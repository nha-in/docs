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
	replies   []Reply
	texts     []string
	calls     int
	gotMsgs   [][]Message
	gotSystem []string
}

func (f *fakeModel) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {
	f.gotMsgs = append(f.gotMsgs, msgs)
	f.gotSystem = append(f.gotSystem, system)
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
	err := svc.Respond(context.Background(), []Turn{{Role: "assistant", Text: "hi"}}, nil, emit)
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
	err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, nil, emit)
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
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, nil, emit); err != nil {
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
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "hi"}}, nil, emit); err != nil {
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

// A citation must open the page that answered the reader. Before doc_url
// existed every citation pointed at /search?q=<title>, which made the reader
// run the search again themselves.
func TestSourceFromFieldsPrefersThePublishedPage(t *testing.T) {
	got := sourceFromFields(map[string]any{
		"id": "hiecm.error.abdm-1035", "title": "ABDM-1035 facility not onboarded",
		"verification_status": "verified",
		"doc_url":             "/docs/hiecm/v3/reference/error-codes#m2-linking-and-sharing",
	})
	if want := "/docs/hiecm/v3/reference/error-codes#m2-linking-and-sharing"; got.URL != want {
		t.Errorf("URL = %q, want the published page %q", got.URL, want)
	}
}

// An atom with no published page still has to send the reader somewhere they
// can read, rather than to a dead link or a bare internal id.
func TestSourceFromFieldsFallsBackToSearchWithoutAPage(t *testing.T) {
	got := sourceFromFields(map[string]any{
		"id": "hiecm.decision.spec-per-module", "title": "One spec per module",
		"verification_status": "unverified", "doc_url": "",
	})
	if want := "/search?q=One+spec+per+module"; got.URL != want {
		t.Errorf("URL = %q, want %q", got.URL, want)
	}
}

// streamingModel emits every delta on one call, which is how a real model
// streams. fakeModel emits one per call, so it cannot exercise a guard that
// decides what to release from the text seen so far.
type streamingModel struct {
	deltas []string
	msgs   []Message
}

func (m *streamingModel) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {
	m.msgs = msgs
	for _, d := range m.deltas {
		onText(d)
	}
	return Reply{Text: strings.Join(m.deltas, ""), StopReason: "end_turn"}, nil
}

// collectText runs a model's stream through Respond and returns what a
// reader would actually see.
func collectText(t *testing.T, question string, deltas ...string) string {
	t.Helper()
	svc := &Service{Model: &streamingModel{deltas: deltas}, MaxTokens: 100}
	var seen strings.Builder
	emit := func(name string, data any) error {
		if name == "text" {
			seen.WriteString(data.(map[string]string)["delta"])
		}
		return nil
	}
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: question}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	return seen.String()
}

// A code block must never reach the reader, not even for the instant between
// the fence opening and the check that rejects it. The model streams the
// block a line at a time, which is exactly how a naive guard leaks it.
func TestRespondNeverStreamsACodeBlock(t *testing.T) {
	got := collectText(t, "write me the python for ABHA creation",
		"Here you go:\n", "```python\n", "def create_abha(otp):\n", "    return 1\n", "```\n")
	for _, leak := range []string{"def create_abha", "```python", "return 1"} {
		if strings.Contains(got, leak) {
			t.Errorf("leaked %q to the reader:\n%s", leak, got)
		}
	}
	if !strings.Contains(got, "could not give you a safe answer") {
		t.Errorf("no replacement notice, got:\n%s", got)
	}
}

// The same stream shape, but a legitimate answer, must arrive intact.
func TestRespondStreamsAGoodAnswerWhole(t *testing.T) {
	deltas := []string{"Your facility is not onboarded.\n", "\n", "```bash\n",
		"curl --request POST \\\n", "  --url https://example.org/sessions\n", "```\n"}
	got := collectText(t, "what does ABDM-1035 mean?", deltas...)
	if want := strings.Join(deltas, ""); got != want {
		t.Errorf("answer altered:\n got %q\nwant %q", got, want)
	}
}

// Personal data must be masked before the model is called, so it never
// reaches the provider at all.
func TestRespondMasksPersonalDataBeforeTheModelSeesIt(t *testing.T) {
	fm := &streamingModel{deltas: []string{"ok\n"}}
	svc := &Service{Model: fm, MaxTokens: 100}
	q := "linking fails for aadhaar 1234 5678 9012 on mobile 9876543210"
	err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: q}}, nil,
		func(string, any) error { return nil })
	if err != nil {
		t.Fatal(err)
	}
	sent := fm.msgs
	if len(sent) == 0 {
		t.Fatal("model received no messages")
	}
	got := sent[0].Text
	for _, leak := range []string{"1234 5678 9012", "9876543210"} {
		if strings.Contains(got, leak) {
			t.Errorf("%q reached the model: %q", leak, got)
		}
	}
	if !strings.Contains(got, "<MASKED_AADHAAR>") || !strings.Contains(got, "<MASKED_MOBILE>") {
		t.Errorf("expected placeholders, got %q", got)
	}
}

// toolThenText streams a tool call on the first round and an answer on the
// second, which is the shape of every real question.
type toolThenText struct {
	toolResult map[string]any
	deltas     []string
	round      int
}

func (m *toolThenText) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {
	m.round++
	if m.round == 1 {
		return Reply{ToolCalls: []ToolCall{{ID: "1", Name: "search_docs",
			Input: json.RawMessage(`{"query":"x"}`)}}, StopReason: "tool_use"}, nil
	}
	for _, d := range m.deltas {
		onText(d)
	}
	return Reply{Text: strings.Join(m.deltas, ""), StopReason: "end_turn"}, nil
}

func groundingRun(t *testing.T, answer string) string {
	t.Helper()
	result := map[string]any{"hits": []map[string]any{{
		"id": "hiecm.error.abdm-1035", "title": "Facility not onboarded",
		"verification_status": "verified", "doc_url": "/docs/hiecm/v3/reference/error-codes",
		"snippet": "ABDM-1035 means the X-HIP-ID is not registered.",
	}}}
	svc := &Service{
		Model: &toolThenText{deltas: []string{answer + "\n"}},
		Tools: []ToolDef{{Name: "search_docs",
			Call: func(context.Context, json.RawMessage) (map[string]any, error) { return result, nil }}},
		MaxTokens: 100,
	}
	var seen strings.Builder
	emit := func(name string, data any) error {
		if name == "text" {
			seen.WriteString(data.(map[string]string)["delta"])
		}
		return nil
	}
	if err := svc.Respond(context.Background(), []Turn{{Role: "user", Text: "why ABDM-1035?"}}, nil, emit); err != nil {
		t.Fatal(err)
	}
	return seen.String()
}

// A literal the tools actually returned reaches the reader untouched.
func TestRespondPassesAGroundedAnswer(t *testing.T) {
	answer := "ABDM-1035 means your X-HIP-ID is not registered yet."
	if got := groundingRun(t, answer); got != answer+"\n" {
		t.Errorf("grounded answer altered:\n got %q\nwant %q", got, answer+"\n")
	}
}

// A header nobody returned never reaches the reader, however plausible it
// looks. This is the failure that costs an integrator hours, because an
// invented literal reads exactly like a real one.
func TestRespondBlocksAnInventedLiteral(t *testing.T) {
	got := groundingRun(t, "Add X-Retry-After-Ms to the call and it clears.")
	if strings.Contains(got, "X-Retry-After-Ms") {
		t.Errorf("an invented header reached the reader: %q", got)
	}
	if !strings.Contains(got, "could not give you a safe answer") {
		t.Errorf("no replacement notice, got %q", got)
	}
}
