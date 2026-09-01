package fhir

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"encoding/json"
	"os"
	"sort"
	"testing"
)

func keys(m map[string][]byte) []string {
	ks := make([]string, 0, len(m))
	for k := range m {
		ks = append(ks, k)
	}
	sort.Strings(ks)
	return ks
}

func TestGoldenExamples(t *testing.T) {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	ex, err := GoldenExamples(ig)
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := ex["OPConsultation"]; !ok {
		t.Errorf("no OPConsultation example; got keys %v", keys(ex))
	}
	if _, ok := ex["Prescription"]; !ok {
		t.Errorf("no Prescription example; got keys %v", keys(ex))
	}
	var b map[string]any
	if err := json.Unmarshal(ex["OPConsultation"], &b); err != nil || b["type"] != "document" {
		t.Errorf("OPConsultation example is not a document bundle: %v %v", b["type"], err)
	}
}

// TestGoldenExamplesSkipsNonBundle guards the two-stage decode in
// GoldenExamples: the fixture's package/example/Claim-example-01.json is a
// non-Bundle resource whose "type" field is an object (a CodeableConcept),
// which would type-conflict with exampleBundle's string Type field if
// decoded directly. GoldenExamples must recognize it as "not a Bundle" from
// resourceType alone and skip it without error, rather than either failing
// the build or attributing it to some record type.
func TestGoldenExamplesSkipsNonBundle(t *testing.T) {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	ex, err := GoldenExamples(ig)
	if err != nil {
		t.Fatalf("GoldenExamples returned an error in the presence of a non-Bundle example: %v", err)
	}
	for recordType := range ex {
		if recordType == "" {
			t.Errorf("non-Bundle example was attributed to a record type; got keys %v", keys(ex))
		}
	}
}

// buildTgz packs files (path -> content) into an in-memory gzipped tar
// archive, for constructing a deliberately corrupt IG package on the fly.
func buildTgz(t *testing.T, files map[string]string) string {
	t.Helper()
	var buf bytes.Buffer
	gw := gzip.NewWriter(&buf)
	tw := tar.NewWriter(gw)
	for name, content := range files {
		hdr := &tar.Header{
			Name: name,
			Mode: 0o644,
			Size: int64(len(content)),
		}
		if err := tw.WriteHeader(hdr); err != nil {
			t.Fatal(err)
		}
		if _, err := tw.Write([]byte(content)); err != nil {
			t.Fatal(err)
		}
	}
	if err := tw.Close(); err != nil {
		t.Fatal(err)
	}
	if err := gw.Close(); err != nil {
		t.Fatal(err)
	}
	path := t.TempDir() + "/corrupt-ig.tgz"
	if err := os.WriteFile(path, buf.Bytes(), 0o644); err != nil {
		t.Fatal(err)
	}
	return path
}

// TestGoldenExamplesCorruptJSON asserts that a syntactically corrupt Bundle
// example fails the build loudly rather than being silently dropped: a
// resourceType-only pre-check that runs before the full unmarshal must not
// let a genuine JSON syntax error slip through as "not a Bundle, skip it".
func TestGoldenExamplesCorruptJSON(t *testing.T) {
	tgzPath := buildTgz(t, map[string]string{
		"package/package.json":                       `{"version": "1.0.0"}`,
		"package/example/Bundle-broken-example.json": `{"resourceType": "Bundle", "type": "document", entry BROKEN`,
	})
	ig, err := LoadIG(tgzPath)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := GoldenExamples(ig); err == nil {
		t.Fatal("want error for syntactically corrupt Bundle example, got nil")
	}
}
