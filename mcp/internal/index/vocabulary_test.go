package index

import (
	"path/filepath"
	"runtime"
	"slices"
	"strings"
	"testing"
)

const testVocab = `
- terms: [abdm, ndhm, national digital health mission]
- terms: [hmis, hims, hospital information system, emr]
  note: provider facing software
- terms: [abha address, phr address]
`

func mustParse(t *testing.T) *Vocabulary {
	t.Helper()
	v, err := ParseVocabulary([]byte(testVocab))
	if err != nil {
		t.Fatal(err)
	}
	return v
}

func TestExpandSingleWordSynonym(t *testing.T) {
	got := mustParse(t).Expand("ndhm callback url")
	if !slices.Contains(got, "abdm") {
		t.Errorf("Expand(ndhm) = %v, want it to contain abdm", got)
	}
}

func TestExpandMatchesMultiWordPhrase(t *testing.T) {
	// The phrase spans three tokens. A word-by-word expander misses it,
	// which is the whole reason phrases are matched before words.
	got := mustParse(t).Expand("connecting my hospital information system")
	if !slices.Contains(got, "hmis") {
		t.Errorf("Expand(hospital information system) = %v, want hmis", got)
	}
}

func TestExpandIsCaseInsensitive(t *testing.T) {
	got := mustParse(t).Expand("What is NDHM")
	if !slices.Contains(got, "abdm") {
		t.Errorf("Expand(NDHM) = %v, want abdm", got)
	}
}

func TestExpandOmitsTermsAlreadyPresent(t *testing.T) {
	// Both members of the set are in the query, so there is nothing to add.
	for _, term := range mustParse(t).Expand("abdm and ndhm") {
		if term == "abdm" || term == "ndhm" {
			t.Errorf("Expand returned %q, which the query already contains", term)
		}
	}
}

func TestExpandUnknownTermReturnsNothing(t *testing.T) {
	if got := mustParse(t).Expand("pineapple deployment"); len(got) != 0 {
		t.Errorf("Expand(unknown) = %v, want empty", got)
	}
}

func TestExpandOnNilVocabularyIsSafe(t *testing.T) {
	// The server must run with no vocabulary file present.
	var v *Vocabulary
	if got := v.Expand("ndhm"); len(got) != 0 {
		t.Errorf("nil vocabulary expanded to %v, want empty", got)
	}
}

func TestExpandDoesNotMatchInsideALongerWord(t *testing.T) {
	// "emr" must not fire on "emergency". Substring matching would.
	if got := mustParse(t).Expand("emergency access"); len(got) != 0 {
		t.Errorf("Expand(emergency) = %v, want empty", got)
	}
}

func TestFTSQueryAddsExpansionsAsAlternatives(t *testing.T) {
	q := ftsQuery("ndhm", mustParse(t))
	if !strings.Contains(q, `"abdm"`) {
		t.Errorf("ftsQuery = %q, want it to offer abdm", q)
	}
	if !strings.Contains(q, " OR ") {
		t.Errorf("ftsQuery = %q, want expansions ORed, not ANDed", q)
	}
}

func TestFTSQueryWithoutVocabularyIsUnchanged(t *testing.T) {
	if got, want := ftsQuery("abdm-1035", nil), ftsQuote("abdm-1035"); got != want {
		t.Errorf("ftsQuery without vocabulary = %q, want %q", got, want)
	}
}

func TestShippedVocabularyParses(t *testing.T) {
	// The file the server actually loads must be valid, and must carry the
	// terms the support agent failed on.
	_, thisFile, _, _ := runtime.Caller(0)
	path := filepath.Join(filepath.Dir(thisFile), "..", "..", "..",
		"catalogue", "shared", "vocabulary.yaml")
	v, err := LoadVocabulary(path)
	if err != nil {
		t.Fatal(err)
	}
	for _, term := range []string{"hmis", "health id", "golden card", "ndhm"} {
		if len(v.Expand(term)) == 0 {
			t.Errorf("shipped vocabulary does not expand %q", term)
		}
	}
}
