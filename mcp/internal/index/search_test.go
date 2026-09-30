package index

import (
	"context"
	"errors"
	"path/filepath"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/catalogue"
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

func TestSearchInKeepsTheGatewayAndSharedAtoms(t *testing.T) {
	// The fixture's atoms are all HIE-CM. Scoped to hiecm they are found;
	// scoped to nhcx they are not; with no scope, Search is unchanged.
	r := openFixture(t, false)
	for _, tc := range []struct {
		gateway string
		want    bool
	}{{"", true}, {"hiecm", true}, {"nhcx", false}} {
		hits, err := r.SearchIn(context.Background(), "ABDM-1035", "", "", tc.gateway, 10, nil)
		if err != nil {
			t.Fatal(err)
		}
		if got := len(hits) > 0; got != tc.want {
			t.Errorf("gateway %q: found = %v, want %v (%d hits)", tc.gateway, got, tc.want, len(hits))
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

	// "zzqqxx" appears nowhere in the fixture. The keyword leg still finds
	// the atom through its other words (an unknown token narrows keyword
	// results, it does not empty them), and the vector leg scores the
	// questions chunk. Whichever leg wins, the snippet shows atom text.
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
	for _, q := range qs["hiecm.error.abdm-1035"].Questions {
		if strings.Contains(hits[0].Snippet, q) {
			t.Errorf("snippet carries a generated question %q: %q", q, hits[0].Snippet)
		}
	}
}

// One unknown word must narrow keyword results, not empty them: exact
// identifiers are what keyword search is for on API docs.
func TestKeywordSearchSurvivesOneUnknownToken(t *testing.T) {
	r := openFixture(t, false)
	hits, err := r.ftsSearch("ABDM-1035 zzqx", "", "", "", 10)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("an unknown extra token emptied the keyword results: %+v", hits)
	}
}

// A question in plain words keeps every word required: a looser keyword
// match would crowd the vector leg's answers out. Only an exact identifier
// is retried without its stray words.
func TestKeywordFallbackIsForIdentifiersOnly(t *testing.T) {
	r := openFixture(t, false)
	if alone, _ := r.ftsSearch("gateway", "", "", "", 10); len(alone) == 0 {
		t.Fatal("fixture has no atom matching gateway, so this test proves nothing")
	}
	hits, err := r.ftsSearch("gateway zzqx", "", "", "", 10)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) != 0 {
		t.Fatalf("a plain-words query fell back to a looser match: %+v", hits)
	}
	if got := identifiers(`why does ABDM-1035 fail on m1_post_profile_verify at /v3/link with X-CM-ID and txnId?`); strings.Join(got, " ") != "ABDM-1035 m1_post_profile_verify /v3/link X-CM-ID txnId" {
		t.Errorf("identifiers = %q", got)
	}
}

// An intent with no atom behind it must still find the operation.
func TestSearchFindsAnOperationByIntent(t *testing.T) {
	ops := append(fixtureOps(), catalogue.Operation{
		OperationID: "m1_post_profile_verify", Method: "post", Path: "/abha/api/v3/profile/login/verify",
		Summary: "Verify the OTP", Module: "m1", Gateway: "hiecm", SpecJSON: []byte(`{}`),
		Params: []string{"txnId", "otp"}, ResponseCodes: []string{"200", "401"},
	})
	var all []catalogue.Chunk
	for _, a := range fixtureAtoms() {
		all = append(all, catalogue.ChunkAtom(a)...)
	}
	for _, o := range ops {
		all = append(all, catalogue.ChunkOperation(o))
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
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	meta := Meta{CatalogueVersion: "v", BuiltAt: "t", EmbeddingModel: f.Model(), EmbeddingDim: 64}
	if err := Build(dbPath, fixtureAtoms(), nil, ops, fixtureSpecErrors(), nil, nil, chunks, meta); err != nil {
		t.Fatal(err)
	}
	r, err := Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()
	ctx := context.Background()
	hits, err := r.SearchKind(ctx, "verify the otp", "operation", "", "", "", 5, f)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].Kind != "operation" || hits[0].ID != "m1_post_profile_verify" {
		t.Fatalf("operation not found by intent: %+v", hits)
	}
	if hits[0].DocURL != "/docs/hiecm/v3/api/m1/endpoints/m1-post-profile-verify" {
		t.Errorf("operation doc url %q", hits[0].DocURL)
	}
	both, err := r.SearchKind(ctx, "verify the otp", "", "", "", "", 5, f)
	if err != nil {
		t.Fatal(err)
	}
	found := false
	for _, h := range both {
		found = found || (h.Kind == "operation" && h.ID == "m1_post_profile_verify")
	}
	if !found {
		t.Errorf("default search, atoms and operations, missed the operation: %+v", both)
	}
	atomsOnly, err := r.SearchKind(ctx, "verify the otp", "atom", "", "", "", 5, f)
	if err != nil {
		t.Fatal(err)
	}
	for _, h := range atomsOnly {
		if h.Kind != "atom" {
			t.Errorf("kind atom returned %+v", h)
		}
	}
}

// Mixed search puts each list's first hit on the same score; the atom, which
// carries the guidance, goes first rather than whichever id sorts lower.
func TestFuseBreaksATieForTheAtom(t *testing.T) {
	got := fuse(10, []SearchHit{{Kind: "atom", ID: "shared.glossary.timestamp-header"}}, []SearchHit{{Kind: "operation", ID: "m2_notify"}})
	if got[0].Kind != "atom" {
		t.Fatalf("tie went to %+v, want the atom first", got[0])
	}
}

func contractFixture(t *testing.T) *Reader {
	t.Helper()
	atoms := append(fixtureAtoms(),
		catalogue.Atom{ID: "nhcx.concept.old-claim-flow", Type: "concept", Gateway: "nhcx", Milestone: "n/a", Title: "Old claim flow", Summary: "Superseded claim flow.", Body: "## In plain words\n\nThe zzclaim flow before v2.", Status: "deprecated", Side: "provider", Related: map[string][]string{}},
		catalogue.Atom{ID: "nhcx.concept.claim-flow", Type: "concept", Gateway: "nhcx", Milestone: "n/a", Title: "Claim flow", Summary: "The claim flow.", Body: "## In plain words\n\nThe zzclaim flow a hospital runs.", Status: "current", Side: "provider", Related: map[string][]string{}},
		catalogue.Atom{ID: "nhcx.concept.adjudication", Type: "concept", Gateway: "nhcx", Milestone: "n/a", Title: "Adjudication", Summary: "What the payer does.", Body: "## In plain words\n\nThe payer's zzclaim review.", Status: "current", Side: "payer", Related: map[string][]string{}},
	)
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	if err := Build(dbPath, atoms, nil, fixtureOps(), fixtureSpecErrors(), nil, nil, nil, Meta{CatalogueVersion: "v", BuiltAt: "t"}); err != nil {
		t.Fatal(err)
	}
	r, err := Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	return r
}

func ids(hits []SearchHit) map[string]bool {
	out := map[string]bool{}
	for _, h := range hits {
		out[h.ID] = true
	}
	return out
}

func TestDeprecatedAtomsAreHiddenByDefault(t *testing.T) {
	r := contractFixture(t)
	ctx := context.Background()
	hits, err := r.SearchFiltered(ctx, "zzclaim", "atom", Filter{}, 10, nil)
	if err != nil {
		t.Fatal(err)
	}
	if got := ids(hits); got["nhcx.concept.old-claim-flow"] || !got["nhcx.concept.claim-flow"] {
		t.Fatalf("default search = %v, want the current atom and not the deprecated one", got)
	}
	hits, err = r.SearchFiltered(ctx, "zzclaim", "atom", Filter{IncludeDeprecated: true}, 10, nil)
	if err != nil {
		t.Fatal(err)
	}
	if !ids(hits)["nhcx.concept.old-claim-flow"] {
		t.Fatal("include_deprecated did not return the deprecated atom")
	}
}

func TestSideFilter(t *testing.T) {
	r := contractFixture(t)
	hits, err := r.SearchFiltered(context.Background(), "zzclaim", "atom", Filter{Side: "payer"}, 10, nil)
	if err != nil {
		t.Fatal(err)
	}
	if got := ids(hits); !got["nhcx.concept.adjudication"] || got["nhcx.concept.claim-flow"] {
		t.Fatalf("side payer = %v, want the payer atom only", got)
	}
}

// A question asking what something is prefers the glossary: an error atom
// that repeats the term must not outrank the entry that defines it.
func TestDefinitionQuestionsPreferTheGlossary(t *testing.T) {
	atoms := append(fixtureAtoms(),
		catalogue.Atom{ID: "hiecm.glossary.hiu", Type: "glossary", Gateway: "hiecm", Milestone: "n/a", Title: "HIU, health information user", Summary: "The system that requests records.", Body: "## In plain words\n\nAn HIU requests a person's records with consent.", Related: map[string][]string{}},
		catalogue.Atom{ID: "hiecm.error.abdm-1040", Type: "error", Gateway: "hiecm", Milestone: "M3", Title: "ABDM-1040 HIU not found", Summary: "The HIU id is not registered as an HIU.", Body: "## In plain words\n\nHIU HIU HIU. The HIU in the request is not an HIU the gateway knows. Register the HIU.", Related: map[string][]string{}},
	)
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	if err := Build(dbPath, atoms, nil, fixtureOps(), fixtureSpecErrors(), nil, nil, nil, Meta{CatalogueVersion: "v", BuiltAt: "t"}); err != nil {
		t.Fatal(err)
	}
	r, err := Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()
	for _, q := range []string{"hiu", "what is an HIU?"} {
		hits, err := r.SearchIn(context.Background(), q, "", "", "", 5, nil)
		if err != nil {
			t.Fatal(err)
		}
		if len(hits) == 0 || hits[0].ID != "hiecm.glossary.hiu" {
			t.Errorf("%q: top hit %v, want the glossary entry first", q, ids(hits))
		}
	}
	// Not a definition question: the error atom may lead.
	for _, q := range []string{"what are the tests required before exiting the ABDM sandbox", "what is the NHCX claim API endpoint"} {
		if definitionShaped(q) {
			t.Errorf("%q asks for a request, not a term's definition", q)
		}
	}
	if definitionShaped("the gateway rejects my HIU request with an error") {
		t.Error("a full sentence about an error is not definition shaped")
	}
}

// A floor above every cosine leaves the vector leg empty; zero keeps it.
func TestVectorFloorDropsNeighbours(t *testing.T) {
	r := openFixture(t, true)
	f := embed.NewFake(64)
	hits, err := r.vectorSearch(context.Background(), "link a care context", Filter{}, 10, f)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 {
		t.Fatal("fixture vector search returned nothing with no floor")
	}
	r.VectorFloor = 1.5 // above any cosine
	hits, err = r.vectorSearch(context.Background(), "link a care context", Filter{}, 10, f)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) != 0 {
		t.Errorf("floor above every score should drop every hit, got %d", len(hits))
	}
}
