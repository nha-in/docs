package chat

import (
	"context"
	"strings"
	"testing"
)

// The panel attaches the page a reader is looking at when they open it from
// that page. These cover the four things that attachment has to get right:
// the model sees it, the transcript does not, its size is bounded, and an
// answer read off it is not mistaken for an ungrounded one.

// samplePage is what the panel attaches from a docs page. The path in it
// appears nowhere else, so a test can tell whether the answer was grounded
// by the page or by something the loop already had.
func samplePage() *Page {
	return &Page{
		Title:    "Link a care context",
		URL:      "/docs/hiecm/v3/api/m2/link-carecontext",
		Markdown: "# Link a care context\n\nPOST /v0.5/links/link/confirm carries the linkRefNumber.",
	}
}

func TestPageIsCarriedAsContextNotAsATurn(t *testing.T) {
	page := samplePage()
	fm := &fakeModel{replies: []Reply{{Text: "ok", StopReason: "end_turn"}}, texts: []string{"ok\n"}}
	svc := &Service{Model: fm, MaxTokens: 100}
	emit, _ := collectEvents()
	if err := svc.Respond(context.Background(),
		[]Turn{{Role: "user", Text: "what does this endpoint need?"}}, page, emit); err != nil {
		t.Fatal(err)
	}
	system := fm.gotSystem[0]
	for _, want := range []string{page.Title, page.URL, page.Markdown} {
		if !strings.Contains(system, want) {
			t.Errorf("system prompt is missing %q from the attached page", want)
		}
	}
	// The reader did not type the page, so it must not reach the model as a
	// message, which is what would make the model answer it as a question.
	for i, m := range fm.gotMsgs[0] {
		if strings.Contains(m.Text, "linkRefNumber") {
			t.Fatalf("message %d carries the page markdown as a turn: %q", i, m.Text)
		}
	}
}

func TestNoPageLeavesThePromptAndTheLoopAlone(t *testing.T) {
	// An older client sends no page at all, and opening the panel from the
	// top bar attaches none. Both must behave exactly as before.
	for name, page := range map[string]*Page{
		"nil":          nil,
		"emptyContent": {Title: "Somewhere", URL: "/docs/x"},
	} {
		fm := &fakeModel{replies: []Reply{{Text: "ok", StopReason: "end_turn"}}, texts: []string{"ok\n"}}
		svc := &Service{Model: fm, MaxTokens: 100}
		emit, _ := collectEvents()
		if err := svc.Respond(context.Background(),
			[]Turn{{Role: "user", Text: "hi"}}, page, emit); err != nil {
			t.Fatalf("%s: %v", name, err)
		}
		if fm.gotSystem[0] != SystemPrompt("") {
			t.Errorf("%s: system prompt changed with nothing attached", name)
		}
	}
}

func TestValidatePageCapsTheMarkdown(t *testing.T) {
	svc := &Service{}
	if err := svc.ValidatePage(nil); err != nil {
		t.Errorf("nil page rejected: %v", err)
	}
	// Multibyte on purpose: the cap counts runes, not bytes, so a page of
	// Devanagari is not rejected at a third of the length of an English one.
	atCap := &Page{Markdown: strings.Repeat("क", MaxPageChars)}
	if err := svc.ValidatePage(atCap); err != nil {
		t.Errorf("page at exactly MaxPageChars rejected: %v", err)
	}
	over := &Page{Markdown: strings.Repeat("x", MaxPageChars+1)}
	if err := svc.ValidatePage(over); err == nil {
		t.Error("page over MaxPageChars accepted, want error")
	}
	// Respond enforces it too, so no caller can route around the handler.
	svc.Model = &fakeModel{replies: []Reply{{StopReason: "end_turn"}}}
	emit, _ := collectEvents()
	if err := svc.Respond(context.Background(),
		[]Turn{{Role: "user", Text: "hi"}}, over, emit); err == nil {
		t.Error("Respond accepted an oversized page, want error")
	}
}

func TestPageGroundsAnAnswerThatCallsNoTools(t *testing.T) {
	// The grounding check blocks an answer that states API specifics while
	// citing nothing. An answer read straight off the attached page cites no
	// atom, but it is grounded, and the reader can see which page it came
	// from because the panel names it.
	page := samplePage()
	answer := "Send `POST /v0.5/links/link/confirm` with the linkRefNumber.\n"
	fm := &fakeModel{replies: []Reply{{Text: answer, StopReason: "end_turn"}}, texts: []string{answer}}
	svc := &Service{Model: fm, MaxTokens: 100}
	emit, evs := collectEvents()
	if err := svc.Respond(context.Background(),
		[]Turn{{Role: "user", Text: "how do I confirm the link?"}}, page, emit); err != nil {
		t.Fatal(err)
	}
	var got strings.Builder
	for _, e := range *evs {
		if e.name == "text" {
			got.WriteString(e.data.(map[string]string)["delta"])
		}
	}
	if strings.Contains(got.String(), blockedNotice) {
		t.Fatalf("an answer taken from the attached page was blocked: %q", got.String())
	}
	if !strings.Contains(got.String(), "/v0.5/links/link/confirm") {
		t.Fatalf("answer did not reach the reader: %q", got.String())
	}
}
