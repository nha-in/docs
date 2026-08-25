package main

import (
	"database/sql"
	"os"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/embed"
	_ "modernc.org/sqlite"
)

func fixtureDir() string {
	return filepath.Join("..", "..", "internal", "catalogue", "testdata", "catalogue")
}

func TestRunKeywordOnly(t *testing.T) {
	out := filepath.Join(t.TempDir(), "catalogue.db")
	if err := run(fixtureDir(), out, nil); err != nil {
		t.Fatal(err)
	}
	db, err := sql.Open("sqlite", out)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	counts := map[string]int{}
	for _, q := range []string{"atoms", "operations", "chunks"} {
		var n int
		if err := db.QueryRow("SELECT count(*) FROM " + q).Scan(&n); err != nil {
			t.Fatal(err)
		}
		counts[q] = n
	}
	if counts["atoms"] != 2 || counts["operations"] != 2 {
		t.Errorf("counts = %v", counts)
	}
	if counts["chunks"] != 0 {
		t.Errorf("keyword-only build wrote %d chunks, want 0", counts["chunks"])
	}
}

func TestRunWithEmbedder(t *testing.T) {
	out := filepath.Join(t.TempDir(), "catalogue.db")
	if err := run(fixtureDir(), out, embed.NewFake(32)); err != nil {
		t.Fatal(err)
	}
	db, err := sql.Open("sqlite", out)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	var n int
	if err := db.QueryRow("SELECT count(*) FROM chunks WHERE embedding IS NOT NULL").Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n == 0 {
		t.Error("no embedded chunks")
	}
	var model string
	if err := db.QueryRow("SELECT value FROM meta WHERE key='embedding_model'").Scan(&model); err != nil {
		t.Fatal(err)
	}
	if model != "fake-32" {
		t.Errorf("embedding_model = %q", model)
	}
}

func TestRunSkipsOpenapiMarkdown(t *testing.T) {
	dir := t.TempDir()

	openapiDir := filepath.Join(dir, "openapi")
	if err := os.MkdirAll(openapiDir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(openapiDir, "CONVENTIONS.md"),
		[]byte("This is plain prose with no frontmatter.\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	concepts := filepath.Join(dir, "hiecm", "concepts")
	if err := os.MkdirAll(concepts, 0o755); err != nil {
		t.Fatal(err)
	}
	atom := `---
id: hiecm.concept.sample
type: concept
gateway: hiecm
milestone: M2
title: Sample concept
summary: >
  A sample concept used for testing.
verified:
  status: verified
---

## In plain words

Sample body text.

## When it goes wrong

Not applicable.
`
	if err := os.WriteFile(filepath.Join(concepts, "sample.md"), []byte(atom), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := os.WriteFile(filepath.Join(dir, "VERSION"), []byte("v"), 0o644); err != nil {
		t.Fatal(err)
	}

	out := filepath.Join(dir, "out.db")
	if err := run(dir, out, nil); err != nil {
		t.Fatalf("run() failed: %v", err)
	}

	db, err := sql.Open("sqlite", out)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	var n int
	if err := db.QueryRow("SELECT count(*) FROM atoms").Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Errorf("atoms count = %d, want 1", n)
	}
}

func TestRunSkipsRootReadme(t *testing.T) {
	dir := t.TempDir()

	if err := os.WriteFile(filepath.Join(dir, "README.md"),
		[]byte("This is root documentation with no frontmatter.\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	concepts := filepath.Join(dir, "hiecm", "concepts")
	if err := os.MkdirAll(concepts, 0o755); err != nil {
		t.Fatal(err)
	}
	atom := `---
id: hiecm.concept.sample
type: concept
gateway: hiecm
milestone: M2
title: Sample concept
summary: >
  A sample concept used for testing.
verified:
  status: verified
---

## In plain words

Sample body text.

## When it goes wrong

Not applicable.
`
	if err := os.WriteFile(filepath.Join(concepts, "sample.md"), []byte(atom), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := os.WriteFile(filepath.Join(dir, "VERSION"), []byte("v"), 0o644); err != nil {
		t.Fatal(err)
	}

	out := filepath.Join(dir, "out.db")
	if err := run(dir, out, nil); err != nil {
		t.Fatalf("run() failed: %v", err)
	}

	db, err := sql.Open("sqlite", out)
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	var n int
	if err := db.QueryRow("SELECT count(*) FROM atoms").Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Errorf("atoms count = %d, want 1", n)
	}
}

func TestRunSkipsNestedReadme(t *testing.T) {
	dir := t.TempDir()

	// READMEs anywhere in the catalogue are contributor notes for their
	// folder, never atoms, so a frontmatter-less one must not fail the run.
	concepts := filepath.Join(dir, "hiecm", "concepts")
	if err := os.MkdirAll(concepts, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(concepts, "README.md"),
		[]byte("Nested README with no frontmatter.\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := os.WriteFile(filepath.Join(dir, "VERSION"), []byte("v"), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := run(dir, filepath.Join(dir, "out.db"), nil); err != nil {
		t.Fatalf("nested README.md should be skipped, got: %v", err)
	}
}

func TestRunFailsOnBadAtom(t *testing.T) {
	dir := t.TempDir()
	bad := filepath.Join(dir, "hiecm", "concepts")
	if err := os.MkdirAll(bad, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(bad, "broken.md"), []byte("no frontmatter"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "VERSION"), []byte("v"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := run(dir, filepath.Join(dir, "out.db"), nil); err == nil {
		t.Fatal("want error for broken atom")
	}
}
