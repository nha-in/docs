package eval

import (
	"context"
	"encoding/json"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
	"github.com/eka-care/abdm-docs/mcp/internal/server/servertest"
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
