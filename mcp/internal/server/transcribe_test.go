package server_test

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/chat"
	"github.com/nha-in/docs/mcp/internal/server"
	"github.com/nha-in/docs/mcp/internal/server/servertest"
)

func voiceHandler(t *testing.T, tr server.Transcriber, limiter *chat.Limiter) http.Handler {
	t.Helper()
	var opts []server.Option
	if tr != nil {
		opts = append(opts, server.WithTranscriber(tr))
	}
	h, err := server.Handler(servertest.Reader(t), nil, "https://docs.example.com", &chat.Service{}, limiter, 0, opts...)
	if err != nil {
		t.Fatal(err)
	}
	return h
}

func voiceRequest(h http.Handler, method, contentType, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, "/api/transcribe", strings.NewReader(body))
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

// A recording goes to the configured server as a named audio file with the
// model and the key, and its words come back trimmed.
func TestTranscribeSendsTheRecordingAndReturnsItsWords(t *testing.T) {
	var auth, model, filename, sent string
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		auth = req.Header.Get("Authorization")
		if err := req.ParseMultipartForm(1 << 20); err != nil {
			t.Errorf("upstream could not read the form: %v", err)
		}
		model = req.FormValue("model")
		f, hdr, err := req.FormFile("file")
		if err != nil {
			t.Errorf("upstream got no file: %v", err)
			return
		}
		b, _ := io.ReadAll(f)
		sent, filename = string(b), hdr.Filename
		fmt.Fprint(w, `{"text":"  link records  "}`)
	}))
	defer upstream.Close()
	h := voiceHandler(t, server.WhisperHTTP{URL: upstream.URL, Model: "whisper-1", APIKey: "k"}, chat.NewLimiter(10, 100))

	if rec := voiceRequest(h, http.MethodGet, "", ""); rec.Code != 200 || !strings.Contains(rec.Body.String(), `"enabled":true`) {
		t.Fatalf("GET = %d %s, want enabled", rec.Code, rec.Body)
	}
	rec := voiceRequest(h, http.MethodPost, "audio/webm;codecs=opus", "OPUSBYTES")
	if rec.Code != 200 || !strings.Contains(rec.Body.String(), `"text":"link records"`) {
		t.Fatalf("POST = %d %s, want the trimmed words", rec.Code, rec.Body)
	}
	if auth != "Bearer k" || model != "whisper-1" || filename != "question.webm" || sent != "OPUSBYTES" {
		t.Errorf("upstream saw auth=%q model=%q file=%q body=%q", auth, model, filename, sent)
	}
	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "https://docs.example.com" {
		t.Errorf("allow origin = %q", got)
	}
}

// What is not a recording is refused before anything is sent on.
func TestTranscribeRefusesWhatIsNotARecording(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		t.Error("a refused request reached the transcription server")
	}))
	defer upstream.Close()
	h := voiceHandler(t, server.WhisperHTTP{URL: upstream.URL, Model: "m"}, chat.NewLimiter(50, 100))
	for _, tc := range []struct {
		name, method, contentType, body string
		want                            int
	}{
		{"not audio", http.MethodPost, "application/json", `{"a":1}`, 415},
		{"empty", http.MethodPost, "audio/webm", "", 400},
		{"too long", http.MethodPost, "audio/wav", strings.Repeat("x", (4<<20)+1), 413},
		{"wrong method", http.MethodDelete, "", "", 405},
	} {
		if rec := voiceRequest(h, tc.method, tc.contentType, tc.body); rec.Code != tc.want {
			t.Errorf("%s: %d, want %d", tc.name, rec.Code, tc.want)
		}
	}
}

// With no transcriber configured the endpoint is absent, which is how the
// panel knows not to show a microphone.
func TestTranscribeIsOffUnlessConfigured(t *testing.T) {
	h := voiceHandler(t, nil, chat.NewLimiter(10, 100))
	for _, method := range []string{http.MethodGet, http.MethodPost} {
		if rec := voiceRequest(h, method, "audio/webm", "x"); rec.Code != 404 {
			t.Errorf("%s = %d, want 404", method, rec.Code)
		}
	}
}

// A transcription server that fails is a 502 with no detail of its own, and
// the recording's words are never in the reply.
func TestTranscribeUpstreamFailure(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		http.Error(w, "model exploded: secret detail", 500)
	}))
	defer upstream.Close()
	h := voiceHandler(t, server.WhisperHTTP{URL: upstream.URL, Model: "m"}, chat.NewLimiter(10, 100))
	rec := voiceRequest(h, http.MethodPost, "audio/webm", "x")
	if rec.Code != 502 || strings.Contains(rec.Body.String(), "secret detail") {
		t.Errorf("POST = %d %s, want a bare 502", rec.Code, rec.Body)
	}
}

// Dictation shares the chat's per-address limit: asking by voice is not a
// way round it.
func TestTranscribeSharesTheRateLimit(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		fmt.Fprint(w, `{"text":"hi"}`)
	}))
	defer upstream.Close()
	h := voiceHandler(t, server.WhisperHTTP{URL: upstream.URL, Model: "m"}, chat.NewLimiter(1, 100))
	if rec := voiceRequest(h, http.MethodPost, "audio/webm", "x"); rec.Code != 200 {
		t.Fatalf("first = %d", rec.Code)
	}
	rec := voiceRequest(h, http.MethodPost, "audio/webm", "x")
	if rec.Code != 429 || !strings.Contains(rec.Body.String(), `"limit":"minute"`) || rec.Header().Get("Retry-After") == "" {
		t.Errorf("second = %d %s, want a 429 naming the minute limit", rec.Code, rec.Body)
	}
}
