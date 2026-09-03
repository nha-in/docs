package eval

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/guard"
)

type CheckResult struct {
	CaseID   string   `json:"case_id"`
	Failures []string `json:"failures"`
}

// forbidden is what no answer may say, whatever the case. The case adds its
// own. Lower case; the answer is lower cased before matching.
var forbidden = []string{
	"great question", "good question", "i apologize", "i apologise", "i'm sorry",
	"let me ", "i will search", "i'll search", "i'll look", "let me look",
	"the catalogue", "atom", "system prompt", "\u2014",
}

var (
	sentenceEndRe = regexp.MustCompile(`[.!?](\s|$)`)
	headingRe     = regexp.MustCompile(`(?m)^#{1,6}\s`)
	listRe        = regexp.MustCompile(`(?m)^\s*(?:[-*]|\d+\.)\s`)
	codeSpanRe    = regexp.MustCompile("`[^`\n]+`")
)

func sentences(s string) int {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0
	}
	n := len(sentenceEndRe.FindAllStringIndex(s, -1))
	if n == 0 {
		return 1
	}
	return n
}

// Check runs every deterministic rule for one case against its transcript.
func Check(c Case, t Transcript) CheckResult {
	var f []string
	add := func(format string, a ...any) { f = append(f, fmt.Sprintf(format, a...)) }
	answer := t.Answer
	lower := strings.ToLower(answer)

	for _, p := range append(append([]string{}, forbidden...), c.MustNotContain...) {
		if strings.Contains(lower, strings.ToLower(p)) {
			add("forbidden: %s", p)
		}
	}
	if headingRe.MatchString(answer) {
		add("shape: heading in a chat answer")
	}

	// Literals: grounded against the corpus and the question, and inside a
	// code span.
	haystack := t.Corpus + "\n" + lastUser(c)
	if c.Attachment != nil {
		haystack += "\n" + c.Attachment.Text
	}
	for _, v := range guard.CheckGrounding(answer, haystack, len(t.Sources), true) {
		if v.Rule == "invented_identifier" {
			add("grounding: %s", strings.SplitN(v.Detail, " appears", 2)[0])
		}
	}
	stripped := codeSpanRe.ReplaceAllString(answer, "")
	for _, lit := range guard.Literals(stripped) {
		add("shape: literal %s outside a code span", lit)
	}

	switch c.ExpectedBehaviour {
	case "answer":
		if len(t.Sources) == 0 {
			add("citations: none")
		}
		for _, want := range c.ExpectedSources {
			found := false
			for _, s := range t.Sources {
				if s.ID == want {
					found = true
				}
			}
			if !found {
				add("expected_source: %s absent", want)
			}
		}
		if c.ExpectedShape == "define" {
			if listRe.MatchString(answer) {
				add("shape: define has a list")
			}
			if n := sentences(answer); n > 4 {
				add("shape: define has %d sentences", n)
			}
		}
	case "decline":
		if n := sentences(answer); n > 2 {
			add("decline: %d sentences", n)
		}
		if !strings.Contains(answer, "/docs/") && !strings.Contains(lower, "support") {
			add("decline: no route")
		}
	}
	if t.Blocked {
		add("blocked: the guard withheld the answer")
	}
	return CheckResult{CaseID: c.ID, Failures: f}
}

func lastUser(c Case) string {
	for i := len(c.Turns) - 1; i >= 0; i-- {
		if c.Turns[i].Role == "user" {
			return c.Turns[i].Text
		}
	}
	return ""
}

// CheckAll pairs cases with transcripts by id. A case with no transcript is
// a failure, because an unanswered case is not a pass.
func CheckAll(cases []Case, ts map[string]Transcript) []CheckResult {
	out := make([]CheckResult, 0, len(cases))
	for _, c := range cases {
		t, ok := ts[c.ID]
		if !ok {
			out = append(out, CheckResult{CaseID: c.ID, Failures: []string{"transcript: missing"}})
			continue
		}
		out = append(out, Check(c, t))
	}
	return out
}
