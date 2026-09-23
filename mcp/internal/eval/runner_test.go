package eval

import (
	"context"
	"encoding/json"
	"path/filepath"
	"strings"
	"testing"

	"github.com/nha-in/docs/mcp/internal/chat"
	"github.com/nha-in/docs/mcp/internal/server"
	"github.com/nha-in/docs/mcp/internal/server/servertest"
)

// toolThenAnswer searches once, then answers, which is the shape of every
// real question.
type toolThenAnswer struct{ round int }

func (m *toolThenAnswer) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	m.round++
	if m.round == 1 {
		return chat.Reply{ToolCalls: []chat.ToolCall{{ID: "1", Name: "search_docs",
			Input: json.RawMessage(`{"query":"ABDM-1035"}`)}}, StopReason: "tool_use"}, nil
	}
	onText("`ABDM-1035` means the `X-HIP-ID` header is not registered.\n\n")
	return chat.Reply{Text: "`ABDM-1035` means the `X-HIP-ID` header is not registered.", StopReason: "end_turn"}, nil
}

func TestRunWritesATranscriptWithToolsAndSources(t *testing.T) {
	r := servertest.Reader(t)
	tools := server.ChatTools(server.NewTools(r, nil).Defs())
	out := t.TempDir()
	cases := []Case{{ID: "diagnose-1035-01", Slice: "diagnose", Class: "diagnose",
		Turns:       []Turn{{Role: "user", Text: "what does ABDM-1035 mean"}},
		MustContain: []string{"not registered"}, ExpectedSources: []string{"hiecm.error.abdm-1035"},
		ExpectedShape: "diagnose", ExpectedBehaviour: "answer", SourceRow: "annexure#spec-errors-m2",
		CatalogueVersion: "2026.08.24"}}
	n, err := Run(context.Background(), RunConfig{OutDir: out, Model: &toolThenAnswer{},
		ModelID: "fake", Temperature: 0.1, Tools: tools, MaxTokens: 200}, cases)
	if err != nil || n != 1 {
		t.Fatalf("n=%d err=%v", n, err)
	}
	ts, err := ReadTranscripts(out)
	if err != nil {
		t.Fatal(err)
	}
	tr := ts["diagnose-1035-01"]
	if tr.Answer == "" || len(tr.Sources) == 0 || tr.Sources[0].ID != "hiecm.error.abdm-1035" {
		t.Fatalf("transcript incomplete: %+v", tr)
	}
	if len(tr.Calls) != 2 || len(tr.Calls[0].ToolResults) != 1 || tr.Calls[0].ToolResults[0].Name != "search_docs" {
		t.Fatalf("tool trace missing: %+v", tr.Calls)
	}
	if tr.Corpus == "" {
		t.Fatal("corpus empty")
	}
	if res := Check(cases[0], tr); len(res.Failures) != 0 {
		t.Fatalf("a good answer failed checks: %v", res.Failures)
	}
	if ret := Retrieval(cases[0], tr); !ret.Scored || ret.Recall3 != 1 {
		t.Fatalf("retrieval not scored: %+v", ret)
	}
	_ = filepath.Join
}

// TestRunRecordsTheRetrievalStackOnTheTranscript covers I7: two runs on
// different retrieval stacks must not compare as if they were the same
// instrument, so the provider and the index they ran against travel with
// every transcript rather than living only in the command line that
// produced them.
func TestRunRecordsTheRetrievalStackOnTheTranscript(t *testing.T) {
	out := t.TempDir()
	cases := []Case{{ID: "define-hmis-01", Slice: "define", Class: "define",
		Turns: []Turn{{Role: "user", Text: "what is a HIMS"}}, MustContain: []string{"hospital"},
		ExpectedShape: "define", ExpectedBehaviour: "answer", SourceRow: "annexure#glossary",
		CatalogueVersion: "2026.08.24"}}
	fm := &toolThenAnswer{round: 1} // skip straight to the text-only reply
	n, err := Run(context.Background(), RunConfig{OutDir: out, Model: fm, ModelID: "fake",
		Temperature: 0.1, MaxTokens: 200, EmbedProvider: "bedrock", DBPath: "catalogue.db"}, cases)
	if err != nil || n != 1 {
		t.Fatalf("n=%d err=%v", n, err)
	}
	ts, err := ReadTranscripts(out)
	if err != nil {
		t.Fatal(err)
	}
	tr := ts["define-hmis-01"]
	if tr.EmbedProvider != "bedrock" || tr.DBPath != "catalogue.db" {
		t.Fatalf("transcript did not record the retrieval stack: embed_provider=%q db_path=%q", tr.EmbedProvider, tr.DBPath)
	}
}

