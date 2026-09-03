package eval

import (
	"strings"
	"testing"
)

func TestScorecardCountsPerSlice(t *testing.T) {
	cases := []Case{
		{ID: "d1", Slice: "define", ExpectedBehaviour: "answer"},
		{ID: "d2", Slice: "define", ExpectedBehaviour: "answer"},
		{ID: "x1", Slice: "decline", ExpectedBehaviour: "decline"},
	}
	checks := []CheckResult{{CaseID: "d1"}, {CaseID: "d2", Failures: []string{"grounding: X-Foo", "forbidden: let me "}}, {CaseID: "x1"}}
	retrieval := []RetrievalResult{{CaseID: "d1", Scored: true, Recall3: 1, RR: 1}, {CaseID: "d2", Scored: true, Recall3: 0, RR: 0.25}, {CaseID: "x1"}}
	grades := []Grade{{CaseID: "d1", Grade: "A"}, {CaseID: "d2", Grade: "C"}, {CaseID: "x1", Grade: "A"}}
	sc := BuildScorecard(cases, checks, retrieval, grades)
	var define, decline SliceScore
	for _, s := range sc.Slices {
		if s.Slice == "define" {
			define = s
		}
		if s.Slice == "decline" {
			decline = s
		}
	}
	if define.Factuality != 0.5 || define.Grounding != 1 || define.Forbidden != 1 || define.Recall3 != 0.5 || define.MRR != 0.625 {
		t.Fatalf("define = %+v", define)
	}
	if decline.Uncertainty != 1 {
		t.Fatalf("decline = %+v", decline)
	}
	if sc.Overall.Cases != 3 {
		t.Fatalf("overall = %+v", sc.Overall)
	}
}

func TestDeltaNamesTheChange(t *testing.T) {
	before := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.5}}}
	now := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.9}}}
	d := Delta(now, before)
	if !strings.Contains(d, "define") || !strings.Contains(d, "+0.40") {
		t.Fatalf("delta = %q", d)
	}
}
