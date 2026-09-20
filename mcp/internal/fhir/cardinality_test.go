package fhir

import "testing"

// A min of 1 binds within its parent. NRCES makes Composition.attester.mode
// and Composition.relatesTo.code required inside parents that are themselves
// 0..*, and its own HealthDocumentRecord example carries neither parent. A
// digest that lists those paths as required without saying so tells a
// generator to emit an attester with no party, which is structurally present
// and semantically empty.
func TestOptionalAncestorFindsTheNearestOptionalParent(t *testing.T) {
	mins := map[string]int{
		"Composition":                  0,
		"Composition.attester":         0,
		"Composition.attester.mode":    1,
		"Composition.section":          1,
		"Composition.section.entry":    1,
		"Composition.relatesTo":        0,
		"Composition.relatesTo.code":   1,
		"Composition.type":             1,
		"Composition.type.coding":      1,
		"Composition.type.coding.code": 1,
	}
	for _, tc := range []struct {
		id   string
		want string
	}{
		{"Composition.attester.mode", "Composition.attester"},
		{"Composition.relatesTo.code", "Composition.relatesTo"},
		// Every ancestor is required, so the element is unconditional.
		{"Composition.section.entry", ""},
		{"Composition.type.coding.code", ""},
		// A top level element has no ancestor to report.
		{"Composition.section", ""},
	} {
		if got := optionalAncestor(tc.id, mins); got != tc.want {
			t.Errorf("optionalAncestor(%q) = %q, want %q", tc.id, got, tc.want)
		}
	}
}

// An ancestor missing from the index must not be read as optional: an unknown
// min is not a min of zero, and guessing here would mark a genuine
// requirement conditional and let a broken bundle through.
func TestOptionalAncestorIgnoresUnknownAncestors(t *testing.T) {
	if got := optionalAncestor("Composition.attester.mode", map[string]int{}); got != "" {
		t.Errorf("optionalAncestor with no ancestors known = %q, want empty", got)
	}
}

// NRCES fixes the SNOMED code that types a Composition at
// Composition.type.coding.code, three levels down. The digest used to cut
// every element deeper than two levels, so it reported no fixed values at all
// and validate_fhir could not check that code.
func TestFixedValuesAreKeptBelowTwoLevels(t *testing.T) {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	d, err := Digest(ig, "OPConsultRecord", "OPConsultation")
	if err != nil {
		t.Fatal(err)
	}
	var found bool
	for _, f := range d.Fixed {
		if f.Path == "Composition.type.coding.system" && f.Value == "http://snomed.info/sct" {
			found = true
		}
	}
	if !found {
		t.Errorf("no fixed value recorded at Composition.type.coding.system; got %+v", d.Fixed)
	}
}
