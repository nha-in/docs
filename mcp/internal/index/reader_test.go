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
		if g.Type == "error" {
			for _, a := range g.Atoms {
				if a.ID == "hiecm.error.abdm-1035" && a.VerificationStatus == "verified" {
					found = true
				}
			}
		}
	}
	if !found {
		t.Errorf("outgoing error atom missing: %+v", groups)
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
				if g.Type != "flow" {
					t.Errorf("flow bucketed under %q, want its own type", g.Type)
				}
			}
		}
	}
	if !found {
		t.Errorf("incoming reference missing: %+v", groups)
	}
}

func TestRelatedAtomsReverseEdgeGroupedByOwnType(t *testing.T) {
	// The flow references this endpoint under its "endpoints" relation.
	// Walking from the endpoint, the flow arrives over the reverse edge
	// and must be bucketed as a flow, once, never under "endpoint".
	r := openFixture(t, false)
	groups, err := r.RelatedAtoms("hiecm.endpoint.m1-enrolment-by-aadhaar")
	if err != nil {
		t.Fatal(err)
	}
	seen := 0
	for _, g := range groups {
		for _, a := range g.Atoms {
			if a.ID == "hiecm.flow.m2-link-care-context" {
				seen++
				if g.Type != "flow" {
					t.Errorf("reverse edge grouped under %q, want flow", g.Type)
				}
			}
		}
		if g.Type == "endpoint" {
			t.Errorf("unexpected endpoint group on an endpoint's own walk: %+v", g.Atoms)
		}
	}
	if seen != 1 {
		t.Errorf("flow appears %d times, want exactly once", seen)
	}
}

func TestSpecErrorCodesLookup(t *testing.T) {
	r := openFixture(t, false)
	rows, err := r.SpecErrorCodes("ABDM-1016")
	if err != nil {
		t.Fatal(err)
	}
	if len(rows) != 1 || rows[0].Message != "Dependent service unavailable" ||
		rows[0].Action != "Retry with backoff" || rows[0].Module != "m1" {
		t.Errorf("rows = %+v", rows)
	}
	// Raw response code fields arrive with trailing colon and space.
	trimmed, err := r.SpecErrorCodes("ABDM-1016: ")
	if err != nil {
		t.Fatal(err)
	}
	if len(trimmed) != 1 || trimmed[0].Code != "ABDM-1016" {
		t.Errorf("trimmed lookup rows = %+v", trimmed)
	}
	empty, err := r.SpecErrorCodes("ABDM-9999")
	if err != nil {
		t.Fatal(err)
	}
	if len(empty) != 0 {
		t.Errorf("want no rows for unknown code, got %+v", empty)
	}
}

func TestListOperationsFilters(t *testing.T) {
	r := openFixture(t, false)
	all, err := r.ListOperations("", "", "")
	if err != nil {
		t.Fatal(err)
	}
	if len(all) != 1 || all[0].Module != "m2" {
		t.Errorf("all = %+v", all)
	}
	byModule, err := r.ListOperations("", "m2", "")
	if err != nil {
		t.Fatal(err)
	}
	if len(byModule) != 1 {
		t.Errorf("module filter = %+v", byModule)
	}
	byQ, err := r.ListOperations("", "", "ADD-CONTEXTS")
	if err != nil {
		t.Fatal(err)
	}
	if len(byQ) != 1 {
		t.Errorf("q filter should match path case-insensitively, got %+v", byQ)
	}
	none, err := r.ListOperations("", "m9", "")
	if err != nil {
		t.Fatal(err)
	}
	if len(none) != 0 {
		t.Errorf("want no rows for unknown module, got %+v", none)
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
	if s.ByStatus["verified"] != 1 || s.ByStatus["unverified"] != 2 || s.Operations != 1 {
		t.Errorf("stats = %+v", s)
	}
}
