package chat

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"testing"
	"unicode/utf8"
)

// fakeModel scripts a sequence of replies, one per call, in order. texts[i],
// if non-empty, is streamed through onText before replies[i] is returned,
// mirroring how a real Model streams text deltas ahead of the final Reply.
//
// The two tests that need real tool execution against a genuine catalogue
// snapshot (TestLoopToolCallThenAnswer, TestLoopBudgetExhausted) live in
// loop_integration_test.go instead, in an external chat_test package: they
// need server.NewTools to build real []ToolDef values, and package server
// imports package chat (for the HTTP handler, Task 6), so an internal test
// file here importing server would be a self-import cycle. See that file's
// doc comment for the full explanation.
type fakeModel struct {
	replies []Reply
	texts   []string
	calls   int
	gotMsgs [][]Message
}

func (f *fakeModel) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {
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

func TestValidateTurnsRejectsBadShapes(t *testing.T) {
	svc := &Service{}
	cases := map[string][]Turn{
		"empty":           {},
		"endsAssistant":   {{Role: "assistant", Text: "hi"}},
		"startsAssistant": {{Role: "assistant", Text: "hi"}, {Role: "user", Text: "hi"}},
		"consecutiveUser": {{Role: "user", Text: "a"}, {Role: "user", Text: "b"}},
	}
	for name, turns := range cases {
		if err := svc.ValidateTurns(turns); err == nil {
			t.Errorf("%s: want error, got nil", name)
		}
	}
	tooLong := []Turn{{Role: "user", Text: string(make([]byte, MaxInputLen+1))}}
	if err := svc.ValidateTurns(tooLong); err == nil {
		t.Error("tooLong: want error, got nil")
	}
	tooManyTurns := make([]Turn, 0, MaxTurns+2)
	for i := 0; i <= MaxTurns; i++ {
		role := "user"
		if i%2 == 1 {
			role = "assistant"
		}
		tooManyTurns = append(tooManyTurns, Turn{Role: role, Text: "x"})
	}
	if err := svc.ValidateTurns(tooManyTurns); err == nil {
		t.Error("tooManyTurns: want error, got nil")
	}
	if err := svc.ValidateTurns([]Turn{{Role: "user", Text: "hi"}}); err != nil {
		t.Errorf("valid single turn rejected: %v", err)
	}
	valid := []Turn{
		{Role: "user", Text: "hi"},
		{Role: "assistant", Text: "hello"},
		{Role: "user", Text: "and then?"},
	}
	if err := svc.ValidateTurns(valid); err != nil {
		t.Errorf("valid alternating turns rejected: %v", err)
	}
}

func TestValidateTurnsCapsAssistantLen(t *testing.T) {
	// Only user turns were length-capped; an oversized assistant turn (the
	// wire format lets a client submit one directly, not just the model's
	// own prior reply) must be rejected too, or a single request can carry
	// unbounded assistant text into every Bedrock round.
	svc := &Service{}
	tooLong := []Turn{
		{Role: "user", Text: "hi"},
		{Role: "assistant", Text: strings.Repeat("x", MaxAssistantLen+1)},
		{Role: "user", Text: "and then?"},
	}
	if err := svc.ValidateTurns(tooLong); err == nil {
		t.Error("oversized assistant turn accepted, want rejection")
	}
	ok := []Turn{
		{Role: "user", Text: "hi"},
		{Role: "assistant", Text: strings.Repeat("x", MaxAssistantLen)},
		{Role: "user", Text: "and then?"},
	}
	if err := svc.ValidateTurns(ok); err != nil {
		t.Errorf("assistant turn at exactly MaxAssistantLen rejected: %v", err)
	}
}

func TestRespondRejectsInvalidTurns(t *testing.T) {
	svc := &Service{Model: &fakeModel{}}
	emit, _ := collectEvents()
	err := svc.Respond(context.Background(), []Turn{{Role: "assistant", Text: "hi"}}, emit)
	if err == nil {
		t.Fatal("want validation error, got nil")
	}
}

func TestValidateTurnsMultibyteRuneCount(t *testing.T) {
	// MaxInputLen is a character (rune) budget, not a byte budget. A
	// Devanagari question is ~3 bytes/rune, so counting bytes would reject
	// a perfectly reasonable multilingual question well under the limit.
	svc := &Service{}
	ok := []Turn{{Role: "user", Text: strings.Repeat("न", 1500)}}
	if err := svc.ValidateTurns(ok); err != nil {
		t.Errorf("1500-rune multibyte text rejected: %v", err)
	}
	tooLong := []Turn{{Role: "user", Text: strings.Repeat("न", 2001)}}
	if err := svc.ValidateTurns(tooLong); err == nil {
		t.Error("2001-rune multibyte text accepted, want rejection")
	}
}

func TestToolDetailTruncatesOnRunes(t *testing.T) {
	// A multibyte rune sitting across the 80-character boundary must not be
	// split mid-rune, which byte-slicing would do.
	query := strings.Repeat("न", 90)
	c := ToolCall{Name: "search_docs", Input: json.RawMessage(`{"query":"` + query + `"}`)}
	detail := toolDetail(c)
	if !utf8.ValidString(detail) {
		t.Fatalf("toolDetail produced invalid UTF-8: %q", detail)
	}
	if got := utf8.RuneCountInString(detail); got != 80 {
		t.Fatalf("toolDetail rune count = %d, want 80", got)
	}
}

func TestRespondStopsOnFirstEmitTextError(t *testing.T) {
	// A client disconnect surfaces as an emit error from the SSE writer.
	// The loop must notice it right where it happens -- on the "text"
	// event -- rather than only at the next tool/sources emit, which would
	// waste a whole extra model round on a dead connection.
	fm := &fakeModel{
		replies: []Reply{{Text: "hello", StopReason: "end_turn"}},
		texts:   []string{"hello"},
	}
	svc := &Service{Model: fm, MaxTokens: 100}
	wantErr := errors.New("client gone")
	emit := func(name string, data any) error {
		if name == "text" {
			return wantErr
		}
		return nil
	}
	err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, emit)
	if !errors.Is(err, wantErr) {
		t.Fatalf("err = %v, want %v", err, wantErr)
	}
	if fm.calls != 1 {
		t.Fatalf("model called %d times, want 1 (must stop after the first emit error, not make a second call)", fm.calls)
	}
}

