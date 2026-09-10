package server

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
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

// newTestTools builds a Tools over the fixture snapshot with a fake
// embedder, the same setup TestLookupOpensTopHitsAndWalksOneHop uses, so
// Lookup (and anything bound to it) has real hits to return.
func newTestTools(t *testing.T) *Tools {
	t.Helper()
	return NewTools(fixtureReader(t, true), embed.NewFake(64))
}

func keys(m map[string]any) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}

func TestChatToolsForBindsSearchDocsToLookup(t *testing.T) {
	tools := newTestTools(t)
	defs := tools.ChatToolsFor([]string{"search_docs", "decode_error"})
	if len(defs) != 2 || defs[0].Name != "search_docs" || defs[1].Name != "decode_error" {
		t.Fatalf("got %+v", defs)
	}
	out, err := defs[0].Call(context.Background(), json.RawMessage(`{"query":"link care contexts"}`))
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := out["passages"]; !ok {
		t.Errorf("chat search_docs must return a passage pack, got keys %v", keys(out))
	}
	if !strings.Contains(defs[0].Description, "Call this when") {
		t.Errorf("description must state when to call it, got %q", defs[0].Description)
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

func TestLookupOpensTopHitsAndWalksOneHop(t *testing.T) {
	r := fixtureReader(t, true)
	tools := NewTools(r, embed.NewFake(64))
	pack, err := tools.Lookup(context.Background(), lookupIn{Query: "link care contexts"})
	if err != nil {
		t.Fatal(err)
	}
	if len(pack.Passages) == 0 || len(pack.Passages) > 5 {
		t.Fatalf("passages = %d, want 1..5", len(pack.Passages))
	}
	if pack.Passages[0].Body == "" {
		t.Error("top passage must carry the full body, not a snippet")
	}
	for i, p := range pack.Passages {
		if i >= 3 && len(p.Body) > 600 {
			t.Errorf("passage %d past the top three should be a summary, got %d chars", i, len(p.Body))
		}
	}
	if len(pack.Related) == 0 {
		t.Error("expected at least one related atom one hop out")
	}
}

// failingOpener stubs atomOpener with a GetAtom that always errors, so
// openPassage's degrade-to-summary branch can be exercised without needing
// a real index that can be made to fail GetAtom while still returning the
// hit from Search.
type failingOpener struct{}

func (failingOpener) GetAtom(id string) (catalogue.Atom, error) {
	return catalogue.Atom{}, fmt.Errorf("atom %s: simulated open failure", id)
}

// RelatedAtoms is never reached on this path (openPassage returns before
// calling it when GetAtom fails); it only exists to satisfy atomOpener.
func (failingOpener) RelatedAtoms(id string) ([]index.RelatedGroup, error) {
	return nil, nil
}

func TestOpenPassageDegradesToSummaryOnGetAtomError(t *testing.T) {
	hit := index.SearchHit{ID: "hiecm.flow.m2-link-care-context", Type: "flow",
		Title: "Link a care context", Summary: "the search hit's own summary"}
	p, related := openPassage(failingOpener{}, hit)
	if p.Body != hit.Summary {
		t.Errorf("Body = %q, want the search hit's summary %q", p.Body, hit.Summary)
	}
	if p.ID != hit.ID || p.Title != hit.Title {
		t.Errorf("passage fields not carried through from the hit: %+v", p)
	}
	if related != nil {
		t.Errorf("related = %v, want nil: the related walk must be skipped when GetAtom fails", related)
	}
}
