package server

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"reflect"
	"slices"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
	"github.com/nha-in/docs/mcp/internal/route"
)

var sixTools = []string{"abdm_search", "abdm_get", "abdm_related",
	"abdm_decode_error", "abdm_validate", "abdm_catalogue_info"}

func TestToolDefsAreTheSixTools(t *testing.T) {
	defs := NewTools(fixtureReader(t, false), nil).Defs()
	if len(defs) != len(sixTools) {
		t.Fatalf("got %d defs, want %d", len(defs), len(sixTools))
	}
	for i, d := range defs {
		if d.Name != sixTools[i] {
			t.Errorf("def %d = %q, want %q", i, d.Name, sixTools[i])
		}
		if d.Description == "" || d.InputSchema == nil || d.OutputSchema == nil || d.Call == nil {
			t.Errorf("def %q is incomplete", d.Name)
		}
	}
}

// tools/list is what a client sees: the six tools, then every old name as a
// deprecated alias, each read-only and each declaring an output schema.
func TestToolsListIsSixToolsPlusAliases(t *testing.T) {
	res, err := connect(t, false, nil).ListTools(context.Background(), nil)
	if err != nil {
		t.Fatal(err)
	}
	var names []string
	for _, tool := range res.Tools {
		names = append(names, tool.Name)
		if tool.OutputSchema == nil {
			t.Errorf("%s declares no outputSchema", tool.Name)
		}
		if tool.Annotations == nil || !tool.Annotations.ReadOnlyHint {
			t.Errorf("%s is not marked readOnlyHint", tool.Name)
		}
	}
	want := append(append([]string{}, sixTools...), "search_docs", "list_atoms",
		"list_operations", "list_fhir_profiles", "get_atom", "get_operation",
		"get_fhir_profile", "get_fhir_example", "related_atoms", "decode_error",
		"validate_request", "validate_fhir", "catalogue_info")
	if !reflect.DeepEqual(sorted(names), sorted(want)) {
		t.Fatalf("tools/list = %v, want %v", names, want)
	}
	for _, tool := range res.Tools {
		isNew := strings.HasPrefix(tool.Name, "abdm_")
		deprecated := strings.HasPrefix(tool.Description, "Deprecated alias for `abdm_")
		if isNew == deprecated {
			t.Errorf("%s: new=%v but deprecated=%v: %q", tool.Name, isNew, deprecated, tool.Description)
		}
	}
}

func sorted(s []string) []string {
	out := slices.Clone(s)
	slices.Sort(out)
	return out
}

func TestGetDispatchesByIdShape(t *testing.T) {
	for id, kind := range map[string]string{
		"hiecm.error.abdm-1062":       "atom",
		"shared.glossary.link-token":  "atom",
		"m1_post_profile_verify":      "operation",
		"linkAddContexts":             "operation",
		"fhir:OPConsultRecord":        "fhir_profile",
		"fhir:OPConsultation":         "fhir_profile",
		"fhir-example:OPConsultation": "fhir_example",
	} {
		if got := kindOfID(id); got != kind {
			t.Errorf("%s: got %s, want %s", id, got, kind)
		}
	}
}

// callResult calls a tool and returns its text and whether it is an error.
func callResult(t *testing.T, sess *mcp.ClientSession, tool string, args map[string]any) (string, bool, any) {
	t.Helper()
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{Name: tool, Arguments: args})
	if err != nil {
		t.Fatal(err)
	}
	return res.Content[0].(*mcp.TextContent).Text, res.IsError, res.StructuredContent
}

// Every id abdm_search hands out opens with abdm_get: that is what makes one
// search tool and one get tool enough.
func TestEveryIdSearchReturnsOpensWithGet(t *testing.T) {
	sess := connect(t, false, nil)
	for _, kind := range []string{"atom", "operation", "fhir_profile"} {
		var out struct {
			Results []struct {
				ID, Kind string
			} `json:"results"`
		}
		txt := callText(t, sess, "abdm_search", map[string]any{"kind": kind})
		if err := json.Unmarshal([]byte(txt), &out); err != nil || len(out.Results) == 0 {
			t.Fatalf("kind %s listed nothing: %v %s", kind, err, txt)
		}
		for _, r := range out.Results {
			if r.Kind != kind {
				t.Errorf("listing kind %s returned a %s", kind, r.Kind)
			}
			if txt, isErr, _ := callResult(t, sess, "abdm_get", map[string]any{"id": r.ID}); isErr {
				t.Errorf("abdm_get %s: %s", r.ID, txt)
			}
		}
	}
}