func TestLoopUnknownToolRoutesAround(t *testing.T) {
	// The model asks for a tool that does not exist; the loop must hand back
	// an error ToolResult rather than failing the whole turn, so the model
	// can route around it.
	fm := &fakeModel{
		replies: []Reply{
			{ToolCalls: []ToolCall{{ID: "t1", Name: "no_such_tool", Input: json.RawMessage(`{}`)}},
				StopReason: "tool_use"},
			{Text: "done", StopReason: "end_turn"},
		},
		texts: []string{"", "done"},
	}
	svc := &Service{Model: fm, Tools: nil, MaxTokens: 100}
	emit, _ := collectEvents()
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, emit); err != nil {
		t.Fatal(err)
	}
	last := fm.gotMsgs[1]
	tr := last[len(last)-1].ToolResult
	if tr == nil || !tr.IsError || string(tr.Content) != "unknown tool" {
		t.Fatalf("tool result = %+v, want an IsError result with content %q", tr, "unknown tool")
	}
}

func TestLoopPreservesTextAlongsideToolCalls(t *testing.T) {
	// A Reply can carry both Text and ToolCalls at once: the model streamed
	// some prose ("checking the catalogue...") before deciding to call a
	// tool. That text must not be dropped from the conversation history fed
	// into the next round, or the model never sees what it already said and
	// can repeat itself.
	fm := &fakeModel{
		replies: []Reply{
			{Text: "checking", ToolCalls: []ToolCall{{ID: "t1", Name: "no_such_tool", Input: json.RawMessage(`{}`)}},
				StopReason: "tool_use"},
			{Text: "done", StopReason: "end_turn"},
		},
		texts: []string{"checking", "done"},
	}
	svc := &Service{Model: fm, Tools: nil, MaxTokens: 100}
	emit, _ := collectEvents()
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, emit); err != nil {
		t.Fatal(err)
	}
	if fm.calls != 2 {
		t.Fatalf("model called %d times, want 2", fm.calls)
	}
	second := fm.gotMsgs[1]
	var found bool
	for _, m := range second {
		if m.Role == "assistant" && m.Text == "checking" {
			found = true
		}
	}
	if !found {
		t.Fatalf("second model call's messages missing assistant text %q: %+v", "checking", second)
	}
}
