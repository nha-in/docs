package server

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"sync"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// captureHandler is a slog.Handler that appends every record it receives to
// a slice, guarded by a mutex since slog may be called concurrently.
type captureHandler struct {
	mu      *sync.Mutex
	records *[]slog.Record
}

func newCaptureHandler() *captureHandler {
	return &captureHandler{mu: &sync.Mutex{}, records: &[]slog.Record{}}
}

func (h *captureHandler) Enabled(context.Context, slog.Level) bool { return true }

func (h *captureHandler) Handle(_ context.Context, r slog.Record) error {
	h.mu.Lock()
	defer h.mu.Unlock()
	*h.records = append(*h.records, r)
	return nil
}

func (h *captureHandler) WithAttrs(_ []slog.Attr) slog.Handler { return h }
func (h *captureHandler) WithGroup(_ string) slog.Handler      { return h }

func (h *captureHandler) toolCallRecords() []slog.Record {
	h.mu.Lock()
	defer h.mu.Unlock()
	var out []slog.Record
	for _, r := range *h.records {
		if r.Message == "tool_call" {
			out = append(out, r)
		}
	}
	return out
}

// allText renders every captured record's message and attribute values into
// one string, for a blunt string-absence check: the middleware must never
// pass tool call arguments (or results) through to slog, so nothing in that
// rendering may ever contain content that only appeared in a call's input.
func (h *captureHandler) allText() string {
	h.mu.Lock()
	defer h.mu.Unlock()
	var sb strings.Builder
	for _, r := range *h.records {
		sb.WriteString(r.Message)
		r.Attrs(func(a slog.Attr) bool {
			fmt.Fprintf(&sb, " %s=%v", a.Key, a.Value.Any())
			return true
		})
		sb.WriteString("\n")
	}
	return sb.String()
}

func recordAttr(r slog.Record, key string) (any, bool) {
	var v any
	found := false
	r.Attrs(func(a slog.Attr) bool {
		if a.Key == key {
			v = a.Value.Any()
			found = true
		}
		return true
	})
	return v, found
}

func TestToolCallLogging(t *testing.T) {
	h := newCaptureHandler()
	prev := slog.Default()
	slog.SetDefault(slog.New(h))
	defer slog.SetDefault(prev)

	sess := connect(t, false, nil)
	callText(t, sess, "catalogue_info", map[string]any{})

	recs := h.toolCallRecords()
	var matches []slog.Record
	for _, r := range recs {
		if v, ok := recordAttr(r, "tool"); ok && v == "catalogue_info" {
			matches = append(matches, r)
		}
	}
	if len(matches) != 1 {
		t.Fatalf("want exactly 1 tool_call record for catalogue_info, got %d (all: %d)", len(matches), len(recs))
	}
	if matches[0].Level != slog.LevelInfo {
		t.Errorf("level = %v, want Info", matches[0].Level)
	}
	if _, ok := recordAttr(matches[0], "ms"); !ok {
		t.Errorf("missing ms attr")
	}
	if v, ok := recordAttr(matches[0], "error"); ok && v == true {
		t.Errorf("catalogue_info should not be logged as an error")
	}
}

func TestToolCallLoggingErrorFlag(t *testing.T) {
	h := newCaptureHandler()
	prev := slog.Default()
	slog.SetDefault(slog.New(h))
	defer slog.SetDefault(prev)

	sess := connect(t, false, nil)
	_, err := sess.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "get_atom", Arguments: map[string]any{"id": "does.not.exist"},
	})
	if err != nil {
		t.Fatal(err)
	}

	recs := h.toolCallRecords()
	var found bool
	for _, r := range recs {
		toolV, _ := recordAttr(r, "tool")
		errV, hasErr := recordAttr(r, "error")
		if toolV == "get_atom" && hasErr && errV == true {
			found = true
		}
	}
	if !found {
		t.Fatalf("want a tool_call record with error=true for get_atom on unknown id, got: %+v", recs)
	}
}

// TestValidateFhirArgsNeverLogged pins that no slog call anywhere in the
// validate_fhir path carries the bundle. The middleware logs only tool
// name, ms and error (toolCallLoggingMiddleware in mcp.go); this drives a
// tools/call for validate_fhir through it with a slog handler that records
// every attribute value, then asserts none contains a marker planted only
// inside the bundle content.
func TestValidateFhirArgsNeverLogged(t *testing.T) {
	h := newCaptureHandler()
	prev := slog.Default()
	slog.SetDefault(slog.New(h))
	defer slog.SetDefault(prev)

	const marker = "SECRET-BUNDLE-CONTENT-9d1f"
	bundle := fmt.Sprintf(`{"resourceType":"Bundle","type":"document","marker":%q}`, marker)

	sess := connect(t, false, nil)
	if _, err := sess.CallTool(context.Background(), &mcp.CallToolParams{
		Name:      "validate_fhir",
		Arguments: map[string]any{"bundle_json": bundle},
	}); err != nil {
		t.Fatal(err)
	}

	captured := h.allText()
	if strings.Contains(captured, marker) {
		t.Fatal("bundle content reached a log line")
	}
}
