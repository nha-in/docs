package catalogue

import (
	"strings"
	"testing"
)

func TestLoadAtomsSkipsNotesAndAnnexure(t *testing.T) {
	atoms, err := LoadAtoms("testdata/catalogue")
	if err != nil {
		t.Fatal(err)
	}
	// Pinned against testdata/catalogue: change the count only if the
	// fixture itself grows or shrinks an atom.
	wantCount := 2
	if len(atoms) != wantCount {
		t.Fatalf("got %d atoms, want %d", len(atoms), wantCount)
	}
	for _, a := range atoms {
		if a.ID == "" {
			t.Errorf("atom from %s has no id", a.SourcePath)
		}
		if strings.HasSuffix(a.SourcePath, "README.md") {
			t.Errorf("README.md was loaded as an atom: %s", a.SourcePath)
		}
		if strings.Contains(a.SourcePath, "/annexure/") {
			t.Errorf("annexure was loaded as an atom: %s", a.SourcePath)
		}
		if strings.Contains(a.SourcePath, "/openapi/") {
			t.Errorf("openapi spec was loaded as an atom: %s", a.SourcePath)
		}
	}
}
