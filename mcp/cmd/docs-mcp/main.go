// Command docs-mcp serves the catalogue snapshot over MCP and JSON.
package main

import (
	"flag"
	"log/slog"
	"net/http"
	"os"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
)

func main() {
	db := flag.String("db", "catalogue.db", "path to catalogue.db snapshot")
	addr := flag.String("addr", ":8080", "listen address")
	allowOrigin := flag.String("allow-origin", "", "docs site origin for /api/search CORS")
	ollamaURL := flag.String("ollama", "", "Ollama base URL; empty serves keyword-only")
	model := flag.String("embed-model", "nomic-embed-text", "embedding model name")
	flag.Parse()

	r, err := index.Open(*db)
	if err != nil {
		slog.Error("open snapshot", "err", err)
		os.Exit(1)
	}
	defer r.Close()

	var emb embed.Embedder
	if *ollamaURL != "" {
		emb = embed.NewOllama(*ollamaURL, *model)
	}
	h, err := server.Handler(r, emb, *allowOrigin)
	if err != nil {
		slog.Error("configure server", "err", err)
		os.Exit(1)
	}

	slog.Info("docs-mcp starting", "addr", *addr,
		"catalogue_version", r.CatalogueVersion(), "built_at", r.BuiltAt(),
		"embeddings", emb != nil && r.EmbeddingsEnabled())
	if err := http.ListenAndServe(*addr, h); err != nil {
		slog.Error("server", "err", err)
		os.Exit(1)
	}
}
