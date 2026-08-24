// Package server exposes the catalogue snapshot as MCP tools and as a
// JSON search endpoint for the docs site.
package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const serverVersion = "0.1.0"

// NewMCPServer wires the nine tools. emb may be nil (keyword-only).
func NewMCPServer(r *index.Reader, emb embed.Embedder) *mcp.Server {
	s := mcp.NewServer(&mcp.Implementation{Name: "abdm-docs", Version: serverVersion}, nil)
	s.AddReceivingMiddleware(toolCallLoggingMiddleware)
	versioned := func(fields map[string]any) map[string]any {
		fields["catalogue_version"] = r.CatalogueVersion()
		return fields
	}

	type searchIn struct {
		Query     string `json:"query" jsonschema:"the search query"`
		Type      string `json:"type,omitempty" jsonschema:"optional atom type filter"`
		Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter, M1 to M4"`
		Limit     int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "search_docs",
		Description: "Hybrid search over the ABDM catalogue. Results carry verification_status; treat unverified content as unverified.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in searchIn) (*mcp.CallToolResult, any, error) {
		hits, err := r.Search(ctx, in.Query, in.Type, in.Milestone, in.Limit, emb)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(versioned(map[string]any{"hits": searchHitsJSON(hits)}))
	})

	type getAtomIn struct {
		ID string `json:"id" jsonschema:"the atom id, for example hiecm.error.abdm-1035"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_atom",
		Description: "Read one catalogue atom: full frontmatter fields and markdown body.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		a, err := r.GetAtom(in.ID)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(versioned(map[string]any{
			"id": a.ID, "type": a.Type, "gateway": a.Gateway,
			"milestone": a.Milestone, "title": a.Title, "summary": a.Summary,
			"verification_status": a.VerificationStatus, "body": a.Body,
		}))
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "related_atoms",
		Description: "Walk the catalogue graph from one atom: its endpoints, callbacks, errors, tests and concepts, both directions.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		groups, err := r.RelatedAtoms(in.ID)
		if err != nil {
			return notFoundOrErr(err)
		}
		out := map[string]any{}
		for _, g := range groups {
			out[g.Relation] = atomRefsJSON(g.Atoms)
		}
		return jsonResult(versioned(map[string]any{"id": in.ID, "related": out}))
	})

	type decodeIn struct {
		Input string `json:"input" jsonschema:"an error code or a raw gateway response body"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "decode_error",
		Description: "Extract ABDM error codes from a code or raw response and return the matching error atoms with their fixes.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in decodeIn) (*mcp.CallToolResult, any, error) {
		codes := catalogue.ExtractErrorCodes(in.Input)
		if len(codes) == 0 {
			return jsonResult(versioned(map[string]any{
				"message": "no error codes found in the input; try search_docs with the response text",
				"codes":   []string{},
			}))
		}
		matches := map[string]any{}
		for _, code := range codes {
			refs, err := r.AtomsByErrorCode(code)
			if err != nil {
				return nil, nil, err
			}
			var full []map[string]any
			for _, ref := range refs {
				if ref.Type != "error" {
					continue
				}
				a, err := r.GetAtom(ref.ID)
				if err != nil {
					continue
				}
				full = append(full, map[string]any{
					"id": a.ID, "title": a.Title, "summary": a.Summary,
					"verification_status": a.VerificationStatus, "body": a.Body,
				})
			}
			if full == nil {
				matches[code] = map[string]any{
					"message": "no error atom for this code yet; try search_docs",
				}
			} else {
				matches[code] = full
			}
		}
		return jsonResult(versioned(map[string]any{"codes": codes, "matches": matches}))
	})

	type listAtomsIn struct {
		Type      string `json:"type,omitempty" jsonschema:"optional atom type filter"`
		Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_atoms",
		Description: "Enumerate catalogue atoms by type and milestone, for example all M2 test cases.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in listAtomsIn) (*mcp.CallToolResult, any, error) {
		refs, err := r.ListAtoms(in.Type, in.Milestone)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(versioned(map[string]any{"atoms": atomRefsJSON(refs)}))
	})

	type emptyIn struct{}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "catalogue_info",
		Description: "Catalogue version, build time, embeddings status and coverage counts by gateway, milestone, type and verification status.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in emptyIn) (*mcp.CallToolResult, any, error) {
		stats, err := r.Stats()
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(versioned(map[string]any{
			"built_at":   r.BuiltAt(),
			"embeddings": emb != nil && r.EmbeddingsEnabled(),
			"atoms": map[string]any{
				"by_gateway":   stats.ByGateway,
				"by_milestone": stats.ByMilestone,
				"by_type":      stats.ByType,
				"by_status":    stats.ByStatus,
			},
			"operations": stats.Operations,
		}))
	})

	type listOpsIn struct {
		Tag string `json:"tag,omitempty" jsonschema:"optional tag filter"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_operations",
		Description: "List API operations from the ingested OpenAPI specifications.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in listOpsIn) (*mcp.CallToolResult, any, error) {
		ops, err := r.ListOperations(in.Tag)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(versioned(map[string]any{"operations": ops}))
	})

	type getOpIn struct {
		OperationID string `json:"operation_id" jsonschema:"the operationId from list_operations"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_operation",
		Description: "Get the exact OpenAPI fragment for one operation: parameters, headers, schemas.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getOpIn) (*mcp.CallToolResult, any, error) {
		frag, err := r.GetOperation(in.OperationID)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(versioned(map[string]any{
			"operation_id": in.OperationID,
			"spec":         json.RawMessage(frag),
		}))
	})

	type validateIn struct {
		OperationID string `json:"operation_id" jsonschema:"the operationId from list_operations"`
		Body        string `json:"body" jsonschema:"the candidate request body as raw JSON"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "validate_request",
		Description: "Validate a candidate request body against an operation's schema, locally, before calling the sandbox. Also reminds you of required headers and parameters, which body validation cannot see.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateIn) (*mcp.CallToolResult, any, error) {
		v, err := r.GetOperationValidation(in.OperationID)
		if err != nil {
			return notFoundOrErr(err)
		}
		base := map[string]any{
			"operation_id":        in.OperationID,
			"required_parameters": v.RequiredParams,
		}
		if v.RequestSchemaJSON == nil {
			base["valid"] = false
			base["errors"] = []string{"this operation has no application/json request schema; nothing to validate against"}
			return jsonResult(versioned(base))
		}
		var payload any
		if err := json.Unmarshal([]byte(in.Body), &payload); err != nil {
			base["valid"] = false
			base["errors"] = []string{"body is not valid JSON: " + err.Error()}
			return jsonResult(versioned(base))
		}
		var schema openapi3.Schema
		if err := json.Unmarshal(v.RequestSchemaJSON, &schema); err != nil {
			return nil, nil, fmt.Errorf("stored schema for %s: %w", in.OperationID, err)
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
		return jsonResult(versioned(base))
	})

	return s
}

func searchHitsJSON(hits []index.SearchHit) []map[string]any {
	out := []map[string]any{}
	for _, h := range hits {
		out = append(out, map[string]any{
			"id": h.ID, "type": h.Type, "milestone": h.Milestone,
			"title": h.Title, "summary": h.Summary,
			"verification_status": h.VerificationStatus, "snippet": h.Snippet,
		})
	}
	return out
}

func atomRefsJSON(refs []index.AtomRef) []map[string]any {
	out := []map[string]any{}
	for _, a := range refs {
		out = append(out, map[string]any{
			"id": a.ID, "type": a.Type, "milestone": a.Milestone,
			"title": a.Title, "verification_status": a.VerificationStatus,
		})
	}
	return out
}

// toolCallLoggingMiddleware logs exactly one slog line per served tools/call
// request: message "tool_call" with attrs tool, ms and, when the call
// produced an error, error=true. Request arguments and response bodies are
// never logged, per the project privacy rule. Other methods, such as
// initialize and tools/list, are left unlogged.
func toolCallLoggingMiddleware(next mcp.MethodHandler) mcp.MethodHandler {
	return func(ctx context.Context, method string, req mcp.Request) (mcp.Result, error) {
		if method != "tools/call" {
			return next(ctx, method, req)
		}
		tool := ""
		if ctr, ok := req.(*mcp.CallToolRequest); ok {
			tool = ctr.Params.Name
		}
		start := time.Now()
		res, err := next(ctx, method, req)
		attrs := []any{"tool", tool, "ms", time.Since(start).Milliseconds()}
		isErr := err != nil
		if !isErr {
			if ctr, ok := res.(*mcp.CallToolResult); ok && ctr.IsError {
				isErr = true
			}
		}
		if isErr {
			attrs = append(attrs, "error", true)
		}
		slog.Info("tool_call", attrs...)
		return res, err
	}
}

func jsonResult(v any) (*mcp.CallToolResult, any, error) {
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return nil, nil, err
	}
	return &mcp.CallToolResult{
		Content: []mcp.Content{&mcp.TextContent{Text: string(b)}},
	}, nil, nil
}

func notFoundOrErr(err error) (*mcp.CallToolResult, any, error) {
	var nf *index.NotFoundError
	if errors.As(err, &nf) {
		return &mcp.CallToolResult{
			IsError: true,
			Content: []mcp.Content{&mcp.TextContent{
				Text: fmt.Sprintf("%s. Use search_docs, list_atoms or list_operations to find valid ids.", nf.Error()),
			}},
		}, nil, nil
	}
	return nil, nil, err
}
