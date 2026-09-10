package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"regexp"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/fhir"
	"github.com/eka-care/abdm-docs/mcp/internal/guard"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/eka-care/abdm-docs/mcp/internal/route"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/google/jsonschema-go/jsonschema"
)

// The ten chat-visible tool descriptions, shared verbatim between the MCP
// registration in mcp.go and the Defs table below.
const (
	searchDocsDescription = "Hybrid search over the ABDM catalogue atoms: concepts, flows, endpoints, callbacks, errors, tests, glossary entries, decisions, FHIR mappings, sandbox notes and troubleshooting guides. " +
		"It does NOT search raw API operations; those are covered by list_operations and get_operation. " +
		"Use this when you have an intent in your own words and want the catalogue's guidance. " +
		"Results carry verification_status; treat unverified content as unverified."
	getAtomDescription = "Read one catalogue atom: full frontmatter fields and markdown body. " +
		"Use this when you already know the exact atom id and want the one full atom; use search_docs when you only have an intent. " +
		"Atoms not marked verified carry a caution field."
	relatedAtomsDescription = "Walk the catalogue graph from one atom, both directions. " +
		"Related atoms come back grouped by their own type (concept, flow, endpoint, callback, error, test, ...), each atom once. " +
		"Use this to move from one exact atom to its neighbours; use search_docs when you do not have a starting atom."
	decodeErrorDescription = "Extract ABDM error codes from a code or raw response body and return, per code, the matching narrative error atoms with their fixes plus the specification error table rows (code, message, action, module). " +
		"Use this first for any error response from the gateway, before reaching for search_docs."
	catalogueInfoDescription = "Catalogue version, build time, embeddings status and coverage counts by gateway, milestone, type and verification status. " +
		"Use this to check which snapshot you are talking to and how complete it is."
	listOperationsDescription = "List API operations from the ingested OpenAPI specifications. " +
		"The unfiltered listing is hundreds of operations and is truncated at 60 rows, so filter by tag, by module or by q, a substring over operation_id, summary and path. " +
		"Use this to enumerate or find operations; use get_operation for one exact operation, and search_docs for catalogue guidance."
	getOperationDescription = "Get the exact OpenAPI fragment for one operation: parameters, headers, schemas. " +
		"Use this when you know the operation_id and need the one exact contract; find ids with list_operations."
	listFhirProfilesDescription = "List the NRCES FHIR profiles the ABDM record types map to, with each profile's canonical URL. " +
		"Use this to discover which profile a hiType requires before building or validating a bundle."
	getFhirProfileDescription = "Read one NRCES profile digest: required elements, Composition sections, and fixed values, extracted from the pinned implementation guide. " +
		"Accepts the profile name or the ABDM hiType. Use this when writing or fixing bundle generation code."
	getFhirExampleDescription = "A known-good document bundle for one ABDM record type, taken from the NRCES implementation guide's own examples. " +
		"Use it as the reference shape when scaffolding generation code."
	validateRequestDescription = "Validate a candidate request body against an operation's schema, locally, before calling the sandbox. " +
		"Also reminds you of required headers and parameters, which body validation cannot see. " +
		"Use this before writing request code for any operation."
)

type searchIn struct {
	Query     string `json:"query" jsonschema:"the search query"`
	Type      string `json:"type,omitempty" jsonschema:"optional atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox, troubleshooting"`
	Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter, M1 to M4"`
	Limit     int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
}

type getAtomIn struct {
	ID string `json:"id" jsonschema:"the atom id, for example hiecm.error.abdm-1035"`
}

type decodeIn struct {
	Input string `json:"input" jsonschema:"an error code or a raw gateway response body"`
}

type validateIn struct {
	OperationID string `json:"operation_id" jsonschema:"the operationId from list_operations"`
	Body        string `json:"body" jsonschema:"the candidate request body as raw JSON"`
}

type emptyIn struct{}

type listOpsIn struct {
	Tag    string `json:"tag,omitempty" jsonschema:"optional exact tag filter"`
	Module string `json:"module,omitempty" jsonschema:"optional exact module filter, for example gateway, m1, m2, m3, m4, p1, phr-services"`
	Q      string `json:"q,omitempty" jsonschema:"optional case-insensitive substring filter over operation_id, summary and path"`
}

type getOpIn struct {
	OperationID string `json:"operation_id" jsonschema:"the operationId from list_operations"`
}

type emptyFhirIn struct{}

type getFhirProfileIn struct {
	Profile string `json:"profile" jsonschema:"the NRCES profile name, for example OPConsultRecord, or an ABDM hiType such as OPConsultation"`
}

type getFhirExampleIn struct {
	RecordType string `json:"record_type" jsonschema:"the ABDM hiType, for example OPConsultation"`
}

