package catalogue

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"testing"
)

func writeSkill(t *testing.T, dir, name, router string, refs map[string]string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Join(dir, name), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, name, "SKILL.md"), []byte(router), 0o644); err != nil {
		t.Fatal(err)
	}
	if len(refs) == 0 {
		return
	}
	refDir := filepath.Join(dir, name, "references")
	if err := os.MkdirAll(refDir, 0o755); err != nil {
		t.Fatal(err)
	}
	for f, body := range refs {
		if err := os.WriteFile(filepath.Join(refDir, f), []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
}

func TestLoadSkillsReadsRouterAndSections(t *testing.T) {
	dir := t.TempDir()
	writeSkill(t, dir, "abdm-m1",
		"---\nname: abdm-m1\ndescription: Use when building M1.\n---\n\n# M1\n\nRouter body.\n",
		map[string]string{"scaffold.md": "# Scaffold\n\nStep one.\n", "debug.md": "# Debug\n\nCodes.\n"})

	got, err := LoadSkills(dir)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 3 {
		t.Fatalf("loaded %d sections, want 3: %+v", len(got), got)
	}
	// The router sorts first because its section is empty.
	if got[0].Section != "" || got[0].Name != "abdm-m1" {
		t.Errorf("first section = %+v, want the router", got[0])
	}
	if got[0].Description != "Use when building M1." {
		t.Errorf("description = %q", got[0].Description)
	}
	if got[0].Body != "# M1\n\nRouter body." {
		t.Errorf("router body = %q, want the frontmatter stripped", got[0].Body)
	}
	if got[1].Section != "debug" || got[2].Section != "scaffold" {
		t.Errorf("sections = %q, %q, want debug then scaffold", got[1].Section, got[2].Section)
	}
	// Every section carries the skill's description, so a client listing
	// sections can say what the skill is for without fetching the router.
	if got[1].Description != got[0].Description {
		t.Errorf("section description = %q, want the skill's", got[1].Description)
	}
}

// A skill folder whose SKILL.md is missing is a compile that went wrong.
// Skipping it silently would tell an integrator the module does not exist.
func TestLoadSkillsFailsOnMissingRouter(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "abdm-m9"), 0o755); err != nil {
		t.Fatal(err)
	}
	if _, err := LoadSkills(dir); err == nil {
		t.Fatal("want an error for a skill folder with no SKILL.md")
	}
}

// The folder name is the address on every surface, so frontmatter that
// disagrees with it would make the skill reachable under two names.
func TestLoadSkillsFailsOnNameMismatch(t *testing.T) {
	dir := t.TempDir()
	writeSkill(t, dir, "abdm-m1", "---\nname: abdm-m2\n---\n\nbody\n", nil)
	if _, err := LoadSkills(dir); err == nil {
		t.Fatal("want an error when frontmatter name differs from the folder")
	}
}

// Every compiled SKILL.md the repository ships has a colon inside its
// unquoted description, which is not valid YAML. A strict parse rejected all
// twelve skills, so the lenient read is load bearing.
func TestLoadSkillsAcceptsColonInDescription(t *testing.T) {
	dir := t.TempDir()
	writeSkill(t, dir, "abdm-fhir",
		"---\nname: abdm-fhir\ndescription: Use when checking FHIR for ABDM: building bundles.\n---\n\nbody\n",
		nil)
	got, err := LoadSkills(dir)
	if err != nil {
		t.Fatal(err)
	}
	want := "Use when checking FHIR for ABDM: building bundles."
	if got[0].Description != want {
		t.Errorf("description = %q, want %q", got[0].Description, want)
	}
}

func TestLoadSkillsMissingDirIsNotExist(t *testing.T) {
	// The indexer treats an absent skills directory as "no prompts", not
	// as a failed build, so the error it returns has to stay unwrappable
	// to fs.ErrNotExist through the context this adds.
	_, err := LoadSkills(filepath.Join(t.TempDir(), "absent"))
	if !errors.Is(err, fs.ErrNotExist) {
		t.Fatalf("err = %v, want one errors.Is(fs.ErrNotExist) matches", err)
	}
}
