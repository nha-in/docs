package server

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// fixtureReader builds the same two-atom snapshot the index tests use.
// Duplicated here because index's fixture helper lives in its test files.
func fixtureReader(t *testing.T, withVectors bool) *index.Reader {
	t.Helper()
	dbPath := buildServerFixtureDB(t, withVectors) // defined in fixtures_test.go below
	r, err := index.Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	return r
}

func connect(t *testing.T, withVectors bool, emb embed.Embedder) *mcp.ClientSession {
	t.Helper()
	srv := NewMCPServer(fixtureReader(t, withVectors), emb)
	ct, st := mcp.NewInMemoryTransports()
	if _, err := srv.Connect(context.Background(), st, nil); err != nil {
		t.Fatal(err)
	}
	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "0"}, nil)
	sess, err := client.Connect(context.Background(), ct, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { sess.Close() })
	return sess
}

func callText(t *testing.T, sess *mcp.ClientSession, tool string, args map[string]any) string {
	t.Helper()
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{Name: tool, Arguments: args})
	if err != nil {
		t.Fatal(err)
	}
	if len(res.Content) == 0 {
		t.Fatalf("%s: empty content", tool)
	}
	txt, ok := res.Content[0].(*mcp.TextContent)
	if !ok {
		t.Fatalf("%s: content is %T", tool, res.Content[0])
	}
	return txt.Text
}

func TestSearchDocsCarriesVersionAndStatus(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	out := callText(t, sess, "search_docs", map[string]any{"query": "ABDM-1035"})
	var payload struct {
		CatalogueVersion string `json:"catalogue_version"`
		Hits             []struct {
			ID                 string `json:"id"`
			VerificationStatus string `json:"verification_status"`
		} `json:"hits"`
	}
	if err := json.Unmarshal([]byte(out), &payload); err != nil {
		t.Fatalf("not JSON: %v\n%s", err, out)
	}
	if payload.CatalogueVersion != "2026.08.24" {
		t.Errorf("catalogue_version = %q", payload.CatalogueVersion)
	}
	if len(payload.Hits) == 0 || payload.Hits[0].ID != "hiecm.error.abdm-1035" {
		t.Errorf("hits = %+v", payload.Hits)
	}
	if payload.Hits[0].VerificationStatus != "verified" {
		t.Errorf("status not carried")
	}
}

func TestGetAtomUnknownNamesClosest(t *testing.T) {
	sess := connect(t, false, nil)
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{
		Name: "get_atom", Arguments: map[string]any{"id": "hiecm.error.abdm-1036"}})
	if err != nil {
		t.Fatal(err)
	}
	if !res.IsError {
		t.Fatal("want IsError for unknown id")
	}
	txt := res.Content[0].(*mcp.TextContent).Text
	if !strings.Contains(txt, "hiecm.error.abdm-1035") {
		t.Errorf("error does not name closest match: %s", txt)
	}
}

func relatedGroups(t *testing.T, out string) map[string][]struct {
	ID   string `json:"id"`
	Type string `json:"type"`
} {
	t.Helper()
	var payload struct {
		Related map[string][]struct {
			ID   string `json:"id"`
			Type string `json:"type"`
		} `json:"related"`
	}
	if err := json.Unmarshal([]byte(out), &payload); err != nil {
		t.Fatalf("not JSON: %v\n%s", err, out)
	}
	return payload.Related
}

func TestRelatedAtoms(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "related_atoms", map[string]any{"id": "hiecm.flow.m2-link-care-context"})
	related := relatedGroups(t, out)
	errs := related["error"]
	if len(errs) != 1 || errs[0].ID != "hiecm.error.abdm-1035" {
		t.Errorf("error group = %+v", related)
	}
	eps := related["endpoint"]
	if len(eps) != 1 || eps[0].ID != "hiecm.endpoint.m1-enrolment-by-aadhaar" {
		t.Errorf("endpoint group = %+v", related)
	}
}

