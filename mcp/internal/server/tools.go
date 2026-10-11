package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"sort"
	"strings"
	"sync"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/google/jsonschema-go/jsonschema"
	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/chat"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/fhir"
	"github.com/nha-in/docs/mcp/internal/guard"
	"github.com/nha-in/docs/mcp/internal/index"
	"github.com/nha-in/docs/mcp/internal/route"
)

// The six tools. The abdm_ prefix is there because a client such as Cursor
// or an OpenAI agent puts every connected server's tools in one namespace,
// where a bare search, get or validate collides with another server's.
const (
	toolSearch   = "abdm_search"
	toolGet      = "abdm_get"
	toolRelated  = "abdm_related"
	toolDecode   = "abdm_decode_error"
	toolValidate = "abdm_validate"
	toolInfo     = "abdm_catalogue_info"
)

const (
	searchDescription = "Find anything in the ABDM catalogue and get back ids that abdm_get opens. " +
		"With a query it ranks the written guidance (atoms: concepts, flows, endpoints, callbacks, errors, tests, glossary entries, decisions, FHIR mappings, sandbox notes, troubleshooting) by hybrid keyword and semantic search. " +
		"kind operation matches API operations whose operationId, summary or path contains every word of the query; kind fhir_profile does the same for the NRCES FHIR profiles. " +
		"With an empty query and a kind it lists that kind, filtered and paginated: pass next_offset back as offset for the next page. " +
		"response_format concise (the default) returns id, kind, title, summary and url per result; detailed adds type, milestone and snippet for atoms, and method, path, module and tag for operations."
	getDescription = "Read one item in full by an id that abdm_search returned. The id's shape says what it is: " +
		"an atom id such as hiecm.error.abdm-1035 returns the atom's fields and markdown body; " +
		"an operationId such as linkAddContexts returns the exact OpenAPI contract; " +
		"fhir:<profile name or ABDM hiType>, such as fhir:OPConsultRecord, returns the NRCES profile digest; " +
		"fhir-example:<hiType>, such as fhir-example:OPConsultation, returns a known-good document bundle. " +
		"An unknown id is an error that names the closest valid ids."
	relatedDescription = "Walk the catalogue graph from one atom id, both directions. " +
		"Related atoms come back grouped by their own type (concept, flow, endpoint, callback, error, test, ...), each atom once. " +
		"Use this to move from one exact atom to its neighbours; use abdm_search when you do not have a starting atom."
	decodeDescription = "Extract ABDM error codes from a code or raw response body and return, per code, the matching narrative error atoms with their fixes plus the specification rows (code, message, http status, returning operation_id, module). " +
		"Use this first for any error response from the gateway, before reaching for abdm_search."
	validateDescription = "Check something locally before sending it anywhere. " +
		"kind request validates a candidate request body (body, raw JSON) against one operation's schema (operation_id) and lists the required headers and parameters that body validation cannot see. " +
		"kind fhir runs a structural pre-flight check of a FHIR document bundle (bundle_json, optionally record_type) against the pinned NRCES profiles and ABDM transport rules, returning findings with locations and fixes; " +
		"it does not validate terminology and does not replace the official HL7 validator, whose recipe the catalogue carries. The bundle is never logged."
	infoDescription = "Catalogue version, build time, embeddings status and coverage counts by gateway, milestone and type. " +
		"Use this to check which snapshot you are talking to and how complete it is."
)

// atomTypeValues are the catalogue atom types.
var atomTypeValues = []any{
	"concept", "flow", "endpoint", "callback", "error",
	"test", "glossary", "decision", "fhir", "sandbox", "troubleshooting",
}

// searchIn is abdm_search's input. tag is set only by the list_operations
// alias, which had a tag filter the new tool does not advertise.
type searchIn struct {
	Query          string `json:"query,omitempty" jsonschema:"what to look for: your own words, an error code, an operationId or a path. Leave empty, with a kind, to list that kind"`
	Kind           string `json:"kind,omitempty" jsonschema:"what to return: atom (written guidance), operation (API operations), fhir_profile (NRCES profiles) or any"`
	Type           string `json:"type,omitempty" jsonschema:"atoms only: the atom type"`
	Gateway        string `json:"gateway,omitempty" jsonschema:"atoms only: one gateway's atoms; shared atoms always come too"`
	Milestone      string `json:"milestone,omitempty" jsonschema:"atoms only: M1 to M4 or P1 to P4"`
	Module         string `json:"module,omitempty" jsonschema:"operations only: the specification module, for example gateway, m1 or m2"`
	Limit          int    `json:"limit,omitempty" jsonschema:"results per call: default 10 with a query and 25 for a listing, at most 25 for an atom query and 100 otherwise"`
	Offset         int    `json:"offset,omitempty" jsonschema:"skip this many results: the next_offset of the previous page"`
	ResponseFormat string `json:"response_format,omitempty" jsonschema:"concise (default) or detailed"`
	tag            string
}

