package eval

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/eka-care/abdm-docs/mcp/internal/chat"
	"github.com/eka-care/abdm-docs/mcp/internal/server"
)

type RunConfig struct {
	OutDir      string
	Model       chat.Model
	ModelID     string
	Temperature float64
	// Tools is the fixed tool set a run answers with when RoutedTools is
	// nil: every case sees the same tools, the pre-C4 behaviour.
	Tools     []chat.ToolDef
	MaxTokens int
	MCPURL    string
	// RoutedTools switches a run onto the routed retrieval path: each case
	// pre-retrieves a passage pack and is offered only the tools its
	// question routes to, through server.ChatHooks. nil keeps Tools as the
	// fixed set above, matching a run built before this existed.
	RoutedTools      *server.Tools
	PromptVersion    string
	CatalogueVersion string
	// EmbedProvider and DBPath name the retrieval stack this run answered
	// against, recorded on every transcript so two runs on different stacks
	// never compare as if they were the same instrument.
	EmbedProvider string
	DBPath        string
}

// lastUserMessageText returns the text of the last user message in msgs, or
// "" if there is none. It is the pack, the page and the question the model
// actually saw, so a corpus built from it grounds exactly what the model
// could ground an answer on.
func lastUserMessageText(msgs []chat.Message) string {
	for i := len(msgs) - 1; i >= 0; i-- {
		if msgs[i].Role == "user" {
			return msgs[i].Text
		}
	}
	return ""
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
		// TraceTools is the eval's own opt in: the tool_result event carries
		// the raw input and output this loop records below, and nothing
		// serving a real reader should ever turn it on.
		svc := &chat.Service{Model: rec, Tools: cfg.Tools, MaxTokens: cfg.MaxTokens, MCPURL: cfg.MCPURL, TraceTools: true}
		if cfg.RoutedTools != nil {
			svc.Lookup, svc.ToolsFor = server.ChatHooks(cfg.RoutedTools)
		}
		tr := Transcript{CaseID: c.ID, CatalogueVersion: cfg.CatalogueVersion, ModelID: cfg.ModelID,
			Temperature: cfg.Temperature, PromptVersion: cfg.PromptVersion,
			EmbedProvider: cfg.EmbedProvider, DBPath: cfg.DBPath,
			RecordedAt: time.Now().UTC().Format(time.RFC3339)}
		var answer, corpus strings.Builder
		var pendingTools []ToolTrace
		emit := func(event string, data any) error {
			switch event {
			case "text":
				answer.WriteString(data.(map[string]string)["delta"])
			case "tool_result":
				m := data.(map[string]any)
				// Both input and output arrive as json.RawMessage when
				// valid JSON and as a plain string otherwise -- a
				// tool-use input truncated at max_tokens is invalid JSON,
				// same as an error message such as "unknown tool" is on
				// the output side. Either way ToolTrace's fields end up
				// valid JSON, a bare string marshalled into one, because
				// they are json.RawMessage and are written verbatim into
				// the transcript: storing an invalid string as one, rather
				// than marshalling it, would write a broken transcript.json.
				var in, out json.RawMessage
				switch v := m["input"].(type) {
				case json.RawMessage:
					in = v
				case string:
					in, _ = json.Marshal(v)
				}
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
		// The pre-retrieved pack never appears as a tool_result event (it is
		// prepended straight into the last user message by the chat loop),
		// so the corpus built above from tool_result alone is missing it.
		// The grounding check would then score every literal the model
		// correctly quoted from the pack as an invention. rec.Calls[0] is
		// the first model call of the turn, the one the pack rides on.
		if len(rec.Calls) > 0 {
			corpus.WriteString(lastUserMessageText(rec.Calls[0].Messages))
		}
		tr.Answer = strings.TrimSpace(answer.String())
		tr.Corpus = corpus.String()
		tr.Blocked = strings.Contains(tr.Answer, chat.BlockedNotice)
		if err := WriteTranscript(cfg.OutDir, tr); err != nil {
			return n, err
		}
		n++
	}
	return n, first
}
