package server

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/nha-in/docs/mcp/internal/chat"
)

// Transcriber turns a short recording of a reader's question into text. The
// chat never sees audio: the panel sends a recording here, gets the words
// back, and puts them in the box for the reader to check before anything is
// asked.
type Transcriber interface {
	Transcribe(ctx context.Context, audio []byte, contentType string) (string, error)
}

// WhisperHTTP sends the recording to any server that speaks the
// /v1/audio/transcriptions contract Whisper servers share, self-hosted or
// hosted. Which one is the deployment's choice; nothing here names a vendor.
type WhisperHTTP struct {
	URL    string // the full transcriptions endpoint
	Model  string
	APIKey string // optional, sent as a bearer token
	Client *http.Client
}

func (w WhisperHTTP) Transcribe(ctx context.Context, audio []byte, contentType string) (string, error) {
	var body bytes.Buffer
	form := multipart.NewWriter(&body)
	if err := form.WriteField("model", w.Model); err != nil {
		return "", err
	}
	if err := form.WriteField("response_format", "json"); err != nil {
		return "", err
	}
	part, err := form.CreateFormFile("file", "question"+audioExt(contentType))
	if err != nil {
		return "", err
	}
	if _, err := part.Write(audio); err != nil {
		return "", err
	}
	if err := form.Close(); err != nil {
		return "", err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, w.URL, &body)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", form.FormDataContentType())
	if w.APIKey != "" {
		req.Header.Set("Authorization", "Bearer "+w.APIKey)
	}
	client := w.Client
	if client == nil {
		client = http.DefaultClient
	}
	res, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("transcription request: %w", err)
	}
	defer res.Body.Close()
	if res.StatusCode/100 != 2 {
		return "", fmt.Errorf("transcription server answered %d", res.StatusCode)
	}
	var out struct {
		Text string `json:"text"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&out); err != nil {
		return "", fmt.Errorf("transcription response: %w", err)
	}
	return strings.TrimSpace(out.Text), nil
}

// audioExt names the upload after what the browser recorded. Whisper servers
// pick the decoder from the file name, so a recording sent as "question" with
// no extension is refused.
func audioExt(contentType string) string {
	switch contentType {
	case "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac":
		return ".mp4"
	case "audio/ogg":
		return ".ogg"
	case "audio/wav", "audio/x-wav", "audio/wave":
		return ".wav"
	case "audio/mpeg":
		return ".mp3"
	}
	return ".webm"
}

const (
	// maxTranscribeBytes holds a minute of speech in any format a browser
	// records, with room to spare: a minute of uncompressed 16 kHz mono is
	// under 2 MB.
	maxTranscribeBytes   = 4 << 20
	maxTranscribeSeconds = 60
	transcribeTimeout    = 30 * time.Second
)

// Option configures what Handler serves beyond search, chat and MCP.
type Option func(*options)

type options struct {
	transcriber Transcriber
}

// WithTranscriber turns on voice input at /api/transcribe.
func WithTranscriber(t Transcriber) Option {
	return func(o *options) { o.transcriber = t }
}

// transcribeHandler serves voice input. GET says whether it is on, so the
// panel knows whether to show a microphone at all; POST takes a recording
// and returns its words. The recording is held in memory for the one request
// and never written anywhere, and what was said is never logged: it is the
// reader's, and may carry a patient's identifier before the chat's own
// masking has had the chance to see it.
func transcribeHandler(t Transcriber, allowOrigin string, limiter *chat.Limiter, trustedHops int) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		if req.Method == http.MethodOptions { // an audio body forces a preflight
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(204)
			return
		}
		// It shares the chat's rate limit, so it is on only where chat is.
		if t == nil || limiter == nil {
			writeJSON(w, 404, map[string]string{"error": "voice input is not enabled on this deployment"})
			return
		}
		switch req.Method {
		case http.MethodGet:
			writeJSON(w, 200, map[string]any{"enabled": true, "max_seconds": maxTranscribeSeconds})
			return
		case http.MethodPost:
		default:
			writeJSON(w, 405, map[string]string{"error": "GET or POST only"})
			return
		}
		if d := limiter.Deny(clientIP(req, trustedHops), time.Now()); d.Limit != "" {
			secs := int(d.RetryAfter.Seconds() + 0.999)
			if secs < 1 {
				secs = 1
			}
			w.Header().Set("Retry-After", strconv.Itoa(secs))
			writeJSON(w, 429, map[string]any{"error": "rate limit reached", "limit": d.Limit, "retry_after_seconds": secs})
			return
		}
		contentType, _, _ := strings.Cut(req.Header.Get("Content-Type"), ";")
		contentType = strings.TrimSpace(contentType)
		if !strings.HasPrefix(contentType, "audio/") {
			writeJSON(w, 415, map[string]string{"error": "send the recording as audio"})
			return
		}
		audio, err := io.ReadAll(http.MaxBytesReader(w, req.Body, maxTranscribeBytes))
		if err != nil {
			writeJSON(w, 413, map[string]string{"error": "the recording is too long"})
			return
		}
		if len(audio) == 0 {
			writeJSON(w, 400, map[string]string{"error": "the recording is empty"})
			return
		}
		ctx, cancel := context.WithTimeout(req.Context(), transcribeTimeout)
		defer cancel()
		start := time.Now()
		text, err := t.Transcribe(ctx, audio, contentType)
		if err != nil {
			slog.Error("transcribe failed", "err", err, "bytes", len(audio))
			writeJSON(w, 502, map[string]string{"error": "could not transcribe the recording"})
			return
		}
		slog.Info("api_transcribe", "bytes", len(audio), "chars", len(text), "ms", time.Since(start).Milliseconds())
		writeJSON(w, 200, map[string]string{"text": text})
	}
}
