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

// TestPartialRunReportsFewerAnsweredThanCases covers C2: a run that stopped
// partway through (a Bedrock throttle at case 40, say) must not read as a
// complete one. CheckAll records "transcript: missing" for the unanswered
// case, and the scorecard must count it as unanswered rather than folding
// it into a number that looks like the rest.
func TestPartialRunReportsFewerAnsweredThanCases(t *testing.T) {
	cases := []Case{
		{ID: "d1", Slice: "define", ExpectedBehaviour: "answer"},
		{ID: "d2", Slice: "define", ExpectedBehaviour: "answer"},
	}
	checks := CheckAll(cases, map[string]Transcript{
		"d1": {CaseID: "d1", Answer: "HMIS is hospital software."},
	})
	sc := BuildScorecard(cases, checks, nil, nil)
	if sc.Overall.Cases != 2 {
		t.Fatalf("cases = %d, want 2", sc.Overall.Cases)
	}
	if sc.Overall.Answered != 1 {
		t.Fatalf("answered = %d, want 1 (the run stopped after one case)", sc.Overall.Answered)
	}
}

// TestGradedCountExcludesQuestionMarkButKeepsUnstable covers the other half
// of C2: a case graded "?" (a total judge failure) never produced a usable
// verdict and must not count as graded, while "unstable" is a real verdict
// (a three way split) and does.
func TestGradedCountExcludesQuestionMarkButKeepsUnstable(t *testing.T) {
	cases := []Case{
		{ID: "a1", Slice: "define", ExpectedBehaviour: "answer"},
		{ID: "a2", Slice: "define", ExpectedBehaviour: "answer"},
		{ID: "a3", Slice: "define", ExpectedBehaviour: "answer"},
	}
	grades := []Grade{{CaseID: "a1", Grade: "A"}, {CaseID: "a2", Grade: "unstable"}, {CaseID: "a3", Grade: "?"}}
	sc := BuildScorecard(cases, nil, nil, grades)
	if sc.Overall.Graded != 2 {
		t.Fatalf("graded = %d, want 2 (a1 and a2; a3's \"?\" is not a verdict)", sc.Overall.Graded)
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

// item D: a slice whose only case is unstable must not read as a factuality
// regression; it is unmeasured, like a check-only run.
func TestSliceWithOnlyAnUnstableCaseReportsFactualityUnmeasured(t *testing.T) {
	cases := []Case{{ID: "u1", Slice: "define", ExpectedBehaviour: "answer"}}
	grades := []Grade{{CaseID: "u1", Grade: "unstable"}}
	sc := BuildScorecard(cases, nil, nil, grades)
	if sc.Overall.Factuality != -1 {
		t.Fatalf("factuality = %v, want -1 (unmeasured), got a score computed over zero graded cases", sc.Overall.Factuality)
	}
	if sc.Overall.Unstable != 1 {
		t.Fatalf("unstable = %d, want 1", sc.Overall.Unstable)
	}
}

// item E: a "?" vote (a total judge failure on that case) must not count
// toward any denominator either; it is not a grade at all.
func TestQuestionMarkGradeIsExcludedFromEveryDenominator(t *testing.T) {
	cases := []Case{{ID: "q1", Slice: "define", ExpectedBehaviour: "answer"}}
	grades := []Grade{{CaseID: "q1", Grade: "?"}}
	sc := BuildScorecard(cases, nil, nil, grades)
	if sc.Overall.Factuality != -1 {
		t.Fatalf("factuality = %v, want -1 (unmeasured)", sc.Overall.Factuality)
	}
}

// item F: comparing a measured run against a check-only baseline (which
// carries the -1 unmeasured sentinel) must not print a bogus delta like
// "0.80 (+1.80)".
func TestDeltaRendersHonestlyWhenTheBeforeSideIsUnmeasured(t *testing.T) {
	before := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: -1}}}
	now := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.8}}}
	d := Delta(now, before)
	if !strings.Contains(d, "0.80 (new)") {
		t.Fatalf("delta = %q, want an honest \"(new)\" marker", d)
	}
	if strings.Contains(d, "+1.80") {
		t.Fatalf("delta = %q, computed a delta against an unmeasured baseline", d)
	}
}

