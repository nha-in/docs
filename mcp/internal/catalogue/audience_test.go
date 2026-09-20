package catalogue

import "testing"

func TestIntegratorAtomsDropsContributorAudience(t *testing.T) {
	in := []Atom{
		{ID: "shared.glossary.abha"},
		{ID: "shared.decision.vocabulary-in-one-file", Audience: "contributor"},
		{ID: "shared.decision.role-model-two-axes"},
	}
	got := IntegratorAtoms(in)
	if len(got) != 2 {
		t.Fatalf("kept %d atoms, want 2: %+v", len(got), got)
	}
	for _, a := range got {
		if a.Audience == "contributor" {
			t.Errorf("contributor atom %s reached the snapshot", a.ID)
		}
	}
}

// An atom is integrator-facing unless it says otherwise, so an absent
// audience must never be read as contributor.
func TestIntegratorAtomsKeepsUnmarkedAtoms(t *testing.T) {
	if got := IntegratorAtoms([]Atom{{ID: "a"}, {ID: "b"}}); len(got) != 2 {
		t.Fatalf("kept %d atoms, want 2", len(got))
	}
}

// The filter reads the parsed frontmatter, so a change to the field name or
// the struct tag has to fail here rather than silently stop filtering.
func TestParseAtomReadsAudience(t *testing.T) {
	src := []byte("---\nid: shared.decision.x\ntype: decision\naudience: contributor\ntitle: X\n---\nbody\n")
	a, err := ParseAtom("catalogue/shared/decisions/x.md", src)
	if err != nil {
		t.Fatal(err)
	}
	if a.Audience != "contributor" {
		t.Fatalf("Audience = %q, want contributor", a.Audience)
	}
}
