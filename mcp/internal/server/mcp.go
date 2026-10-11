// Package server exposes the catalogue snapshot as MCP tools and as a
// JSON search endpoint for the docs site.
package server

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
)

const serverVersion = "0.2.0"

// readOnly marks every tool: each reads one immutable snapshot and touches
// nothing outside it, so a repeated call has no further effect.
var readOnly = &mcp.ToolAnnotations{ReadOnlyHint: true, IdempotentHint: true, OpenWorldHint: new(bool)}

// NewMCPServer wires the six tools and, for one release, the thirteen old
// names as deprecated aliases. emb may be nil (keyword-only).
func NewMCPServer(r *index.Reader, emb embed.Embedder) *mcp.Server {
	s := mcp.NewServer(&mcp.Implementation{Name: "abdm-docs", Version: serverVersion}, nil)
	s.AddReceivingMiddleware(toolCallLoggingMiddleware)
	tools := NewTools(r, emb)
	for _, d := range append(tools.Defs(), tools.aliasDefs()...) {
		register(s, d)
	}

	// The compiled skills, as one resource per section and one prompt per
	// skill. A snapshot built before skills were indexed has no rows and
	// registers nothing, so an older database still serves.
	if err := addSkills(s, r); err != nil {
		slog.Warn("skills not registered", "err", err)
	}

	return s
}

// register adds one ToolDef to the server. The SDK validates the arguments
// against d.InputSchema and the result against d.OutputSchema, and sends the
// result twice: as structuredContent for a client that reads the schema, and
// as the same JSON in a text block for one that does not. An error from
// d.Call comes back as an isError result carrying its message, which every
// tool writes to say what to call instead.
func register(s *mcp.Server, d ToolDef) {
	mcp.AddTool(s, &mcp.Tool{
		Name: d.Name, Description: d.Description, Annotations: readOnly,
		InputSchema: d.InputSchema, OutputSchema: d.OutputSchema,
	}, func(ctx context.Context, req *mcp.CallToolRequest, in json.RawMessage) (*mcp.CallToolResult, any, error) {
		out, err := d.Call(ctx, in)
		if err != nil {
			return nil, nil, err
		}
		b, err := json.Marshal(out)
		if err != nil {
			return nil, nil, err
		}
		return &mcp.CallToolResult{Content: []mcp.Content{&mcp.TextContent{Text: string(b)}}}, out, nil
	})
}

func searchHitsJSON(hits []index.SearchHit) []map[string]any {
	out := []map[string]any{}
	for _, h := range hits {
		out = append(out, map[string]any{
			"id": h.ID, "type": h.Type, "milestone": h.Milestone,
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