func TestRelatedAtomsReverseEdgeNotMislabeled(t *testing.T) {
	// The flow references the endpoint under its "endpoints" relation.
	// Walking from the endpoint, the flow must come back under "flow",
	// once, and never under an "endpoints" or "endpoint" group.
	sess := connect(t, false, nil)
	out := callText(t, sess, "related_atoms", map[string]any{"id": "hiecm.endpoint.m1-enrolment-by-aadhaar"})
	related := relatedGroups(t, out)
	if _, ok := related["endpoints"]; ok {
		t.Errorf("reverse edge still grouped under relation name: %s", out)
	}
	if _, ok := related["endpoint"]; ok {
		t.Errorf("flow mislabeled as endpoint: %s", out)
	}
	flows := related["flow"]
	if len(flows) != 1 || flows[0].ID != "hiecm.flow.m2-link-care-context" || flows[0].Type != "flow" {
		t.Errorf("flow group = %+v", related)
	}
}

func TestGetAtomCautionOnUnverifiedOnly(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "get_atom", map[string]any{"id": "hiecm.flow.m2-link-care-context"})
	if !strings.Contains(out, `"caution"`) || !strings.Contains(out, "recorded claims, not observed behaviour") {
		t.Errorf("unverified atom missing caution: %s", out)
	}
	out = callText(t, sess, "get_atom", map[string]any{"id": "hiecm.error.abdm-1035"})
	if strings.Contains(out, `"caution"`) {
		t.Errorf("verified atom must carry no caution: %s", out)
	}
}

func TestDecodeError(t *testing.T) {
	sess := connect(t, false, nil)
	raw := `{"error":{"code":"ABDM-1035","message":"facility not onboarded"}}`
	out := callText(t, sess, "decode_error", map[string]any{"input": raw})
	if !strings.Contains(out, "hiecm.error.abdm-1035") {
		t.Errorf("decode failed: %s", out)
	}
	// The verified error atom sits side by side with the spec table row.
	if !strings.Contains(out, `"specification"`) ||
		!strings.Contains(out, "Facility is not registered with the bridge") {
		t.Errorf("spec rows missing beside the atom: %s", out)
	}
	if strings.Contains(out, `"caution"`) {
		t.Errorf("verified error atom must carry no caution: %s", out)
	}
	out = callText(t, sess, "decode_error", map[string]any{"input": "nothing here"})
	if !strings.Contains(out, "no error codes") {
		t.Errorf("want honest empty answer, got: %s", out)
	}
}

func TestDecodeErrorSpecTableFallback(t *testing.T) {
	// ABDM-1016 has no error atom, only a spec table row; decode_error
	// must return the row instead of going silent. Real responses carry
	// trailing punctuation on the code field.
	sess := connect(t, false, nil)
	raw := `{"code":"ABDM-1016: ","message":"Dependent service unavailable"}`
	out := callText(t, sess, "decode_error", map[string]any{"input": raw})
	if strings.Contains(out, "no error atom for this code yet; try search_docs") {
		t.Fatalf("went silent despite spec table row: %s", out)
	}
	for _, want := range []string{
		`"specification"`, "ABDM-1016", "Dependent service unavailable",
		"Retry with backoff", `"module": "m1"`, "specification error table",
		"no narrative error atom",
	} {
		if !strings.Contains(out, want) {
			t.Errorf("fallback output missing %q: %s", want, out)
		}
	}
	// A code in neither source still gets the honest empty answer.
	out = callText(t, sess, "decode_error", map[string]any{"input": "ABDM-9999"})
	if !strings.Contains(out, "no error atom for this code yet") {
		t.Errorf("want honest miss for unknown code: %s", out)
	}
}

func TestListOperationsCasingAndFilters(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "list_operations", map[string]any{})
	for _, want := range []string{`"operation_id"`, `"method"`, `"path"`, `"summary"`, `"tag"`, `"module": "m2"`} {
		if !strings.Contains(out, want) {
			t.Errorf("snake_case field %s missing: %s", want, out)
		}
	}
	for _, goCased := range []string{"OperationID", "Method", "Path", "Summary", "Tag"} {
		if strings.Contains(out, `"`+goCased+`"`) {
			t.Errorf("Go-cased field %q leaked into JSON: %s", goCased, out)
		}
	}
	out = callText(t, sess, "list_operations", map[string]any{"module": "m2"})
	if !strings.Contains(out, "linkAddContexts") {
		t.Errorf("module filter dropped the operation: %s", out)
	}
	out = callText(t, sess, "list_operations", map[string]any{"q": "add-contexts"})
	if !strings.Contains(out, "linkAddContexts") {
		t.Errorf("q filter missed the path substring: %s", out)
	}
	out = callText(t, sess, "list_operations", map[string]any{"q": "no-such-thing"})
	if strings.Contains(out, "linkAddContexts") {
		t.Errorf("q filter matched everything: %s", out)
	}
}

