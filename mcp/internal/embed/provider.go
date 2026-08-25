package embed

import (
	"context"
	"fmt"
)

// Config selects the embedding provider. The choice is made once, by the
// deploy pipeline, and the process does exactly what its environment says:
// there is no runtime fallback from one provider to another, because the
// query-time model must be the same model that built the index. A process
// configured for a provider it cannot reach fails at startup, loudly.
type Config struct {
	// Provider is "bedrock", "ollama" or "none". Empty means none, unless
	// OllamaURL is set, which keeps the pre-provider flag contract working.
	Provider string
	// Model is the provider's own model id. Empty takes the provider default.
	Model string
	// OllamaURL is the Ollama base URL, read only when Provider is "ollama".
	OllamaURL string
	// Region is the AWS region, read only when Provider is "bedrock". Empty
	// lets the SDK resolve AWS_REGION itself.
	Region string
}

// Defaults per provider. The model id is part of the index stamp, so these
// only apply when nothing was configured at all.
const (
	DefaultBedrockModel = "amazon.titan-embed-text-v2:0"
	DefaultOllamaModel  = "nomic-embed-text"
)

// New builds the configured embedder, or returns nil for a keyword-only
// process. nil is a deliberate mode, not an error: the server and the indexer
// both degrade to FTS-only retrieval without an embedder.
func New(ctx context.Context, cfg Config) (Embedder, error) {
	provider := cfg.Provider
	if provider == "" && cfg.OllamaURL != "" {
		provider = "ollama"
	}
	switch provider {
	case "bedrock":
		model := cfg.Model
		if model == "" {
			model = DefaultBedrockModel
		}
		return NewBedrock(ctx, cfg.Region, model)
	case "ollama":
		if cfg.OllamaURL == "" {
			return nil, fmt.Errorf("embed: provider ollama needs OLLAMA_URL")
		}
		model := cfg.Model
		if model == "" {
			model = DefaultOllamaModel
		}
		return NewOllama(cfg.OllamaURL, model), nil
	case "", "none":
		return nil, nil
	default:
		return nil, fmt.Errorf("embed: unknown provider %q (bedrock, ollama or none)", cfg.Provider)
	}
}