// twoCallsThenAnswer makes two tool calls in a single round, then answers.
// It is the shape a question takes when the model looks two places before
// it has enough to answer.
type twoCallsThenAnswer struct{ round int }

func (m *twoCallsThenAnswer) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	m.round++
	if m.round == 1 {
		return chat.Reply{ToolCalls: []chat.ToolCall{
			{ID: "1", Name: "search_docs", Input: json.RawMessage(`{"query":"ABDM-1035"}`)},
			{ID: "2", Name: "catalogue_info", Input: json.RawMessage(`{}`)},
		}, StopReason: "tool_use"}, nil
	}
	onText("fine")
	return chat.Reply{Text: "fine", StopReason: "end_turn"}, nil
}

func TestRunPairsToolResultsWithTheCallThatMadeThem(t *testing.T) {
	r := servertest.Reader(t)
	tools := server.ChatTools(server.NewTools(r, nil).Defs())
	out := t.TempDir()
	cases := []Case{{ID: "diagnose-two-calls", Slice: "diagnose", Class: "diagnose",
		Turns:       []Turn{{Role: "user", Text: "what does ABDM-1035 mean"}},
		MustContain: []string{"fine"}, ExpectedShape: "diagnose", ExpectedBehaviour: "answer",
		SourceRow: "annexure#spec-errors-m2", CatalogueVersion: "2026.08.24"}}
	n, err := Run(context.Background(), RunConfig{OutDir: out, Model: &twoCallsThenAnswer{},
		ModelID: "fake", Temperature: 0.1, Tools: tools, MaxTokens: 200}, cases)
	if err != nil || n != 1 {
		t.Fatalf("n=%d err=%v", n, err)
	}
	ts, err := ReadTranscripts(out)
	if err != nil {
		t.Fatal(err)
	}
	tr := ts["diagnose-two-calls"]
	if len(tr.Calls) != 2 {
		t.Fatalf("calls = %d, want 2", len(tr.Calls))
	}
	got := tr.Calls[0].ToolResults
	if len(got) != 2 || got[0].Name != "search_docs" || got[1].Name != "catalogue_info" {
		t.Fatalf("tool results out of order or missing: %+v", got)
	}
	if len(tr.Calls[1].ToolResults) != 0 {
		t.Fatalf("the answering call should carry no tool results: %+v", tr.Calls[1].ToolResults)
	}
}

// unknownToolThenAnswer names a tool that does not exist, so runTool takes
// its error path, then answers anyway once the error comes back. This is
// the shape that would have caught the tool_result event breaking the
// stream on an error payload that is not itself valid JSON.
type unknownToolThenAnswer struct{ round int }

func (m *unknownToolThenAnswer) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	m.round++
	if m.round == 1 {
		return chat.Reply{ToolCalls: []chat.ToolCall{{ID: "1", Name: "no_such_tool",
			Input: json.RawMessage(`{}`)}}, StopReason: "tool_use"}, nil
	}
	onText("still fine")
	return chat.Reply{Text: "still fine", StopReason: "end_turn"}, nil
}

