// Command docs-mcp serves the catalogue snapshot over MCP and JSON.
package main

import (
	"context"
	"flag"
	"log/slog"
	"net/http"
	"os"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
)

// envOr lets the environment set every default while the flags stay as local
// dev overrides: the same image runs in every environment purely by env, and
// `docs-mcp -addr :9090` still works at a keyboard.
func envOr(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}

func main() {
	db := flag.String("db", envOr("DB_PATH", "catalogue.db"), "path to catalogue.db snapshot")
	addr := flag.String("addr", envOr("ADDR", ":8080"), "listen address")
	allowOrigin := flag.String("allow-origin", envOr("ALLOW_ORIGIN", ""), "docs site origin for /api/search CORS")
	provider := flag.String("embed-provider", envOr("EMBED_PROVIDER", ""), "embedding provider: bedrock, ollama or none")
	model := flag.String("embed-model", envOr("EMBED_MODEL", ""), "embedding model id; empty takes the provider default")
	ollamaURL := flag.String("ollama", envOr("OLLAMA_URL", ""), "Ollama base URL, for -embed-provider ollama")
	region := flag.String("aws-region", envOr("AWS_REGION", ""), "AWS region, for -embed-provider bedrock")
	flag.Parse()

	r, err := index.Open(*db)
	if err != nil {
		slog.Error("open snapshot", "err", err)
		os.Exit(1)
	}
	defer r.Close()

	emb, err := embed.New(context.Background(), embed.Config{
		Provider:  *provider,
		Model:     *model,
		OllamaURL: *ollamaURL,
		Region:    *region,
	})
	if err != nil {
		slog.Error("configure embeddings", "err", err)
		os.Exit(1)
	}
	h, err := server.Handler(r, emb, *allowOrigin)
	if err != nil {
		slog.Error("configure server", "err", err)
		os.Exit(1)
	}

	embeddingModel := "none"
	if emb != nil {
		embeddingModel = emb.Model()
	}
	slog.Info("docs-mcp starting", "addr", *addr,
		"catalogue_version", r.CatalogueVersion(), "built_at", r.BuiltAt(),
		"embeddings", emb != nil && r.EmbeddingsEnabled(), "embedding_model", embeddingModel)
	if err := http.ListenAndServe(*addr, h); err != nil {
		slog.Error("server", "err", err)
		os.Exit(1)
	}
}