// mustSchemaFor infers the input schema for In with no further constraints.
func mustSchemaFor[In any]() *jsonschema.Schema {
	s, err := jsonschema.For[In](nil)
	if err != nil {
		panic(err)
	}
	return s
}

// ToolDef is one chat- and MCP-visible tool: its name, description, input
// schema and the handler that unmarshals raw JSON input and runs it.
type ToolDef struct {
	Name        string
	Description string
	InputSchema *jsonschema.Schema
	// Call unmarshals raw into the tool's input struct and runs it.
	Call func(ctx context.Context, raw json.RawMessage) (map[string]any, error)
}

// Tools holds the ten read-only catalogue tools shared by the MCP server
// registration and the chat loop.
type Tools struct {
	r   *index.Reader
	emb embed.Embedder
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

func (t *Tools) SearchDocs(ctx context.Context, in searchIn) (map[string]any, error) {
	hits, err := t.r.Search(ctx, in.Query, in.Type, in.Milestone, in.Limit, t.emb)
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{"hits": searchHitsJSON(hits)}), nil
}

func (t *Tools) GetAtom(ctx context.Context, in getAtomIn) (map[string]any, error) {
	a, err := t.r.GetAtom(in.ID)
	if err != nil {
		return nil, err
	}
	fields := map[string]any{
		"id": a.ID, "type": a.Type, "gateway": a.Gateway,
		"milestone": a.Milestone, "title": a.Title, "summary": a.Summary,
		"verification_status": a.VerificationStatus, "body": a.Body,
		// The page a reader is sent to. Empty when the atom has no
		// published page, which callers must treat as not citable.
		"doc_url": index.DocLink(a.DocURL, a.DocAnchor),
	}
	if a.VerificationStatus != "verified" {
		fields["caution"] = unverifiedCaution
	}
	return t.versioned(fields), nil
}

type lookupIn struct {
	Query     string `json:"query" jsonschema:"what the reader asked, in their words"`
	Milestone string `json:"milestone,omitempty" jsonschema:"M1..M4, P1..P3 to narrow, else empty"`
}

