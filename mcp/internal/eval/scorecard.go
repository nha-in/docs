package eval

import (
	"fmt"
	"sort"
	"strings"
)

type SliceScore struct {
	Slice string `json:"slice"`
	Cases int    `json:"cases"`
	// Answered and Graded expose how much of the slice the numbers below
	// actually cover. A run that stopped partway through still reports
	// Cases at the full count, so a factuality or recall figure with
	// Answered well under Cases is a partial run reading as a complete one.
	Answered    int     `json:"answered"`
	Graded      int     `json:"graded"`
	Factuality  float64 `json:"factuality"`
	Uncertainty float64 `json:"uncertainty"`
	Grounding   int     `json:"grounding_failures"`
	Forbidden   int     `json:"forbidden_phrases"`
	Shape       int     `json:"shape_failures"`
	Recall3     float64 `json:"recall_at_3"`
	MRR         float64 `json:"mrr"`
	Unstable    int     `json:"unstable"`
	// MeanToolCalls and RetrievalHitRate come from CheckResult, so they
	// cover every answered case, not just the ones a judge scored.
	MeanToolCalls    float64 `json:"mean_tool_calls"`
	RetrievalHitRate float64 `json:"retrieval_hit_rate"`
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
	answered, graded                                                int
	recall, rr                                                      float64
	toolCalls                                                       int
	// retrievalCases and retrievalHits cover only answered cases that have
	// expected sources: a case with none is not a retrieval measurement, so
	// it must not sit in either the numerator or the denominator (finding 4).
	retrievalCases, retrievalHits int
}

func (t tally) score(name string) SliceScore {
	s := SliceScore{Slice: name, Cases: t.cases, Answered: t.answered, Graded: t.graded,
		Grounding: t.grounding, Forbidden: t.forbidden,
		Shape: t.shape, Unstable: t.unstable, Factuality: -1, Uncertainty: -1, Recall3: -1, MRR: -1,
		MeanToolCalls: -1, RetrievalHitRate: -1}
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
	if t.answered > 0 {
		s.MeanToolCalls = float64(t.toolCalls) / float64(t.answered)
	}
	if t.retrievalCases > 0 {
		s.RetrievalHitRate = float64(t.retrievalHits) / float64(t.retrievalCases)
	}
	return s
}

// caseAnswered reports whether id got a transcript. CheckAll (checks.go)
// marks a case with no transcript with exactly one failure, "transcript:
// missing", and produces nothing else for it; every other result, including
// one with zero failures, came from a real answer. A case with no
// CheckResult at all, which happens when checks have not run yet, is
// unanswered too, the same as one CheckAll marked missing.
func caseAnswered(byCheck map[string]CheckResult, id string) bool {
	cr, ok := byCheck[id]
	if !ok {
		return false
	}
	return !(len(cr.Failures) == 1 && cr.Failures[0] == "transcript: missing")
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
			if caseAnswered(byCheck, c.ID) {
				tt.answered++
				tt.toolCalls += byCheck[c.ID].ToolCalls
				if len(c.ExpectedSources) > 0 {
					tt.retrievalCases++
					if byCheck[c.ID].RetrievalHit {
						tt.retrievalHits++
					}
				}
			}
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
			// unstable and "?" are not grades: a three way split or a
			// failed judging call is not evidence the answer regressed, so
			// neither counts toward any denominator. A "?" grade still means
			// the judge produced a verdict token, so it counts as graded;
			// only its absence from byGrade means the case was never judged.
			if g, ok := byGrade[c.ID]; ok {
				if g.Grade != "?" {
					tt.graded++
				}
				switch {
				case g.Grade == "unstable":
					tt.unstable++
				case g.Grade == "?":
					// no usable grade; excluded from every denominator
				case c.ExpectedBehaviour == "answer":
					tt.answers++
					if g.Grade == "A" || g.Grade == "B" {
						tt.abGrades++
					}
				default:
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

const scoreTableHeader = "| slice | cases | answered | graded | factuality | uncertainty | grounding | forbidden | recall@3 | mean tool calls | retrieval hit rate |\n|---|---|---|---|---|---|---|---|---|---|---|\n"

// deltaCell renders one dimension's before/after as a Markdown cell. A
// negative value is the -1 sentinel for "not measured this run", not a
// score, so it must never be diffed:
//   - now unmeasured: "n/a", whatever the baseline says.
//   - now measured but before unmeasured: "<value> (new)", because there is
//     nothing honest to subtract from.
//   - both measured: the value and its signed delta.
func deltaCell(now, was float64) string {
	switch {
	case now < 0:
		return "n/a"
	case was < 0:
		return fmt.Sprintf("%.2f (new)", now)
	default:
		return fmt.Sprintf("%.2f (%+.2f)", now, now-was)
	}
}

// Delta renders the change between two scorecards as a Markdown table, for
// the pull request comment. A slice that ran in before but not in now is
// named as gone rather than silently dropped from the table.
func Delta(now, before Scorecard) string {
	prev := map[string]SliceScore{}
	for _, s := range before.Slices {
		prev[s.Slice] = s
	}
	seen := map[string]bool{}
	var b strings.Builder
	b.WriteString(scoreTableHeader)
	for _, s := range now.Slices {
		seen[s.Slice] = true
		p := prev[s.Slice]
		fmt.Fprintf(&b, "| %s | %d | %d (%+d) | %d (%+d) | %s | %s | %d (%+d) | %d (%+d) | %s | %s | %s |\n", s.Slice,
			s.Cases, s.Answered, s.Answered-p.Answered, s.Graded, s.Graded-p.Graded,
			deltaCell(s.Factuality, p.Factuality), deltaCell(s.Uncertainty, p.Uncertainty),
			s.Grounding, s.Grounding-p.Grounding, s.Forbidden, s.Forbidden-p.Forbidden, deltaCell(s.Recall3, p.Recall3),
			deltaCell(s.MeanToolCalls, p.MeanToolCalls), deltaCell(s.RetrievalHitRate, p.RetrievalHitRate))
	}
	var gone []string
	for _, s := range before.Slices {
		if !seen[s.Slice] {
			gone = append(gone, s.Slice)
		}
	}
	sort.Strings(gone)
	for _, name := range gone {
		fmt.Fprintf(&b, "| %s | gone: this slice ran before but not in this run | | | | | | | | | |\n", name)
	}
	return b.String()
}

// Table renders one scorecard's own numbers as a Markdown table, with no
// comparison and no delta. Use this for a run's own report; Delta is for
// comparing two runs.
func Table(sc Scorecard) string {
	cell := func(v float64) string {
		if v < 0 {
			return "n/a"
		}
		return fmt.Sprintf("%.2f", v)
	}
	var b strings.Builder
	b.WriteString(scoreTableHeader)
	for _, s := range sc.Slices {
		fmt.Fprintf(&b, "| %s | %d | %d | %d | %s | %s | %d | %d | %s | %s | %s |\n", s.Slice,
			s.Cases, s.Answered, s.Graded, cell(s.Factuality), cell(s.Uncertainty), s.Grounding, s.Forbidden, cell(s.Recall3),
			cell(s.MeanToolCalls), cell(s.RetrievalHitRate))
	}
	return b.String()
}
