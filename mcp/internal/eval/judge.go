package eval

import (
	"context"
	_ "embed"
	"fmt"
	"regexp"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

//go:embed rubric.md
var rubric string

type Grade struct {
	CaseID    string   `json:"case_id"`
	Grade     string   `json:"grade"`
	Votes     []string `json:"votes"`
	Rationale string   `json:"rationale"`
}

// Judge grades an answer against its case's marking criteria. It is a model
// with no tools: it sees the question, the answer, the sources retrieved and
// the criteria, and nothing else. Runs is how many times each case is graded;
// the majority stands, and a three way split is reported as unstable for a
// human to grade.
type Judge struct {
	Model chat.Model
	Runs  int
}

// gradeRe accepts the shapes a model actually emits: bold markers, a
// blockquote arrow, leading space, lower case, trailing text after the
// letter. splitGradeRe catches a hedged "GRADE: B/C", which is not a grade.
var gradeRe = regexp.MustCompile(`(?im)^[\s>*_]*GRADE\s*[:\-]\s*\**\s*([ABC])\b`)
var splitGradeRe = regexp.MustCompile(`(?im)^[\s>*_]*GRADE\s*[:\-]\s*\**\s*[ABC]\s*(?:/|\||,|\bor\b)\s*[ABC]\b`)

// parseGrade takes the last grade line, so a model that reasons through the
// format before committing is read on its conclusion, not its aside.
func parseGrade(text string) string {
	if splitGradeRe.MatchString(text) {
		return ""
	}
	m := gradeRe.FindAllStringSubmatch(text, -1)
	if len(m) == 0 {
		return ""
	}
	return strings.ToUpper(m[len(m)-1][1])
}

// conversation renders every turn the assistant saw, plus any attachment and
// page. The last user turn alone hides a follow-up's referent and hides an
// attachment entirely, and the judge cannot grade what it cannot see.
func conversation(c Case) string {
	var b strings.Builder
	for _, t := range c.Turns {
		b.WriteString(t.Role + ": " + t.Text + "\n")
	}
	if c.Attachment != nil {
		b.WriteString("attachment " + c.Attachment.Name + ": " + c.Attachment.Text + "\n")
	}
	if c.Page != nil {
		b.WriteString("page in view: " + c.Page.Title + " (" + c.Page.URL + ")\n")
	}
	return strings.TrimSpace(b.String())
}

func (j Judge) prompt(c Case, t Transcript) string {
	var sources []string
	for _, s := range t.Sources {
		sources = append(sources, s.ID+": "+s.Title+" ("+s.Status+")")
	}
	if len(sources) == 0 {
		sources = []string{"(no source was cited)"}
	}
	corpus := strings.TrimSpace(t.Corpus)
	if corpus == "" {
		corpus = "(nothing was retrieved)"
	}
	if len(corpus) > 40000 {
		corpus = corpus[:40000] + "\n(truncated)"
	}
	sources = append(sources, "", "Text retrieved:", corpus)
	crit := make([]string, 0, len(c.MustContain))
	for _, m := range c.MustContain {
		crit = append(crit, "- "+m)
	}
	r := strings.NewReplacer(
		"{{question}}", conversation(c),
		"{{answer}}", t.Answer,
		"{{sources}}", strings.Join(sources, "\n"),
		"{{behaviour}}", c.ExpectedBehaviour,
		"{{criteria}}", strings.Join(crit, "\n"),
	)
	return r.Replace(rubric)
}

func (j Judge) Grade(ctx context.Context, c Case, t Transcript) (Grade, error) {
	runs := j.Runs
	if runs <= 0 {
		runs = 3
	}
	g := Grade{CaseID: c.ID}
	var rationales []string
	for i := 0; i < runs; i++ {
		var v, rationale string
		for try := 0; try < 2 && v == ""; try++ {
			p := j.prompt(c, t)
			if try > 0 {
				p += "\n\nYour previous reply had no usable final line. Reply again and end with exactly one line reading GRADE: A, GRADE: B or GRADE: C, with nothing after it."
			}
			reply, err := j.Model.Stream(ctx, "", nil, []chat.Message{{Role: "user", Text: p}}, 900, func(string) {})
			if err != nil {
				return g, fmt.Errorf("judge %s: %w", c.ID, err)
			}
			if reply.StopReason == "max_tokens" {
				continue
			}
			v = parseGrade(reply.Text)
			rationale = strings.TrimSpace(gradeRe.ReplaceAllString(reply.Text, ""))
		}
		if v == "" {
			v, rationale = "?", "the judge produced no usable grade"
		}
		g.Votes = append(g.Votes, v)
		rationales = append(rationales, v+": "+rationale)
	}
	counts := map[string]int{}
	for _, v := range g.Votes {
		counts[v]++
	}
	best, bestN := "", 0
	for _, v := range []string{"A", "B", "C"} {
		if counts[v] > bestN {
			best, bestN = v, counts[v]
		}
	}
	if bestN*2 <= len(g.Votes) && len(g.Votes) > 1 {
		g.Grade = "unstable"
		g.Rationale = strings.Join(rationales, "\n\n")
		return g, nil
	}
	g.Grade = best
	g.Rationale = strings.Join(rationales, "\n\n")
	return g, nil
}

// GradeAll grades every case, recording a failed grading call against that
// one case rather than losing the whole run to it. It returns an error only
// when every case failed, because that is a total outage, not one flaky
// call, and should fail loudly.
func GradeAll(ctx context.Context, j Judge, cases []Case, ts map[string]Transcript) ([]Grade, error) {
	out := make([]Grade, 0, len(cases))
	errors := 0
	for _, c := range cases {
		t, ok := ts[c.ID]
		if !ok {
			out = append(out, Grade{CaseID: c.ID, Grade: "C", Rationale: "no transcript"})
			continue
		}
		g, err := j.Grade(ctx, c, t)
		if err != nil {
			errors++
			out = append(out, Grade{CaseID: c.ID, Grade: "?", Rationale: "judge error: " + err.Error()})
			continue
		}
		out = append(out, g)
	}
	if len(cases) > 0 && errors == len(cases) {
		return out, fmt.Errorf("judge: every one of %d cases failed", len(cases))
	}
	return out, nil
}
