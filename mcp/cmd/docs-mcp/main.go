// Command docs-mcp serves the catalogue snapshot over MCP and JSON.
package main

import (
	"context"
	"flag"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
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

// envIntOr is envOr's integer counterpart: the environment sets the default,
// the flag stays available as a local override, and a malformed environment
// value falls back rather than failing startup on a typo.
func envIntOr(name string, fallback int) int {
	if v := os.Getenv(name); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}

// envBoolOr is envOr's boolean counterpart: the environment sets the
// default, the flag stays available as a local override, and a malformed
// environment value falls back rather than failing startup on a typo.
func envBoolOr(name string, fallback bool) bool {
	if v := os.Getenv(name); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
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
	chatModel := flag.String("chat-model", envOr("CHAT_MODEL", ""), "Bedrock model id for /api/chat; empty disables chat")
	chatMaxTokens := flag.Int("chat-max-tokens", envIntOr("CHAT_MAX_TOKENS", 1500), "max output tokens per chat answer")
	chatPerMin := flag.Int("chat-rate-per-min", envIntOr("CHAT_RATE_PER_MIN", 5), "chat requests per ip per minute")
	chatPerDay := flag.Int("chat-rate-per-day", envIntOr("CHAT_RATE_PER_DAY", 100), "chat requests per ip per day")
	mcpURL := flag.String("mcp-url", envOr("MCP_URL", ""), "public MCP endpoint the chat assistant names; empty keeps the built-in default")
	trustProxy := flag.Bool("trust-proxy", envBoolOr("TRUST_PROXY", false),
		"trust the last X-Forwarded-For entry for the chat rate limiter's client IP; "+
			"enable only when a trusted reverse proxy sits in front and appends its own entry")
	flag.Parse()

	r, err := index.Open(*db)
	if err != nil {
		slog.Error("open snapshot", "err", err)
		os.Exit(1)
	}
	defer r.Close()

	// Deployment policy, deliberately at the edge rather than in the library:
	// every deployment must decide its provider. An absent decision is a
	// failed deploy, not a quiet keyword-only server; only an explicit `none`
	// serves without a model. This is infrastructure-neutral: a crash here
	// fails an ArgoCD rollout and an ECS deployment alike.
	if *provider == "" && *ollamaURL == "" {
		slog.Error("EMBED_PROVIDER is not set; every deployment must decide: bedrock, ollama, or an explicit none")
		os.Exit(1)
	}
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

	switch {
	case emb == nil && r.EmbeddingsEnabled():
		// The operator explicitly chose none over an index that has vectors.
		// Honoured, but out loud: semantic search is off on purpose.
		slog.Warn("index has embeddings but EMBED_PROVIDER=none; serving keyword-only deliberately")
	case emb != nil && !r.EmbeddingsEnabled():
		// A model with nothing to search against is a broken release, not a
		// mode: rebuild the snapshot with the same provider.
		slog.Error("embedding provider configured but the index has no vectors; rebuild catalogue.db with this provider",
			"provider", emb.Model())
		os.Exit(1)
	case emb != nil:
		// The model must actually answer before the deployment is healthy.
		// Reachability and permissions fail here, at startup, not on the
		// first developer's query.
		probeCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		if _, err := emb.Embed(probeCtx, []string{"startup probe"}); err != nil {
			cancel()
			slog.Error("embedding provider unreachable at startup", "provider", emb.Model(), "err", err)
			os.Exit(1)
		}
		cancel()
	}

	// chatSvc and limiter stay nil unless CHAT_MODEL is set; Handler treats a
	// nil chatSvc as "chat not enabled" and 404s /api/chat, so the server
	// keeps serving everything else with zero behavior change. They are
	// always constructed together in this one block, never one without the
	// other, matching the invariant Handler's rate-limit check relies on.
	var chatSvc *chat.Service
	var limiter *chat.Limiter
	if *chatModel != "" {
		// A parsed-but-nonsensical config (zero or negative) is a broken
		// deploy, not a quiet no-op: a <=0 max-tokens makes every answer
		// empty, and a <=0 rate limit makes every request 429 or, worse (a
		// negative bucket that never fills), lets every request through.
		// Fail loudly at startup rather than serving either silently.
		if *chatMaxTokens <= 0 {
			slog.Error("CHAT_MAX_TOKENS must be a positive integer", "got", *chatMaxTokens)
			os.Exit(1)
		}
		if *chatPerMin <= 0 {
			slog.Error("CHAT_RATE_PER_MIN must be a positive integer", "got", *chatPerMin)
			os.Exit(1)
		}
		if *chatPerDay <= 0 {
			slog.Error("CHAT_RATE_PER_DAY must be a positive integer", "got", *chatPerDay)
			os.Exit(1)
		}
		model, err := chat.NewBedrockModel(context.Background(), *region, *chatModel)
		if err != nil {
			slog.Error("configure chat model", "err", err)
			os.Exit(1)
		}
		chatSvc = &chat.Service{
			Model:     model,
			Tools:     server.ChatTools(server.NewTools(r, emb).Defs()),
			MaxTokens: *chatMaxTokens,
			MCPURL:    *mcpURL,
		}
		limiter = chat.NewLimiter(*chatPerMin, *chatPerDay)
		slog.Info("chat enabled", "model", *chatModel)
	}

	h, err := server.Handler(r, emb, *allowOrigin, chatSvc, limiter, *trustProxy)
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
