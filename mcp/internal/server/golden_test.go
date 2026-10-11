package server

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"os"
	"path/filepath"
	"testing"

	"github.com/nha-in/docs/mcp/internal/embed"
)

var update = flag.Bool("update", false, "rewrite golden files")

// checkGolden compares a tool's compact JSON text with its golden file. The
// file is stored indented so a reviewer can read the diff; the comparison
// is on the indented form of both.
func checkGolden(t *testing.T, name, got string) {
	t.Helper()
	var buf bytes.Buffer
	if err := json.Indent(&buf, []byte(got), "", "  "); err != nil {
		t.Fatalf("%s: tool text is not JSON: %v\n%s", name, err, got)
	}
	buf.WriteByte('\n')
	path := filepath.Join("testdata", "golden", name)
	if *update {
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(path, buf.Bytes(), 0o644); err != nil {
			t.Fatal(err)
		}
		return
	}
	want, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("missing golden file %s; run with -update", path)
	}
	if string(want) != buf.String() {
		t.Errorf("contract drift in %s:\n got: %s\nwant: %s", name, buf.String(), want)
	}
}

// The tools/list contract: names, descriptions, input and output schemas
// and annotations of all nineteen entries, the six tools and the aliases.
func TestGoldenToolsList(t *testing.T) {
	res, err := connect(t, false, nil).ListTools(context.Background(), nil)
	if err != nil {
		t.Fatal(err)
	}
	b, err := json.Marshal(res.Tools)
	if err != nil {
		t.Fatal(err)
	}
	checkGolden(t, "tools_list.json", string(b))
}

func TestGoldenSearch(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	checkGolden(t, "abdm_search.json",
		callText(t, sess, "abdm_search", map[string]any{"query": "ABDM-1035"}))
	checkGolden(t, "abdm_search_detailed.json",
		callText(t, sess, "abdm_search", map[string]any{"query": "ABDM-1035", "response_format": "detailed"}))
}

func TestGoldenSearchListings(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "abdm_search_operations.json",
		callText(t, sess, "abdm_search", map[string]any{"kind": "operation"}))
	checkGolden(t, "abdm_search_fhir_profiles.json",
		callText(t, sess, "abdm_search", map[string]any{"kind": "fhir_profile"}))
}

func TestGoldenGetOperation(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "abdm_get_operation.json",
		callText(t, sess, "abdm_get", map[string]any{"id": "linkAddContexts"}))
}

func TestGoldenCatalogueInfo(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "abdm_catalogue_info.json",
		callText(t, sess, "abdm_catalogue_info", map[string]any{}))
}

func TestGoldenGetFHIRProfile(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "abdm_get_fhir_profile.json",
		callText(t, sess, "abdm_get", map[string]any{"id": "fhir:OPConsultRecord"}))
}

func TestGoldenGetFHIRExample(t *testing.T) {
	sess := connect(t, false, nil)
	checkGolden(t, "abdm_get_fhir_example.json",
		callText(t, sess, "abdm_get", map[string]any{"id": "fhir-example:OPConsultation"}))
}

func TestGoldenValidateFhir(t *testing.T) {
	sess := connect(t, false, nil)
	bundle := `{"resourceType":"Bundle","type":"document","timestamp":"2020-07-09T15:32:26.605+05:30","identifier":{"system":"https://example.com/bundle","value":"1"},"entry":[{"fullUrl":"Composition/1","resource":{"resourceType":"Composition","id":"1"}}]}`
	checkGolden(t, "abdm_validate_fhir.json",
		callText(t, sess, "abdm_validate", map[string]any{
			"kind":        "fhir",
			"bundle_json": bundle,
			"record_type": "OPConsultation",
		}))
}
