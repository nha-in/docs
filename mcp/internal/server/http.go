package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// chatBodyLimit bounds how much of a POST /api/chat request body gets
// decoded, so a client cannot force the server to buffer an unbounded
// payload. 128 KiB comfortably covers MaxTurns turns at MaxInputLen /
// MaxAssistantLen each (about 30 KB) alongside an attached page at
// MaxPageChars (24 KB), plus JSON escaping of a whole Markdown document.
const chatBodyLimit = 128 * 1024 // 128 KiB

func Handler(r *index.Reader, emb embed.Embedder, allowOrigin string, chatSvc *chat.Service, limiter *chat.Limiter, trustProxy bool) (http.Handler, error) {
	if emb != nil && r.EmbeddingsEnabled() && emb.Model() != r.EmbeddingModel() {
		return nil, fmt.Errorf("embedding model mismatch: index built with %q, server configured with %q",
			r.EmbeddingModel(), emb.Model())
	}
	if chatSvc != nil && limiter == nil {
		// The /api/chat handler calls limiter.Allow with no nil-guard, trusting
		// that chatSvc and limiter are always constructed together. Catching the
		// mismatch here, at startup, turns a would-be nil-pointer panic on the
		// first chat request into a clear failure to boot.
		return nil, fmt.Errorf("server: chatSvc is set but limiter is nil")
	}
	mcpServer := NewMCPServer(r, emb)
	streamable := mcp.NewStreamableHTTPHandler(
		func(*http.Request) *mcp.Server { return mcpServer }, nil)

	mux := http.NewServeMux()
	mux.Handle("/mcp", streamable)
	mux.Handle("/mcp/", streamable)

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, req *http.Request) {
		writeJSON(w, 200, map[string]any{
			"catalogue_version": r.CatalogueVersion(),
			"built_at":          r.BuiltAt(),
			"embeddings":        emb != nil && r.EmbeddingsEnabled(),
		})
	})

	mux.HandleFunc("/api/search", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		q := req.URL.Query().Get("q")
		if q == "" {
			writeJSON(w, 400, map[string]string{"error": "missing q parameter"})
			return
		}
		limit, _ := strconv.Atoi(req.URL.Query().Get("limit"))
		start := time.Now()
		hits, err := r.Search(req.Context(), q, "", "", limit, emb)
		if err != nil {
			slog.Error("search failed", "err", err)
			writeJSON(w, 500, map[string]string{"error": "search failed"})
			return
		}
		slog.Info("api_search", "hits", len(hits), "ms", time.Since(start).Milliseconds())
		writeJSON(w, 200, map[string]any{
			"catalogue_version": r.CatalogueVersion(),
			"hits":              searchHitsJSON(hits),
		})
	})

	mux.HandleFunc("/api/chat", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		if req.Method == http.MethodOptions { // the POST + JSON body forces a preflight
			w.Header().Set("Access-Control-Allow-Methods", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(204)
			return
		}
		if chatSvc == nil {
			writeJSON(w, 404, map[string]string{"error": "chat is not enabled on this deployment"})
			return
		}
		if req.Method != http.MethodPost {
			writeJSON(w, 405, map[string]string{"error": "POST only"})
			return
		}
		if !limiter.Allow(clientIP(req, trustProxy), time.Now()) {
			writeJSON(w, 429, map[string]string{"error": "rate limit reached, try again in a minute"})
			return
		}
		var in struct {
			Turns []chat.Turn `json:"turns"`
			// Optional: the page the reader had open. Absent from an older
			// client, and from any request opened from the top bar.
			Page *chat.Page `json:"page"`
		}
		if err := json.NewDecoder(io.LimitReader(req.Body, chatBodyLimit)).Decode(&in); err != nil {
			writeJSON(w, 400, map[string]string{"error": "bad request body"})
			return
		}
		// Validation errors must be JSON 400s, not SSE streams: validate
		// before NewSSEWriter commits the response to text/event-stream.
		if err := chatSvc.ValidateTurns(in.Turns); err != nil {
			writeJSON(w, 400, map[string]string{"error": err.Error()})
			return
		}
		if err := chatSvc.ValidatePage(in.Page); err != nil {
			writeJSON(w, 400, map[string]string{"error": err.Error()})
			return
		}
		ctx, cancel := context.WithTimeout(req.Context(), 60*time.Second)
		defer cancel()
		sw, err := chat.NewSSEWriter(w)
		if err != nil {
			slog.Error("chat sse setup failed", "err", err)
			writeJSON(w, 500, map[string]string{"error": "the assistant hit a problem, try again shortly"})
			return
		}
		start := time.Now()
		if err := chatSvc.Respond(ctx, in.Turns, in.Page, sw.Event); err != nil {
			_ = sw.Event("error", map[string]string{"message": "the assistant hit a problem, try again shortly"})
			slog.Error("chat failed", "err", err)
			return
		}
		slog.Info("chat", "turns", len(in.Turns), "ms", time.Since(start).Milliseconds(),
			"q", in.Turns[len(in.Turns)-1].Text)
	})

	return mux, nil
}

// clientIP identifies the caller for rate limiting. When trustProxy is true,
// the last entry of X-Forwarded-For is used when present (the entry nearest
// to us, appended by our own reverse proxy, is the only one we can trust);
// otherwise -- and this is the default -- X-Forwarded-For is ignored
// entirely and RemoteAddr's host is used, since a direct caller with no
// proxy in front can set that header to whatever it likes and forge a fresh
// identity on every request to dodge the rate limit. If RemoteAddr does not
// parse as host:port, it is returned verbatim rather than discarded, since
// some identifier beats none for rate limiting purposes.
func clientIP(req *http.Request, trustProxy bool) string {
	if trustProxy {
		if fwd := req.Header.Get("X-Forwarded-For"); fwd != "" {
			parts := strings.Split(fwd, ",")
			return strings.TrimSpace(parts[len(parts)-1])
		}
	}
	host, _, err := net.SplitHostPort(req.RemoteAddr)
	if err != nil {
		return req.RemoteAddr
	}
	return host
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
