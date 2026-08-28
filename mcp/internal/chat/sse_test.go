package chat

import (
	"net/http/httptest"
	"testing"
)

func TestSSEFraming(t *testing.T) {
	rec := httptest.NewRecorder()
	sw, err := NewSSEWriter(rec)
	if err != nil {
		t.Fatal(err)
	}
	if err := sw.Event("text", map[string]string{"delta": "hi"}); err != nil {
		t.Fatal(err)
	}
	if err := sw.Event("done", map[string]any{}); err != nil {
		t.Fatal(err)
	}
	want := "event: text\ndata: {\"delta\":\"hi\"}\n\nevent: done\ndata: {}\n\n"
	if got := rec.Body.String(); got != want {
		t.Errorf("frames:\n got %q\nwant %q", got, want)
	}
	if ct := rec.Header().Get("Content-Type"); ct != "text/event-stream" {
		t.Errorf("content type %q", ct)
	}
	if got := rec.Header().Get("X-Accel-Buffering"); got != "no" {
		t.Errorf("X-Accel-Buffering = %q, want %q (nginx-family proxies buffer SSE otherwise)", got, "no")
	}
}
