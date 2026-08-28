package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"time"
	"unicode/utf8"
)

// Turn is one message in a conversation as the HTTP layer (Task 6) decodes
// it off the wire and as the panel (Task 8) sends it.
type Turn struct {
	Role string `json:"role"` // "user" or "assistant"
	Text string `json:"text"`
}

// Source is one catalogue atom the answer drew on, surfaced to the panel as
// a citation chip.
type Source struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
	URL    string `json:"url"`
}

// Service runs the agent loop: stream from the model, execute any tool
// calls it asks for, feed the results back, repeat until it has an answer.
type Service struct {
	Model     Model
	Tools     []ToolDef
	MaxTokens int
}

const (
	// MaxTurns bounds how many turns (user + assistant messages together) a
	// single request may carry.
	MaxTurns = 10
	// MaxInputLen bounds the length of any one user turn's text.
	MaxInputLen = 2000
	// MaxAssistantLen bounds the length of any one assistant turn's text. An
	// assistant turn is normally the model's own prior reply, but the wire
	// format lets a client submit one directly as conversation history, so it
	// needs its own cap: without one, a single request could carry roughly a
	// megabyte of assistant text into every Bedrock round for the life of the
	// conversation.
	MaxAssistantLen = 4000
	// MaxToolCalls bounds how many tool rounds the loop will run before it
	// forces the model to answer from whatever it has gathered so far.
	MaxToolCalls = 6
	// toolCallTimeout bounds how long any single tool call may run.
	toolCallTimeout = 10 * time.Second
	// maxSources caps how many citations the loop surfaces per answer.
	maxSources = 6
)

// budgetExhaustedNotice is appended as a user message once the tool-call
// budget is spent, telling the model to stop investigating and answer.
const budgetExhaustedNotice = "Tool budget exhausted. Answer now from what you have."

// systemPrompt is the Ask AI assistant's system prompt.
//
// It is longer than a rule list because the retriever has shapes the model
// cannot see and would otherwise be misled by: search_docs covers atoms and
// not operations, it always returns its nearest matches rather than nothing,
// and a large part of the operation surface carries no description. Each
// section below answers one of those, so the model compensates for what the
// index does not yet do. The catalogue's own soft spots are named for the
// same reason: an answer built on a placeholder schema reads exactly like an
// answer built on NHA's own words unless the model knows the difference.
//
// Every word here is sent on each model call, and a single question can take
// up to MaxToolCalls+1 of them, so additions should earn their place.
const systemPrompt = `You are the Ask AI assistant on the ABDM Developer Portal. You answer developer questions about India's ABDM gateways (HIE-CM, UHI, NHCX) strictly from this portal's catalogue, which you reach through your tools. Never answer an ABDM API question from general knowledge. If you have not looked, look first.

WHERE THINGS LIVE

The catalogue has two halves, and they are reached differently.

- Atoms are the written knowledge: concepts, flows, endpoint guides, callbacks, error explanations, tests, glossary entries, decisions, FHIR mappings and sandbox notes. search_docs searches these, and only these.
- Operations are the raw API surface parsed from NHA's specification files, across the modules gateway, m1, m2, m3, m4, p1, p2, p3 and phr-services. search_docs does not reach them. Use list_operations to filter by module, by tag, or by a substring of an operationId, summary or path, and get_operation to read one in full.

That split matters: search_docs returning nothing about an endpoint does not mean the endpoint does not exist. It means no atom was written about it. Check list_operations with the path or name before you tell anyone something is missing.

search_docs returns short snippets, not whole atoms. When a hit looks like the answer, open it with get_atom before answering from it; a snippet cut at 200 characters is where half-right answers come from.

The rest: decode_error for any error code or raw error body, and call it before anything else when the question carries one. related_atoms to walk from an atom you already have to its neighbours. catalogue_info for versions and coverage.

JUDGING WHAT COMES BACK

Search always returns its nearest matches, even when nothing genuinely matches. Ranked results are candidates, not answers.

- Before using a result, check that it answers the question that was asked. If the question named a literal, a path, an error code, a field or a header, the result should contain that literal.
- If nothing you retrieved contains what was asked for, try once more with list_operations using that literal, and then say plainly that the catalogue does not cover it and point the reader to /docs/support.
- Never close a gap with a nearby endpoint or a similar sounding concept. Confidently naming the wrong endpoint costs an integrator hours; saying the catalogue does not have it costs them a minute.

HONESTY ABOUT WHAT YOU FOUND

- Content from a verified atom is stated plainly. Content from an unverified atom is flagged as coming from the specification without sandbox confirmation.
- Many operations, and nearly all of p1, p2, p3 and phr-services, carry a path, a method, a summary and schemas but no description. Report what the schema shows and say the specification says no more. Do not infer purpose, side effects or ordering that is not written down.
- The PHR modules p1, p2, p3 and phr-services are derived from NHA's Aarogya Setu Postman collection and have not been run against a sandbox from this portal.
- Soft spots worth naming when they come up: NHA's files define no callbacks, so the inbound half of M2 and M3 is this portal's reconstruction; a few component schemas were missing from NHA's files and stand as marked placeholders whose fields are not authoritative; error codes and messages are NHA's, but the suggested action against a code is this portal's reading rather than NHA's; and the UTC TIMESTAMP format is confirmed against the sandbox, not against production.

WRITING THE ANSWER

- Lead with the answer. The reader is mid-task, usually with a failing call in front of them.
- Quote API literals exactly as the tools give them: endpoint paths, header names, error codes, timestamp formats, field names. Never paraphrase a literal, and never tidy its case or spacing.
- Markdown renders in this panel. Use inline code for every literal, short bulleted or numbered lists for steps and options, and no headings.
- Do not invent portal URLs. The panel shows links to your sources by itself; /docs/support is the one path you may name.
- Cite the atom ids you drew on.
- Answer in the language the question was asked in. Literals stay as they are.
- A few sentences unless the question needs a sequence. Answer what was asked and offer the next step, rather than explaining everything nearby.`

