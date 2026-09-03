package eval

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
)

type RunConfig struct {
	OutDir           string
	Model            chat.Model
	ModelID          string
	Temperature      float64
	Tools            []chat.ToolDef
	MaxTokens        int
	MCPURL           string
	PromptVersion    string
	CatalogueVersion string
}

func toTurns(c Case) ([]chat.Turn, *chat.Page) {
	turns := make([]chat.Turn, 0, len(c.Turns))
	for i, t := range c.Turns {
		turn := chat.Turn{Role: t.Role, Text: t.Text}
		// The attachment rides on the first user turn, which is how the
		// panel sends it and how a follow-up still has it.
		if c.Attachment != nil && i == 0 && t.Role == "user" {
			turn.Attachment = &chat.Attachment{Name: c.Attachment.Name, Text: c.Attachment.Text, Kind: c.Attachment.Kind}
		}
		turns = append(turns, turn)
	}
	var page *chat.Page
	if c.Page != nil {
		page = &chat.Page{Title: c.Page.Title, URL: c.Page.URL, Markdown: c.Page.Markdown}
	}
	return turns, page
}

// Run answers every case through the chat loop and writes one transcript
// each. A case that errors still gets a transcript, with the error in Flags,
// so the scorecard counts it rather than the run stopping.
func Run(ctx context.Context, cfg RunConfig, cases []Case) (int, error) {
	var first error
	n := 0
	for _, c := range cases {
		rec := &RecordingModel{Inner: cfg.Model}
		svc := &chat.Service{Model: rec, Tools: cfg.Tools, MaxTokens: cfg.MaxTokens, MCPURL: cfg.MCPURL}
		tr := Transcript{CaseID: c.ID, CatalogueVersion: cfg.CatalogueVersion, ModelID: cfg.ModelID,
			Temperature: cfg.Temperature, PromptVersion: cfg.PromptVersion,
			RecordedAt: time.Now().UTC().Format(time.RFC3339)}
		var answer, corpus strings.Builder
		var pendingTools []ToolTrace
		emit := func(event string, data any) error {
			switch event {
			case "text":
				answer.WriteString(data.(map[string]string)["delta"])
			case "tool_result":
				m := data.(map[string]any)
				in, _ := m["input"].(json.RawMessage)
				// output is json.RawMessage when the tool returned valid
				// JSON and a plain string (an error message such as
				// "unknown tool") otherwise; either way ToolTrace.Output
				// ends up valid JSON, a bare string marshalled into one.
				var out json.RawMessage
				switch v := m["output"].(type) {
				case json.RawMessage:
					out = v
				case string:
					out, _ = json.Marshal(v)
				}
				pendingTools = append(pendingTools, ToolTrace{Name: m["name"].(string), Input: in, Output: out})
				corpus.Write(out)
				corpus.WriteString("\n")
			case "sources":
				tr.Sources = data.([]chat.Source)
			}
			return nil
		}
		turns, page := toTurns(c)
		if err := svc.Respond(ctx, turns, page, emit); err != nil {
			tr.Flags = append(tr.Flags, "error: "+err.Error())
			if first == nil {
				first = fmt.Errorf("%s: %w", c.ID, err)
			}
		}
		// Tool results belong to the call that asked for them: the first
		// call's tool calls produced the traces recorded before the second
		// call ran. Attach in order.
		tr.Calls = rec.Calls
		ti := 0
		for i := range tr.Calls {
			k := len(tr.Calls[i].Reply.ToolCalls)
			if ti+k > len(pendingTools) {
				k = len(pendingTools) - ti
			}
			tr.Calls[i].ToolResults = pendingTools[ti : ti+k]
			ti += k
		}
		tr.Answer = strings.TrimSpace(answer.String())
		tr.Corpus = corpus.String()
		tr.Blocked = strings.Contains(tr.Answer, "I do not have an answer for that I can stand behind")
		if err := WriteTranscript(cfg.OutDir, tr); err != nil {
			return n, err
		}
		n++
	}
	return n, first
}
