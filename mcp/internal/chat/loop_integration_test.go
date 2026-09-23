// Package chat_test (external, not chat) holds the two loop tests that need
// real []chat.ToolDef values built by server.NewTools against a genuine
// catalogue snapshot: TestLoopToolCallThenAnswer (a real search_docs call)
// and TestLoopBudgetExhausted (a real catalogue_info call, six times over).
//
// They cannot live in loop_test.go (package chat, an internal test file):
// package server imports package chat for the /api/chat HTTP handler (Task
// 6), so an internal chat test file that also imports server would import a
// package that imports the package under test -- Go's test tooling rejects
// that outright ("import cycle not allowed in test"), even though no actual
// production cycle exists. An external test package sidesteps the
// restriction entirely, the same way internal/server/servertest and this
// package's own sibling internal/server/chat_endpoint_test.go do for the
// mirror-image problem.
package chat_test

import (
	"context"
	"encoding/json"
	"slices"
	"testing"

	"github.com/nha-in/docs/mcp/internal/chat"
	"github.com/nha-in/docs/mcp/internal/server"
	"github.com/nha-in/docs/mcp/internal/server/servertest"
)

// fakeModel is a copy of chat's own unexported fakeModel (loop_test.go),
// duplicated here because an external test package cannot reach an
// unexported type in the package it tests.
type fakeModel struct {
	replies []chat.Reply
	texts   []string
	calls   int
	gotMsgs [][]chat.Message
}

func (f *fakeModel) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	f.gotMsgs = append(f.gotMsgs, msgs)
	i := f.calls
	f.calls++
	if i < len(f.texts) && f.texts[i] != "" {
		onText(f.texts[i])
	}
	return f.replies[i], nil
}

type event struct {
	name string
	data any
}

func collectEvents() (func(string, any) error, *[]event) {
	var evs []event
	return func(name string, data any) error {
		evs = append(evs, event{name, data})
		return nil
	}, &evs
}

// toolCallThenAnswer builds the fakeModel and tools every test in this
// group answers with: one search_docs call, then a text answer.
func toolCallThenAnswer(t *testing.T) (*fakeModel, []chat.ToolDef) {
	t.Helper()
	r := servertest.Reader(t)
	tools := server.ChatTools(server.NewTools(r, nil).Defs())
	fm := &fakeModel{
		replies: []chat.Reply{
			{ToolCalls: []chat.ToolCall{{ID: "t1", Name: "search_docs",
				Input: json.RawMessage(`{"query":"timestamp"}`)}}, StopReason: "tool_use"},
			{Text: "It is ISO 8601 UTC.", StopReason: "end_turn"},
		},
		texts: []string{"", "It is ISO 8601 UTC."},
	}
	return fm, tools
}

func TestLoopToolCallThenAnswer(t *testing.T) {
	fm, tools := toolCallThenAnswer(t)
	// TraceTools is the eval harness's opt in (internal/eval/runner.go);
	// this test covers what it turns on.
	svc := &chat.Service{Model: fm, Tools: tools, MaxTokens: 100, TraceTools: true}
	emit, evs := collectEvents()
	err := svc.Respond(context.Background(),
		[]chat.Turn{{Role: "user", Text: "what is the timestamp format?"}}, nil, emit)
	if err != nil {
		t.Fatal(err)
	}
	names := []string{}
	for _, e := range *evs {
		names = append(names, e.name)
	}
	// tool event before the call, tool_result after it, then streamed text,
	// then sources, then done.
	want := []string{"tool", "tool_result", "text", "sources", "done"}
	if !slices.Equal(names, want) {
		t.Fatalf("events %v, want %v", names, want)
	}
	// The second model call must carry the tool result back.
	last := fm.gotMsgs[1]
	if last[len(last)-1].ToolResult == nil {
		t.Fatal("tool result was not appended to the conversation")
	}
	// The tool event names the search_docs call with its query as the detail.
	toolEvt := (*evs)[0]
	data, ok := toolEvt.data.(map[string]string)
	if !ok || data["name"] != "search_docs" || data["detail"] != "timestamp" {
		t.Errorf("tool event data = %+v", toolEvt.data)
	}
	// The tool_result event carries the raw input and output the eval
	// harness records; it is the recorder's evidence, not the reader's cue.
	resultEvt := (*evs)[1]
	rdata, ok := resultEvt.data.(map[string]any)
	if !ok || rdata["name"] != "search_docs" {
		t.Errorf("tool_result event data = %+v", resultEvt.data)
	}
	if _, ok := rdata["input"].(json.RawMessage); !ok {
		t.Errorf("tool_result input = %+v, want json.RawMessage", rdata["input"])
	}
}

