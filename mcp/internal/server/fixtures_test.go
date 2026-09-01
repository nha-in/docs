package server

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	"github.com/eka-care/abdm-docs/mcp/internal/fhir"
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
			// One fixture carries a published page so the contract covers a
			// citation that resolves, not only the empty case.
			DocURL: "/docs/hiecm/v3/reference/error-codes", DocAnchor: "m2-linking-and-sharing",
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

// fixtureFHIRDigests returns one NRCES profile digest, mirroring the shape
// Task 4's writer_test withFHIR fixture uses: enough for list_fhir_profiles
// and get_fhir_profile to have something real to read.
func fixtureFHIRDigests() []fhir.ProfileDigest {
	return []fhir.ProfileDigest{{
		RecordType:  "OPConsultation",
		ProfileName: "OPConsultRecord",
		URL:         "https://nrces.in/ndhm/fhir/r4/StructureDefinition/OPConsultRecord",
		Title:       "OP Consult Record",
		Description: "A record of an outpatient consultation.",
		Required:    []fhir.ElementRule{{Path: "Composition.author", Min: 1}},
		Sections:    []fhir.SectionRule{{Slice: "ChiefComplaints", Min: 0, Max: "1"}},
	}}
}

// fixtureFHIRExamples returns one known-good document bundle keyed by hiType,
// for get_fhir_example.
func fixtureFHIRExamples() map[string][]byte {
	return map[string][]byte{
		"OPConsultation": []byte(`{"resourceType":"Bundle","type":"document","timestamp":"2020-07-09T15:32:26.605+05:30","identifier":{"system":"https://example.com/bundle","value":"1"},"entry":[{"fullUrl":"Composition/1","resource":{"resourceType":"Composition","id":"1"}}]}`),
	}
}

// buildServerFixtureDB builds the same two-atom, one-operation snapshot
// the index tests use, assembled via the exported catalogue, embed and
// index APIs, plus one FHIR profile digest and one FHIR example so the
// three FHIR read tools have fixture data to read. withVectors selects the
// fake-embedded or keyword-only variant.
func buildServerFixtureDB(t *testing.T, withVectors bool) string {
	t.Helper()
	atoms := fixtureAtoms()
	var chunks []index.EmbeddedChunk
	meta := index.Meta{CatalogueVersion: "2026.08.24", BuiltAt: "2026-08-24T00:00:00Z",
		SourceHashes:  map[string]string{"openapi/hiecm-v3.yaml": "abc"},
		FHIRIGVersion: "0.7.2"}
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
	if err := index.Build(dbPath, atoms, fixtureOps(), fixtureSpecErrors(),
		fixtureFHIRDigests(), fixtureFHIRExamples(), chunks, meta); err != nil {
		t.Fatal(err)
	}
	return dbPath
}
