package eval

import (
	"fmt"
	"sort"
	"strings"
)

type SliceScore struct {
	Slice       string  `json:"slice"`
	Cases       int     `json:"cases"`
	Factuality  float64 `json:"factuality"`
	Uncertainty float64 `json:"uncertainty"`
	Grounding   int     `json:"grounding_failures"`
	Forbidden   int     `json:"forbidden_phrases"`
	Shape       int     `json:"shape_failures"`
	Recall3     float64 `json:"recall_at_3"`
	MRR         float64 `json:"mrr"`
	Unstable    int     `json:"unstable"`
}

type Scorecard struct {
	Run              string       `json:"run"`
	CatalogueVersion string       `json:"catalogue_version"`
	ModelID          string       `json:"model_id"`
	PromptVersion    string       `json:"prompt_version"`
	Temperature      float64      `json:"temperature"`
	Slices           []SliceScore `json:"slices"`
	Overall          SliceScore   `json:"overall"`
}

type tally struct {
	cases, answers, abGrades, declines, aDeclines, scored, unstable int
	grounding, forbidden, shape                                     int
	recall, rr                                                      float64
}

func (t tally) score(name string) SliceScore {
	s := SliceScore{Slice: name, Cases: t.cases, Grounding: t.grounding, Forbidden: t.forbidden,
		Shape: t.shape, Unstable: t.unstable, Factuality: -1, Uncertainty: -1, Recall3: -1, MRR: -1}
	if t.answers > 0 {
		s.Factuality = float64(t.abGrades) / float64(t.answers)
	}
	if t.declines > 0 {
		s.Uncertainty = float64(t.aDeclines) / float64(t.declines)
	}
	if t.scored > 0 {
		s.Recall3 = t.recall / float64(t.scored)
		s.MRR = t.rr / float64(t.scored)
	}
	return s
}

// BuildScorecard folds checks, retrieval and grades into one number per
// dimension per slice. Grades may be empty (a check-only run); factuality and
// uncertainty then read -1 rather than 0, so nobody mistakes "not judged"
// for "all wrong".
func BuildScorecard(cases []Case, checks []CheckResult, retrieval []RetrievalResult, grades []Grade) Scorecard {
	byCheck := map[string]CheckResult{}
	for _, c := range checks {
		byCheck[c.CaseID] = c
	}
	byRet := map[string]RetrievalResult{}
	for _, r := range retrieval {
		byRet[r.CaseID] = r
	}
	byGrade := map[string]Grade{}
	for _, g := range grades {
		byGrade[g.CaseID] = g
	}
	tallies := map[string]*tally{}
	all := &tally{}
	for _, c := range cases {
		t := tallies[c.Slice]
		if t == nil {
			t = &tally{}
			tallies[c.Slice] = t
		}
		for _, tt := range []*tally{t, all} {
			tt.cases++
			for _, f := range byCheck[c.ID].Failures {
				switch {
				case strings.HasPrefix(f, "grounding:"):
					tt.grounding++
				case strings.HasPrefix(f, "forbidden:"):
					tt.forbidden++
				case strings.HasPrefix(f, "shape:"), strings.HasPrefix(f, "decline:"):
					tt.shape++
				}
			}
			if r := byRet[c.ID]; r.Scored {
				tt.scored++
				tt.recall += r.Recall3
				tt.rr += r.RR
			}
			if g, ok := byGrade[c.ID]; ok {
				if g.Grade == "unstable" {
					tt.unstable++
				}
				if c.ExpectedBehaviour == "answer" {
					tt.answers++
					if g.Grade == "A" || g.Grade == "B" {
						tt.abGrades++
					}
				} else {
					tt.declines++
					if g.Grade == "A" {
						tt.aDeclines++
					}
				}
			}
		}
	}
	sc := Scorecard{Overall: all.score("overall")}
	for name, t := range tallies {
		sc.Slices = append(sc.Slices, t.score(name))
	}
	sort.Slice(sc.Slices, func(i, j int) bool { return sc.Slices[i].Slice < sc.Slices[j].Slice })
	return sc
}

// Delta renders the change between two scorecards as a Markdown table, for
// the pull request comment.
func Delta(now, before Scorecard) string {
	prev := map[string]SliceScore{}
	for _, s := range before.Slices {
		prev[s.Slice] = s
	}
	var b strings.Builder
	b.WriteString("| slice | factuality | uncertainty | grounding | forbidden | recall@3 |\n|---|---|---|---|---|---|\n")
	f := func(now, was float64) string {
		if now < 0 {
			return "n/a"
		}
		return fmt.Sprintf("%.2f (%+.2f)", now, now-was)
	}
	for _, s := range now.Slices {
		p := prev[s.Slice]
		fmt.Fprintf(&b, "| %s | %s | %s | %d (%+d) | %d (%+d) | %s |\n", s.Slice,
			f(s.Factuality, p.Factuality), f(s.Uncertainty, p.Uncertainty),
			s.Grounding, s.Grounding-p.Grounding, s.Forbidden, s.Forbidden-p.Forbidden, f(s.Recall3, p.Recall3))
	}
	return b.String()
}
