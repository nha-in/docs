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

// The atoms INSERT is positional, so a column added to the schema without a
// matching value (or the reverse) writes the wrong field into the wrong
// column, or silently drops one. Round-tripping through Build and GetAtom is
// what catches that: it is not visible from a successful build or a passing
// indexer run.
func TestBuildRoundTripsDocLinkColumns(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "c.db")
	atom := catalogue.Atom{
		ID: "hiecm.error.abdm-1035", Type: "error", Gateway: "hiecm",
		Milestone: "M2", Title: "T", Summary: "s", VerificationStatus: "verified",
		Body: "b", SourcePath: "hiecm/errors/abdm-1035.md",
		DocURL: "/docs/hiecm/v3/reference/error-codes", DocAnchor: "m2-linking-and-sharing",
	}
	if err := Build(dbPath, []catalogue.Atom{atom}, nil, nil, nil,
		Meta{CatalogueVersion: "v", BuiltAt: "t"}); err != nil {
		t.Fatal(err)
	}
	r, err := Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	defer r.Close()

	got, err := r.GetAtom(atom.ID)
	if err != nil {
		t.Fatal(err)
	}
	if got.DocURL != atom.DocURL || got.DocAnchor != atom.DocAnchor {
		t.Errorf("round trip lost the link: DocURL=%q DocAnchor=%q, want %q and %q",
			got.DocURL, got.DocAnchor, atom.DocURL, atom.DocAnchor)
	}
	if want := atom.DocURL + "#" + atom.DocAnchor; DocLink(got.DocURL, got.DocAnchor) != want {
		t.Errorf("DocLink = %q, want %q", DocLink(got.DocURL, got.DocAnchor), want)
	}

	// The same columns must survive the list path, which selects its own set.
	refs, err := r.ListAtoms("error", "")
	if err != nil || len(refs) != 1 {
		t.Fatalf("ListAtoms: %v, %d rows", err, len(refs))
	}
	if refs[0].DocURL != atom.DocURL || refs[0].DocAnchor != atom.DocAnchor {
		t.Errorf("ListAtoms lost the link: %+v", refs[0])
	}
}