type Passage struct {
	ID                 string `json:"id"`
	Type               string `json:"type"`
	Milestone          string `json:"milestone"`
	Title              string `json:"title"`
	VerificationStatus string `json:"verification_status"`
	DocURL             string `json:"doc_url"`
	Body               string `json:"body"` // full body for the top hits, summary for the rest
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
		VerificationStatus: h.VerificationStatus, DocURL: index.DocLink(h.DocURL, h.DocAnchor),
		Body: h.Summary}
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
// chain search_docs, get_atom and related_atoms itself and often stopped
// at a 200 character snippet; a cheap model stops there more often. Doing
// the chain in code costs nothing the model can get wrong.
func (t *Tools) Lookup(ctx context.Context, in lookupIn) (PassagePack, error) {
	hits, err := t.r.Search(ctx, in.Query, "", in.Milestone, lookupHits, t.emb)
	if err != nil {
		return PassagePack{}, err
	}
	var pack PassagePack
	seenRelated := map[string]bool{}
	for i, h := range hits {
		p := Passage{ID: h.ID, Type: h.Type, Milestone: h.Milestone, Title: h.Title,
			VerificationStatus: h.VerificationStatus, DocURL: index.DocLink(h.DocURL, h.DocAnchor),
			Body: h.Summary}
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

func (t *Tools) RelatedAtoms(ctx context.Context, in getAtomIn) (map[string]any, error) {
	groups, err := t.r.RelatedAtoms(in.ID)
	if err != nil {
		return nil, err
	}
	out := map[string]any{}
	for _, g := range groups {
		out[g.Type] = atomRefsJSON(g.Atoms)
	}
	return t.versioned(map[string]any{"id": in.ID, "related": out}), nil
}

func (t *Tools) DecodeError(ctx context.Context, in decodeIn) (map[string]any, error) {
	codes := catalogue.ExtractErrorCodes(in.Input)
	if len(codes) == 0 {
		return t.versioned(map[string]any{
			"message": "no error codes found in the input; try search_docs with the response text",
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
				"verification_status": a.VerificationStatus, "body": a.Body,
			}
			if a.VerificationStatus != "verified" {
				entry["caution"] = unverifiedCaution
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
			match["source"] = "specification error table"
		}
		if full == nil {
			if len(specRows) > 0 {
				match["note"] = "no narrative error atom exists for this code yet; the specification rows above are the recorded truth, and search_docs with the message text may find related guidance"
			} else {
				match["message"] = "no error atom for this code yet; try search_docs"
			}
		}
		matches[code] = match
	}
	return t.versioned(map[string]any{"codes": codes, "matches": matches}), nil
}

// ValidateRequest checks a candidate body against an operation's stored
// request schema. A missing or unresolvable operation is returned as an
// error for the caller to format (mcp.go's notFoundOrErr does this for the
// MCP wire surface); a body that fails to parse or fails schema validation
// is not an error, it is the answer, reported as valid: false with errors.
func (t *Tools) ValidateRequest(ctx context.Context, in validateIn) (map[string]any, error) {
	v, err := t.r.GetOperationValidation(in.OperationID)
	if err != nil {
		return nil, err
	}
	base := map[string]any{
		"operation_id":        in.OperationID,
		"required_parameters": v.RequiredParams,
	}
	if v.RequestSchemaJSON == nil {
		base["valid"] = false
		base["errors"] = []string{"this operation has no application/json request schema; nothing to validate against"}
		return t.versioned(base), nil
	}
	var payload any
	if err := json.Unmarshal([]byte(in.Body), &payload); err != nil {
		base["valid"] = false
		base["errors"] = []string{"body is not valid JSON: " + err.Error()}
		return t.versioned(base), nil
	}
	var schema openapi3.Schema
	if err := json.Unmarshal(v.RequestSchemaJSON, &schema); err != nil {
		return nil, fmt.Errorf("stored schema for %s: %w", in.OperationID, err)
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

func (t *Tools) ListOperations(ctx context.Context, in listOpsIn) (map[string]any, error) {
	ops, err := t.r.ListOperations(in.Tag, in.Module, in.Q)
	if err != nil {
		return nil, err
	}
	fields := map[string]any{"operations": ops}
	if in.Tag == "" && in.Module == "" && in.Q == "" && len(ops) > maxUnfilteredOperations {
		fields["operations"] = ops[:maxUnfilteredOperations]
		fields["truncated"] = fmt.Sprintf("%d more; filter by tag, module or q",
			len(ops)-maxUnfilteredOperations)
	}
	return t.versioned(fields), nil
}

func (t *Tools) GetOperation(ctx context.Context, in getOpIn) (map[string]any, error) {
	frag, module, err := t.r.GetOperation(in.OperationID)
	if err != nil {
		return nil, err
	}
	out := map[string]any{
		"operation_id": in.OperationID,
		"spec":         json.RawMessage(frag),
	}
	if path := operationDocPath(module, in.OperationID); path != "" {
		out["doc_path"] = path
	}
	return t.versioned(out), nil
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
			"by_status":    stats.ByStatus,
		},
		"operations": stats.Operations,
	}), nil
}

func (t *Tools) ListFHIRProfiles(ctx context.Context, in emptyFhirIn) (map[string]any, error) {
	profiles, err := t.r.ListFHIRProfiles()
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{"profiles": profiles}), nil
}

// GetFHIRProfile resolves in.Profile first as an NRCES profile name; when
// that misses, and the input is instead an ABDM hiType, it retries via
// fhir.RecordTypes's hiType-to-profile-name mapping. Either way the
// returned error, when the profile is not found, is the reader's own
// NotFoundError, so mcp.go's notFoundOrErr can format it the same way
// get_atom's miss is formatted.
func (t *Tools) GetFHIRProfile(ctx context.Context, in getFhirProfileIn) (map[string]any, error) {
	d, err := t.r.GetFHIRProfile(in.Profile)
	if err != nil {
		if profileName, ok := fhir.RecordTypes[in.Profile]; ok {
			d, err = t.r.GetFHIRProfile(profileName)
		}
	}
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{
		"record_type":  d.RecordType,
		"profile_name": d.ProfileName,
		"url":          d.URL,
		"title":        d.Title,
		"description":  d.Description,
		"required":     d.Required,
		"sections":     d.Sections,
		"fixed":        d.Fixed,
	}), nil
}

func (t *Tools) GetFHIRExample(ctx context.Context, in getFhirExampleIn) (map[string]any, error) {
	b, err := t.r.GetFHIRExample(in.RecordType)
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{
		"record_type": in.RecordType,
		"example":     json.RawMessage(b),
	}), nil
}

// ChatTools adapts server.ToolDef definitions (as vended by Tools.Defs) into
// the chat package's own ToolDef shape, so a chat.Service can be built from
// the same ten tools the MCP server exposes. Package chat cannot import
// package server -- server imports chat for the /api/chat handler (Task 6),
// and Go disallows the reverse -- so this conversion lives on the server
// side of that boundary instead. Field-by-field rather than a bulk slice
// conversion: server.ToolDef and chat.ToolDef are distinct named types, and
// Go does not permit converting between two slice types whose element types
// merely share an underlying layout.
func ChatTools(defs []ToolDef) []chat.ToolDef {
	out := make([]chat.ToolDef, len(defs))
	for i, d := range defs {
		out[i] = chat.ToolDef{Name: d.Name, Description: d.Description, InputSchema: d.InputSchema, Call: d.Call}
	}
	return out
}

