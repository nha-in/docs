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
