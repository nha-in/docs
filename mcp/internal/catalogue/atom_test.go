package catalogue

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func readFixture(t *testing.T, rel string) []byte {
	t.Helper()
	b, err := os.ReadFile(filepath.Join("testdata", "catalogue", rel))
	if err != nil {
		t.Fatal(err)
	}
	return b
}

func TestParseAtomError(t *testing.T) {
	rel := filepath.Join("hiecm", "errors", "abdm-1035.md")
	a, err := ParseAtom(rel, readFixture(t, rel))
	if err != nil {
		t.Fatal(err)
	}
	if a.ID != "hiecm.error.abdm-1035" || a.Type != "error" || a.Milestone != "M2" {
		t.Errorf("frontmatter mismatch: %+v", a)
	}
	if a.VerificationStatus != "verified" {
		t.Errorf("status = %q, want verified", a.VerificationStatus)
	}
	if want := []string{"ABDM-1035"}; !reflect.DeepEqual(a.ErrorCodes, want) {
		t.Errorf("ErrorCodes = %v, want %v", a.ErrorCodes, want)
	}
}

func TestParseAtomRelatedAndCodes(t *testing.T) {
	rel := filepath.Join("hiecm", "flows", "m2-link-care-context.md")
	a, err := ParseAtom(rel, readFixture(t, rel))
	if err != nil {
		t.Fatal(err)
	}
	if want := []string{"ABDM-1035", "ABDM-1037"}; !reflect.DeepEqual(a.ErrorCodes, want) {
		t.Errorf("ErrorCodes = %v, want %v", a.ErrorCodes, want)
	}
	if want := []string{"hiecm.error.abdm-1035"}; !reflect.DeepEqual(a.Related["errors"], want) {
		t.Errorf("Related[errors] = %v, want %v", a.Related["errors"], want)
	}
	if want := []string{"hiecm.endpoint.link-add-contexts"}; !reflect.DeepEqual(a.Related["endpoints"], want) {
		t.Errorf("Related[endpoints] = %v, want %v", a.Related["endpoints"], want)
	}
}

func TestParseAtomRejectsMissingFrontmatter(t *testing.T) {
	if _, err := ParseAtom("x.md", []byte("no frontmatter here")); err == nil {
		t.Fatal("want error for missing frontmatter")
	}
}

func TestParseAtomRejectsMissingID(t *testing.T) {
	src := []byte("---\ntype: concept\ntitle: t\n---\nbody")
	if _, err := ParseAtom("x.md", src); err == nil {
		t.Fatal("want error for missing id")
	}
}

// An atom must never carry its own route. It is authored before the site is
// built and is not published one to one as a page, so a route in frontmatter
// would be a guess that rots. Routes come from catalogue/atom-routes.json,
// applied by the indexer.
func TestParseAtomIgnoresAnyRouteInFrontmatter(t *testing.T) {
	content := []byte("---\nid: a.b.c\ndocs:\n  url: /docs/somewhere\n---\n\n# Body\n")
	a, err := ParseAtom("x.md", content)
	if err != nil {
		t.Fatal(err)
	}
	if a.DocURL != "" || a.DocAnchor != "" {
		t.Errorf("DocURL=%q DocAnchor=%q, want both empty: an atom may not declare a route",
			a.DocURL, a.DocAnchor)
	}
}