// getIn is abdm_get's input. kind is set only by the get_atom and
// get_operation aliases, which know what their id is without its shape.
type getIn struct {
	ID   string `json:"id" jsonschema:"an id exactly as abdm_search returned it: hiecm.error.abdm-1035, linkAddContexts, fhir:OPConsultRecord or fhir-example:OPConsultation"`
	kind string
}

type relatedIn struct {
	ID string `json:"id" jsonschema:"an atom id, for example hiecm.flow.m2-link-care-context"`
}

type decodeIn struct {
	Input string `json:"input" jsonschema:"an error code or a raw gateway response body"`
}

type validateIn struct {
	Kind        string `json:"kind" jsonschema:"request or fhir"`
	OperationID string `json:"operation_id,omitempty" jsonschema:"kind request: the operationId, from abdm_search with kind operation"`
	Body        string `json:"body,omitempty" jsonschema:"kind request: the candidate request body as raw JSON"`
	BundleJSON  string `json:"bundle_json,omitempty" jsonschema:"kind fhir: the FHIR document bundle, as a JSON string"`
	RecordType  string `json:"record_type,omitempty" jsonschema:"kind fhir: optional expected ABDM hiType, for example OPConsultation"`
}

type emptyIn struct{}

// mustSchemaFor infers the input schema for In with no further constraints.
func mustSchemaFor[In any]() *jsonschema.Schema {
	s, err := jsonschema.For[In](nil)
	if err != nil {
		panic(err)
	}
	return s
}

// schemaWithEnums infers In's schema and constrains the named properties to
// the given values.
func schemaWithEnums[In any](enums map[string][]any) *jsonschema.Schema {
	s := mustSchemaFor[In]()
	for prop, values := range enums {
		s.Properties[prop].Enum = values
	}
	return s
}

// outSchema is an object schema whose listed properties are required. It
// names what every successful result carries and leaves the rest open, so
// it is a promise the tool keeps rather than a copy of its output.
func outSchema(props map[string]*jsonschema.Schema) *jsonschema.Schema {
	s := &jsonschema.Schema{Type: "object", Properties: props}
	for k := range props {
		s.Required = append(s.Required, k)
	}
	sort.Strings(s.Required)
	return s
}

func typed(t string) *jsonschema.Schema { return &jsonschema.Schema{Type: t} }

func versionedSchema(props map[string]*jsonschema.Schema) *jsonschema.Schema {
	props["catalogue_version"] = typed("string")
	return outSchema(props)
}

var (
	searchOut = versionedSchema(map[string]*jsonschema.Schema{
		"results": {Type: "array", Items: outSchema(map[string]*jsonschema.Schema{
			"id":    typed("string"),
			"kind":  {Type: "string", Enum: []any{"atom", "operation", "fhir_profile"}},
			"title": typed("string"),
		})},
	})
	getOut = versionedSchema(map[string]*jsonschema.Schema{
		"id":   typed("string"),
		"kind": {Type: "string", Enum: []any{"atom", "operation", "fhir_profile", "fhir_example"}},
	})
	relatedOut = versionedSchema(map[string]*jsonschema.Schema{
		"id": typed("string"), "related": typed("object"),
	})
	decodeOut   = versionedSchema(map[string]*jsonschema.Schema{"codes": {Type: "array", Items: typed("string")}})
	validateOut = versionedSchema(map[string]*jsonschema.Schema{
		"kind": {Type: "string", Enum: []any{"request", "fhir"}},
	})
	infoOut = versionedSchema(map[string]*jsonschema.Schema{
		"built_at": typed("string"), "embeddings": typed("boolean"),
		"atoms": typed("object"), "operations": typed("integer"),
	})
)

// ToolDef is one chat- and MCP-visible tool: its name, description, input
// and output schemas and the handler that unmarshals raw JSON input and
// runs it. ChatTools ignores OutputSchema; the MCP registration declares it.
type ToolDef struct {
	Name         string
	Description  string
	InputSchema  *jsonschema.Schema
	OutputSchema *jsonschema.Schema
	// Call unmarshals raw into the tool's input struct and runs it.
	Call func(ctx context.Context, raw json.RawMessage) (map[string]any, error)
}

// def builds a ToolDef whose Call unmarshals into In and runs run.
func def[In any](name, desc string, in, out *jsonschema.Schema,
	run func(context.Context, In) (map[string]any, error)) ToolDef {
	return ToolDef{Name: name, Description: desc, InputSchema: in, OutputSchema: out,
		Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
			var v In
			if len(raw) > 0 {
				if err := json.Unmarshal(raw, &v); err != nil {
					return nil, err
				}
			}
			return run(ctx, v)
		}}
}

