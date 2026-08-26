package index

import (
	"context"
	"database/sql"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	_ "modernc.org/sqlite"
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
			Related: map[string][]string{
				"errors":    {"hiecm.error.abdm-1035"},
				"endpoints": {"hiecm.endpoint.m1-enrolment-by-aadhaar"},
			},
		},
		{
			ID: "hiecm.endpoint.m1-enrolment-by-aadhaar", Type: "endpoint", Gateway: "hiecm",
			Milestone: "M1", Title: "Enrol an ABHA by Aadhaar",
			Summary: "POST enrol/byAadhaar creates an ABHA from an Aadhaar OTP.", VerificationStatus: "unverified",
			Body:       "## In plain words\n\nSend the encrypted Aadhaar OTP to enrol.",
			SourcePath: "hiecm/endpoints/m1-enrolment-by-aadhaar.md",
			Related:    map[string][]string{},
		},
	}
}

func fixtureOps() []catalogue.Operation {
	return []catalogue.Operation{{
		OperationID: "linkAddContexts", Method: "POST",
		Path: "/links/link/add-contexts", Summary: "Add care contexts",
		Tag: "links", Module: "m2", SpecJSON: []byte(`{"summary":"Add care contexts"}`),
		RequestSchemaJSON: []byte(`{"type":"object","required":["abhaNumber"],"properties":{"abhaNumber":{"type":"string"},"count":{"type":"integer"}}}`),
		RequiredParams:    []string{"X-HIP-ID (header)"},
	}}
}

func fixtureSpecErrors() []catalogue.SpecErrorCode {
	return []catalogue.SpecErrorCode{
		{Code: "ABDM-1016", Message: "Dependent service unavailable",
			Action: "Retry with backoff", Module: "m1"},
		{Code: "ABDM-1035", Message: "Facility is not registered with the bridge",
			Action: "Fix onboarding", Module: "m2"},
	}
}


// buildFixtureDB builds a snapshot; withVectors selects the fake-embedded
// or the keyword-only variant. Reused by reader and server tests.
func buildFixtureDB(t *testing.T, withVectors bool) string {
	t.Helper()
	atoms := fixtureAtoms()
	var chunks []EmbeddedChunk
	meta := Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z",
		SourceHashes: map[string]string{"openapi/hiecm-v3.yaml": "abc"}}
	for _, a := range atoms {
		for _, c := range catalogue.ChunkAtom(a) {
			chunks = append(chunks, EmbeddedChunk{Chunk: c})
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
	if err := Build(dbPath, atoms, fixtureOps(), fixtureSpecErrors(), chunks, meta); err != nil {
		t.Fatal(err)
	}
	return dbPath
}

func TestBuildWritesAllTables(t *testing.T) {
	db, err := sql.Open("sqlite", buildFixtureDB(t, true))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	for query, want := range map[string]int{
		"SELECT count(*) FROM atoms":            3,
		"SELECT count(*) FROM atoms_fts":        3,
		"SELECT count(*) FROM operations":       1,
		"SELECT count(*) FROM related":          2,
		"SELECT count(*) FROM atom_error_codes": 2,
		"SELECT count(*) FROM spec_error_codes": 2,
		"SELECT count(*) FROM sources":          1,
	} {
		var n int
		if err := db.QueryRow(query).Scan(&n); err != nil {
			t.Fatalf("%s: %v", query, err)
		}
		if n != want {
			t.Errorf("%s = %d, want %d", query, n, want)
		}
	}
	var nChunks int
	if err := db.QueryRow("SELECT count(*) FROM chunks WHERE embedding IS NOT NULL").Scan(&nChunks); err != nil {
		t.Fatal(err)
	}
	if nChunks == 0 {
		t.Error("no embedded chunks written")
	}
	var model string
	if err := db.QueryRow("SELECT value FROM meta WHERE key='embedding_model'").Scan(&model); err != nil {
		t.Fatal(err)
	}
	if model != "fake-64" {
		t.Errorf("embedding_model = %q", model)
	}
}

func TestBuildNormalizesSpecErrorCodes(t *testing.T) {
	// Real-world tables and responses carry noise such as a trailing
	// colon and space; the stored code must be the clean upper-case form.
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	specErrs := []catalogue.SpecErrorCode{
		{Code: "abdm-1016: ", Message: "m", Action: "a", Module: "m1"},
	}
	meta := Meta{CatalogueVersion: "v", BuiltAt: "t"}
	if err := Build(dbPath, nil, nil, specErrs, nil, meta); err != nil {
		t.Fatal(err)
	}
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	var code string
	if err := db.QueryRow(`SELECT code FROM spec_error_codes`).Scan(&code); err != nil {
		t.Fatal(err)
	}
	if code != "ABDM-1016" {
		t.Errorf("stored code = %q, want ABDM-1016", code)
	}
}

func TestVectorRoundTrip(t *testing.T) {
	v := []float32{1.5, -2.25, 0}
	got := blobToVec(vecToBlob(v))
	if len(got) != 3 || got[0] != 1.5 || got[1] != -2.25 || got[2] != 0 {
		t.Errorf("round trip = %v", got)
	}
}
