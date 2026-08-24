package index

import (
	"errors"
	"testing"
)

func openFixture(t *testing.T, withVectors bool) *Reader {
	t.Helper()
	r, err := Open(buildFixtureDB(t, withVectors))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	return r
}

func TestMetaAndEmbeddingFlags(t *testing.T) {
	r := openFixture(t, true)
	if r.CatalogueVersion() != "2026.08.24" || !r.EmbeddingsEnabled() || r.EmbeddingModel() != "fake-64" {
		t.Errorf("meta: version=%q model=%q enabled=%v",
			r.CatalogueVersion(), r.EmbeddingModel(), r.EmbeddingsEnabled())
	}
	kw := openFixture(t, false)
	if kw.EmbeddingsEnabled() {
		t.Error("keyword-only snapshot reports embeddings enabled")
	}
}

func TestGetAtomNotFoundNamesClosest(t *testing.T) {
	r := openFixture(t, false)
	_, err := r.GetAtom("hiecm.error.abdm-1036")
	var nf *NotFoundError
	if !errors.As(err, &nf) {
		t.Fatalf("err = %v, want NotFoundError", err)
	}
	if len(nf.Closest) == 0 || nf.Closest[0] != "hiecm.error.abdm-1035" {
		t.Errorf("Closest = %v", nf.Closest)
	}
}

func TestListAtomsFilters(t *testing.T) {
	r := openFixture(t, false)
	errs, err := r.ListAtoms("error", "")
	if err != nil {
		t.Fatal(err)
	}
	if len(errs) != 1 || errs[0].ID != "hiecm.error.abdm-1035" {
		t.Errorf("errs = %+v", errs)
	}
	all, err := r.ListAtoms("", "M2")
	if err != nil {
		t.Fatal(err)
	}
	if len(all) != 2 {
		t.Errorf("M2 atoms = %+v", all)
	}
}

func TestRelatedAtomsBothDirections(t *testing.T) {
	r := openFixture(t, false)
	// Outgoing: flow -> error.
	groups, err := r.RelatedAtoms("hiecm.flow.m2-link-care-context")
	if err != nil {
		t.Fatal(err)
	}
	found := false
	for _, g := range groups {
		if g.Relation == "errors" {
			for _, a := range g.Atoms {
				if a.ID == "hiecm.error.abdm-1035" && a.VerificationStatus == "verified" {
					found = true
				}
			}
		}
	}
	if !found {
		t.Errorf("outgoing errors missing: %+v", groups)
	}
	// Incoming: error <- flow.
	groups, err = r.RelatedAtoms("hiecm.error.abdm-1035")
	if err != nil {
		t.Fatal(err)
	}
	found = false
	for _, g := range groups {
		for _, a := range g.Atoms {
			if a.ID == "hiecm.flow.m2-link-care-context" {
				found = true
			}
		}
	}
	if !found {
		t.Errorf("incoming reference missing: %+v", groups)
	}
}

func TestAtomsByErrorCode(t *testing.T) {
	r := openFixture(t, false)
	refs, err := r.AtomsByErrorCode("ABDM-1035")
	if err != nil {
		t.Fatal(err)
	}
	if len(refs) != 2 {
		t.Errorf("refs = %+v, want both fixture atoms", refs)
	}
	empty, err := r.AtomsByErrorCode("ABDM-9999")
	if err != nil {
		t.Fatal(err)
	}
	if len(empty) != 0 {
		t.Errorf("want empty for unknown code, got %+v", empty)
	}
}

func TestGetOperationAndStats(t *testing.T) {
	r := openFixture(t, false)
	raw, err := r.GetOperation("linkAddContexts")
	if err != nil || len(raw) == 0 {
		t.Fatalf("raw=%q err=%v", raw, err)
	}
	if _, err := r.GetOperation("nope"); err == nil {
		t.Fatal("want NotFoundError")
	}
	v, err := r.GetOperationValidation("linkAddContexts")
	if err != nil {
		t.Fatal(err)
	}
	if v.RequestSchemaJSON == nil || len(v.RequiredParams) != 1 || v.RequiredParams[0] != "X-HIP-ID (header)" {
		t.Errorf("validation lookup = %+v", v)
	}
	s, err := r.Stats()
	if err != nil {
		t.Fatal(err)
	}
	if s.ByStatus["verified"] != 1 || s.ByStatus["unverified"] != 1 || s.Operations != 1 {
		t.Errorf("stats = %+v", s)
	}
}