func TestRunRecordsAnErroredToolCallWithoutAbortingTheRun(t *testing.T) {
	r := servertest.Reader(t)
	tools := server.ChatTools(server.NewTools(r, nil).Defs())
	out := t.TempDir()
	cases := []Case{{ID: "diagnose-unknown-tool", Slice: "diagnose", Class: "diagnose",
		Turns:       []Turn{{Role: "user", Text: "what does ABDM-1035 mean"}},
		MustContain: []string{"fine"}, ExpectedShape: "diagnose", ExpectedBehaviour: "answer",
		SourceRow: "annexure#spec-errors-m2", CatalogueVersion: "2026.08.24"}}
	n, err := Run(context.Background(), RunConfig{OutDir: out, Model: &unknownToolThenAnswer{},
		ModelID: "fake", Temperature: 0.1, Tools: tools, MaxTokens: 200}, cases)
	if err != nil || n != 1 {
		t.Fatalf("an errored tool call must not abort the run: n=%d err=%v", n, err)
	}
	ts, err := ReadTranscripts(out)
	if err != nil {
		t.Fatal(err)
	}
	tr := ts["diagnose-unknown-tool"]
	if tr.Answer != "still fine" {
		t.Fatalf("answer = %q, want the model's answer after the error came back", tr.Answer)
	}
	if len(tr.Calls) != 2 || len(tr.Calls[0].ToolResults) != 1 || tr.Calls[0].ToolResults[0].Name != "no_such_tool" {
		t.Fatalf("errored tool call trace missing: %+v", tr.Calls)
	}
	if !json.Valid(tr.Calls[0].ToolResults[0].Output) {
		t.Fatalf("errored tool output must still be valid JSON: %s", tr.Calls[0].ToolResults[0].Output)
	}
}

// TestLastUserMessageText covers finding 1: the corpus the grounding check
// scores against must include the pre-retrieved pack, and the pack never
// appears as a tool_result event -- it rides in the last user message of
// the first model call instead.
func TestLastUserMessageText(t *testing.T) {
	cases := []struct {
		name string
		msgs []chat.Message
		want string
	}{
		{"no messages", nil, ""},
		{"last message is the user's", []chat.Message{
			{Role: "user", Text: "<passages>\npack\n</passages>\n\nwhat is an abha address"},
		}, "<passages>\npack\n</passages>\n\nwhat is an abha address"},
		{"last message is the assistant's", []chat.Message{
			{Role: "user", Text: "question"},
			{Role: "assistant", Text: "answer"},
		}, "question"},
	}
	for _, c := range cases {
		if got := lastUserMessageText(c.msgs); got != c.want {
			t.Errorf("%s: lastUserMessageText = %q, want %q", c.name, got, c.want)
		}
	}
}

// TestStripAnswerShapeDropsTheExemplarButKeepsTheDocumentation covers the
// finding that the answer_shape block's own exemplar text, which can carry
// a literal like an error code that never came from a passage, must not
// enter the grounding corpus, while the passages and page text sharing that
// same message are real documentation and must survive.
func TestStripAnswerShapeDropsTheExemplarButKeepsTheDocumentation(t *testing.T) {
	msg := "<passages>\nABDM-2000 is an invalid TIMESTAMP header.\n</passages>\n\n" +
		`<answer_shape name="diagnose" budget="200 words">` + "\n" +
		"Example:\nABDM-1016 is NHA's code for an invalid TIMESTAMP header.\n" +
		"</answer_shape>\n\nwhy do I get ABDM-2000"
	got := stripAnswerShape(msg)
	if !strings.Contains(got, "ABDM-2000") {
		t.Errorf("the passage's own identifier must survive stripping: %q", got)
	}
	if strings.Contains(got, "ABDM-1016") {
		t.Errorf("the exemplar identifier inside answer_shape must not survive stripping: %q", got)
	}
	if strings.Contains(got, "<answer_shape") || strings.Contains(got, "</answer_shape>") {
		t.Errorf("the answer_shape tags themselves must not survive stripping: %q", got)
	}
	if !strings.Contains(got, "why do I get ABDM-2000") {
		t.Errorf("the reader's own question must survive stripping: %q", got)
	}
}