// Tools holds the read-only catalogue tools shared by the MCP server
// registration and the chat loop.
type Tools struct {
	r   *index.Reader
	emb embed.Embedder

	// Profile digests are immutable per snapshot: loaded once, on the first
	// FHIR validation, rather than re-read from the reader on every call.
	digestsOnce sync.Once
	digests     map[string]*fhir.ProfileDigest
	digestsErr  error
}

// NewTools builds a Tools bound to the given snapshot reader and embedder.
// emb may be nil (keyword-only search).
func NewTools(r *index.Reader, emb embed.Embedder) *Tools {
	return &Tools{r: r, emb: emb}
}

func (t *Tools) versioned(fields map[string]any) map[string]any {
	fields["catalogue_version"] = t.r.CatalogueVersion()
	return fields
}

// notFound turns the reader's miss into an error a model can act on: the
// closest valid ids, written as ids this tool accepts (so a FHIR miss names
// fhir:... ids), and the call to make next.
func notFound(err error, prefix, next string) error {
	var nf *index.NotFoundError
	if !errors.As(err, &nf) {
		return err
	}
	if len(nf.Closest) == 0 {
		return fmt.Errorf("%s%s not found, and this snapshot holds nothing of that kind. %s", prefix, nf.ID, next)
	}
	ids := make([]string, len(nf.Closest))
	for i, c := range nf.Closest {
		ids[i] = prefix + c
	}
	return fmt.Errorf("%s%s not found. Closest valid ids: %s. %s", prefix, nf.ID, strings.Join(ids, ", "), next)
}

const (
	searchLimit  = 10
	listLimit    = 25
	maxLimit     = 100
	titleRunes   = 90
	summaryRunes = 100
)

// clip keeps the first line of s and cuts it at n runes, on a word boundary
// where there is one, so a concise result stays inside its budget.
func clip(s string, n int) string {
	s, _, _ = strings.Cut(strings.TrimSpace(s), "\n")
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	cut := string(r[:n])
	if i := strings.LastIndex(cut, " "); i > n/2 {
		cut = cut[:i]
	}
	return cut + "..."
}

func atomHitRow(h index.SearchHit, detailed bool) map[string]any {
	row := map[string]any{"id": h.ID, "kind": "atom", "url": index.DocLink(h.DocURL, h.DocAnchor)}
	if detailed {
		row["title"], row["summary"] = h.Title, h.Summary
		row["type"], row["milestone"], row["snippet"] = h.Type, h.Milestone, h.Snippet
	} else {
		row["title"], row["summary"] = clip(h.Title, titleRunes), clip(h.Summary, summaryRunes)
	}
	return row
}

func atomRefRow(a index.AtomRef, detailed bool) map[string]any {
	row := map[string]any{"id": a.ID, "kind": "atom", "title": a.Title, "url": index.DocLink(a.DocURL, a.DocAnchor)}
	if detailed {
		row["type"], row["milestone"] = a.Type, a.Milestone
	}
	return row
}

func operationRow(o index.OperationSummary, detailed bool) map[string]any {
	row := map[string]any{"id": o.OperationID, "kind": "operation",
		"title": o.Method + " " + o.Path, "summary": clip(o.Summary, summaryRunes),
		"url": operationDocPath(o.Module, o.OperationID)}
	if detailed {
		row["summary"] = o.Summary
		row["method"], row["path"], row["module"], row["tag"] = o.Method, o.Path, o.Module, o.Tag
	}
	return row
}

func profileRow(p index.FHIRProfileSummary, detailed bool) map[string]any {
	row := map[string]any{"id": "fhir:" + p.ProfileName, "kind": "fhir_profile", "title": p.Title,
		"summary": "hiType " + p.RecordType + "; its example bundle is fhir-example:" + p.RecordType,
		"url":     p.URL}
	if detailed {
		row["record_type"], row["profile_name"] = p.RecordType, p.ProfileName
	}
	return row
}

// containsAll reports whether every word of q occurs in hay, both lowered.
func containsAll(hay, q string) bool {
	hay = strings.ToLower(hay)
	for _, w := range strings.Fields(strings.ToLower(q)) {
		if !strings.Contains(hay, w) {
			return false
		}
	}
	return true
}

