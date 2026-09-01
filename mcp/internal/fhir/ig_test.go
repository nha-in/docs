package fhir

import "testing"

func TestLoadIG(t *testing.T) {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	if ig.Version != "6.5.0" {
		t.Errorf("version = %q, want 6.5.0", ig.Version)
	}
	for _, name := range []string{"OPConsultRecord", "PrescriptionRecord", "DocumentBundle"} {
		if _, ok := ig.Profiles[name]; !ok {
			t.Errorf("profile %s missing", name)
		}
	}
	if _, ok := ig.Examples["Bundle-OPConsultNote-example-05"]; !ok {
		t.Errorf("example bundle missing; have %d examples", len(ig.Examples))
	}
}

func TestLoadIGMissingFile(t *testing.T) {
	if _, err := LoadIG("testdata/nope.tgz"); err == nil {
		t.Fatal("expected error for missing file")
	}
}
