package server

import (
	"flag"
	"os"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
)

var update = flag.Bool("update", false, "rewrite golden files")

func checkGolden(t *testing.T, name, got string) {
	t.Helper()
	path := filepath.Join("testdata", "golden", name)
	if *update {
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(path, []byte(got), 0o644); err != nil {
			t.Fatal(err)
		}
		return
	}
	want, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("missing golden file %s; run with -update", path)
	}
	if string(want) != got {
		t.Errorf("contract drift in %s:\n got: %s\nwant: %s", name, got, want)
	}
}

func TestGoldenSearchDocs(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	checkGolden(t, "search_docs.json",
		callText(t, sess, "search_docs", map[string]any{"query": "ABDM-1035"}))
}

func TestGoldenGetOperation(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "get_operation.json",
		callText(t, sess, "get_operation", map[string]any{"operation_id": "linkAddContexts"}))
}

func TestGoldenCatalogueInfo(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "catalogue_info.json",
		callText(t, sess, "catalogue_info", map[string]any{}))
}

func TestGoldenListFHIRProfiles(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "list_fhir_profiles.json",
		callText(t, sess, "list_fhir_profiles", map[string]any{}))
}

func TestGoldenGetFHIRProfile(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "get_fhir_profile.json",
		callText(t, sess, "get_fhir_profile", map[string]any{"profile": "OPConsultRecord"}))
}

func TestGoldenGetFHIRExample(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "get_fhir_example.json",
		callText(t, sess, "get_fhir_example", map[string]any{"record_type": "OPConsultation"}))
}

func TestGoldenValidateFhir(t *testing.T) {
	sess := connect(t, false, nil)
	bundle := `{"resourceType":"Bundle","type":"document","timestamp":"2020-07-09T15:32:26.605+05:30","identifier":{"system":"https://example.com/bundle","value":"1"},"entry":[{"fullUrl":"Composition/1","resource":{"resourceType":"Composition","id":"1"}}]}`
	checkGolden(t, "validate_fhir.json",
		callText(t, sess, "validate_fhir", map[string]any{
			"bundle_json": bundle,
			"record_type": "OPConsultation",
		}))
}
