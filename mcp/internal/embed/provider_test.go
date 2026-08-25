package embed

import (
	"context"
	"testing"
)

func TestProviderNoneIsDeliberateNil(t *testing.T) {
	for _, provider := range []string{"", "none"} {
		emb, err := New(context.Background(), Config{Provider: provider})
		if err != nil || emb != nil {
			t.Errorf("provider %q: emb=%v err=%v, want nil, nil", provider, emb, err)
		}
	}
}

func TestProviderOllama(t *testing.T) {
	emb, err := New(context.Background(), Config{Provider: "ollama", OllamaURL: "http://x"})
	if err != nil {
		t.Fatal(err)
	}
	if emb.Model() != "ollama/"+DefaultOllamaModel {
		t.Errorf("model = %q", emb.Model())
	}

	if _, err := New(context.Background(), Config{Provider: "ollama"}); err == nil {
		t.Error("ollama without URL should error")
	}
}

// The pre-provider contract: an Ollama URL alone still selects Ollama, so a
// deployment that only sets OLLAMA_URL keeps working.
func TestBareOllamaURLSelectsOllama(t *testing.T) {
	emb, err := New(context.Background(), Config{OllamaURL: "http://x", Model: "m"})
	if err != nil {
		t.Fatal(err)
	}
	if emb.Model() != "ollama/m" {
		t.Errorf("model = %q", emb.Model())
	}
}

func TestProviderUnknownErrors(t *testing.T) {
	if _, err := New(context.Background(), Config{Provider: "openai"}); err == nil {
		t.Error("unknown provider should error")
	}
}