// TestLoopToolResultAbsentWithoutTraceTools covers I10: the tool_result
// event carries every raw tool payload, so a reader's panel must never
// receive it. Service.TraceTools defaults to false, which every
// reader-facing deployment (cmd/docs-mcp/main.go) leaves alone.
func TestLoopToolResultAbsentWithoutTraceTools(t *testing.T) {
	fm, tools := toolCallThenAnswer(t)
	svc := &chat.Service{Model: fm, Tools: tools, MaxTokens: 100}
	emit, evs := collectEvents()
	if err := svc.Respond(context.Background(),
		[]chat.Turn{{Role: "user", Text: "what is the timestamp format?"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	names := []string{}
	for _, e := range *evs {
		names = append(names, e.name)
	}
	want := []string{"tool", "text", "sources", "done"}
	if !slices.Equal(names, want) {
		t.Fatalf("events %v, want %v (no tool_result without TraceTools)", names, want)
	}
}

// TestLoopToolResultGuardsATruncatedToolInput covers the other half of
// I10: a tool-use input cut off at max_tokens is invalid JSON, and the
// tool_result event must guard it exactly as the output side is already
// guarded, rather than let json.Marshal fail and abort the round.
func TestLoopToolResultGuardsATruncatedToolInput(t *testing.T) {
	r := servertest.Reader(t)
	tools := server.ChatTools(server.NewTools(r, nil).Defs())
	fm := &fakeModel{
		replies: []chat.Reply{
			{ToolCalls: []chat.ToolCall{{ID: "t1", Name: "search_docs",
				Input: json.RawMessage(`{"query":"timestamp"`)}}, StopReason: "tool_use"}, // truncated: no closing brace
			{Text: "It is ISO 8601 UTC.", StopReason: "end_turn"},
		},
		texts: []string{"", "It is ISO 8601 UTC."},
	}
	svc := &chat.Service{Model: fm, Tools: tools, MaxTokens: 100, TraceTools: true}
	emit, evs := collectEvents()
	if err := svc.Respond(context.Background(),
		[]chat.Turn{{Role: "user", Text: "what is the timestamp format?"}}, nil, emit); err != nil {
		t.Fatalf("a truncated tool input aborted the round: %v", err)
	}
	var resultEvt *event
	for i := range *evs {
		if (*evs)[i].name == "tool_result" {
			resultEvt = &(*evs)[i]
		}
	}
	if resultEvt == nil {
		t.Fatal("no tool_result event; the truncated input aborted the round instead of being guarded")
	}
	rdata := resultEvt.data.(map[string]any)
	if _, ok := rdata["input"].(string); !ok {
		t.Errorf("tool_result input = %+v (%T), want a plain string for invalid JSON", rdata["input"], rdata["input"])
	}
}

func TestLoopBudgetExhausted(t *testing.T) {
	call := chat.Reply{ToolCalls: []chat.ToolCall{{ID: "x", Name: "catalogue_info",
		Input: json.RawMessage(`{}`)}}, StopReason: "tool_use"}
	replies := []chat.Reply{call, call, call, call, call, call, // 6 = chat.MaxToolCalls
		{Text: "best effort", StopReason: "end_turn"}}
	fm := &fakeModel{replies: replies, texts: make([]string, 7)}
	r := servertest.Reader(t)
	svc := &chat.Service{Model: fm, Tools: server.ChatTools(server.NewTools(r, nil).Defs()), MaxTokens: 100}
	emit, _ := collectEvents()
	if err := svc.Respond(context.Background(),
		[]chat.Turn{{Role: "user", Text: "what is an ABHA"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	if fm.calls != 7 {
		t.Fatalf("model called %d times, want 7 (6 tool rounds + forced answer)", fm.calls)
	}
	// The forced-answer call's last message is the budget-exhausted notice,
	// appended as a user text message after the sixth tool round -- not a
	// ToolResult. (Amends the plan's draft assertion: see progress.md's
	// Task 5 ruling.)
	final := fm.gotMsgs[6]
	got := final[len(final)-1]
	if got.ToolResult != nil {
		t.Fatalf("expected the forced-answer call's last message to be the budget notice, got a ToolResult: %+v", got)
	}
	if got.Role != "user" || got.Text != "Tool budget exhausted. Answer now from what you have." {
		t.Fatalf("final message = %+v, want the budget-exhausted user notice", got)
	}
}
