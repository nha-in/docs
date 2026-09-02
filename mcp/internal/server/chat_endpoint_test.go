// Chat endpoint tests live in an external server_test package rather than
// alongside the rest of the internal server tests: they need to import
// internal/chat to build a chat.Service and a scripted chat.Model, and
// internal/chat itself imports internal/server (for server.ToolDef). An
// internal test file (package server) importing chat would therefore be a
// same-package-augmented-with-a-cyclic-dependency, which the go tool
// rejects outright; an external package server_test has no such problem
// since it is a distinct package from server and chat only ever imports the
// production server package. servertest.Reader stands in for the package's
// own unexported fixtureReader, which an external test file cannot reach.
package server_test

import (
	"bytes"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
	"github.com/eka-care/abdm-docs/mcp/internal/server/servertest"
)

// scriptedModel mirrors chat's own unexported fakeModel: it scripts a
// sequence of replies, one per Stream call, streaming texts[i] through
// onText (when non-empty) before returning replies[i]. Unlike chat's
// fakeModel, a call past the end of the script does not panic: it returns a
// benign empty end_turn reply instead. Some endpoint tests (the rate-limit
// test in particular) legitimately let a valid first request reach the
// model -- only the second, over-limit request is the one under test -- so
// an unscripted scriptedModel{} must survive being called rather than
// index-panicking.
type scriptedModel struct {
	replies   []chat.Reply
	texts     []string
	calls     int
	gotSystem []string
}

func (f *scriptedModel) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	f.gotSystem = append(f.gotSystem, system)
	i := f.calls
	f.calls++
	if i < len(f.texts) && f.texts[i] != "" {
		onText(f.texts[i])
	}
	if i >= len(f.replies) {
		return chat.Reply{StopReason: "end_turn"}, nil
	}
	return f.replies[i], nil
}

// testHandler wraps server.Handler with a fresh test reader and a fixed CORS
// origin, so each chat test only has to supply the pieces it cares about.
func testHandler(t *testing.T, svc *chat.Service, limiter *chat.Limiter) http.Handler {
	t.Helper()
	h, err := server.Handler(servertest.Reader(t), nil, "https://docs.example.com", svc, limiter, false)
	if err != nil {
		t.Fatal(err)
	}
	return h
}

func TestChatEndpointDisabled(t *testing.T) {
	h := testHandler(t, nil, nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/api/chat", strings.NewReader(`{"turns":[]}`)))
	if rec.Code != 404 {
		t.Fatalf("disabled chat = %d, want 404", rec.Code)
	}
}

func TestChatEndpointStreams(t *testing.T) {
	fm := &scriptedModel{
		replies: []chat.Reply{
			{ToolCalls: []chat.ToolCall{{ID: "t1", Name: "search_docs",
				Input: []byte(`{"query":"timestamp"}`)}}, StopReason: "tool_use"},
			{Text: "It is ISO 8601 UTC.", StopReason: "end_turn"},
		},
		texts: []string{"", "It is ISO 8601 UTC."},
	}
	svc := &chat.Service{Model: fm, Tools: server.ChatTools(server.NewTools(servertest.Reader(t), nil).Defs()), MaxTokens: 100}
	h := testHandler(t, svc, chat.NewLimiter(100, 1000))
	body := `{"turns":[{"role":"user","text":"what is the timestamp format?"}]}`
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/api/chat", strings.NewReader(body)))
	if rec.Code != 200 {
		t.Fatalf("status %d, body %s", rec.Code, rec.Body.String())
	}
	out := rec.Body.String()
	for _, want := range []string{"event: tool", "event: text", "event: sources", "event: done"} {
		if !strings.Contains(out, want) {
			t.Errorf("stream missing %q:\n%s", want, out)
		}
	}
}

func TestChatEndpointValidation(t *testing.T) {
	svc := &chat.Service{Model: &scriptedModel{}, MaxTokens: 100}
	h := testHandler(t, svc, chat.NewLimiter(100, 1000))
	for name, body := range map[string]string{
		"empty":         `{"turns":[]}`,
		"endsAssistant": `{"turns":[{"role":"assistant","text":"hi"}]}`,
		"tooLong":       fmt.Sprintf(`{"turns":[{"role":"user","text":%q}]}`, strings.Repeat("x", 2001)),
	} {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest("POST", "/api/chat", strings.NewReader(body)))
		if rec.Code != 400 {
			t.Errorf("%s: status %d, want 400", name, rec.Code)
		}
	}
}