// Search is abdm_search. A query over atoms (kind atom or any) is the ranked
// hybrid search; everything else is a filtered, paginated listing.
func (t *Tools) Search(ctx context.Context, in searchIn) (map[string]any, error) {
	kind := in.Kind
	if kind == "" {
		kind = "any"
	}
	q := strings.TrimSpace(in.Query)
	detailed := in.ResponseFormat == "detailed"
	if q != "" && (kind == "any" || kind == "atom") {
		hits, err := t.r.SearchIn(ctx, q, in.Type, in.Milestone, in.Gateway, in.Limit, t.emb)
		if err != nil {
			return nil, err
		}
		rows := []map[string]any{}
		for _, h := range hits {
			rows = append(rows, atomHitRow(h, detailed))
		}
		return t.versioned(map[string]any{"results": rows}), nil
	}
	rows := []map[string]any{}
	switch kind {
	case "atom":
		refs, err := t.r.ListAtoms(in.Type, in.Milestone)
		if err != nil {
			return nil, err
		}
		for _, a := range refs {
			if in.Gateway == "" || strings.HasPrefix(a.ID, in.Gateway+".") || strings.HasPrefix(a.ID, "shared.") {
				rows = append(rows, atomRefRow(a, detailed))
			}
		}
	case "operation":
		ops, err := t.r.ListOperations(in.tag, in.Module, "")
		if err != nil {
			return nil, err
		}
		for _, o := range ops {
			if containsAll(o.OperationID+" "+o.Summary+" "+o.Path, q) {
				rows = append(rows, operationRow(o, detailed))
			}
		}
	case "fhir_profile":
		profiles, err := t.r.ListFHIRProfiles()
		if err != nil {
			return nil, err
		}
		for _, p := range profiles {
			if containsAll(p.ProfileName+" "+p.RecordType+" "+p.Title, q) {
				rows = append(rows, profileRow(p, detailed))
			}
		}
	case "any":
		return nil, errors.New(`an empty query lists one kind: call abdm_search with kind "atom", "operation" or "fhir_profile", or give a query`)
	default:
		return nil, fmt.Errorf(`kind %q is not one of "atom", "operation", "fhir_profile" or "any"`, kind)
	}
	limit := in.Limit
	if limit <= 0 {
		limit = listLimit
		if q != "" {
			limit = searchLimit
		}
	}
	limit = min(limit, maxLimit)
	offset := min(max(in.Offset, 0), len(rows))
	end := min(offset+limit, len(rows))
	out := map[string]any{"results": rows[offset:end], "total": len(rows)}
	if end < len(rows) {
		out["next_offset"] = end
	}
	return t.versioned(out), nil
}

// kindOfID reads what an id names from its shape: the fhir: and
// fhir-example: prefixes are ours; an atom id is gateway.type.slug; an
// operationId never carries a dot.
func kindOfID(id string) string {
	switch {
	case strings.HasPrefix(id, "fhir-example:"):
		return "fhir_example"
	case strings.HasPrefix(id, "fhir:"):
		return "fhir_profile"
	case strings.Contains(id, "."):
		return "atom"
	default:
		return "operation"
	}
}

const getNext = "Call abdm_get with one of them, or abdm_search with a description to find the right id."

// Get is abdm_get.
func (t *Tools) Get(ctx context.Context, in getIn) (map[string]any, error) {
	kind := in.kind
	if kind == "" {
		kind = kindOfID(in.ID)
	}
	switch kind {
	case "atom":
		a, err := t.r.GetAtom(in.ID)
		if err != nil {
			return nil, notFound(err, "", getNext)
		}
		return t.versioned(map[string]any{
			"kind": "atom", "id": a.ID, "type": a.Type, "gateway": a.Gateway,
			"milestone": a.Milestone, "title": a.Title, "summary": a.Summary,
			"body": a.Body,
			// The page a reader is sent to. Empty when the atom has no
			// published page, which callers must treat as not citable.
			"doc_url": index.DocLink(a.DocURL, a.DocAnchor),
		}), nil
	case "operation":
		frag, module, err := t.r.GetOperation(in.ID)
		if err != nil {
			if hint := t.fhirHint(in.ID); hint != "" {
				return nil, errors.New(hint)
			}
			return nil, notFound(err, "", getNext)
		}
		out := map[string]any{"kind": "operation", "id": in.ID, "operation_id": in.ID, "spec": json.RawMessage(frag)}
		if path := operationDocPath(module, in.ID); path != "" {
			out["doc_path"] = path
		}
		return t.versioned(out), nil
	case "fhir_profile":
		name := strings.TrimPrefix(in.ID, "fhir:")
		d, err := t.r.GetFHIRProfile(name)
		if err != nil {
			// The profile name missed; an ABDM hiType names the same digest.
			if profileName, ok := fhir.RecordTypes[name]; ok {
				d, err = t.r.GetFHIRProfile(profileName)
			}
		}
		if err != nil {
			return nil, notFound(err, "fhir:", getNext)
		}
		return t.versioned(map[string]any{
			"kind": "fhir_profile", "id": in.ID,
			"record_type": d.RecordType, "profile_name": d.ProfileName,
			"url": d.URL, "title": d.Title, "description": d.Description,
			"required": d.Required, "sections": d.Sections, "fixed": d.Fixed,
		}), nil
	default: // fhir_example
		recordType := strings.TrimPrefix(in.ID, "fhir-example:")
		b, err := t.r.GetFHIRExample(recordType)
		if err != nil {
			return nil, notFound(err, "fhir-example:", getNext)
		}
		return t.versioned(map[string]any{
			"kind": "fhir_example", "id": in.ID,
			"record_type": recordType, "example": json.RawMessage(b),
		}), nil
	}
}

