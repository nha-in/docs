// Package eval is the instrument that scores the Ask AI assistant: cases,
// transcripts, deterministic checks, retrieval metrics, a judge, and the
// scorecard that ties them together. Data lives under evals/askai/ at the
// repository root; this package only reads and writes it.
package eval

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type Attachment struct {
	Name string `json:"name"`
	Text string `json:"text"`
	Kind string `json:"kind"`
}

type Page struct {
	Title    string `json:"title"`
	URL      string `json:"url"`
	Markdown string `json:"markdown"`
}

type Turn struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type Case struct {
	ID                string      `json:"id"`
	Slice             string      `json:"slice"`
	Class             string      `json:"class"`
	Turns             []Turn      `json:"turns"`
	Attachment        *Attachment `json:"attachment"`
	Page              *Page       `json:"page"`
	MustContain       []string    `json:"must_contain"`
	MustNotContain    []string    `json:"must_not_contain"`
	ExpectedSources   []string    `json:"expected_sources"`
	ExpectedShape     string      `json:"expected_shape"`
	ExpectedBehaviour string      `json:"expected_behaviour"`
	DerivedFrom       *string     `json:"derived_from"`
	SourceRow         string      `json:"source_row"`
	CatalogueVersion  string      `json:"catalogue_version"`
	Notes             string      `json:"notes"`
}

var (
	slices     = set("faq-verbatim", "faq-rephrased", "define", "diagnose", "decline", "conversation")
	classes    = set("define", "how-do-i", "diagnose", "compare", "meta", "out-of-scope", "unclear")
	shapes     = set("define", "how-do-i", "diagnose", "compare", "meta", "decline")
	behaviours = set("answer", "decline")
)

func set(vals ...string) map[string]bool {
	m := make(map[string]bool, len(vals))
	for _, v := range vals {
		m[v] = true
	}
	return m
}

func (c *Case) validate(file string) error {
	fail := func(field, why string) error { return fmt.Errorf("%s: %s: %s", file, field, why) }
	if c.ID == "" || c.ID != strings.TrimSuffix(filepath.Base(file), ".json") {
		return fail("id", "must equal the file name")
	}
	if !slices[c.Slice] {
		return fail("slice", "not one of the six slices")
	}
	if !classes[c.Class] {
		return fail("class", "not a known class")
	}
	if !shapes[c.ExpectedShape] {
		return fail("expected_shape", "not a known shape")
	}
	if !behaviours[c.ExpectedBehaviour] {
		return fail("expected_behaviour", "must be answer or decline")
	}
	if len(c.Turns) == 0 || c.Turns[len(c.Turns)-1].Role != "user" {
		return fail("turns", "must end with a user turn")
	}
	if len(c.MustContain) == 0 {
		return fail("must_contain", "must name at least one fact or route")
	}
	if !strings.HasPrefix(c.SourceRow, "annexure#") {
		return fail("source_row", "must cite an annexure row")
	}
	if c.CatalogueVersion == "" {
		return fail("catalogue_version", "required")
	}
	return nil
}

// LoadCases walks dir, reads every .json file, validates each, and returns
// the cases sorted by ID so a run is ordered the same way every time.
func LoadCases(dir string) ([]Case, error) {
	var cases []Case
	err := filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
		if err != nil || d.IsDir() || !strings.HasSuffix(path, ".json") {
			return err
		}
		raw, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		var c Case
		if err := json.Unmarshal(raw, &c); err != nil {
			return fmt.Errorf("%s: %w", path, err)
		}
		if err := c.validate(path); err != nil {
			return err
		}
		cases = append(cases, c)
		return nil
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(cases, func(i, j int) bool { return cases[i].ID < cases[j].ID })
	return cases, nil
}
