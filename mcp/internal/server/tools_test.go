package server

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
)

func TestToolDefsMatchMCP(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	want := []string{"search", "get", "related", "decode_error", "catalogue_info"}
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
	defs := tools.ChatToolsFor([]string{"search", "decode_error", "get"})
	if len(defs) != 3 || defs[0].Name != "search" || defs[1].Name != "decode_error" || defs[2].Name != "get" {
		t.Fatalf("got %+v", defs)
	}
	out, err := defs[0].Call(context.Background(), json.RawMessage(`{"query":"link care contexts"}`))
	if err != nil {
		t.Fatal(err)
	}
	if _, ok := out["passages"]; !ok {
		t.Errorf("chat search must return a passage pack, got keys %v", keys(out))
	}
	if !strings.Contains(defs[0].Description, "Call this when") {
		t.Errorf("description must state when to call it, got %q", defs[0].Description)
	}
}

func TestChatToolsForBindsValidateRequest(t *testing.T) {
	r := fixtureReader(t, false)
	tools := NewTools(r, nil)
	defs := tools.ChatToolsFor([]string{"search", "validate"})
	if len(defs) != 2 || defs[0].Name != "search" || defs[1].Name != "validate" {
		t.Fatalf("got %+v", defs)
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
		t.Errorf("chat validate must return required_parameters, got keys %v", keys(out))
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
	out, err := defByName(t, defs, "search").Call(context.Background(), json.RawMessage(`{"kind":"fhir_profile"}`))
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
	def := defByName(t, defs, "get")

	out, err := def.Call(context.Background(), json.RawMessage(`{"id":"fhir:OPConsultRecord"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["profile_name"] != "OPConsultRecord" {
		t.Fatalf("get_fhir_profile by profile name = %v", out)
	}

	// Same digest, looked up by its ABDM hiType instead of its profile name.
	out, err = def.Call(context.Background(), json.RawMessage(`{"id":"fhir:OPConsultation"}`))
	if err != nil {
		t.Fatal(err)
	}
	if out["profile_name"] != "OPConsultRecord" {
		t.Fatalf("get_fhir_profile by hiType = %v", out)
	}

	if _, err := def.Call(context.Background(), json.RawMessage(`{"id":"fhir:NoSuchProfile"}`)); err == nil {
		t.Fatal("want an error for an unknown profile")
	}
}

func TestToolDefCallGetFHIRExample(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	def := defByName(t, defs, "get")

	out, err := def.Call(context.Background(), json.RawMessage(`{"id":"fhir-example:OPConsultation"}`))
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

	if _, err := def.Call(context.Background(), json.RawMessage(`{"id":"fhir-example:NoSuchType"}`)); err == nil {
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

func (failingOpener) OperationRoute(id string) (string, string, bool) { return "", "", false }

func (failingOpener) RelatedOutbound(id string) ([]index.AtomRef, error) { return nil, nil }

func (routedOpener) RelatedOutbound(id string) ([]index.AtomRef, error) { return nil, nil }

// outboundOpener stubs the outbound walk for one passage.
type outboundOpener struct{ refs []index.AtomRef }

func (outboundOpener) GetAtom(id string) (catalogue.Atom, error) { return catalogue.Atom{ID: id}, nil }
func (outboundOpener) RelatedAtoms(id string) ([]index.RelatedGroup, error) {
	return nil, nil
}
func (outboundOpener) OperationRoute(id string) (string, string, bool) { return "", "", false }
func (o outboundOpener) RelatedOutbound(id string) ([]index.AtomRef, error) {
	return o.refs, nil
}

// Next questions are what the passage's author named as related, in the
// conversation's gateway or shared, never a passage already shown and never
// the same atom twice. The backlinks RelatedAtoms walks play no part: for
// the ABHA glossary entry they were every NHCX callback in the catalogue.
func TestNextQuestionsAreOutboundScopedAndUnseen(t *testing.T) {
	o := outboundOpener{refs: []index.AtomRef{
		{ID: "shared.glossary.ayushman-card", Type: "glossary", Title: "Ayushman card"},
		{ID: "nhcx.callback.claim-on-submit", Type: "callback", Title: "Receiving POST /v1/claim/on_submit"},
		{ID: "hiecm.flow.m1-create-abha-aadhaar-otp", Type: "flow", Title: "Create an ABHA"},
		{ID: "hiecm.glossary.abha-number", Type: "glossary", Title: "ABHA number"},
		{ID: "hiecm.flow.m1-create-abha-aadhaar-otp", Type: "flow", Title: "Create an ABHA"},
	}}
	shown := map[string]bool{"hiecm.glossary.abha-number": true}
	got := nextQuestions(o, "shared.glossary.abha", shown, "hiecm")
	want := []string{"shared.glossary.ayushman-card", "hiecm.flow.m1-create-abha-aadhaar-otp"}
	if len(got) != len(want) {
		t.Fatalf("next = %v, want ids %v", got, want)
	}
	for i, w := range want {
		if got[i]["id"] != w {
			t.Errorf("next[%d] = %s, want %s", i, got[i]["id"], w)
		}
	}
}

// routedOpener returns an endpoint atom that names an operation, and knows
// that operation's route, so the passage can be checked for the path line.
type routedOpener struct{ known bool }

func (routedOpener) GetAtom(id string) (catalogue.Atom, error) {
	return catalogue.Atom{ID: id, Type: "endpoint", Operation: "m2_post_v3_link_token_generate",
		Body: "Generates a link token for the patient."}, nil
}

func (routedOpener) RelatedAtoms(id string) ([]index.RelatedGroup, error) { return nil, nil }

func (o routedOpener) OperationRoute(id string) (string, string, bool) {
	if !o.known || id != "m2_post_v3_link_token_generate" {
		return "", "", false
	}
	return "POST", "/api/hiecm/v3/token/generate-token", true
}

// The endpoint atom's body never carries its path; the guard grounds
// literals against the pack, so the passage has to carry the route or every
// answer quoting the real path is withheld.
func TestOpenPassageCarriesTheOperationRoute(t *testing.T) {
	hit := index.SearchHit{ID: "hiecm.endpoint.m2-generate-link-token", Type: "endpoint"}
	p, _ := openPassage(routedOpener{known: true}, hit)
	if !strings.HasPrefix(p.Body, "POST /api/hiecm/v3/token/generate-token\n\n") {
		t.Errorf("Body should open with the method and path, got %q", p.Body)
	}
	if !strings.HasSuffix(p.Body, "Generates a link token for the patient.") {
		t.Errorf("Body should still end with the atom body, got %q", p.Body)
	}
	// An operation the index does not know leaves the body as it was, rather
	// than writing an empty route line.
	p, _ = openPassage(routedOpener{known: false}, hit)
	if p.Body != "Generates a link token for the patient." {
		t.Errorf("unknown operation should leave the body untouched, got %q", p.Body)
	}
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

// A code in the question names the one atom that explains it, and that atom
// goes first whatever the rest of the wording ranks: "401 with code 900901"
// retrieved five M1 enrolment atoms and not the error atom. Only an error
// atom is pinned; a flow that merely mentions the code keeps its rank.
type codeStub map[string][]index.AtomRef

func (s codeStub) AtomsByErrorCode(code string) ([]index.AtomRef, error) { return s[code], nil }

func TestPinErrorAtomsPutsTheCodesErrorAtomFirst(t *testing.T) {
	stub := codeStub{"900901": {
		{ID: "hiecm.flow.m1-create-abha", Type: "flow"},
		{ID: "hiecm.error.900901", Type: "error", Title: "900901, the credentials are not valid"},
	}}
	hits := []index.SearchHit{{ID: "hiecm.endpoint.m1-enrolment-by-aadhaar"}, {ID: "hiecm.error.900901"}, {ID: "shared.glossary.abha"}}
	got := pinErrorAtoms(stub, "abha enrolment returns 401 with code 900901 Invalid Credentials", hits, 5)
	var ids []string
	for _, h := range got {
		ids = append(ids, h.ID)
	}
	want := []string{"hiecm.error.900901", "hiecm.endpoint.m1-enrolment-by-aadhaar", "shared.glossary.abha"}
	if strings.Join(ids, ",") != strings.Join(want, ",") {
		t.Errorf("ids = %v, want %v (error atom first, no duplicate, the flow not pinned)", ids, want)
	}
	if got := pinErrorAtoms(stub, "how do I create an ABHA", hits, 5); len(got) != 3 || got[0].ID != hits[0].ID {
		t.Errorf("a question with no code must keep search order, got %v", got)
	}
}

// An agent that read "900901" in a response passes exactly that. The code
// alone was not read as one, because a bare six-digit number is only a code
// in a JSON "code" value or after a word like "error"; an input that is
// nothing but the code has no other reading.
func TestDecodeErrorReadsABareGatewayCode(t *testing.T) {
	tools := NewTools(fixtureReader(t, false), nil)
	out, err := tools.DecodeError(context.Background(), decodeIn{Input: " 900901 "})
	if err != nil {
		t.Fatal(err)
	}
	codes, _ := out["codes"].([]string)
	if len(codes) != 1 || codes[0] != "900901" {
		t.Errorf("codes = %v, want [900901]", out["codes"])
	}
}