// fhirHint names the id that would have worked when an operation lookup
// was really given a FHIR name.
func (t *Tools) fhirHint(id string) string {
	if _, ok := fhir.RecordTypes[id]; ok {
		return fmt.Sprintf(`%s is an ABDM hiType, not an operationId. Call abdm_get with id "fhir:%s" for its profile or "fhir-example:%s" for its example bundle.`, id, id, id)
	}
	if _, err := t.r.GetFHIRProfile(id); err == nil {
		return fmt.Sprintf(`%s is an NRCES profile name, not an operationId. Call abdm_get with id "fhir:%s".`, id, id)
	}
	return ""
}

type lookupIn struct {
	Query     string `json:"query" jsonschema:"what the reader asked, in their words"`
	Milestone string `json:"milestone,omitempty" jsonschema:"M1..M4, P1..P3 to narrow, else empty"`
	Kind      string `json:"kind,omitempty" jsonschema:"operation to find API operations by words in their operationId, summary or path; leave empty for the documentation"`
	Module    string `json:"module,omitempty" jsonschema:"with kind operation: the specification module, for example m2"`
}

type Passage struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Milestone string `json:"milestone"`
	Title     string `json:"title"`
	DocURL    string `json:"doc_url"`
	Body      string `json:"body"` // full body for the top hits, summary for the rest
}

type PassagePack struct {
	Passages []Passage `json:"passages"`
	// Related are one hop out from the top hits: id and title only, so
	// the model knows a sibling exists without paying to read it.
	Related []map[string]string `json:"related"`
}

const (
	lookupHits   = 5
	lookupOpened = 3
)

// atomOpener is the slice of *index.Reader that openPassage needs, cut out
// so a test can stub a GetAtom failure without needing a real index that can
// be made to fail cleanly.
type atomOpener interface {
	GetAtom(id string) (catalogue.Atom, error)
	RelatedAtoms(id string) ([]index.RelatedGroup, error)
}

// openPassage builds the full-body passage and its one-hop related atoms
// for a top-3 search hit. When the atom can't be opened, a summary is
// better than a missing passage, so it degrades to the search hit's
// summary and skips the related walk for that hit; the warning is how an
// index-integrity problem (a search hit whose atom no longer opens)
// becomes visible instead of silently returning a snippet.
func openPassage(r atomOpener, h index.SearchHit) (Passage, []map[string]string) {
	p := Passage{ID: h.ID, Type: h.Type, Milestone: h.Milestone, Title: h.Title,
		DocURL: index.DocLink(h.DocURL, h.DocAnchor),
		Body:   h.Summary}
	a, err := r.GetAtom(h.ID)
	if err != nil {
		slog.Warn("lookup: could not open atom, returning its summary", "id", h.ID, "error", err)
		return p, nil
	}
	p.Body = a.Body
	var related []map[string]string
	groups, err := r.RelatedAtoms(h.ID)
	if err == nil {
		for _, g := range groups {
			for _, ref := range g.Atoms {
				related = append(related, map[string]string{
					"id": ref.ID, "type": g.Type, "title": ref.Title})
			}
		}
	}
	return p, related
}

// Lookup is search, open and walk in one call. The chat model used to
// chain search, get and related itself and often stopped at a 200
// character snippet; a cheap model stops there more often. Doing the chain
// in code costs nothing the model can get wrong.
func (t *Tools) Lookup(ctx context.Context, in lookupIn) (PassagePack, error) {
	// The chat scopes a request to the reader's gateway (chat.WithGateway);
	// the pre-retrieval and the model's own abdm_search both land here, so
	// both are scoped. An MCP client never sets it and searches everything.
	hits, err := t.r.SearchIn(ctx, in.Query, "", in.Milestone, chat.GatewayFrom(ctx), lookupHits, t.emb)
	if err != nil {
		return PassagePack{}, err
	}
	var pack PassagePack
	seenRelated := map[string]bool{}
	for i, h := range hits {
		p := Passage{ID: h.ID, Type: h.Type, Milestone: h.Milestone, Title: h.Title,
			DocURL: index.DocLink(h.DocURL, h.DocAnchor),
			Body:   h.Summary}
		if i < lookupOpened {
			var related []map[string]string
			p, related = openPassage(t.r, h)
			for _, ref := range related {
				if seenRelated[ref["id"]] {
					continue
				}
				seenRelated[ref["id"]] = true
				pack.Related = append(pack.Related, ref)
			}
		}
		pack.Passages = append(pack.Passages, p)
	}
	return pack, nil
}

