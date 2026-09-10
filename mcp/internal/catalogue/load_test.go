package catalogue

import "testing"

func TestLoadAtomsSkipsNotesAndAnnexure(t *testing.T) {
	atoms, err := LoadAtoms("testdata/catalogue")
	if err != nil {
		t.Fatal(err)
	}
	if len(atoms) == 0 {
		t.Fatal("no atoms loaded from testdata")
	}
	for _, a := range atoms {
		if a.ID == "" {
			t.Errorf("atom from %s has no id", a.SourcePath)
		}
	}
}