func TestGetUnknownIdNamesTheCorrectedCall(t *testing.T) {
	sess := connect(t, false, nil)
	for id, want := range map[string]string{
		"hiecm.error.abdm-1036":  "hiecm.error.abdm-1035",
		"linkAddContext":         "linkAddContexts",
		"fhir:OPConsult":         "fhir:OPConsultRecord",
		"fhir-example:OPConsult": "fhir-example:OPConsultation",
		// An ABDM hiType is not an operationId: say which id would work.
		"OPConsultation": `"fhir:OPConsultation"`,
	} {
		txt, isErr, _ := callResult(t, sess, "abdm_get", map[string]any{"id": id})
		if !isErr {
			t.Errorf("%s: want isError", id)
		}
		if !strings.Contains(txt, want) || !strings.Contains(txt, "abdm_") {
			t.Errorf("%s: error does not name %s and the call to make: %s", id, want, txt)
		}
	}
}

func TestSearchWithAnEmptyQueryListsOneKind(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "abdm_search", map[string]any{"kind": "atom", "type": "error"})
	if !strings.Contains(out, "hiecm.error.abdm-1035") || strings.Contains(out, "hiecm.flow.") {
		t.Errorf("atom listing by type: %s", out)
	}
	out = callText(t, sess, "abdm_search", map[string]any{"kind": "operation", "module": "m2"})
	if !strings.Contains(out, `"id":"linkAddContexts"`) ||
		!strings.Contains(out, `"url":"/docs/hiecm/v3/api/m2/endpoints/linkaddcontexts"`) {
		t.Errorf("operation listing: %s", out)
	}
	out = callText(t, sess, "abdm_search", map[string]any{"kind": "operation", "query": "add contexts"})
	if !strings.Contains(out, "linkAddContexts") {
		t.Errorf("every word of the query must match somewhere in the operation: %s", out)
	}
	out = callText(t, sess, "abdm_search", map[string]any{"kind": "fhir_profile"})
	if !strings.Contains(out, `"id":"fhir:OPConsultRecord"`) {
		t.Errorf("fhir listing: %s", out)
	}
	txt, isErr, _ := callResult(t, sess, "abdm_search", map[string]any{})
	if !isErr || !strings.Contains(txt, `kind "atom", "operation" or "fhir_profile"`) {
		t.Errorf("an empty query with no kind must say what to pass: %v %s", isErr, txt)
	}
}

func TestSearchListingPaginates(t *testing.T) {
	sess := connect(t, false, nil)
	var page struct {
		Results    []map[string]any `json:"results"`
		Total      int              `json:"total"`
		NextOffset *int             `json:"next_offset"`
	}
	txt := callText(t, sess, "abdm_search", map[string]any{"kind": "atom", "limit": 2})
	if err := json.Unmarshal([]byte(txt), &page); err != nil {
		t.Fatal(err)
	}
	if len(page.Results) != 2 || page.Total != 3 || page.NextOffset == nil || *page.NextOffset != 2 {
		t.Fatalf("first page: %s", txt)
	}
	page.NextOffset = nil
	txt = callText(t, sess, "abdm_search", map[string]any{"kind": "atom", "limit": 2, "offset": 2})
	if err := json.Unmarshal([]byte(txt), &page); err != nil {
		t.Fatal(err)
	}
	if len(page.Results) != 1 || page.NextOffset != nil {
		t.Fatalf("last page: %s", txt)
	}
}

