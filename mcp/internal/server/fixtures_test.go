package server

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/index"
)

func fixtureAtoms() []catalogue.Atom {
	return []catalogue.Atom{
		{
			ID: "hiecm.error.abdm-1035", Type: "error", Gateway: "hiecm",
			Milestone: "M2", Title: "ABDM-1035 facility not onboarded",
			Summary: "The gateway rejected the call.", VerificationStatus: "verified",
			Body:       "## In plain words\n\nThe gateway does not recognise your facility. ABDM-1035 means the X-HIP-ID is not registered.",
			SourcePath: "hiecm/errors/abdm-1035.md",
			ErrorCodes: []string{"ABDM-1035"}, Related: map[string][]string{},
		},
		{
			ID: "hiecm.flow.m2-link-care-context", Type: "flow", Gateway: "hiecm",
			Milestone: "M2", Title: "Link a care context",
			Summary: "Tell ABDM about a visit.", VerificationStatus: "unverified",
			Body:       "## In plain words\n\nLinking makes a visit discoverable.",
			SourcePath: "hiecm/flows/m2-link-care-context.md",
			ErrorCodes: []string{"ABDM-1035"},
			Related:    map[string][]string{"errors": {"hiecm.error.abdm-1035"}},
		},
	}
}

func fixtureOps() []catalogue.Operation {
	return []catalogue.Operation{{
		OperationID: "linkAddContexts", Method: "POST",
		Path: "/links/link/add-contexts", Summary: "Add care contexts",
		Tag: "links", SpecJSON: []byte(`{"summary":"Add care contexts"}`),
		RequestSchemaJSON: []byte(`{"type":"object","required":["abhaNumber"],"properties":{"abhaNumber":{"type":"string"},"count":{"type":"integer"}}}`),
		RequiredParams:    []string{"X-HIP-ID (header)"},
	}}
}

// buildServerFixtureDB builds the same two-atom, one-operation snapshot
// the index tests use, assembled via the exported catalogue, embed and
// index APIs. withVectors selects the fake-embedded or keyword-only
// variant.
func buildServerFixtureDB(t *testing.T, withVectors bool) string {
	t.Helper()
	atoms := fixtureAtoms()
	var chunks []index.EmbeddedChunk
	meta := index.Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z",
		SourceHashes: map[string]string{"openapi/hiecm-v3.yaml": "abc"}}
	for _, a := range atoms {
		for _, c := range catalogue.ChunkAtom(a) {
			chunks = append(chunks, index.EmbeddedChunk{Chunk: c})
		}
	}
	if withVectors {
		f := embed.NewFake(64)
		var texts []string
		for _, c := range chunks {
			texts = append(texts, c.Text)
		}
		vecs, err := f.Embed(context.Background(), texts)
		if err != nil {
			t.Fatal(err)
		}
		for i := range chunks {
			chunks[i].Vector = vecs[i]
		}
		meta.EmbeddingModel = f.Model()
		meta.EmbeddingDim = 64
	} else {
		chunks = nil
	}
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	if err := index.Build(dbPath, atoms, fixtureOps(), chunks, meta); err != nil {
		t.Fatal(err)
	}
	return dbPath
}
