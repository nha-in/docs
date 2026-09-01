package index

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
	"github.com/eka-care/abdm-docs/mcp/internal/fhir"
	_ "modernc.org/sqlite"
)

type EmbeddedChunk struct {
	catalogue.Chunk
	Vector []float32
}

type Meta struct {
	CatalogueVersion string
	BuiltAt          string
	EmbeddingModel   string
	EmbeddingDim     int
	SourceHashes     map[string]string
	FHIRIGVersion    string
	// Vocabulary is catalogue/shared/vocabulary.yaml verbatim, carried in
	// the index so the server needs the database and nothing else. Empty
	// when the file is absent, and search then behaves as it did before.
	Vocabulary string
}

func Build(dbPath string, atoms []catalogue.Atom, ops []catalogue.Operation,
	specErrors []catalogue.SpecErrorCode, fhirDigests []fhir.ProfileDigest,
	fhirExamples map[string][]byte, chunks []EmbeddedChunk, meta Meta) error {
	_ = os.Remove(dbPath)
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return err
	}
	defer db.Close()
	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("create schema: %w", err)
	}
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	for _, a := range atoms {
		if _, err := tx.Exec(`INSERT INTO atoms VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
			a.ID, a.Type, a.Gateway, a.Milestone, a.Title, a.Summary,
			a.VerificationStatus, a.Body, a.SourcePath, a.DocURL, a.DocAnchor); err != nil {
			return fmt.Errorf("atom %s: %w", a.ID, err)
		}
		if _, err := tx.Exec(
			`INSERT INTO atoms_fts (id, title, summary, body, error_codes) VALUES (?,?,?,?,?)`,
			a.ID, a.Title, a.Summary, a.Body, strings.Join(a.ErrorCodes, " ")); err != nil {
			return fmt.Errorf("atom fts %s: %w", a.ID, err)
		}
		for relation, ids := range a.Related {
			for _, to := range ids {
				if _, err := tx.Exec(`INSERT INTO related VALUES (?,?,?)`,
					a.ID, relation, to); err != nil {
					return err
				}
			}
		}
		for _, code := range a.ErrorCodes {
			if _, err := tx.Exec(`INSERT INTO atom_error_codes VALUES (?,?)`,
				code, a.ID); err != nil {
				return err
			}
		}
	}
	for _, o := range ops {
		reqParams, err := json.Marshal(o.RequiredParams)
		if err != nil {
			return err
		}
		var reqSchema any
		if o.RequestSchemaJSON != nil {
			reqSchema = string(o.RequestSchemaJSON)
		}
		if _, err := tx.Exec(`INSERT INTO operations VALUES (?,?,?,?,?,?,?,?,?)`,
			o.OperationID, o.Method, o.Path, o.Summary, o.Tag, o.Module,
			string(o.SpecJSON), reqSchema, string(reqParams)); err != nil {
			return fmt.Errorf("operation %s: %w", o.OperationID, err)
		}
	}
	for _, e := range specErrors {
		if _, err := tx.Exec(`INSERT INTO spec_error_codes VALUES (?,?,?,?)`,
			catalogue.NormalizeErrorCode(e.Code), e.Message, e.Action, e.Module); err != nil {
			return fmt.Errorf("spec error code %s: %w", e.Code, err)
		}
	}
	for _, c := range chunks {
		var blob any
		if c.Vector != nil {
			blob = vecToBlob(c.Vector)
		}
		if _, err := tx.Exec(
			`INSERT INTO chunks (atom_id, heading, text, embedding) VALUES (?,?,?,?)`,
			c.AtomID, c.Heading, c.Text, blob); err != nil {
			return fmt.Errorf("chunk for %s: %w", c.AtomID, err)
		}
	}
	for _, kv := range [][2]string{
		{"catalogue_version", meta.CatalogueVersion},
		{"built_at", meta.BuiltAt},
		{"embedding_model", meta.EmbeddingModel},
		{"embedding_dim", strconv.Itoa(meta.EmbeddingDim)},
		{"fhir_ig_version", meta.FHIRIGVersion},
		{"vocabulary", meta.Vocabulary},
	} {
		if _, err := tx.Exec(`INSERT INTO meta VALUES (?,?)`, kv[0], kv[1]); err != nil {
			return err
		}
	}
	for p, h := range meta.SourceHashes {
		if _, err := tx.Exec(`INSERT INTO sources VALUES (?,?)`, p, h); err != nil {
			return err
		}
	}
	for _, d := range fhirDigests {
		digestJSON, err := json.Marshal(d)
		if err != nil {
			return fmt.Errorf("fhir digest %s: %w", d.ProfileName, err)
		}
		if _, err := tx.Exec(`INSERT INTO fhir_profiles VALUES (?,?,?,?,?)`,
			d.ProfileName, d.RecordType, d.URL, d.Title, string(digestJSON)); err != nil {
			return fmt.Errorf("fhir profile %s: %w", d.ProfileName, err)
		}
	}
	for recordType, bundle := range fhirExamples {
		if _, err := tx.Exec(`INSERT INTO fhir_examples VALUES (?,?)`,
			recordType, string(bundle)); err != nil {
			return fmt.Errorf("fhir example %s: %w", recordType, err)
		}
	}
	return tx.Commit()
}