func TestConciseAndDetailedSearch(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	var out struct {
		Results []map[string]any `json:"results"`
	}
	txt := callText(t, sess, "abdm_search", map[string]any{"query": "ABDM-1035"})
	if err := json.Unmarshal([]byte(txt), &out); err != nil {
		t.Fatal(err)
	}
	for _, r := range out.Results {
		for k := range r {
			if k != "id" && k != "kind" && k != "title" && k != "summary" && k != "url" {
				t.Errorf("concise result carries %q: %v", k, r)
			}
		}
	}
	txt = callText(t, sess, "abdm_search", map[string]any{"query": "ABDM-1035", "response_format": "detailed"})
	if !strings.Contains(txt, `"snippet"`) || !strings.Contains(txt, `"milestone"`) {
		t.Errorf("detailed result lacks snippet or milestone: %s", txt)
	}
}

// The budget: a concise search at limit 10 stays under 4,000 characters,
// here with every field at the longest length the catalogue holds today
// (title 135, summary 325, id 56 characters).
func TestConciseSearchAtLimitTenStaysUnder4000(t *testing.T) {
	var atoms []catalogue.Atom
	for i := 0; i < 12; i++ {
		atoms = append(atoms, catalogue.Atom{
			ID:   fmt.Sprintf("hiecm.troubleshooting.budget-%02d-%s", i, strings.Repeat("x", 30)),
			Type: "troubleshooting", Gateway: "hiecm", Milestone: "M2",
			Title:   "budget " + strings.Repeat("longword ", 16),
			Summary: "budget " + strings.Repeat("sentence ", 35),
			Body:    "## In plain words\n\nbudget", SourcePath: "x.md",
			DocURL: "/docs/hiecm/v3/getting-started/some-long-page-name", DocAnchor: "some-long-section-anchor",
			Related: map[string][]string{},
		})
	}
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	if err := index.Build(dbPath, atoms, nil, nil, nil, nil, nil, nil,
		index.Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z"}); err != nil {
		t.Fatal(err)
	}
	r, err := index.Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	out, err := NewTools(r, nil).Search(context.Background(), searchIn{Query: "budget", Limit: 10})
	if err != nil {
		t.Fatal(err)
	}
	b, _ := json.Marshal(out)
	if n := len(out["results"].([]map[string]any)); n != 10 {
		t.Fatalf("got %d results, want 10", n)
	}
	if len(b) >= 4000 {
		t.Fatalf("concise search at limit 10 is %d characters, budget 4000:\n%s", len(b), b)
	}
}

// structuredContent is what a client validates against outputSchema; the
// text is what a model reads. They must be the same JSON.
func TestStructuredContentMatchesText(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	for _, c := range []struct {
		tool string
		args map[string]any
	}{
		{"abdm_search", map[string]any{"query": "ABDM-1035"}},
		{"abdm_search", map[string]any{"kind": "operation"}},
		{"abdm_get", map[string]any{"id": "hiecm.error.abdm-1035"}},
		{"abdm_get", map[string]any{"id": "linkAddContexts"}},
		{"abdm_get", map[string]any{"id": "fhir:OPConsultRecord"}},
		{"abdm_get", map[string]any{"id": "fhir-example:OPConsultation"}},
		{"abdm_related", map[string]any{"id": "hiecm.flow.m2-link-care-context"}},
		{"abdm_decode_error", map[string]any{"input": "ABDM-1035"}},
		{"abdm_validate", map[string]any{"kind": "request", "operation_id": "linkAddContexts", "body": `{"abhaNumber":"1"}`}},
		{"abdm_validate", map[string]any{"kind": "fhir", "bundle_json": `{"resourceType":"Bundle"}`}},
		{"abdm_catalogue_info", map[string]any{}},
	} {
		txt, isErr, structured := callResult(t, sess, c.tool, c.args)
		if isErr || structured == nil {
			t.Errorf("%s %v: isError=%v structured=%v: %s", c.tool, c.args, isErr, structured, txt)
			continue
		}
		var a, b any
		sb, _ := json.Marshal(structured)
		json.Unmarshal(sb, &a)
		json.Unmarshal([]byte(txt), &b)
		if !reflect.DeepEqual(a, b) {
			t.Errorf("%s: structuredContent and text differ", c.tool)
		}
	}
}

