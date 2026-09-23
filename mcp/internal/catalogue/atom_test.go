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

// M4 answers with HIS codes and the PHR side with AS codes. Both were absent
// from the pattern, so decode_error found nothing in a response an integrator
// pasted, for every code outside the ABDM series.
func TestExtractErrorCodesCoversRegistryAndPHRSeries(t *testing.T) {
	for _, tc := range []struct {
		in   string
		want string
	}{
		{`{"code":"HIS-1132","message":"duplicate facility detected"}`, "HIS-1132"},
		{"AS-1038 the entered OTP is incorrect", "AS-1038"},
		{"ABDM-1035", "ABDM-1035"},
		{`{"code":"900901","message":"Invalid Credentials"}`, "900901"},
		{`{"error":{"code": 900902}}`, "900902"},
	} {
		got := ExtractErrorCodes(tc.in)
		if len(got) != 1 || got[0] != tc.want {
			t.Errorf("ExtractErrorCodes(%q) = %v, want [%s]", tc.in, got, tc.want)
		}
	}
	if got := ExtractErrorCodes("OTP 900901 sent at 1726560000"); len(got) != 0 {
		t.Errorf("a bare number outside a code field is not a code, got %v", got)
	}
	if got := ExtractErrorCodes("no codes here"); len(got) != 0 {
		t.Errorf("expected no codes, got %v", got)
	}
}

// The claims exchange answers in three shapes and none was in the pattern: the
// exchange's own NHCX codes, the payer's PAYR codes, and the one ERR-PYR code
// the scheme's payer sends. A refusal arrives as a ProtocolResponse carrying
// x-hcx-error_details, which is what an integrator pastes.
func TestExtractErrorCodesCoversTheClaimsExchange(t *testing.T) {
	for _, tc := range []struct {
		in   string
		want string
	}{
		{"PAYR-1238", "PAYR-1238"},
		{`{"type":"ProtocolResponse","x-hcx-error_details":{"code":"PAYR-1008","message":"Invalid content type"}}`, "PAYR-1008"},
		{"NHCX-1006 the correlation id was already used", "NHCX-1006"},
		{"ERR-PYR-CLM-007 No prior preauthorization or claim record found", "ERR-PYR-CLM-007"},
	} {
		got := ExtractErrorCodes(tc.in)
		if len(got) != 1 || got[0] != tc.want {
			t.Errorf("ExtractErrorCodes(%q) = %v, want [%s]", tc.in, got, tc.want)
		}
	}
	// A workflow id or a participant code is not an error code.
	for _, in := range []string{"workflow 161 on PMJAY", "1518@hcx", "ERR-PYR"} {
		if got := ExtractErrorCodes(in); len(got) != 0 {
			t.Errorf("ExtractErrorCodes(%q) = %v, want none", in, got)
		}
	}
}
