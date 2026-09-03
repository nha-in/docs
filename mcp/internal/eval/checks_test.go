package eval

import (
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

func answerCase() Case {
	return Case{ID: "define-hmis-01", Slice: "define", Class: "define",
		Turns:       []Turn{{Role: "user", Text: "what is a HIMS"}},
		MustContain: []string{"hospital software"}, MustNotContain: []string{"maybe"},
		ExpectedSources: []string{"shared.glossary.hmis"}, ExpectedShape: "define",
		ExpectedBehaviour: "answer", SourceRow: "annexure#glossary", CatalogueVersion: "2026.08.24"}
}

func TestCheckPassesAGroundedShapedAnswer(t *testing.T) {
	tr := Transcript{CaseID: "define-hmis-01",
		Answer:  "HMIS is the software a hospital runs day to day. NHA writes it HMIS.",
		Corpus:  "HMIS, hospital management information system",
		Sources: []chat.Source{{ID: "shared.glossary.hmis"}}}
	if r := Check(answerCase(), tr); len(r.Failures) != 0 {
		t.Fatalf("unexpected failures: %v", r.Failures)
	}
}

func TestCheckFlagsForbiddenPhrasesAndMissingSource(t *testing.T) {
	tr := Transcript{CaseID: "define-hmis-01",
		Answer: "Great question! Let me look that up. HMIS is hospital software.",
		Corpus: "HMIS"}
	r := Check(answerCase(), tr)
	want := []string{"forbidden: great question", "forbidden: let me ", "citations: none", "expected_source: shared.glossary.hmis absent"}
	for _, w := range want {
		if !contains(r.Failures, w) {
			t.Errorf("missing %q in %v", w, r.Failures)
		}
	}
}

func TestCheckFlagsAnUngroundedLiteral(t *testing.T) {
	tr := Transcript{CaseID: "define-hmis-01",
		Answer:  "Send `X-Retry-After-Ms` with the call.",
		Corpus:  "nothing about that header",
		Sources: []chat.Source{{ID: "shared.glossary.hmis"}}}
	r := Check(answerCase(), tr)
	if !hasPrefix(r.Failures, "grounding: X-Retry-After-Ms") {
		t.Errorf("ungrounded header not flagged: %v", r.Failures)
	}
}

func TestCheckDeclineShape(t *testing.T) {
	c := answerCase()
	c.ID, c.Slice, c.Class, c.ExpectedShape, c.ExpectedBehaviour = "decline-01", "decline", "out-of-scope", "decline", "decline"
	c.MustContain = []string{"/docs/support"}
	good := Transcript{CaseID: "decline-01", Answer: "I do not have anything on NHCX claim rules. Ask [support](/docs/support)."}
	if r := Check(c, good); len(r.Failures) != 0 {
		t.Fatalf("a two sentence decline with a route failed: %v", r.Failures)
	}
	bad := Transcript{CaseID: "decline-01", Answer: "Hmm. That could be many things. It might be A. Or B. Try again."}
	r := Check(c, bad)
	if !hasPrefix(r.Failures, "decline:") {
		t.Errorf("a rambling decline passed: %v", r.Failures)
	}
}

func TestCheckLiteralOutsideCodeSpan(t *testing.T) {
	tr := Transcript{CaseID: "define-hmis-01",
		Answer:  "Send X-HIP-ID on every call.",
		Corpus:  "X-HIP-ID header",
		Sources: []chat.Source{{ID: "shared.glossary.hmis"}}}
	r := Check(answerCase(), tr)
	if !hasPrefix(r.Failures, "shape: literal X-HIP-ID outside a code span") {
		t.Errorf("bare literal passed: %v", r.Failures)
	}
}

func contains(list []string, s string) bool {
	for _, x := range list {
		if x == s {
			return true
		}
	}
	return false
}

func hasPrefix(list []string, p string) bool {
	for _, x := range list {
		if strings.HasPrefix(x, p) {
			return true
		}
	}
	return false
}

// declineCase returns a decline-shaped variant of answerCase, the same base
// the brief's own TestCheckDeclineShape builds by hand.
func declineCase() Case {
	c := answerCase()
	c.ID, c.Slice, c.Class, c.ExpectedShape, c.ExpectedBehaviour = "decline-01", "decline", "out-of-scope", "decline", "decline"
	c.MustContain = []string{"/docs/support"}
	return c
}

func TestCheckSentenceCountIgnoresAbbreviations(t *testing.T) {
	cases := []struct {
		name      string
		c         Case
		answer    string
		badPrefix string // the failure that a naive sentence count would wrongly add
	}{
		{
			name: "define answer with four abbreviations stays within the four sentence limit",
			c:    answerCase(),
			answer: "NHA publishes this, e.g. for HIPs, i.e. hospital systems, etc. It is public. " +
				"Dr. Rao confirmed it.",
			badPrefix: "shape: define has",
		},
		{
			name:      "decline answer with two abbreviations stays within the two sentence limit",
			c:         declineCase(),
			answer:    "Dr. Sharma covers that, e.g. in the FAQ. Ask support at /docs/support.",
			badPrefix: "decline:",
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := Check(tc.c, Transcript{CaseID: tc.c.ID, Answer: tc.answer})
			if hasPrefix(r.Failures, tc.badPrefix) {
				t.Fatalf("an abbreviation was counted as a sentence end: %v", r.Failures)
			}
		})
	}
}

func TestCheckForbiddenAtomIsAWholeWordOnly(t *testing.T) {
	cases := []struct {
		name    string
		answer  string
		wantHit bool
	}{
		// "atomic" contains the letters "atom" as a substring; a naive
		// Contains check flags it even though the answer never says "atom".
		{"atomic operation does not trip the internal word atom", "The sandbox performs an atomic write for every consent grant.", false},
		{"automatically does not trip the internal word atom", "The callback arrives automatically once the HIP responds.", false},
		{"the bare word atom still trips it", "Each atom in the catalogue names one fact.", true},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := Check(answerCase(), Transcript{CaseID: "define-hmis-01", Answer: tc.answer})
			got := contains(r.Failures, "forbidden: atom")
			if got != tc.wantHit {
				t.Fatalf("forbidden: atom present = %v, want %v (failures: %v)", got, tc.wantHit, r.Failures)
			}
		})
	}
}

func TestCheckMustNotContainKeepsPartialMatching(t *testing.T) {
	c := answerCase()
	c.MustNotContain = []string{"<MASKED"}
	tr := Transcript{CaseID: c.ID, Answer: "Contact <MASKED_NAME> for help with that."}
	r := Check(c, tr)
	if !contains(r.Failures, "forbidden: <MASKED") {
		t.Fatalf("a partial must_not_contain entry stopped matching: %v", r.Failures)
	}
}