// Related is abdm_related.
func (t *Tools) Related(ctx context.Context, in relatedIn) (map[string]any, error) {
	groups, err := t.r.RelatedAtoms(in.ID)
	if err != nil {
		return nil, notFound(err, "", "Call abdm_related with one of them.")
	}
	out := map[string]any{}
	for _, g := range groups {
		out[g.Type] = atomRefsJSON(g.Atoms)
	}
	return t.versioned(map[string]any{"id": in.ID, "related": out}), nil
}

// DecodeError is abdm_decode_error.
func (t *Tools) DecodeError(ctx context.Context, in decodeIn) (map[string]any, error) {
	codes := catalogue.ExtractErrorCodes(in.Input)
	if len(codes) == 0 {
		return t.versioned(map[string]any{
			"message": "no error codes found in the input; try abdm_search with the response text",
			"codes":   []string{},
		}), nil
	}
	matches := map[string]any{}
	for _, code := range codes {
		refs, err := t.r.AtomsByErrorCode(code)
		if err != nil {
			return nil, err
		}
		var full []map[string]any
		for _, ref := range refs {
			if ref.Type != "error" {
				continue
			}
			a, err := t.r.GetAtom(ref.ID)
			if err != nil {
				continue
			}
			entry := map[string]any{
				"id": a.ID, "title": a.Title, "summary": a.Summary,
				"body": a.Body,
			}
			full = append(full, entry)
		}
		specRows, err := t.r.SpecErrorCodes(code)
		if err != nil {
			return nil, err
		}
		match := map[string]any{}
		if full != nil {
			match["atoms"] = full
		}
		if len(specRows) > 0 {
			match["specification"] = specRows
			match["source"] = "specification response example"
		}
		if full == nil {
			if len(specRows) > 0 {
				match["note"] = "no narrative error atom exists for this code yet; the specification's response examples above are the only source for this code, and abdm_search with the message text may find related guidance"
			} else {
				match["message"] = "no error atom for this code yet; try abdm_search"
			}
		}
		matches[code] = match
	}
	return t.versioned(map[string]any{"codes": codes, "matches": matches}), nil
}

// Validate is abdm_validate. A missing input or an unknown operation is an
// error that says what to pass; a body or bundle that fails its checks is
// not an error, it is the answer.
func (t *Tools) Validate(ctx context.Context, in validateIn) (map[string]any, error) {
	switch in.Kind {
	case "request":
		if in.OperationID == "" {
			return nil, errors.New(`kind "request" needs operation_id and body; find the operation_id with abdm_search, kind "operation"`)
		}
		out, err := t.validateRequest(in.OperationID, in.Body)
		if err != nil {
			return nil, notFound(err, "", "Call abdm_validate with one of them as operation_id.")
		}
		out["kind"] = "request"
		return out, nil
	case "fhir":
		if in.BundleJSON == "" {
			return nil, errors.New(`kind "fhir" needs bundle_json, the document bundle as a JSON string`)
		}
		if len(in.BundleJSON) > 2<<20 {
			return t.versioned(map[string]any{"kind": "fhir", "error": "bundle exceeds the 2 MiB limit"}), nil
		}
		t.digestsOnce.Do(t.loadDigests)
		if t.digestsErr != nil {
			return nil, t.digestsErr
		}
		return t.versioned(map[string]any{
			"kind":     "fhir",
			"findings": fhir.Validate([]byte(in.BundleJSON), in.RecordType, t.digests),
			"limits":   fmt.Sprintf(fhir.LimitsTemplate, t.r.FHIRIGVersion()),
		}), nil
	default:
		return nil, fmt.Errorf(`kind must be "request" or "fhir", got %q`, in.Kind)
	}
}

func (t *Tools) loadDigests() {
	summaries, err := t.r.ListFHIRProfiles()
	if err != nil {
		t.digestsErr = err
		return
	}
	m := make(map[string]*fhir.ProfileDigest, len(summaries))
	for _, sm := range summaries {
		d, err := t.r.GetFHIRProfile(sm.ProfileName)
		if err != nil {
			t.digestsErr = err
			return
		}
		m[sm.ProfileName] = d
	}
	t.digests = m
}

