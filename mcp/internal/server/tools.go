package server

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/google/jsonschema-go/jsonschema"
)

// The seven chat-visible tool descriptions, shared verbatim between the MCP
// registration in mcp.go and the Defs table below.
const (
	searchDocsDescription = "Hybrid search over the ABDM catalogue atoms: concepts, flows, endpoints, callbacks, errors, tests, glossary entries, decisions, FHIR mappings and sandbox notes. " +
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
)

type searchIn struct {
	Query     string `json:"query" jsonschema:"the search query"`
	Type      string `json:"type,omitempty" jsonschema:"optional atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox"`
	Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter, M1 to M4"`
	Limit     int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
}

type getAtomIn struct {
	ID string `json:"id" jsonschema:"the atom id, for example hiecm.error.abdm-1035"`
}

type decodeIn struct {
	Input string `json:"input" jsonschema:"an error code or a raw gateway response body"`
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

// Tools holds the seven read-only catalogue tools shared by the MCP server
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
	}
	if a.VerificationStatus != "verified" {
		fields["caution"] = unverifiedCaution
	}
	return t.versioned(fields), nil
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
	frag, err := t.r.GetOperation(in.OperationID)
	if err != nil {
		return nil, err
	}
	return t.versioned(map[string]any{
		"operation_id": in.OperationID,
		"spec":         json.RawMessage(frag),
	}), nil
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

// ChatTools adapts server.ToolDef definitions (as vended by Tools.Defs) into
// the chat package's own ToolDef shape, so a chat.Service can be built from
// the same seven tools the MCP server exposes. Package chat cannot import
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

// Defs returns the seven chat-visible tool definitions, in a fixed order:
// search_docs, get_atom, related_atoms, decode_error, list_operations,
// get_operation, catalogue_info.
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
	}
}
