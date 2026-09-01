package fhir

import (
	"bytes"
	"encoding/json"
	"flag"
	"os"
	"testing"
)

var update = flag.Bool("update", false, "regenerate golden files")

func TestDigestOPConsult(t *testing.T) {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	d, err := Digest(ig, "OPConsultRecord", "OPConsultation")
	if err != nil {
		t.Fatal(err)
	}
	if d.URL != "https://nrces.in/ndhm/fhir/r4/StructureDefinition/OPConsultRecord" {
		t.Errorf("url = %q", d.URL)
	}
	var hasChief bool
	for _, s := range d.Sections {
		if s.Slice == "ChiefComplaints" {
			hasChief = true
		}
	}
	if !hasChief {
		t.Errorf("sections missing ChiefComplaints; got %+v", d.Sections)
	}
}

func TestDigestDocumentBundle(t *testing.T) {
	ig, _ := LoadIG("testdata/ig-fixture.tgz")
	d, err := Digest(ig, "DocumentBundle", "")
	if err != nil {
		t.Fatal(err)
	}
	var fixedType bool
	for _, f := range d.Fixed {
		if f.Path == "Bundle.type" && f.Value == "document" {
			fixedType = true
		}
	}
	if !fixedType {
		t.Errorf("DocumentBundle digest missing Bundle.type=document; fixed=%+v", d.Fixed)
	}
	var reqIdent bool
	for _, r := range d.Required {
		if r.Path == "Bundle.identifier" {
			reqIdent = true
		}
	}
	if !reqIdent {
		t.Errorf("DocumentBundle digest missing required Bundle.identifier; required=%+v", d.Required)
	}
}

func TestAllDigestsGolden(t *testing.T) {
	raw := "../../../catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz"
	if _, err := os.Stat(raw); err != nil {
		t.Skip("raw NRCES package not present")
	}
	ig, err := LoadIG(raw)
	if err != nil {
		t.Fatal(err)
	}
	digests, err := AllDigests(ig)
	if err != nil {
		t.Fatal(err)
	}
	if len(digests) != 8 {
		t.Fatalf("got %d digests, want 8", len(digests))
	}
	got, _ := json.MarshalIndent(digests, "", "  ")
	golden := "testdata/golden/digests.json"
	if *update {
		os.MkdirAll("testdata/golden", 0o755)
		os.WriteFile(golden, got, 0o644)
	}
	want, err := os.ReadFile(golden)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(got, want) {
		t.Errorf("digests drifted from golden; regenerate with -update and review")
	}
}