func TestValidateNamesWhatIsMissing(t *testing.T) {
	sess := connect(t, false, nil)
	for _, c := range []struct {
		args map[string]any
		want string
	}{
		{map[string]any{"kind": "request", "body": "{}"}, `abdm_search`},
		{map[string]any{"kind": "fhir"}, "bundle_json"},
		{map[string]any{"kind": "request", "operation_id": "linkAddContext", "body": "{}"}, "linkAddContexts"},
	} {
		txt, isErr, _ := callResult(t, sess, "abdm_validate", c.args)
		if !isErr || !strings.Contains(txt, c.want) {
			t.Errorf("%v: want an error naming %q, got %v %s", c.args, c.want, isErr, txt)
		}
	}
}

// newTestTools builds a Tools over the fixture snapshot with a fake
// embedder, so Lookup (and anything bound to it) has real hits to return.
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

// The chat surface uses only the new names, whatever the router picks.
func TestChatToolSetUsesOnlyNewNames(t *testing.T) {
	tools := newTestTools(t)
	for _, q := range []string{"what is a care context", "getting ABDM-1016 on sessions",
		"what headers does POST /api/hiecm/gateway/v3/sessions need",
		"gateway_sessions_create returns 401"} {
		for _, att := range []bool{false, true} {
			for _, d := range tools.ChatToolsFor(route.Route(route.Input{Question: q, HasAttachment: att}).Tools) {
				if !strings.HasPrefix(d.Name, "abdm_") || strings.HasPrefix(d.Description, "Deprecated") {
					t.Errorf("%q: chat set carries %s", q, d.Name)
				}
			}
		}
	}
	for _, d := range ChatTools(tools.Defs()) {
		if d.Name == "abdm_validate" {
			t.Error("the unrouted chat set must not carry abdm_validate: validating a FHIR bundle is MCP only")
		}
	}
}

func TestChatToolsForBindsSearchToLookup(t *testing.T) {
	tools := newTestTools(t)
	defs := tools.ChatToolsFor([]string{"abdm_search", "abdm_decode_error", "abdm_get"})
	if len(defs) != 3 || defs[0].Name != "abdm_search" || defs[1].Name != "abdm_decode_error" || defs[2].Name != "abdm_get" {
		t.Fatalf("got %+v", defs)
	}
	out, err := defs[0].Call(context.Background(), json.RawMessage(`{"query":"link care contexts"}`))
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := out["passages"]; !ok {
		t.Errorf("chat abdm_search must return a passage pack, got keys %v", keys(out))
	}
	if !strings.Contains(defs[0].Description, "Call this when") {
		t.Errorf("description must state when to call it, got %q", defs[0].Description)
	}
	// kind operation finds operations, which the passage pack never holds.
	out, err = defs[0].Call(context.Background(), json.RawMessage(`{"query":"add-contexts","kind":"operation"}`))
	if err != nil {
		t.Fatal(err)
	}
	if b, _ := json.Marshal(out); !strings.Contains(string(b), "linkAddContexts") {
		t.Errorf("chat abdm_search kind operation: %s", b)
	}
}

func TestChatToolsForBindsValidateToRequestsOnly(t *testing.T) {
	tools := NewTools(fixtureReader(t, false), nil)
	defs := tools.ChatToolsFor([]string{"abdm_search", "abdm_validate"})
	if len(defs) != 2 || defs[1].Name != "abdm_validate" {
		t.Fatalf("got %+v", defs)
	}
	if _, ok := defs[1].InputSchema.Properties["bundle_json"]; ok {
		t.Error("chat abdm_validate must not offer FHIR bundle validation")
	}
	out, err := defs[1].Call(context.Background(), json.RawMessage(
		`{"operation_id":"linkAddContexts","body":"{\"abhaNumber\":\"91-1234\"}"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["valid"] != true {
		t.Errorf("valid body rejected: %v", out)
	}
	if _, ok := out["required_parameters"]; !ok {
		t.Errorf("chat abdm_validate must return required_parameters, got keys %v", keys(out))
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
