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

var gradeRe = regexp.MustCompile(`(?m)^GRADE:\s*([ABC])\s*$`)

func (j Judge) prompt(c Case, t Transcript) string {
	var sources []string
	for _, s := range t.Sources {
		sources = append(sources, s.ID+": "+s.Title+" ("+s.Status+")")
	}
	if len(sources) == 0 {
		sources = []string{"(none)"}
	}
	crit := make([]string, 0, len(c.MustContain))
	for _, m := range c.MustContain {
		crit = append(crit, "- "+m)
	}
	r := strings.NewReplacer(
		"{{question}}", lastUser(c),
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
	rationales := map[string]string{}
	for i := 0; i < runs; i++ {
		reply, err := j.Model.Stream(ctx, "", nil, []chat.Message{{Role: "user", Text: j.prompt(c, t)}}, 600, func(string) {})
		if err != nil {
			return g, fmt.Errorf("judge %s: %w", c.ID, err)
		}
		m := gradeRe.FindStringSubmatch(reply.Text)
		if m == nil {
			return g, fmt.Errorf("judge %s: no GRADE line in %q", c.ID, reply.Text)
		}
		g.Votes = append(g.Votes, m[1])
		rationales[m[1]] = strings.TrimSpace(gradeRe.ReplaceAllString(reply.Text, ""))
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
		return g, nil
	}
	g.Grade = best
	g.Rationale = rationales[best]
	return g, nil
}

func GradeAll(ctx context.Context, j Judge, cases []Case, ts map[string]Transcript) ([]Grade, error) {
	out := make([]Grade, 0, len(cases))
	for _, c := range cases {
		t, ok := ts[c.ID]
		if !ok {
			out = append(out, Grade{CaseID: c.ID, Grade: "C", Rationale: "no transcript"})
			continue
		}
		g, err := j.Grade(ctx, c, t)
		if err != nil {
			return out, err
		}
		out = append(out, g)
	}
	return out, nil
}
