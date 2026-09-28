package index

import (
	"context"
	"os"
	"testing"
)

// Runs against an index built from the real catalogue, keyword only, so it
// needs no embedding credentials. It is the ranking check a migration must
// pass: the atom a reader asks for is still the one search puts first.
func TestRealCatalogueRanksLinkToken(t *testing.T) {
	db := os.Getenv("CATALOGUE_DB")
	if db == "" {
		t.Skip("set CATALOGUE_DB to an index built with: go run ./cmd/indexer -catalogue ../catalogue -out <path> -embed-provider none")
	}
	r, err := Open(db)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()
	hits, err := r.Search(context.Background(), "link token", "", "", 5, nil)
	if err != nil {
		t.Fatal(err)
	}
	for i, h := range hits {
		t.Logf("%d. %s  %s#%s", i+1, h.ID, h.DocURL, h.DocAnchor)
	}
	if len(hits) == 0 || hits[0].ID != "shared.glossary.link-token" {
		t.Fatalf("shared.glossary.link-token is not the top hit for \"link token\"")
	}
}
