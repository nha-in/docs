package catalogue

import (
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// LoadAtoms walks catDir and parses every atom in it, applying the same
// skip rules the indexer always has: .raw is upstream source, not content;
// annexure/ documents sources atoms cite rather than atoms themselves;
// openapi/*.md is spec-area documentation, not an atom; and README.md is a
// contributor note for the folder it sits in, not an atom.
func LoadAtoms(catDir string) ([]Atom, error) {
	var atoms []Atom
	err := filepath.WalkDir(catDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			// .raw holds untouched upstream files; they are sources, not content.
			if d.Name() == ".raw" {
				return filepath.SkipDir
			}
			// Annexure records document sources that atoms cite, not atoms themselves, so they carry no atom frontmatter.
			if d.Name() == "annexure" {
				return filepath.SkipDir
			}
			return nil
		}
		rel, _ := filepath.Rel(catDir, path)
		// Check suffix early to avoid reading non-.md files
		if !strings.HasSuffix(path, ".md") {
			return nil
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		relSlash := filepath.ToSlash(rel)
		switch {
		case strings.HasSuffix(path, ".md") && (relSlash == "openapi" || strings.HasPrefix(relSlash, "openapi/")):
			// Spec-area documentation (e.g. openapi/CONVENTIONS.md) is not an atom
			// and is not hashed; skip it silently.
			return nil
		case strings.HasSuffix(path, string(os.PathSeparator)+"README.md") || relSlash == "README.md":
			// READMEs are contributor notes for the folder they sit in, not
			// atoms; skip them silently wherever they are.
			return nil
		case strings.HasSuffix(path, ".md"):
			a, err := ParseAtom(rel, content)
			if err != nil {
				return err
			}
			atoms = append(atoms, a)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return atoms, nil
}

// IntegratorAtoms drops the atoms written for contributors to this
// catalogue rather than for integrators of ABDM. The distinction is not
// cosmetic: everything the snapshot carries is reachable through the MCP
// server's search_docs, list_atoms and get_atom, and through the site's
// Ask AI panel, so a note about this repository's own retrieval design is
// an answer an integrator can be given to a question about ABDM.
func IntegratorAtoms(atoms []Atom) []Atom {
	kept := atoms[:0:0]
	for _, a := range atoms {
		if a.Audience == "contributor" {
			continue
		}
		kept = append(kept, a)
	}
	return kept
}
