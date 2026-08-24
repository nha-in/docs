package server

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func Handler(r *index.Reader, emb embed.Embedder, allowOrigin string) (http.Handler, error) {
	if emb != nil && r.EmbeddingsEnabled() && emb.Model() != r.EmbeddingModel() {
		return nil, fmt.Errorf("embedding model mismatch: index built with %q, server configured with %q",
			r.EmbeddingModel(), emb.Model())
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

	return mux, nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
