package catalogue

import (
	"strings"
	"testing"
)

// Every atom built from a page must parse in the Go loader and chunk into
// real sections only: no empty body, no placeholder text competing in search.
func TestGeneratedAtomsParseAndChunkCleanly(t *testing.T) {
	atoms, err := LoadAtoms("../../../catalogue")
	if err != nil {
		t.Fatal(err)
	}
	found := 0
	for _, a := range atoms {
		if !a.Generated {
			continue
		}
		found++
		if strings.TrimSpace(a.Body) == "" {
			t.Errorf("%s: empty body", a.ID)
		}
		for _, c := range ChunkAtom(a) {
			if strings.TrimSpace(strings.TrimPrefix(c.Text, a.Title)) == "" {
				t.Errorf("%s: empty chunk under %q", a.ID, c.Heading)
			}
		}
	}
	if found == 0 {
		t.Fatal("no atom carries generated: true; the page-written atoms did not load")
	}
}