func TestListOperationsTruncatesUnfiltered(t *testing.T) {
	// Build a snapshot with more operations than the unfiltered cap.
	atoms := fixtureAtoms()
	ops := make([]catalogue.Operation, 0, 70)
	for i := 0; i < 70; i++ {
		ops = append(ops, catalogue.Operation{
			OperationID: fmt.Sprintf("op%03d", i), Method: "GET",
			Path: fmt.Sprintf("/things/%03d", i), Summary: "Thing",
			Tag: "things", Module: "m1",
			SpecJSON: []byte(`{}`), RequiredParams: nil,
		})
	}
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	meta := index.Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z"}
	if err := index.Build(dbPath, atoms, ops, nil, nil, meta); err != nil {
		t.Fatal(err)
	}
	r, err := index.Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	srv := NewMCPServer(r, nil)
	ct, st := mcp.NewInMemoryTransports()
	if _, err := srv.Connect(context.Background(), st, nil); err != nil {
		t.Fatal(err)
	}
	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "0"}, nil)
	sess, err := client.Connect(context.Background(), ct, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { sess.Close() })

	out := callText(t, sess, "list_operations", map[string]any{})
	var payload struct {
		Operations []map[string]any `json:"operations"`
		Truncated  string           `json:"truncated"`
	}
	if err := json.Unmarshal([]byte(out), &payload); err != nil {
		t.Fatalf("not JSON: %v\n%s", err, out)
	}
	if len(payload.Operations) != 60 {
		t.Errorf("unfiltered rows = %d, want cap of 60", len(payload.Operations))
	}
	if payload.Truncated != "10 more; filter by tag, module or q" {
		t.Errorf("truncated = %q", payload.Truncated)
	}

	// A filtered listing is never truncated.
	out = callText(t, sess, "list_operations", map[string]any{"module": "m1"})
	if err := json.Unmarshal([]byte(out), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Operations) != 70 || strings.Contains(out, "truncated") {
		t.Errorf("filtered listing should be complete: %d rows", len(payload.Operations))
	}
}

func TestCatalogueInfo(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "catalogue_info", map[string]any{})
	if !strings.Contains(out, "2026.08.24") || !strings.Contains(out, "\"embeddings\": false") {
		t.Errorf("info payload: %s", out)
	}
}

func TestValidateRequest(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "validate_request", map[string]any{
		"operation_id": "linkAddContexts",
		"body":         `{"abhaNumber":"91-1234"}`,
	})
	if !strings.Contains(out, `"valid": true`) || !strings.Contains(out, "X-HIP-ID (header)") {
		t.Errorf("valid body rejected: %s", out)
	}
	out = callText(t, sess, "validate_request", map[string]any{
		"operation_id": "linkAddContexts",
		"body":         `{"count":"not-a-number"}`,
	})
	if !strings.Contains(out, `"valid": false`) {
		t.Errorf("invalid body accepted: %s", out)
	}
	out = callText(t, sess, "validate_request", map[string]any{
		"operation_id": "linkAddContexts",
		"body":         `{not json`,
	})
	if !strings.Contains(out, "not valid JSON") {
		t.Errorf("want honest bad-JSON answer: %s", out)
	}
}

func TestListAtomsAndGetOperation(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "list_atoms", map[string]any{"type": "error"})
	if !strings.Contains(out, "hiecm.error.abdm-1035") {
		t.Errorf("list_atoms: %s", out)
	}
	out = callText(t, sess, "get_operation", map[string]any{"operation_id": "linkAddContexts"})
	if !strings.Contains(out, "Add care contexts") || !strings.Contains(out, "catalogue_version") {
		t.Errorf("get_operation: %s", out)
	}
}
