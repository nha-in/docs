// Package server exposes the catalogue snapshot as MCP tools and as a
// JSON search endpoint for the docs site.
package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/fhir"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/google/jsonschema-go/jsonschema"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

const serverVersion = "0.1.0"

// unverifiedCaution is attached to any full atom whose verification status
// is not "verified", so recorded claims are never mistaken for observed
// sandbox behaviour.
const unverifiedCaution = "unverified: formats, URLs and enums in this atom are recorded claims, not observed behaviour; prefer any atom marked verified, and treat exact values as needing a sandbox check"

// atomTypeValues are the catalogue atom types, used to enumerate the type
// filters of search_docs and list_atoms.
var atomTypeValues = []any{
	"concept", "flow", "endpoint", "callback", "error",
	"test", "glossary", "decision", "fhir", "sandbox",
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

// NewMCPServer wires the thirteen tools. emb may be nil (keyword-only).
func NewMCPServer(r *index.Reader, emb embed.Embedder) *mcp.Server {
	s := mcp.NewServer(&mcp.Implementation{Name: "abdm-docs", Version: serverVersion}, nil)
	s.AddReceivingMiddleware(toolCallLoggingMiddleware)
	versioned := func(fields map[string]any) map[string]any {
		fields["catalogue_version"] = r.CatalogueVersion()
		return fields
	}

	tools := NewTools(r, emb)

	mcp.AddTool(s, &mcp.Tool{
		Name:        "search_docs",
		Description: searchDocsDescription,
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
		Description: getAtomDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetAtom(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "related_atoms",
		Description: relatedAtomsDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getAtomIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.RelatedAtoms(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "decode_error",
		Description: decodeErrorDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in decodeIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.DecodeError(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	type listAtomsIn struct {
		Type      string `json:"type,omitempty" jsonschema:"optional atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox"`
		Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name: "list_atoms",
		Description: "Enumerate catalogue atoms by type and milestone, for example all M2 test cases. " +
			"Use this to enumerate what the catalogue covers; use search_docs when you have an intent rather than a category.",
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
		Description: listOperationsDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in listOpsIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ListOperations(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_operation",
		Description: getOperationDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getOpIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetOperation(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "list_fhir_profiles",
		Description: listFhirProfilesDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in emptyFhirIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.ListFHIRProfiles(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_fhir_profile",
		Description: getFhirProfileDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getFhirProfileIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetFHIRProfile(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	mcp.AddTool(s, &mcp.Tool{
		Name:        "get_fhir_example",
		Description: getFhirExampleDescription,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in getFhirExampleIn) (*mcp.CallToolResult, any, error) {
		out, err := tools.GetFHIRExample(ctx, in)
		if err != nil {
			return notFoundOrErr(err)
		}
		return jsonResult(out)
	})

	type validateIn struct {
		OperationID string `json:"operation_id" jsonschema:"the operationId from list_operations"`
		Body        string `json:"body" jsonschema:"the candidate request body as raw JSON"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name: "validate_request",
		Description: "Validate a candidate request body against an operation's schema, locally, before calling the sandbox. " +
			"Also reminds you of required headers and parameters, which body validation cannot see. " +
			"Use this before writing request code for any operation.",
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

	// loadAllDigests loads every indexed profile digest once and caches it
	// for the lifetime of this server: digests are immutable per snapshot,
	// and validate_fhir would otherwise re-read every profile digest from
	// the reader on every call.
	var (
		digestsOnce  sync.Once
		digestsCache map[string]*fhir.ProfileDigest
		digestsErr   error
	)
	loadAllDigests := func(r *index.Reader) (map[string]*fhir.ProfileDigest, error) {
		digestsOnce.Do(func() {
			summaries, err := r.ListFHIRProfiles()
			if err != nil {
				digestsErr = err
				return
			}
			m := make(map[string]*fhir.ProfileDigest, len(summaries))
			for _, sm := range summaries {
				d, err := r.GetFHIRProfile(sm.ProfileName)
				if err != nil {
					digestsErr = err
					return
				}
				m[sm.ProfileName] = d
			}
			digestsCache = m
		})
		return digestsCache, digestsErr
	}

	type validateFhirIn struct {
		BundleJSON string `json:"bundle_json" jsonschema:"the FHIR document bundle to check, as a JSON string"`
		RecordType string `json:"record_type,omitempty" jsonschema:"optional expected ABDM hiType, for example OPConsultation"`
	}
	mcp.AddTool(s, &mcp.Tool{
		Name: "validate_fhir",
		Description: "Structural pre-flight check of a FHIR document bundle against the pinned NRCES profiles and ABDM transport rules. " +
			"Returns findings with locations and concrete fixes, never a bare pass or fail. " +
			"This is tier 1: it does not validate terminology and does not replace the official HL7 validator, whose recipe the catalogue carries.",
	}, func(ctx context.Context, req *mcp.CallToolRequest, in validateFhirIn) (*mcp.CallToolResult, any, error) {
		if len(in.BundleJSON) > 2<<20 {
			return jsonResult(versioned(map[string]any{"error": "bundle exceeds the 2 MiB limit"}))
		}
		digests, err := loadAllDigests(r)
		if err != nil {
			return nil, nil, err
		}
		findings := fhir.Validate([]byte(in.BundleJSON), in.RecordType, digests)
		return jsonResult(versioned(map[string]any{
			"findings": findings,
			"limits":   fmt.Sprintf(fhir.LimitsTemplate, r.FHIRIGVersion()),
		}))
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
			"title": a.Title, "verification_status": a.VerificationStatus,
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
