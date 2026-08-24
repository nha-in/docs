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