// validateRequest checks a candidate body against an operation's stored
// request schema. A missing operation is the reader's NotFoundError.
func (t *Tools) validateRequest(operationID, body string) (map[string]any, error) {
	v, err := t.r.GetOperationValidation(operationID)
	if err != nil {
		return nil, err
	}
	base := map[string]any{
		"operation_id":        operationID,
		"required_parameters": v.RequiredParams,
	}
	if v.RequestSchemaJSON == nil {
		base["valid"] = false
		base["errors"] = []string{"this operation has no application/json request schema; nothing to validate against"}
		return t.versioned(base), nil
	}
	var payload any
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		base["valid"] = false
		base["errors"] = []string{"body is not valid JSON: " + err.Error()}
		return t.versioned(base), nil
	}
	var schema openapi3.Schema
	if err := json.Unmarshal(v.RequestSchemaJSON, &schema); err != nil {
		return nil, fmt.Errorf("stored schema for %s: %w", operationID, err)
	}
	var errs []string
	if err := schema.VisitJSON(payload, openapi3.MultiErrors()); err != nil {
		var multi openapi3.MultiError
		if errors.As(err, &multi) {
			for _, e := range multi {
				errs = append(errs, e.Error())
			}
		} else {
			errs = append(errs, err.Error())
		}
	}
	base["valid"] = len(errs) == 0
	if errs == nil {
		errs = []string{}
	}
	base["errors"] = errs
	return t.versioned(base), nil
}

// nonAlphanumeric matches the run-collapsing the site's route generator does
// in scripts/build-api-reference.mjs. Keep the two in step: an operation id is
// snake_case and its route is hyphenated, so without this an agent holding
// `gateway_sessions_create` cannot reach
// `/docs/hiecm/v3/api/gateway/endpoints/gateway-sessions-create`.
var nonAlphanumeric = regexp.MustCompile(`[^a-zA-Z0-9]+`)

// operationDocPath is site-relative rather than absolute because the server is
// not told where it is published. Every operation it indexes is HIE-CM v3
// today, which is the one assumption here; a second gateway means carrying the
// gateway and version through the index alongside the module.
func operationDocPath(module, operationID string) string {
	if module == "" || operationID == "" {
		return ""
	}
	slug := strings.Trim(nonAlphanumeric.ReplaceAllString(operationID, "-"), "-")
	if slug == "" {
		return ""
	}
	return "/docs/hiecm/v3/api/" + module + "/endpoints/" + strings.ToLower(slug)
}

// CatalogueInfo is abdm_catalogue_info.
func (t *Tools) CatalogueInfo(ctx context.Context, in emptyIn) (map[string]any, error) {
	stats, err := t.r.Stats()
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{
		"built_at":   t.r.BuiltAt(),
		"embeddings": t.emb != nil && t.r.EmbeddingsEnabled(),
		"atoms": map[string]any{
			"by_gateway":   stats.ByGateway,
			"by_milestone": stats.ByMilestone,
			"by_type":      stats.ByType,
		},
		"operations": stats.Operations,
	}), nil
}

// Defs returns the six tools in a fixed order. The MCP registers these and
// the deprecated aliases (aliases.go); the chat sees them through ChatTools
// or ChatToolsFor.
func (t *Tools) Defs() []ToolDef {
	searchSchema := schemaWithEnums[searchIn](map[string][]any{
		"kind": {"any", "atom", "operation", "fhir_profile"}, "type": atomTypeValues,
		"gateway":         {"hiecm", "nhcx", "uhi"},
		"response_format": {"concise", "detailed"},
	})
	searchSchema.Properties["limit"].Minimum = ptr(0.0)
	searchSchema.Properties["limit"].Maximum = ptr(float64(maxLimit))
	searchSchema.Properties["offset"].Minimum = ptr(0.0)
	return []ToolDef{
		def(toolSearch, searchDescription, searchSchema, searchOut, t.Search),
		def(toolGet, getDescription, mustSchemaFor[getIn](), getOut, t.Get),
		def(toolRelated, relatedDescription, mustSchemaFor[relatedIn](), relatedOut, t.Related),
		def(toolDecode, decodeDescription, mustSchemaFor[decodeIn](), decodeOut, t.DecodeError),
		def(toolValidate, validateDescription,
			schemaWithEnums[validateIn](map[string][]any{"kind": {"request", "fhir"}}), validateOut, t.Validate),
		def(toolInfo, infoDescription, mustSchemaFor[emptyIn](), infoOut, t.CatalogueInfo),
	}
}

func ptr[T any](v T) *T { return &v }

// ChatTools adapts server.ToolDef definitions into the chat package's own
// ToolDef shape, for a chat.Service that is not routed. Package chat cannot
// import package server (server imports chat for the /api/chat handler), so
// the conversion lives here. abdm_validate is left out: the chat reaches it
// only through ChatToolsFor, on an attachment, and only for request bodies.
func ChatTools(defs []ToolDef) []chat.ToolDef {
	var out []chat.ToolDef
	for _, d := range defs {
		if d.Name == toolValidate {
			continue
		}
		out = append(out, chat.ToolDef{Name: d.Name, Description: d.Description, InputSchema: d.InputSchema, Call: d.Call})
	}
	return out
}