// item F: a slice that ran before but not now must be named as gone, not
// silently dropped from the table.
func TestDeltaNamesASliceThatVanished(t *testing.T) {
	before := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.5}, {Slice: "decline", Factuality: 0.9}}}
	now := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.5}}}
	d := Delta(now, before)
	if !strings.Contains(d, "decline") {
		t.Fatalf("delta does not name the vanished slice: %q", d)
	}
}

// item F: reportInto must print one honest table of the run's own numbers,
// not a delta against an all-zero scorecard.
func TestTableRendersOneScorecardWithNoDeltas(t *testing.T) {
	sc := Scorecard{Slices: []SliceScore{{Slice: "define", Factuality: 0.8, Uncertainty: -1, Recall3: 0.5, Grounding: 1, Forbidden: 0}}}
	tbl := Table(sc)
	if !strings.Contains(tbl, "0.80") {
		t.Fatalf("table = %q, missing the factuality value", tbl)
	}
	if strings.Contains(tbl, "+") {
		t.Fatalf("table = %q, a table with no baseline must not print a delta", tbl)
	}
}

// TestZeroAnsweredSliceReportsToolCallsAndHitRateUnmeasured covers finding 3:
// a slice with nothing answered must render "n/a" for mean tool calls and
// retrieval hit rate, the same as every other unmeasured column, not the
// fabricated "0.0 | 0%" a bare division guard leaves behind.
func TestZeroAnsweredSliceReportsToolCallsAndHitRateUnmeasured(t *testing.T) {
	cases := []Case{{ID: "d1", Slice: "define", ExpectedBehaviour: "answer", ExpectedSources: []string{"x"}}}
	sc := BuildScorecard(cases, nil, nil, nil)
	if sc.Overall.MeanToolCalls != -1 {
		t.Fatalf("mean tool calls = %v, want -1 (unmeasured)", sc.Overall.MeanToolCalls)
	}
	if sc.Overall.RetrievalHitRate != -1 {
		t.Fatalf("retrieval hit rate = %v, want -1 (unmeasured)", sc.Overall.RetrievalHitRate)
	}
	tbl := Table(sc)
	if strings.Count(tbl, "n/a") < 2 {
		t.Fatalf("table = %q, want n/a for both mean tool calls and retrieval hit rate", tbl)
	}
}

// TestSliceWithOnlyNoExpectedSourceCasesReportsHitRateUnmeasured covers
// finding 4: a decline/abstain slice, where every case has no expected
// sources, must not read as a 100% retrieval hit rate. It is not a
// retrieval measurement at all.
func TestSliceWithOnlyNoExpectedSourceCasesReportsHitRateUnmeasured(t *testing.T) {
	cases := []Case{{ID: "x1", Slice: "decline", ExpectedBehaviour: "decline"}}
	checks := CheckAll(cases, map[string]Transcript{
		"x1": {CaseID: "x1", Answer: "See /docs/support."},
	})
	sc := BuildScorecard(cases, checks, nil, nil)
	if sc.Overall.RetrievalHitRate != -1 {
		t.Fatalf("retrieval hit rate = %v, want -1 (unmeasured, no case in this slice has expected sources)", sc.Overall.RetrievalHitRate)
	}
}

// TestDeltaDoesNotDiffAgainstUnmeasuredToolCallsOrHitRate covers finding 3's
// consequence: a baseline scorecard written before these two fields existed
// unmarshals them as zero, not as the -1 sentinel. Delta must still not
// print a fabricated improvement against that zero.
func TestDeltaDoesNotDiffAgainstUnmeasuredToolCallsOrHitRate(t *testing.T) {
	before := Scorecard{Slices: []SliceScore{{Slice: "define", MeanToolCalls: -1, RetrievalHitRate: -1}}}
	now := Scorecard{Slices: []SliceScore{{Slice: "define", MeanToolCalls: 3, RetrievalHitRate: 0.8}}}
	d := Delta(now, before)
	if !strings.Contains(d, "3.00 (new)") || !strings.Contains(d, "0.80 (new)") {
		t.Fatalf("delta = %q, want honest \"(new)\" markers for both columns", d)
	}
}