// Defs returns the ten chat-visible tool definitions, in a fixed order:
// search_docs, get_atom, related_atoms, decode_error, list_operations,
// get_operation, catalogue_info, list_fhir_profiles, get_fhir_profile,
// get_fhir_example. validate_fhir is deliberately not here: it is
// registered MCP-only, in mcp.go, so it never reaches the chat tool set.
func (t *Tools) Defs() []ToolDef {
	return []ToolDef{
		{
			Name:        "search_docs",
			Description: searchDocsDescription,
			InputSchema: schemaWithAtomTypeEnum[searchIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in searchIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.SearchDocs(ctx, in)
			},
		},
		{
			Name:        "get_atom",
			Description: getAtomDescription,
			InputSchema: mustSchemaFor[getAtomIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in getAtomIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.GetAtom(ctx, in)
			},
		},
		{
			Name:        "related_atoms",
			Description: relatedAtomsDescription,
			InputSchema: mustSchemaFor[getAtomIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in getAtomIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.RelatedAtoms(ctx, in)
			},
		},
		{
			Name:        "decode_error",
			Description: decodeErrorDescription,
			InputSchema: mustSchemaFor[decodeIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in decodeIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.DecodeError(ctx, in)
			},
		},
		{
			Name:        "list_operations",
			Description: listOperationsDescription,
			InputSchema: mustSchemaFor[listOpsIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in listOpsIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.ListOperations(ctx, in)
			},
		},
		{
			Name:        "get_operation",
			Description: getOperationDescription,
			InputSchema: mustSchemaFor[getOpIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in getOpIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.GetOperation(ctx, in)
			},
		},
		{
			Name:        "catalogue_info",
			Description: catalogueInfoDescription,
			InputSchema: mustSchemaFor[emptyIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in emptyIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.CatalogueInfo(ctx, in)
			},
		},
		{
			Name:        "list_fhir_profiles",
			Description: listFhirProfilesDescription,
			InputSchema: mustSchemaFor[emptyFhirIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in emptyFhirIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.ListFHIRProfiles(ctx, in)
			},
		},
		{
			Name:        "get_fhir_profile",
			Description: getFhirProfileDescription,
			InputSchema: mustSchemaFor[getFhirProfileIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in getFhirProfileIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.GetFHIRProfile(ctx, in)
			},
		},
		{
			Name:        "get_fhir_example",
			Description: getFhirExampleDescription,
			InputSchema: mustSchemaFor[getFhirExampleIn](),
			Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
				var in getFhirExampleIn
				if err := json.Unmarshal(raw, &in); err != nil {
					return nil, err
				}
				return t.GetFHIRExample(ctx, in)
			},
		},
	}
}

const chatSearchDescription = "Call this when the answer is not already in the passages you were given, or the reader asks a follow-up that needs something new. It searches this portal's documentation and returns the matching pages in full, with their related pages named. Send the reader's own words as the query."

// ChatToolsFor is the chat loop's view of the tools: only the names the
// router chose, and search_docs bound to Lookup rather than to the
// snippet search the MCP serves. The MCP keeps the granular tools; the
// chat model gets the composite under a name it already knows.
func (t *Tools) ChatToolsFor(names []string) []chat.ToolDef {
	byName := map[string]ToolDef{}
	for _, d := range t.Defs() {
		byName[d.Name] = d
	}
	var out []chat.ToolDef
	for _, n := range names {
		if n == "search_docs" {
			out = append(out, chat.ToolDef{
				Name: "search_docs", Description: chatSearchDescription,
				InputSchema: mustSchemaFor[lookupIn](),
				Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
					var in lookupIn
					if err := json.Unmarshal(raw, &in); err != nil {
						return nil, err
					}
					pack, err := t.Lookup(ctx, in)
					if err != nil {
						return nil, err
					}
					return t.versioned(map[string]any{"passages": pack.Passages, "related": pack.Related}), nil
				},
			})
			continue
		}
		if n == "validate_request" {
			out = append(out, chat.ToolDef{
				Name: "validate_request", Description: validateRequestDescription,
				InputSchema: mustSchemaFor[validateIn](),
				Call: func(ctx context.Context, raw json.RawMessage) (map[string]any, error) {
					var in validateIn
					if err := json.Unmarshal(raw, &in); err != nil {
						return nil, err
					}
					return t.ValidateRequest(ctx, in)
				},
			})
			continue
		}
		if d, ok := byName[n]; ok {
			out = append(out, chat.ToolDef{Name: d.Name, Description: d.Description, InputSchema: d.InputSchema, Call: d.Call})
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
		b, err := json.Marshal(pack)
		if err != nil {
			return nil, nil, guard.PackFacts{}, err
		}
		var srcs []chat.Source
		var facts guard.PackFacts
		for _, p := range pack.Passages {
			srcs = append(srcs, chat.Source{ID: p.ID, Title: p.Title, URL: p.DocURL, Status: p.VerificationStatus})
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
