package eval

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

type scripted struct{ reply chat.Reply }

func (s scripted) Stream(ctx context.Context, system string, tools []chat.ToolDef,
	msgs []chat.Message, maxTokens int, onText func(string)) (chat.Reply, error) {
	onText(s.reply.Text)
	return s.reply, nil
}

func TestRecordingModelKeepsEveryCall(t *testing.T) {
	rm := &RecordingModel{Inner: scripted{reply: chat.Reply{Text: "HMIS is hospital software.", StopReason: "end_turn"}}}
	var got string
	_, err := rm.Stream(context.Background(), "sys", nil,
		[]chat.Message{{Role: "user", Text: "what is HMIS"}}, 100, func(d string) { got += d })
	if err != nil {
		t.Fatal(err)
	}
	if len(rm.Calls) != 1 || rm.Calls[0].System != "sys" || rm.Calls[0].Reply.Text != "HMIS is hospital software." {
		t.Fatalf("calls = %+v", rm.Calls)
	}
	if got != "HMIS is hospital software." {
		t.Fatalf("onText saw %q", got)
	}
}

func TestTranscriptRoundTrips(t *testing.T) {
	dir := t.TempDir()
	in := Transcript{CaseID: "define-hmis-01", CatalogueVersion: "2026.08.24", ModelID: "m",
		Temperature: 0.1, Answer: "HMIS is hospital software.", Corpus: "HMIS hospital",
		Sources: []chat.Source{{ID: "shared.glossary.hmis", Title: "HMIS", URL: "/docs/x"}}}
	if err := WriteTranscript(dir, in); err != nil {
		t.Fatal(err)
	}
	out, err := ReadTranscripts(dir)
	if err != nil {
		t.Fatal(err)
	}
	if out["define-hmis-01"].Answer != in.Answer || out["define-hmis-01"].Sources[0].ID != "shared.glossary.hmis" {
		t.Fatalf("round trip lost data: %+v", out)
	}
	if _, err := ReadTranscripts(filepath.Join(dir, "missing")); err == nil {
		t.Fatal("a missing dir should be an error")
	}
}
