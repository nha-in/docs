// Package servertest builds a minimal, real catalogue.db snapshot for tests
// outside the server package that need genuine server.ToolDef instances --
// the chat loop tests (Task 5) in particular. It is deliberately independent
// of the server package's own unexported test fixtures
// (internal/server/fixtures_test.go): those live in _test.go files and
// cannot be imported from another package, so this package assembles its
// own small snapshot using the same exported catalogue/index/embed APIs.
package servertest

import (
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
)

// Reader builds a fresh one-atom, one-operation snapshot in a temp dir and
// opens it, closing it automatically at the end of the test. Search runs
// keyword-only (no embedded chunks), which is enough for the chat loop's
// scripted tool calls.
func Reader(t *testing.T) *index.Reader {
	t.Helper()
	atoms := []catalogue.Atom{
		{
			ID: "hiecm.error.abdm-1035", Type: "error", Gateway: "hiecm",
			Milestone: "M2", Title: "ABDM-1035 facility not onboarded",
			Summary:            "The gateway rejected the call.",
			VerificationStatus: "verified",
			Body:               "## In plain words\n\nThe gateway does not recognise your facility. ABDM-1035 means the X-HIP-ID header is not registered. Every timestamp in the response is ISO 8601 UTC.",
			SourcePath:         "hiecm/errors/abdm-1035.md",
			ErrorCodes:         []string{"ABDM-1035"},
			Related:            map[string][]string{},
		},
	}
	ops := []catalogue.Operation{{
		OperationID: "linkAddContexts", Method: "POST",
		Path: "/links/link/add-contexts", Summary: "Add care contexts",
		Tag: "links", Module: "m2", SpecJSON: []byte(`{"summary":"Add care contexts"}`),
		RequiredParams: []string{"X-HIP-ID (header)"},
	}}
	specErrors := []catalogue.SpecErrorCode{
		{Code: "ABDM-1035", Message: "Facility is not registered with the bridge",
			Action: "Fix onboarding", Module: "m2"},
	}
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	meta := index.Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z"}
	if err := index.Build(dbPath, atoms, ops, specErrors, nil, meta); err != nil {
		t.Fatal(err)
	}
	r, err := index.Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })
	return r
}
