package server

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/index"
)

func TestToolDefsMatchMCP(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	want := []string{"search_docs", "get_atom", "related_atoms", "decode_error",
		"list_operations", "get_operation", "catalogue_info",
		"list_fhir_profiles", "get_fhir_profile", "get_fhir_example"}
	if len(defs) != len(want) {
		t.Fatalf("got %d defs, want %d", len(defs), len(want))
	}
	for i, d := range defs {
		if d.Name != want[i] {
			t.Errorf("def %d = %q, want %q", i, d.Name, want[i])
		}
		if d.Description == "" || d.InputSchema == nil || d.Call == nil {
			t.Errorf("def %q is incomplete", d.Name)
		}
	}
}

func TestToolDefCallSearch(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	out, err := defs[0].Call(context.Background(),
		json.RawMessage(`{"query": "timestamp"}`))
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := out["hits"]; !ok {
		t.Fatalf("search result missing hits: %v", out)
	}
	if _, ok := out["catalogue_version"]; !ok {
		t.Fatalf("search result missing catalogue_version: %v", out)
	}
}

func defByName(t *testing.T, defs []ToolDef, name string) ToolDef {
	t.Helper()
	for _, d := range defs {
		if d.Name == name {
			return d
		}
	}
	t.Fatalf("no tool def named %q", name)
	return ToolDef{}
}

func TestToolDefCallListFHIRProfiles(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	out, err := defByName(t, defs, "list_fhir_profiles").Call(context.Background(), json.RawMessage(`{}`))
	if err != nil {
		t.Fatal(err)
	}
	profiles, ok := out["profiles"].([]index.FHIRProfileSummary)
	if !ok || len(profiles) != 1 || profiles[0].ProfileName != "OPConsultRecord" {
		t.Fatalf("list_fhir_profiles result = %v", out)
	}
	if _, ok := out["catalogue_version"]; !ok {
		t.Fatalf("list_fhir_profiles result missing catalogue_version: %v", out)
	}
}

func TestToolDefCallGetFHIRProfile(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	def := defByName(t, defs, "get_fhir_profile")

	out, err := def.Call(context.Background(), json.RawMessage(`{"profile":"OPConsultRecord"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["profile_name"] != "OPConsultRecord" {
		t.Fatalf("get_fhir_profile by profile name = %v", out)
	}

	// Same digest, looked up by its ABDM hiType instead of its profile name.
	out, err = def.Call(context.Background(), json.RawMessage(`{"profile":"OPConsultation"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["profile_name"] != "OPConsultRecord" {
		t.Fatalf("get_fhir_profile by hiType = %v", out)
	}

	if _, err := def.Call(context.Background(), json.RawMessage(`{"profile":"NoSuchProfile"}`)); err == nil {
		t.Fatal("want an error for an unknown profile")
	}
}

func TestToolDefCallGetFHIRExample(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	def := defByName(t, defs, "get_fhir_example")

	out, err := def.Call(context.Background(), json.RawMessage(`{"record_type":"OPConsultation"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["record_type"] != "OPConsultation" {
		t.Fatalf("get_fhir_example result = %v", out)
	}
	exJSON, err := json.Marshal(out["example"])
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(exJSON), `"resourceType":"Bundle"`) {
		t.Fatalf("get_fhir_example example missing bundle content: %s", exJSON)
	}

	if _, err := def.Call(context.Background(), json.RawMessage(`{"record_type":"NoSuchType"}`)); err == nil {
		t.Fatal("want an error for an unknown record type")
	}
}
