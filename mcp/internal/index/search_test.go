package index

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/embed"
)

// failingEmbedder always fails to embed, but reports a model name matching
// the fixture snapshot so it passes the model-mismatch check and reaches
// the vector search itself.
type failingEmbedder struct{}

func (failingEmbedder) Embed(_ context.Context, _ []string) ([][]float32, error) {
	return nil, errors.New("ollama unreachable")
}

func (failingEmbedder) Model() string { return "fake-64" }

func TestSearchKeywordOnlySnapshot(t *testing.T) {
	r := openFixture(t, false)
	hits, err := r.Search(context.Background(), "ABDM-1035", "", "", 10, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("hits = %+v, want abdm-1035 first", hits)
	}
	if hits[0].VerificationStatus != "verified" {
		t.Errorf("status missing from hit")
	}
}

func TestSearchHybridFindsSemanticMatch(t *testing.T) {
	r := openFixture(t, true)
	f := embed.NewFake(64)
	// No FTS token overlap with the error atom title, but the fake
	// embedder scores word overlap with the body ("facility",
	// "registered"): the semantic leg must surface the error atom.
	hits, err := r.Search(context.Background(), "facility registered recognise", "", "", 10, f)
	if err != nil {
		t.Fatal(err)
	}
	var ids []string
	for _, h := range hits {
		ids = append(ids, h.ID)
	}
	if !strings.Contains(strings.Join(ids, " "), "hiecm.error.abdm-1035") {
		t.Errorf("semantic match missing: %v", ids)
	}
}

func TestSearchModelMismatchErrors(t *testing.T) {
	r := openFixture(t, true) // snapshot embedded with fake-64
	if _, err := r.Search(context.Background(), "q", "", "", 10, embed.NewFake(32)); err == nil {
		t.Fatal("want error on embedding model mismatch")
	}
}

func TestSearchNilEmbedderDegrades(t *testing.T) {
	r := openFixture(t, true)
	hits, err := r.Search(context.Background(), "ABDM-1035", "", "", 10, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 {
		t.Fatal("keyword leg must still work without an embedder")
	}
}

func TestSearchDegradesWhenVectorLegFails(t *testing.T) {
	r := openFixture(t, true)
	hits, err := r.Search(context.Background(), "ABDM-1035", "", "", 10, failingEmbedder{})
	if err != nil {
		t.Fatalf("want no error when vector leg fails, got %v", err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("hits = %+v, want abdm-1035 first (FTS hits alone)", hits)
	}
}

func TestSearchEmptyFTSQueryNoError(t *testing.T) {
	r := openFixture(t, false)
	hits, err := r.Search(context.Background(), "   ", "", "", 10, nil)
	if err != nil {
		t.Fatalf("want no error for all-quotes/whitespace query, got %v", err)
	}
	if len(hits) != 0 {
		t.Fatalf("hits = %+v, want zero hits", hits)
	}
}

func TestSearchTypeFilter(t *testing.T) {
	r := openFixture(t, true)
	hits, err := r.Search(context.Background(), "ABDM-1035", "flow", "", 10, embed.NewFake(64))
	if err != nil {
		t.Fatal(err)
	}
	for _, h := range hits {
		if h.Type != "flow" {
			t.Errorf("filter leaked: %+v", h)
		}
	}
}
