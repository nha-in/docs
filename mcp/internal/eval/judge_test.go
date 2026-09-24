package eval

import (
	"context"
	"fmt"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/chat"
)

// votes answers with a fixed sequence of grades, one per call.
type votes struct {
	seq []string
	i   int
}

func (v *votes) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	g := v.seq[v.i%len(v.seq)]
	v.i++
	text := "The core fact is present.\nGRADE: " + g
	onText(text)
	return chat.Reply{Text: text, StopReason: "end_turn"}, nil
}

func TestJudgeTakesTheMajorityOfThree(t *testing.T) {
	j := Judge{Model: &votes{seq: []string{"A", "B", "A"}}, Runs: 3}
	g, err := j.Grade(context.Background(), answerCase(), Transcript{Answer: "HMIS is hospital software."})
	if err != nil {
		t.Fatal(err)
	}
	if g.Grade != "A" || len(g.Votes) != 3 || !strings.Contains(g.Rationale, "core fact") {
		t.Fatalf("got %+v", g)
	}
}

func TestJudgeReportsAThreeWaySplitAsUnstable(t *testing.T) {
	j := Judge{Model: &votes{seq: []string{"A", "B", "C"}}, Runs: 3}
	g, err := j.Grade(context.Background(), answerCase(), Transcript{Answer: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if g.Grade != "unstable" {
		t.Fatalf("got %+v", g)
	}
}

func TestJudgePromptCarriesTheCriteriaAndNoTools(t *testing.T) {
	var seen []chat.Message
	var seenTools []chat.ToolDef
	m := &captureModel{onCall: func(msgs []chat.Message, tools []chat.ToolDef) {
		seen = msgs
		seenTools = tools
	}}
	j := Judge{Model: m, Runs: 1}
	c := answerCase()
	if _, err := j.Grade(context.Background(), c, Transcript{Answer: "HMIS is hospital software."}); err != nil {
		t.Fatal(err)
	}
	if len(seenTools) != 0 {
		t.Fatal("the judge must not be handed tools")
	}
	if len(seen) != 1 || !strings.Contains(seen[0].Text, "hospital software") || !strings.Contains(seen[0].Text, "what is a HIMS") {
		t.Fatalf("prompt missing criteria or question: %q", seen[0].Text)
	}
}

type captureModel struct {
	onCall func(msgs []chat.Message, tools []chat.ToolDef)
}

func (c *captureModel) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	c.onCall(msgs, tools)
	return chat.Reply{Text: "ok\nGRADE: A", StopReason: "end_turn"}, nil
}

// item A: the judge must see the text retrieved, not just the source labels.
func TestJudgePromptCarriesTheRetrievedCorpus(t *testing.T) {
	var seen []chat.Message
	m := &captureModel{onCall: func(msgs []chat.Message, tools []chat.ToolDef) { seen = msgs }}
	j := Judge{Model: m, Runs: 1}
	tr := Transcript{Answer: "HMIS is hospital software.", Corpus: "distinctive-corpus-marker-xyz retrieved text"}
	if _, err := j.Grade(context.Background(), answerCase(), tr); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(seen[0].Text, "distinctive-corpus-marker-xyz") {
		t.Fatalf("prompt does not carry the retrieved corpus: %q", seen[0].Text)
	}
}

// item B: a conversation fragment and an attachment must both reach the
// judge, not only the last user turn.
func TestJudgePromptCarriesBothTurnsAndTheAttachment(t *testing.T) {
	var seen []chat.Message
	m := &captureModel{onCall: func(msgs []chat.Message, tools []chat.ToolDef) { seen = msgs }}
	j := Judge{Model: m, Runs: 1}
	c := Case{ID: "conversation-link-token-01", Slice: "conversation", Class: "how-do-i",
		Turns: []Turn{
			{Role: "user", Text: "distinctive-first-turn-marker how do I generate a linking token"},
			{Role: "assistant", Text: "Call the token generation endpoint."},
			{Role: "user", Text: "distinctive-last-turn-marker does it expire"},
		},
		Attachment:        &Attachment{Name: "error.json", Text: "distinctive-attachment-marker-abc"},
		MustContain:       []string{"expires"},
		ExpectedShape:     "how-do-i",
		ExpectedBehaviour: "answer",
		SourceRow:         "annexure#x",
		CatalogueVersion:  "2026.08.24"}
	if _, err := j.Grade(context.Background(), c, Transcript{Answer: "It expires in 30 minutes."}); err != nil {
		t.Fatal(err)
	}
	prompt := seen[0].Text
	if !strings.Contains(prompt, "distinctive-first-turn-marker") {
		t.Fatalf("prompt missing the first turn: %q", prompt)
	}
	if !strings.Contains(prompt, "distinctive-last-turn-marker") {
		t.Fatalf("prompt missing the last turn: %q", prompt)
	}
	if !strings.Contains(prompt, "distinctive-attachment-marker-abc") {
		t.Fatalf("prompt missing the attachment text: %q", prompt)
	}
}

// item C: gradeRe/parseGrade must accept the shapes a real model emits.
func TestParseGradeAcceptsShapesARealModelEmits(t *testing.T) {
	cases := map[string]string{
		"**GRADE: A**":                "A",
		"GRADE: A.":                   "A",
		"Grade: A":                    "A",
		" GRADE: A":                   "A",
		"> GRADE: B":                  "B",
		"GRADE: A (all criteria met)": "A",
	}
	for in, want := range cases {
		if got := parseGrade(in); got != want {
			t.Errorf("parseGrade(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestParseGradeRejectsAHedgedSplitGrade(t *testing.T) {
	if got := parseGrade("GRADE: B/C"); got != "" {
		t.Fatalf("parseGrade(GRADE: B/C) = %q, want empty", got)
	}
}

func TestParseGradeTakesTheLastGradeLine(t *testing.T) {
	text := "First I thought\nGRADE: A\nbut on reflection\nGRADE: B"
	if got := parseGrade(text); got != "B" {
		t.Fatalf("parseGrade = %q, want B", got)
	}
}

// item C: a rationale that mentions GRADE: A before concluding GRADE: B
// scores B end to end, through Grade, not just through the parser.
func TestJudgeScoresOnTheFinalGradeLine(t *testing.T) {
	j := Judge{Model: &fixedReply{text: "First I thought\nGRADE: A\nbut on reflection\nGRADE: B"}, Runs: 1}
	g, err := j.Grade(context.Background(), answerCase(), Transcript{Answer: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if g.Grade != "B" {
		t.Fatalf("got grade %q, want B", g.Grade)
	}
}

type fixedReply struct{ text string }

func (f *fixedReply) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	return chat.Reply{Text: f.text, StopReason: "end_turn"}, nil
}

// item C: a model that never produces a usable grade, even after the retry,
// costs one vote, not the run.
type unusableTwice struct{ calls int }

func (u *unusableTwice) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	u.calls++
	return chat.Reply{Text: "I could not decide on a grade.", StopReason: "end_turn"}, nil
}

func TestJudgeVoteIsQuestionMarkWhenTheModelNeverProducesAUsableGrade(t *testing.T) {
	m := &unusableTwice{}
	j := Judge{Model: m, Runs: 1}
	g, err := j.Grade(context.Background(), answerCase(), Transcript{Answer: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if len(g.Votes) != 1 || g.Votes[0] != "?" {
		t.Fatalf("got %+v", g)
	}
	if m.calls != 2 {
		t.Fatalf("want one retry (2 calls), got %d", m.calls)
	}
}

// item D: an unstable grade must carry all three rationales, not silence.
type labeledReplies struct{ replies []string }

func (l *labeledReplies) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	text := l.replies[0]
	l.replies = l.replies[1:]
	return chat.Reply{Text: text, StopReason: "end_turn"}, nil
}

func TestUnstableGradeCarriesAllThreeRationales(t *testing.T) {
	m := &labeledReplies{replies: []string{
		"reasoning-alpha\nGRADE: A",
		"reasoning-beta\nGRADE: B",
		"reasoning-gamma\nGRADE: C",
	}}
	j := Judge{Model: m, Runs: 3}
	g, err := j.Grade(context.Background(), answerCase(), Transcript{Answer: "x"})
	if err != nil {
		t.Fatal(err)
	}
	if g.Grade != "unstable" {
		t.Fatalf("got grade %q", g.Grade)
	}
	for _, want := range []string{"reasoning-alpha", "reasoning-beta", "reasoning-gamma"} {
		if !strings.Contains(g.Rationale, want) {
			t.Errorf("rationale missing %q: %q", want, g.Rationale)
		}
	}
}

// item E: one flaky call must cost one case, not the run.
type errOnMarker struct{ marker string }

func (e *errOnMarker) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	if strings.Contains(msgs[0].Text, e.marker) {
		return chat.Reply{}, fmt.Errorf("boom")
	}
	return chat.Reply{Text: "ok\nGRADE: A", StopReason: "end_turn"}, nil
}

func TestGradeAllContinuesPastOneCasesErrorAndReturnsTheRest(t *testing.T) {
	c1 := answerCase()
	c2 := answerCase()
	c2.ID = "define-hmis-02"
	c2.Turns = []Turn{{Role: "user", Text: "distinctive-failing-question"}}
	ts := map[string]Transcript{c1.ID: {Answer: "a"}, c2.ID: {Answer: "b"}}
	j := Judge{Model: &errOnMarker{marker: "distinctive-failing-question"}, Runs: 1}
	grades, err := GradeAll(context.Background(), j, []Case{c1, c2}, ts)
	if err != nil {
		t.Fatalf("GradeAll returned an error though not every case failed: %v", err)
	}
	if len(grades) != 2 {
		t.Fatalf("got %d grades, want 2", len(grades))
	}
	var failing Grade
	for _, g := range grades {
		if g.CaseID == c2.ID {
			failing = g
		}
	}
	if failing.Grade != "?" || !strings.Contains(failing.Rationale, "judge error") {
		t.Fatalf("failing case = %+v", failing)
	}
}

func TestGradeAllReturnsErrorOnlyWhenEveryCaseFailed(t *testing.T) {
	c1 := answerCase()
	ts := map[string]Transcript{c1.ID: {Answer: "a"}}
	j := Judge{Model: &errOnMarker{marker: "what is a HIMS"}, Runs: 1}
	if _, err := GradeAll(context.Background(), j, []Case{c1}, ts); err == nil {
		t.Fatal("want an error when every case failed")
	}
}
