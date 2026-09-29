package eval

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"github.com/nha-in/docs/mcp/internal/guard"
)

type CheckResult struct {
	CaseID   string   `json:"case_id"`
	Failures []string `json:"failures"`
	// ToolCalls is how many tool calls the model made to produce the
	// answer. Cheap models compound error per sequential call, so the
	// mean over a run is a quality number, not a cost number.
	ToolCalls int `json:"tool_calls"`
	// RetrievalHit is whether any expected source was retrieved at all.
	// Scored apart from the criteria because retrieval and generation fail
	// differently: a wrong answer with the right atom in hand is a prompt
	// problem, a wrong answer with the wrong atom is an index problem.
	RetrievalHit bool `json:"retrieval_hit"`
}

// forbidden is what no answer may say, whatever the case. The case adds its
// own. Lower case; the answer is lower cased before matching.
var forbidden = []string{
	"great question", "good question", "i apologize", "i apologise", "i'm sorry",
	"let me ", "i will search", "i'll search", "i'll look", "let me look",
	"the catalogue", "atom", "system prompt", "\u2014",
}

func isPanelVoice(p string) bool {
	for _, f := range forbidden {
		if strings.EqualFold(f, p) {
			return true
		}
	}
	return false
}

var (
	sentenceEndRe = regexp.MustCompile(`[.!?](\s|$)`)
	headingRe     = regexp.MustCompile(`(?m)^#{1,6}\s`)
	listRe        = regexp.MustCompile(`(?m)^\s*(?:[-*]|\d+\.)\s`)
	codeSpanRe    = regexp.MustCompile("`[^`\n]+`")
	// fencedBlockRe matches a whole fenced block, curl and all. codeSpanRe
	// cannot span the newlines inside one, so a block has to be stripped
	// first: otherwise every header and path a fenced curl command legally
	// carries reads as a literal sitting outside a code span.
	fencedBlockRe = regexp.MustCompile("(?s)```.*?```")
	// abbreviationEndRe matches a known abbreviation ending in the period
	// sentenceEndRe just found, so "e.g." or "Dr." is not read as closing a
	// sentence. Checked against the text up to and including that period.
	abbreviationEndRe = regexp.MustCompile(`(?i)\b(?:e\.g|i\.e|etc|vs|approx|no|dr|mr|mrs|ms)\.$`)
)

// sentences counts sentence-ending punctuation, skipping one that closes a
// known abbreviation rather than a sentence.
func sentences(s string) int {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0
	}
	n := 0
	for _, m := range sentenceEndRe.FindAllStringIndex(s, -1) {
		if abbreviationEndRe.MatchString(s[:m[0]+1]) {
			continue
		}
		n++
	}
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

	// The panel's voice (no em dash, no "let me", no "atom") and its chat
	// formatting are the panel's own rules. An agent answering through the
	// MCP writes in its own voice, so it keeps only a case's own entries: a
	// wrong literal, or a masked value leaking back.
	agent := t.Surface == SurfaceMCPAgent
	phrases := append(append([]string{}, forbidden...), c.MustNotContain...)
	if agent {
		phrases = nil
		for _, p := range c.MustNotContain {
			if !isPanelVoice(p) {
				phrases = append(phrases, p)
			}
		}
	}
	for _, p := range phrases {
		if phraseMatches(lower, p) {
			add("forbidden: %s", p)
		}
	}
	if headingRe.MatchString(answer) && !agent {
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
	stripped := codeSpanRe.ReplaceAllString(fencedBlockRe.ReplaceAllString(answer, ""), "")
	for _, lit := range guard.Literals(stripped) {
		if !agent {
			add("shape: literal %s outside a code span", lit)
		}
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
		// The define shape is the panel's; an agent answering through the MCP
		// writes for whoever asked it, and is not scored on it.
		// One question at most, after the substance. Two or more is the
		// model asking instead of answering, the failure a nudge rule can
		// reintroduce. Counted outside code, where a ? is part of a URL.
		if n := strings.Count(stripped, "?"); n > 1 && t.Surface != SurfaceMCPAgent {
			add("shape: %d questions in an answer", n)
		}
		if c.ExpectedShape == "define" && t.Surface != SurfaceMCPAgent {
			if listRe.MatchString(answer) {
				add("shape: define has a list")
			}
			if n := sentences(answer); n > 4 {
				add("shape: define has %d sentences", n)
			}
		}
	case "decline":
		// Two sentences and a link to the portal's support page are the
		// panel's decline shape; an MCP agent declines in its own words.
		if agent {
			break
		}
		if n := sentences(answer); n > 2 {
			add("decline: %d sentences", n)
		}
		if !strings.Contains(answer, "/docs/") && !strings.Contains(lower, "support") {
			add("decline: no route")
		}
	}
	// Budget on the shape the loop actually routed to (t.Class), not the
	// case author's ExpectedShape: route.Route has no decline shape, so a
	// decline case routes to whatever shape its question would otherwise
	// take, and judging its answer against ExpectedShape's ceiling checks
	// it against a budget the loop never applied. t.Class is empty only for
	// a transcript recorded before this field existed; fall back to
	// ExpectedShape there.
	budgetShape := t.Class
	if budgetShape == "" {
		budgetShape = c.ExpectedShape
	}
	if n, max, over := guard.OverBudget(budgetShape, answer); over && t.Surface != SurfaceMCPAgent {
		add("budget: %s answer is %d words, over %d", budgetShape, n, max)
	}
	if t.Blocked {
		add("blocked: the guard withheld the answer")
	}
	calls := 0
	for _, mc := range t.Calls {
		calls += len(mc.Reply.ToolCalls)
	}
	hit := len(c.ExpectedSources) == 0
	for _, want := range c.ExpectedSources {
		for _, s := range t.Sources {
			if s.ID == want {
				hit = true
			}
		}
	}
	return CheckResult{CaseID: c.ID, Failures: f, ToolCalls: calls, RetrievalHit: hit}
}

// phraseMatches reports whether phrase appears in the already lower-cased
// answer. A bare word, letters only and no space, matches only at word
// boundaries, so the forbidden entry "atom" does not fire on "atomic". A
// phrase carrying punctuation or a space, such as "<MASKED" or "let me ",
// keeps substring matching: it is deliberately partial, and a word boundary
// would stop it from matching at all.
func phraseMatches(lower, phrase string) bool {
	p := strings.ToLower(phrase)
	if isBareWord(p) {
		return regexp.MustCompile(`\b` + regexp.QuoteMeta(p) + `\b`).MatchString(lower)
	}
	return strings.Contains(lower, p)
}

func isBareWord(s string) bool {
	if s == "" {
		return false
	}
	for _, r := range s {
		if !unicode.IsLetter(r) {
			return false
		}
	}
	return true
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
