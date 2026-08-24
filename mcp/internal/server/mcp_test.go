package server

import (
	"context"
	"encoding/json"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
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

func TestRelatedAtoms(t *testing.T) {
	sess := connect(t, false, nil)
	out := callText(t, sess, "related_atoms", map[string]any{"id": "hiecm.flow.m2-link-care-context"})
	if !strings.Contains(out, "hiecm.error.abdm-1035") || !strings.Contains(out, "errors") {
		t.Errorf("graph walk missing error relation: %s", out)
	}
}

func TestDecodeError(t *testing.T) {
	sess := connect(t, false, nil)
	raw := `{"error":{"code":"ABDM-1035","message":"facility not onboarded"}}`
	out := callText(t, sess, "decode_error", map[string]any{"input": raw})
	if !strings.Contains(out, "hiecm.error.abdm-1035") {
		t.Errorf("decode failed: %s", out)
	}
	out = callText(t, sess, "decode_error", map[string]any{"input": "nothing here"})
	if !strings.Contains(out, "no error codes") {
		t.Errorf("want honest empty answer, got: %s", out)
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