// ValidateTurns checks the shape the HTTP layer (Task 6) must also enforce
// before it even opens the SSE stream: 1..MaxTurns turns, roles alternating
// starting and ending with "user", each user turn's text within MaxInputLen,
// and each assistant turn's text within MaxAssistantLen. It returns a plain
// error describing the violation; the HTTP layer turns that into a 400.
func (s *Service) ValidateTurns(turns []Turn) error {
	if len(turns) < 1 || len(turns) > MaxTurns {
		return fmt.Errorf("chat: expected 1..%d turns, got %d", MaxTurns, len(turns))
	}
	want := "user"
	for i, t := range turns {
		if t.Role != want {
			return fmt.Errorf("chat: turn %d: expected role %q, got %q; roles must alternate starting and ending with user", i, want, t.Role)
		}
		if t.Role == "user" && utf8.RuneCountInString(t.Text) > MaxInputLen {
			return fmt.Errorf("chat: turn %d: user text exceeds %d characters", i, MaxInputLen)
		}
		if t.Role == "assistant" && utf8.RuneCountInString(t.Text) > MaxAssistantLen {
			return fmt.Errorf("chat: turn %d: assistant text exceeds %d characters", i, MaxAssistantLen)
		}
		if want == "user" {
			want = "assistant"
		} else {
			want = "user"
		}
	}
	if turns[len(turns)-1].Role != "user" {
		return fmt.Errorf("chat: last turn must be from user")
	}
	return nil
}

// toMessages converts the wire-shaped Turn slice into the Model's Message
// shape, a direct 1:1 mapping since a Turn only ever carries plain text.
func toMessages(turns []Turn) []Message {
	msgs := make([]Message, 0, len(turns))
	for _, t := range turns {
		msgs = append(msgs, Message{Role: t.Role, Text: t.Text})
	}
	return msgs
}

// toolDetail gives the activity panel something human to show for one tool
// call: the query, id, or input field of the call's input JSON, first 80
// characters, else the tool's own name. Truncation counts runes, not bytes,
// so a multibyte character at the boundary is never split.
func toolDetail(c ToolCall) string {
	var in map[string]any
	if err := json.Unmarshal(c.Input, &in); err == nil {
		for _, field := range []string{"query", "id", "input"} {
			if v, ok := in[field].(string); ok && v != "" {
				if runes := []rune(v); len(runes) > 80 {
					v = string(runes[:80])
				}
				return v
			}
		}
	}
	return c.Name
}

// findTool looks up a tool definition by name.
func findTool(tools []ToolDef, name string) (ToolDef, bool) {
	for _, d := range tools {
		if d.Name == name {
			return d, true
		}
	}
	return ToolDef{}, false
}

// runTool executes one tool call and returns its ToolResult, plus the raw
// result map for source collection when the call succeeded. Neither an
// unknown tool name nor a Call error fails the loop: both become an
// IsError ToolResult so the model can route around the problem.
func runTool(ctx context.Context, tools []ToolDef, c ToolCall) (ToolResult, map[string]any) {
	def, ok := findTool(tools, c.Name)
	if !ok {
		return ToolResult{ID: c.ID, Content: []byte("unknown tool"), IsError: true}, nil
	}
	callCtx, cancel := context.WithTimeout(ctx, toolCallTimeout)
	defer cancel()
	result, err := def.Call(callCtx, c.Input)
	if err != nil {
		return ToolResult{ID: c.ID, Content: []byte(err.Error()), IsError: true}, nil
	}
	content, err := json.Marshal(result)
	if err != nil {
		return ToolResult{ID: c.ID, Content: []byte(err.Error()), IsError: true}, nil
	}
	return ToolResult{ID: c.ID, Content: content}, result
}

