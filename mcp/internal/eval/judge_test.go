package eval

import (
	"context"
	"strings"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
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
