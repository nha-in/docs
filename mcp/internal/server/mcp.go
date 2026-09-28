// Package server exposes the catalogue snapshot as MCP tools and as a
// JSON search endpoint for the docs site.
package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/google/jsonschema-go/jsonschema"
	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
)

const serverVersion = "0.1.0"

// atomTypeValues are the catalogue atom types, used to enumerate the type
// filters of search_docs and list_atoms.
var atomTypeValues = []any{
	"concept", "flow", "endpoint", "callback", "error",
	"test", "glossary", "decision", "fhir", "sandbox", "troubleshooting",
}

// schemaWithAtomTypeEnum infers the input schema for In and constrains its
// "type" property to the known atom types.
func schemaWithAtomTypeEnum[In any]() *jsonschema.Schema {
	s, err := jsonschema.For[In](nil)
	if err != nil {
		panic(err)
	}
	s.Properties["type"].Enum = atomTypeValues
	return s
}

// maxUnfilteredOperations caps list_operations output when no filter is
// given; the full listing runs to hundreds of operations and tens of
// kilobytes.
const maxUnfilteredOperations = 60

// NewMCPServer wires six tools and, for one release, eleven deprecated
// aliases: the old names, each delegating as before. emb may be nil
// (keyword-only).
func NewMCPServer(r *index.Reader, emb embed.Embedder) *mcp.Server {
	s := mcp.NewServer(&mcp.Implementation{Name: "abdm-docs", Version: serverVersion}, nil)
	s.AddReceivingMiddleware(toolCallLoggingMiddleware)
	versioned := func(fields map[string]any) map[string]any {
		fields["catalogue_version"] = r.CatalogueVersion()
		return fields
	}

	tools := NewTools(r, emb)
	readOnly := &mcp.ToolAnnotations{ReadOnlyHint: true}

	mcp.AddTool(s, &mcp.Tool{Name: "search", Annotations: readOnly, InputSchema: schemaWithAtomTypeEnum[searchSixIn](),
		Description: searchDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in searchSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Search(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
	mcp.AddTool(s, &mcp.Tool{Name: "get", Annotations: readOnly, InputSchema: mustSchemaFor[getSixIn](),
		Description: getDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Get(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})
	mcp.AddTool(s, &mcp.Tool{Name: "related", Annotations: readOnly, Description: relatedAtomsDescription},
		func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
			out, err := tools.RelatedAtoms(ctx, in)
			if err != nil {
				return notFoundOrErr(err)
			}
			return jsonResult(out)
		})
	mcp.AddTool(s, &mcp.Tool{Name: "validate", Annotations: readOnly, InputSchema: mustSchemaFor[validateSixIn](),
		Description: validateDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateSixIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.Validate(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "search_docs",
		Description: deprecated("search", searchDocsDescription),
		InputSchema: schemaWithAtomTypeEnum[searchIn](),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in searchIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.SearchDocs(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_atom",
		Description: deprecated("get", getAtomDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetAtom(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "related_atoms",
		Description: deprecated("related", relatedAtomsDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.RelatedAtoms(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "decode_error",
		Annotations: readOnly,
		Description: decodeErrorDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in decodeIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.DecodeError(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	type listAtomsIn struct {
		Type      string `json:"type,omitempty" jsonschema:"optional atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox, troubleshooting"`
		Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_atoms",
		Description: deprecated("search", listAtomsDescription),
		InputSchema: schemaWithAtomTypeEnum[listAtomsIn](),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in listAtomsIn) (*mcp.CallToolResult, any, error) {
		refs, err := r.ListAtoms(in.Type, in.Milestone)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(versioned(map[string]any{"atoms": atomRefsJSON(refs)}))
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "catalogue_info",
		Annotations: readOnly,
		Description: catalogueInfoDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in emptyIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.CatalogueInfo(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_operations",
		Description: deprecated("search", listOperationsDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in listOpsIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ListOperations(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_operation",
		Description: deprecated("get", getOperationDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getOpIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetOperation(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_fhir_profiles",
		Description: deprecated("search", listFhirProfilesDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in emptyFhirIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ListFHIRProfiles(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_fhir_profile",
		Description: deprecated("get", getFhirProfileDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getFhirProfileIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetFHIRProfile(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_fhir_example",
		Description: deprecated("get", getFhirExampleDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getFhirExampleIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetFHIRExample(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "validate_request",
		Description: deprecated("validate", validateRequestDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ValidateRequest(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "validate_fhir",
		Description: deprecated("validate", validateFhirDescription),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateFhirIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ValidateFHIR(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	// The compiled skills, as one resource per section and one prompt per
	// skill. A snapshot built before skills were indexed has no rows and
	// registers nothing, so an older database still serves.
	if err := addSkills(s, r); err != nil {
		slog.Warn("skills not registered", "err", err)
	}

	return s
}

func searchHitsJSON(hits []index.SearchHit) []map[string]any {
	out := []map[string]any{}
	for _, h := range hits {
		out = append(out, map[string]any{
			"kind": h.Kind, "id": h.ID, "type": h.Type, "milestone": h.Milestone,
			"title": h.Title, "summary": h.Summary,
			"snippet": h.Snippet,
			"doc_url": index.DocLink(h.DocURL, h.DocAnchor),
		})
	}
	return out
}

func atomRefsJSON(refs []index.AtomRef) []map[string]any {
	out := []map[string]any{}
	for _, a := range refs {
		out = append(out, map[string]any{
			"id": a.ID, "type": a.Type, "milestone": a.Milestone,
			"title":   a.Title,
			"doc_url": index.DocLink(a.DocURL, a.DocAnchor),
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
	if strings.HasPrefix(err.Error(), "kind ") {
		return &mcp.CallToolResult{IsError: true, Content: []mcp.Content{&mcp.TextContent{Text: err.Error()}}}, nil, nil
	}
	var nf *index.NotFoundError
	if errors.As(err, &nf) {
		return &mcp.CallToolResult{
			IsError: true,
			Content: []mcp.Content{&mcp.TextContent{
				Text: fmt.Sprintf("%s. Use search to find valid ids, then get with an id from its results.", nf.Error()),
			}},
		}, nil, nil
	}
	return nil, nil, err
}
