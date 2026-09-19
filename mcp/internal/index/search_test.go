package index

import (
	"context"
	"errors"
	"path/filepath"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
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

func TestNaivePhrasingFindsAtomThroughQuestions(t *testing.T) {
	// Build the index the way the existing tests do, but pass a questions
	// map for one atom that carries a phrasing its body never uses.
	qs := map[string]catalogue.AtomQuestions{
		"hiecm.flow.m2-link-care-context": {
			BodyHash:  "sha256:test",
			Questions: []string{"how do i attach a hospital visit to a patient health id"},
		},
	}
	r := buildTestIndexWithQuestions(t, qs) // helper mirroring the existing builder, with the extra arg
	hits, err := r.Search(context.Background(), "attach hospital visit to health id", "", "", 5, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.flow.m2-link-care-context" {
		t.Fatalf("top hit = %+v, want the linking flow", hits)
	}
}

// TestQuestionsChunkWinDoesNotLeakIntoSnippet reproduces the wall of
// questions the review flagged: a naive phrasing that scores highest
// against the synthetic "Questions this answers" chunk must still show
// the atom's prose summary as its snippet, not the raw chunk text with the
// other questions in it.
func TestQuestionsChunkWinDoesNotLeakIntoSnippet(t *testing.T) {
	atoms := fixtureAtoms()
	qs := map[string]catalogue.AtomQuestions{
		"hiecm.error.abdm-1035": {
			BodyHash: "sha256:test",
			Questions: []string{
				"how do i fix a bridge not recognising my clinic",
				"why would the network say my facility id is wrong",
			},
		},
	}

	var all []catalogue.Chunk
	for _, a := range atoms {
		all = append(all, catalogue.ChunkAtom(a)...)
		if q, ok := qs[a.ID]; ok {
			all = append(all, catalogue.Chunk{
				AtomID:  a.ID,
				Heading: catalogue.QuestionsHeading,
				Text:    a.Title + "\n" + catalogue.QuestionsHeading + ":\n" + strings.Join(q.Questions, "\n"),
			})
		}
	}
	f := embed.NewFake(64)
	var texts []string
	for _, c := range all {
		texts = append(texts, c.Text)
	}
	vecs, err := f.Embed(context.Background(), texts)
	if err != nil {
		t.Fatal(err)
	}
	var chunks []EmbeddedChunk
	for i, c := range all {
		chunks = append(chunks, EmbeddedChunk{Chunk: c, Vector: vecs[i]})
	}
	meta := Meta{CatalogueVersion: "v", BuiltAt: "t", EmbeddingModel: f.Model(), EmbeddingDim: 64}
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	if err := Build(dbPath, atoms, qs, fixtureOps(), fixtureSpecErrors(), nil, nil, chunks, meta); err != nil {
		t.Fatal(err)
	}
	r, err := Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()

	// "zzqqxx" appears nowhere in the fixture, so the keyword leg matches
	// nothing (FTS is an AND across terms) and only the vector leg, scored
	// against the questions chunk, can surface this atom.
	hits, err := r.Search(context.Background(), "how do i fix bridge not recognising my clinic zzqqxx", "", "", 5, f)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("top hit = %+v, want the abdm-1035 error atom", hits)
	}
	if strings.Contains(hits[0].Snippet, catalogue.QuestionsHeading) {
		t.Errorf("snippet leaked the questions chunk: %q", hits[0].Snippet)
	}
	if hits[0].Snippet != hits[0].Summary {
		t.Errorf("snippet = %q, want the atom summary %q", hits[0].Snippet, hits[0].Summary)
	}
}
