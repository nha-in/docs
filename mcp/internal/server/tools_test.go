package server

import (
	"context"
	"encoding/json"
	"testing"
)

func TestToolDefsMatchMCP(t *testing.T) {
	r := fixtureReader(t, false)
	defs := NewTools(r, nil).Defs()
	want := []string{"search_docs", "get_atom", "related_atoms", "decode_error",
		"list_operations", "get_operation", "catalogue_info"}
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