// The panel attaches the page a reader opened it from, as an optional
// "page" object beside the turns. It has to reach the model, and it has to
// stay optional so an older panel keeps working.
func TestChatEndpointCarriesTheAttachedPage(t *testing.T) {
	fm := &scriptedModel{replies: []chat.Reply{{Text: "ok", StopReason: "end_turn"}}, texts: []string{"ok\n"}}
	svc := &chat.Service{Model: fm, MaxTokens: 100}
	h := testHandler(t, svc, chat.NewLimiter(100, 1000))
	body := `{"turns":[{"role":"user","text":"what does this need?"}],` +
		`"page":{"title":"Link a care context","url":"/docs/m2/link","markdown":"POST /v0.5/links/link/confirm"}}`
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("POST", "/api/chat", strings.NewReader(body)))
	if rec.Code != 200 {
		t.Fatalf("status %d, body %s", rec.Code, rec.Body.String())
	}
	if len(fm.gotSystem) == 0 || !strings.Contains(fm.gotSystem[0], "/v0.5/links/link/confirm") {
		t.Fatal("the attached page never reached the model")
	}
	if !strings.Contains(fm.gotSystem[0], "Link a care context") {
		t.Error("the attached page's title never reached the model")
	}
}

func TestChatEndpointPageSizeLimits(t *testing.T) {
	svc := &chat.Service{Model: &scriptedModel{}, MaxTokens: 100}
	h := testHandler(t, svc, chat.NewLimiter(100, 1000))
	post := func(n int) int {
		body := fmt.Sprintf(`{"turns":[{"role":"user","text":"hi"}],"page":{"title":"x","url":"/x","markdown":%q}}`,
			strings.Repeat("x", n))
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest("POST", "/api/chat", strings.NewReader(body)))
		return rec.Code
	}
	// The panel cuts to exactly MaxPageChars, so that length has to get
	// through: this is what pins chatBodyLimit above the page cap, and it is
	// the assertion that fails if either number moves without the other.
	if got := post(chat.MaxPageChars); got != 200 {
		t.Errorf("page at exactly MaxPageChars = %d, want 200", got)
	}
	if got := post(chat.MaxPageChars + 1); got != 400 {
		t.Errorf("oversized page = %d, want 400", got)
	}
}

func TestChatEndpointRateLimit(t *testing.T) {
	svc := &chat.Service{Model: &scriptedModel{}, MaxTokens: 100}
	h := testHandler(t, svc, chat.NewLimiter(1, 1000))
	req := func() *http.Request {
		r := httptest.NewRequest("POST", "/api/chat",
			strings.NewReader(`{"turns":[{"role":"user","text":"hi"}]}`))
		r.RemoteAddr = "9.9.9.9:1234"
		return r
	}
	first := httptest.NewRecorder()
	h.ServeHTTP(first, req())
	second := httptest.NewRecorder()
	h.ServeHTTP(second, req())
	if second.Code != 429 {
		t.Fatalf("second request = %d, want 429", second.Code)
	}
}

func TestChatEndpointPreflight(t *testing.T) {
	h := testHandler(t, &chat.Service{Model: &scriptedModel{}, MaxTokens: 100}, chat.NewLimiter(100, 1000))
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("OPTIONS", "/api/chat", nil))
	if rec.Code != 204 {
		t.Fatalf("preflight status = %d, want 204", rec.Code)
	}
	if got := rec.Header().Get("Access-Control-Allow-Methods"); got != "POST" {
		t.Errorf("Allow-Methods = %q", got)
	}
	if got := rec.Header().Get("Access-Control-Allow-Headers"); got != "Content-Type" {
		t.Errorf("Allow-Headers = %q", got)
	}
}

func TestChatEndpointMethodNotAllowed(t *testing.T) {
	h := testHandler(t, &chat.Service{Model: &scriptedModel{}, MaxTokens: 100}, chat.NewLimiter(100, 1000))
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, httptest.NewRequest("GET", "/api/chat", nil))
	if rec.Code != 405 {
		t.Fatalf("status = %d, want 405", rec.Code)
	}
}

// The question reaches the log masked. The model is handed a masked copy
// while the original stays in the handler, so this is the one place a live
// patient identifier could still be written down.
func TestChatLogsTheQuestionMasked(t *testing.T) {
	var buf bytes.Buffer
	prior := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&buf, nil)))
	defer slog.SetDefault(prior)

	h := testHandler(t, &chat.Service{Model: &scriptedModel{
		replies: []chat.Reply{{Text: "ok", StopReason: "end_turn"}},
		texts:   []string{"ok"},
	}, MaxTokens: 100}, chat.NewLimiter(100, 1000))
	body := `{"turns":[{"role":"user","text":"my aadhaar 1234 5678 9012 fails"}]}`
	req := httptest.NewRequest("POST", "/api/chat", strings.NewReader(body))
	req.Header.Set("Origin", "https://docs.example.com")
	h.ServeHTTP(httptest.NewRecorder(), req)

	if got := buf.String(); strings.Contains(got, "1234 5678 9012") {
		t.Errorf("the raw question reached the log:\n%s", got)
	}
}
