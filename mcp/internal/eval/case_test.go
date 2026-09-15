package eval

import (
	"os"
	"path/filepath"
	"testing"
)

func writeCase(t *testing.T, dir, slice, name, body string) {
	t.Helper()
	d := filepath.Join(dir, slice)
	if err := os.MkdirAll(d, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(d, name), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
}

const goodCase = `{"id":"define-hmis-01","slice":"define","class":"define",
"turns":[{"role":"user","text":"what is a HIMS"}],"attachment":null,"page":null,
"must_contain":["software a hospital runs"],"must_not_contain":["let me "],
"expected_sources":["shared.glossary.hmis"],"expected_shape":"define",
"expected_behaviour":"answer","derived_from":null,"source_row":"annexure#glossary",
"catalogue_version":"2026.08.24","notes":""}`

func TestLoadCasesReadsAndSorts(t *testing.T) {
	dir := t.TempDir()
	writeCase(t, dir, "define", "define-hmis-01.json", goodCase)
	cases, err := LoadCases(dir)
	if err != nil {
		t.Fatal(err)
	}
	if len(cases) != 1 || cases[0].ID != "define-hmis-01" || cases[0].Class != "define" {
		t.Fatalf("got %+v", cases)
	}
}

func TestLoadCasesRejectsABadEnum(t *testing.T) {
	dir := t.TempDir()
	bad := goodCase[:len(goodCase)-1] // drop the closing brace
	bad = bad + `}`
	bad = replaceOnce(bad, `"class":"define"`, `"class":"question"`)
	writeCase(t, dir, "define", "define-hmis-01.json", bad)
	if _, err := LoadCases(dir); err == nil {
		t.Fatal("a bad class was accepted")
	}
}

func TestLoadCasesRejectsATurnListNotEndingInUser(t *testing.T) {
	dir := t.TempDir()
	bad := replaceOnce(goodCase, `"turns":[{"role":"user","text":"what is a HIMS"}]`,
		`"turns":[{"role":"user","text":"hi"},{"role":"assistant","text":"hello"}]`)
	writeCase(t, dir, "define", "define-hmis-01.json", bad)
	if _, err := LoadCases(dir); err == nil {
		t.Fatal("turns ending in an assistant turn were accepted")
	}
}

func replaceOnce(s, old, new string) string {
	i := len(s)
	for j := 0; j+len(old) <= len(s); j++ {
		if s[j:j+len(old)] == old {
			i = j
			break
		}
	}
	if i == len(s) {
		return s
	}
	return s[:i] + new + s[i+len(old):]
}

func TestNewSlicesAreAccepted(t *testing.T) {
	for _, slice := range []string{"naive", "confusable", "followup", "abstain"} {
		c := Case{
			ID: "x", Slice: slice, Class: "how-do-i",
			Turns:             []Turn{{Role: "user", Text: "q"}},
			MustContain:       []string{"a fact"},
			ExpectedShape:     "how-do-i",
			ExpectedBehaviour: "answer",
			SourceRow:         "annexure#glossary",
			CatalogueVersion:  "2026.08.24",
		}
		if err := c.validate("x.json"); err != nil {
			t.Errorf("slice %q rejected: %v", slice, err)
		}
	}
}
