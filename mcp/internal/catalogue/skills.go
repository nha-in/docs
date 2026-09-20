package catalogue

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// Skill is one file of one compiled integrator skill. A skill folder is a
// SKILL.md that routes plus a references/ file per job, so a module's
// scaffold loop, its endpoint list, its error table and its test matrix are
// four sections of one skill rather than four skills.
//
// Section is empty on the SKILL.md router and is the file's base name
// otherwise ("scaffold", "integrate", "debug", "test"). Description is the
// SKILL.md frontmatter description, carried on every section so a client
// listing sections can say what the skill is for.
type Skill struct {
	Name        string
	Section     string
	Description string
	Body        string
}

// skillFrontmatter is the subset of a compiled SKILL.md's frontmatter that
// matters here. The compiler writes name and description; nothing else in
// the file is addressed by id the way an atom is.
type skillFrontmatter struct {
	Name        string
	Description string
}

// LoadSkills reads every compiled skill folder under dir. It is deliberately
// strict: a folder without a readable SKILL.md is an error rather than a
// skipped directory, because a skill that silently fails to load is one an
// integrator is told does not exist.
func LoadSkills(dir string) ([]Skill, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("read skills dir: %w", err)
	}
	var skills []Skill
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		name := e.Name()
		routerPath := filepath.Join(dir, name, "SKILL.md")
		raw, err := os.ReadFile(routerPath)
		if err != nil {
			return nil, fmt.Errorf("skill %s: %w", name, err)
		}
		fm, body, err := splitSkill(raw)
		if err != nil {
			return nil, fmt.Errorf("skill %s: %w", name, err)
		}
		// The frontmatter name is what an agent matches on, so a folder
		// whose frontmatter disagrees with it would be addressable under
		// two different names depending on the surface.
		if fm.Name != "" && fm.Name != name {
			return nil, fmt.Errorf("skill %s: frontmatter name is %q", name, fm.Name)
		}
		skills = append(skills, Skill{
			Name:        name,
			Description: fm.Description,
			Body:        body,
		})

		refDir := filepath.Join(dir, name, "references")
		refs, err := os.ReadDir(refDir)
		if os.IsNotExist(err) {
			continue
		}
		if err != nil {
			return nil, fmt.Errorf("skill %s references: %w", name, err)
		}
		for _, r := range refs {
			if r.IsDir() || !strings.HasSuffix(r.Name(), ".md") {
				continue
			}
			rb, err := os.ReadFile(filepath.Join(refDir, r.Name()))
			if err != nil {
				return nil, fmt.Errorf("skill %s: %w", name, err)
			}
			skills = append(skills, Skill{
				Name:        name,
				Section:     strings.TrimSuffix(r.Name(), ".md"),
				Description: fm.Description,
				Body:        strings.TrimSpace(string(rb)),
			})
		}
	}
	sort.Slice(skills, func(i, j int) bool {
		if skills[i].Name != skills[j].Name {
			return skills[i].Name < skills[j].Name
		}
		return skills[i].Section < skills[j].Section
	})
	return skills, nil
}

// splitSkill separates a compiled SKILL.md's frontmatter from its body. A
// skill without frontmatter is not an error: only the router carries it, and
// the description it holds is a convenience rather than a key.
//
// The frontmatter is read line by line rather than as YAML, because it is
// not valid YAML and never has been. The compiler writes descriptions like
// "FHIR for ABDM: building NRCES compliant bundles", and a colon followed by
// a space inside an unquoted scalar is a parse error. Skill loaders read
// this file leniently, so this does too: two keys, one line each, split on
// the first colon. Anything stricter would reject every skill the
// repository ships.
func splitSkill(raw []byte) (skillFrontmatter, string, error) {
	var fm skillFrontmatter
	s := string(raw)
	if !strings.HasPrefix(s, "---\n") {
		return fm, strings.TrimSpace(s), nil
	}
	end := strings.Index(s[4:], "\n---\n")
	if end < 0 {
		return fm, "", fmt.Errorf("unterminated frontmatter")
	}
	for _, line := range strings.Split(s[4:4+end], "\n") {
		key, value, ok := strings.Cut(line, ":")
		if !ok {
			continue
		}
		value = strings.TrimSpace(value)
		switch strings.TrimSpace(key) {
		case "name":
			fm.Name = value
		case "description":
			fm.Description = value
		}
	}
	return fm, strings.TrimSpace(s[4+end+5:]), nil
}