const chatSearchDescription = "Call this when the answer is not already in the passages you were given, or the reader asks a follow-up that needs something new. It searches this portal's documentation and returns the matching pages in full, with their related pages named. Send the reader's own words as the query. With kind operation it instead finds API operations whose operationId, summary or path contains every word of the query; abdm_get reads one in full."

// validateRequestIn is the request half of abdm_validate's input: all the
// chat is offered, and the validate_request alias's input.
type validateRequestIn struct {
	OperationID string `json:"operation_id" jsonschema:"the operationId, from abdm_search with kind operation"`
	Body        string `json:"body" jsonschema:"the candidate request body as raw JSON"`
}

// ChatToolsFor is the chat loop's view of the tools: only the names the
// router chose, abdm_search bound to Lookup rather than to the snippet
// search the MCP serves, and abdm_validate cut to request bodies.
func (t *Tools) ChatToolsFor(names []string) []chat.ToolDef {
	byName := map[string]ToolDef{}
	for _, d := range t.Defs() {
		byName[d.Name] = d
	}
	var out []chat.ToolDef
	for _, n := range names {
		switch n {
		case toolSearch:
			out = append(out, chat.ToolDef{
				Name: toolSearch, Description: chatSearchDescription,
				InputSchema: schemaWithEnums[lookupIn](map[string][]any{"kind": {"operation"}}),
				Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
					var in lookupIn
					if err := json.Unmarshal(raw, &in); err != nil {
						return nil, err
					}
					if in.Kind == "operation" {
						return t.Search(ctx, searchIn{Query: in.Query, Kind: "operation", Module: in.Module})
					}
					pack, err := t.Lookup(ctx, in)
					if err != nil {
						return nil, err
					}
					return t.versioned(map[string]any{"passages": pack.Passages, "related": pack.Related}), nil
				},
			})
		case toolValidate:
			out = append(out, chat.ToolDef{
				Name: toolValidate, Description: "Validate a candidate request body against one operation's schema, locally, and list the required headers and parameters body validation cannot see.",
				InputSchema: mustSchemaFor[validateRequestIn](),
				Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
					var in validateRequestIn
					if err := json.Unmarshal(raw, &in); err != nil {
						return nil, err
					}
					return t.Validate(ctx, validateIn{Kind: "request", OperationID: in.OperationID, Body: in.Body})
				},
			})
		default:
			if d, ok := byName[n]; ok {
				out = append(out, chat.ToolDef{Name: d.Name, Description: d.Description, InputSchema: d.InputSchema, Call: d.Call})
			}
		}
	}
	return out
}

// ChatHooks builds the two hooks a routed chat.Service needs: a Lookup
// that pre-retrieves a passage pack and reports what it found as
// guard.PackFacts, and a ToolsFor that asks the router which tools a
// question may use. Both close over lookupIn, which is unexported, so the
// wiring lives here rather than in cmd/docs-mcp or the eval runner, the two
// places that build a chat.Service.
func ChatHooks(tools *Tools) (
	lookup func(ctx context.Context, q string) (json.RawMessage, []chat.Source, guard.PackFacts, error),
	toolsFor func(q string, hasAttachment bool) []chat.ToolDef,
) {
	lookup = func(ctx context.Context, q string) (json.RawMessage, []chat.Source, guard.PackFacts, error) {
		pack, err := tools.Lookup(ctx, lookupIn{Query: q})
		if err != nil {
			return nil, nil, guard.PackFacts{}, err
		}
		if len(pack.Passages) == 0 {
			// An empty pack must read as no lookup at all: {"passages":null,
			// "related":null} still marshals to a non-empty byte slice, so
			// leaving this out would make every zero-hit lookup look like a
			// pack that answered the question, permanently disabling the
			// lookFirst retry for it.
			return nil, nil, guard.PackFacts{}, nil
		}
		b, err := json.Marshal(pack)
		if err != nil {
			return nil, nil, guard.PackFacts{}, err
		}
		var srcs []chat.Source
		var facts guard.PackFacts
		for _, p := range pack.Passages {
			srcs = append(srcs, chat.Source{ID: p.ID, Title: p.Title, URL: p.DocURL})
			if p.Type == "flow" {
				facts.FlowTitles = append(facts.FlowTitles, p.Title)
			}
		}
		lower := strings.ToLower(string(b))
		facts.MentionsABHANumber = strings.Contains(lower, "abha number")
		facts.MentionsABHAAddress = strings.Contains(lower, "abha address")
		return b, srcs, facts, nil
	}
	toolsFor = func(q string, hasAttachment bool) []chat.ToolDef {
		return tools.ChatToolsFor(route.Route(route.Input{Question: q, HasAttachment: hasAttachment}).Tools)
	}
	return lookup, toolsFor
}