// addSource appends src to sources unless its id is already present or the
// cap is already reached.
func addSource(sources *[]Source, src Source) {
	if src.ID == "" || len(*sources) >= maxSources {
		return
	}
	for _, existing := range *sources {
		if existing.ID == src.ID {
			return
		}
	}
	*sources = append(*sources, src)
}

// sourceFromFields builds a Source from one atom-shaped result map (the
// fields get_atom and each search_docs hit share: id, title,
// verification_status).
func sourceFromFields(fields map[string]any) Source {
	id, _ := fields["id"].(string)
	title, _ := fields["title"].(string)
	status, _ := fields["verification_status"].(string)
	return Source{ID: id, Title: title, Status: status, URL: "/search?q=" + url.QueryEscape(title)}
}

// collectSources folds one successful tool call's result into sources,
// deterministically: a get_atom call contributes its one atom; a
// search_docs call contributes its top 3 hits. Dedup keeps the first
// occurrence of each id and caps the total at maxSources.
func collectSources(sources *[]Source, name string, result map[string]any) {
	switch name {
	case "get_atom":
		addSource(sources, sourceFromFields(result))
	case "search_docs":
		hits, _ := result["hits"].([]map[string]any)
		for i, h := range hits {
			if i >= 3 {
				break
			}
			addSource(sources, sourceFromFields(h))
		}
	}
}

// Respond runs the loop, emitting SSE-shaped events through emit. Event
// names and payloads are exactly the spec's contract: "tool" as each tool
// call starts, "text" for each streamed text delta, "sources" once with the
// citations gathered along the way (only if any were gathered), then
// "done". The "error" event is the HTTP layer's job, not this loop's.
func (s *Service) Respond(ctx context.Context, turns []Turn, emit func(event string, data any) error) error {
	if err := s.ValidateTurns(turns); err != nil {
		return err
	}
	msgs := toMessages(turns)
	var sources []Source

	// textErr captures the first error emit("text", ...) returns -- almost
	// always a disconnected client -- so the round that triggered it can be
	// abandoned right away instead of running the rest of the model call
	// (and any tool calls it asks for) against a dead connection. Once set,
	// onText stops emitting further deltas for the rest of this Respond
	// call.
	var textErr error
	onText := func(delta string) {
		if textErr != nil {
			return
		}
		if err := emit("text", map[string]string{"delta": delta}); err != nil {
			textErr = err
		}
	}

	runRound := func() (Reply, error) {
		reply, err := s.Model.Stream(ctx, systemPrompt, s.Tools, msgs, s.MaxTokens, onText)
		if err != nil {
			return reply, err
		}
		if textErr != nil {
			return reply, textErr
		}
		return reply, nil
	}

	for round := 1; round <= MaxToolCalls; round++ {
		reply, err := runRound()
		if err != nil {
			return err
		}
		if len(reply.ToolCalls) == 0 {
			return s.finish(sources, emit)
		}

		for i := range reply.ToolCalls {
			c := reply.ToolCalls[i]
			if err := emit("tool", map[string]string{"name": c.Name, "detail": toolDetail(c)}); err != nil {
				return err
			}
			result, fields := runTool(ctx, s.Tools, c)
			if fields != nil {
				collectSources(&sources, c.Name, fields)
			}
			// Any text the model streamed before calling tools rides along on
			// the first ToolUse message rather than being dropped: the model
			// already said it (the panel showed it), so the next round's
			// history must carry it too, or the model can repeat itself.
			// toBedrockMessages emits a text block alongside the tool-use
			// block on the same message when both are set.
			assistantMsg := Message{Role: "assistant", ToolUse: &c}
			if i == 0 {
				assistantMsg.Text = reply.Text
			}
			msgs = append(msgs, assistantMsg)
			msgs = append(msgs, Message{Role: "user", ToolResult: &result})
		}

		if round == MaxToolCalls {
			msgs = append(msgs, Message{Role: "user", Text: budgetExhaustedNotice})
			if _, err := runRound(); err != nil {
				return err
			}
			return s.finish(sources, emit)
		}
	}
	// Unreachable: the loop above always returns by round == MaxToolCalls.
	return s.finish(sources, emit)
}

// finish emits the sources event (only when there is at least one source)
// followed by done, and returns nil -- the loop's only successful exit.
func (s *Service) finish(sources []Source, emit func(event string, data any) error) error {
	if len(sources) > 0 {
		if err := emit("sources", sources); err != nil {
			return err
		}
	}
	return emit("done", map[string]any{})
}
