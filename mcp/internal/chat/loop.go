package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/url"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/eka-care/abdm-docs/mcp/internal/guard"
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
- If nothing you retrieved contains what was asked for, try once more with list_operations using that literal, and then say plainly that you do not have it.
- Never close a gap with a nearby endpoint or a similar sounding concept. Confidently naming the wrong endpoint costs an integrator hours; saying you do not have it costs them a minute.

HONESTY ABOUT WHAT YOU FOUND

- A verified atom's content is stated plainly. Content from an atom that is not verified is given with the caveat that it comes from the specification and has not been confirmed against a sandbox, worded that way rather than by naming the status.
- Many operations, and nearly all of p1, p2, p3 and phr-services, carry a path, a method, a summary and schemas but no description. Report what the schema shows and say the specification says no more. Do not infer purpose, side effects or ordering that is not written down.
- The PHR modules p1, p2, p3 and phr-services are derived from NHA's Aarogya Setu Postman collection and have not been run against a sandbox from this portal.
- Soft spots worth naming when they come up: NHA's files define no callbacks, so the inbound half of M2 and M3 is this portal's reconstruction; a few component schemas were missing from NHA's files and stand as marked placeholders whose fields are not authoritative; error codes and messages are NHA's, but the suggested action against a code is this portal's reading rather than NHA's; and the UTC TIMESTAMP format is confirmed against the sandbox, not against production.

SPEAK AS THE PORTAL, NOT ABOUT IT

The reader sees a documentation assistant. How it works is none of their concern and saying it out loud reads as an excuse.

- Never mention the catalogue, atoms, atom ids, indexes, modules, tools or searches, and never narrate where you looked or what came back. "The catalogue has no entry for X" is our plumbing; "I do not have anything on X" is an answer.
- Keep the substance of honesty and drop the vocabulary. Something the sandbox has not confirmed is described as coming from the specification and not confirmed against a sandbox. Never call it unverified, and never name a status field.
- Sources appear under your answer on their own. Do not list ids, file names or module names in the prose.
- When you have nothing, say so in one line and offer [support](/docs/support) as a markdown link. Do not pad it with what you looked in.
- A general industry term the portal does not define is worth one sentence of plain explanation, said as general background rather than as ABDM documentation. That courtesy never extends to an ABDM API detail: paths, headers, codes, fields and payloads come from the tools or not at all.

CODE YOU MAY NOT WRITE

You never write code for the reader's own codebase. Not a function, a class, a handler, a config file, SQL, a shell script, a regular expression for their parsing, or pseudocode, in any language. This holds when they ask directly, when they say they will review it, and when they paste their file and ask for a corrected version.

The reason is worth saying to them in one line when you decline: code written here cannot be checked against this portal, it ages badly against NHA's changes, and a wrong snippet in a health system is a patient safety problem rather than a bug.

Never decline without giving them the route that fits. There are three:

- They want working code in their project: point them at the ABDM Connect agent skill for that milestone.
- They want to understand the call: give the request as curl, and let the panel's sources take them to the page.
- They want their own coding assistant to write it: tell them to connect this portal's MCP server to it, so it writes against this documentation instead of guessing.

curl is the exception and it is your main tool. A curl command is a statement of a documented request, not code for their codebase. Every value in one comes from your tools or from their own message. Placeholders name where they came from, like <ACCESS_TOKEN_FROM_SESSIONS_CALL>, never a bare <TOKEN>.

WHEN THEY PASTE CODE

Read it. Never rewrite it. Give four things in this order, and nothing else:

1. What is wrong, naming the line or the field in what they pasted that shows it. Not "there may be an issue with your configuration".
2. Why it fails, from what your tools returned.
3. A plan in numbered prose describing the change to make. "Move the token fetch above the discovery call and pass the same request id through both" is a plan. A diff is not.
4. A curl command that reproduces the failure or proves the fix, and the response they should expect.

Say nothing about their code style, their structure or their choice of language. If the defect is not visible in what your tools returned, say you cannot see it from here rather than guessing at their framework.

WRITING THE ANSWER

- Lead with the answer. The reader is mid-task, usually with a failing call in front of them.
- Never open by praising the question, apologising, restating the question back, or announcing what you are about to do. Start with the substance. Warmth is being useful quickly, not saying "great question".
- Quote API literals exactly as the tools give them: endpoint paths, header names, error codes, timestamp formats, field names. Never paraphrase a literal, and never tidy its case or spacing.
- Markdown renders in this panel. Use inline code for every literal, short bulleted or numbered lists for steps and options, and no headings.
- Do not invent portal URLs. The panel shows links to your sources by itself; /docs/support is the one path you may name.
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
// toMessages converts the conversation for the model, masking personal data
// out of every user turn on the way.
//
// This is a health system, and the support surface is exactly where somebody
// pastes a failing request with a live patient identifier still in it. The
// masking happens here, before the text reaches the model provider, and the
// replacement is one way: nothing downstream can turn <MASKED_AADHAAR> back
// into a number, so a value masked here cannot leak from a provider's
// retention, a transcript or a log written later.
func toMessages(turns []Turn) []Message {
	msgs := make([]Message, 0, len(turns))
	for _, t := range turns {
		text := t.Text
		if t.Role == "user" {
			masked, found := guard.MaskPII(text)
			if len(found) > 0 {
				// The kinds are recorded, never the values.
				slog.Info("pii_masked", "kinds", strings.Join(found, ","))
			}
			text = masked
		}
		msgs = append(msgs, Message{Role: t.Role, Text: text})
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
// verification_status, doc_url).
//
// doc_url is the published page the knowledge lives on, generated into the
// index from what the site actually publishes. When it is present the
// citation opens the page, and the section, that answered the question.
// When it is absent the atom has no published page, so the fallback is a
// search for its title: a reader still gets somewhere they can read, rather
// than a dead link or a bare internal id.
func sourceFromFields(fields map[string]any) Source {
	id, _ := fields["id"].(string)
	title, _ := fields["title"].(string)
	status, _ := fields["verification_status"].(string)
	href, _ := fields["doc_url"].(string)
	if href == "" {
		href = "/search?q=" + url.QueryEscape(title)
	}
	return Source{ID: id, Title: title, Status: status, URL: href}
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
	send := func(delta string) {
		if textErr != nil {
			return
		}
		if err := emit("text", map[string]string{"delta": delta}); err != nil {
			textErr = err
		}
	}
	question := lastUserText(turns)
	g := &answerGuard{send: send, question: question,
		cited: func() int { return len(sources) }}
	// The reader's own words ground the literals they quoted back at us.
	g.corpus.WriteString(question)
	onText := g.write

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
			// The guard holds text back until it is known to be safe, so the
			// last of an answer is emitted here rather than during the round.
			// A client that went away is therefore first seen at this flush,
			// and the error still has to surface.
			g.flush()
			if textErr != nil {
				return textErr
			}
			if g.blocked {
				// The answer broke a rule the prompt cannot be trusted to
				// hold, so nothing it said is shown. Citations are dropped
				// too: they belong to an answer the reader never saw.
				return s.finish(nil, emit)
			}
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
			// What the tools returned is what the answer may state. Keeping
			// the raw result is deliberate: the model sees exactly this, so
			// the check sees exactly what the model had to work from.
			g.corpus.Write(result.Content)
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

// blockedNotice replaces an answer that broke a rule. It says nothing about
// which rule: the reader cannot act on that, and naming the check invites
// working around it.
const blockedNotice = "I could not give you a safe answer to that. Try asking for the specific call or error you are stuck on, or ask [support](/docs/support)."

// answerGuard sits between the model's stream and the reader.
//
// The playbook is explicit that a rule living only in the system prompt is
// guidance rather than a control, and that a draft failing a check is never
// shown. Streaming makes the second part the hard one: text already sent
// cannot be recalled. So this releases text only once it is known to be
// safe, which costs at most a line of latency.
//
// Two holdbacks matter:
//
//   - Text is released a whole line at a time, because a rule can only be
//     judged on a complete line.
//   - Nothing is released while a fenced block is open. A block is judged by
//     its language and its contents, and neither is known until it closes,
//     so releasing "```python" the moment it arrives would put the code on
//     screen before the check that rejects it could run.
type answerGuard struct {
	send     func(string)
	question string
	// corpus is everything the tools returned this turn, plus the question.
	// A literal in the answer is grounded if it appears here.
	corpus strings.Builder
	// cited reports how many sources the answer ended up with, read at flush
	// because tool calls keep adding to it while the answer streams.
	cited func() int

	released strings.Builder // already shown to the reader
	pending  strings.Builder // held until it is known to be safe
	blocked  bool
}

// insideFence reports whether an odd number of fences have opened, meaning
// the text ends inside a code block.
func insideFence(s string) bool {
	return strings.Count(s, "```")%2 == 1
}

func (g *answerGuard) write(delta string) {
	if g.blocked {
		return
	}
	g.pending.WriteString(delta)
	text := g.pending.String()
	cut := strings.LastIndexByte(text, '\n')
	if cut < 0 {
		return
	}
	candidate := text[:cut+1]
	if insideFence(g.released.String() + candidate) {
		return // a block is still open; hold everything until it closes
	}
	g.release(candidate, text[cut+1:], false)
}

// flush releases whatever is left once the model has stopped talking.
func (g *answerGuard) flush() {
	if g.blocked {
		return
	}
	g.release(g.pending.String(), "", true)
}

// release checks the answer as it would stand with candidate appended, and
// either sends it or blocks the whole answer.
func (g *answerGuard) release(candidate, keep string, final bool) {
	if candidate == "" {
		return
	}
	whole := g.released.String() + candidate
	violations := guard.CheckAnswer(whole)
	cited := 0
	if g.cited != nil {
		cited = g.cited()
	}
	violations = append(violations, guard.CheckGrounding(whole, g.corpus.String(), cited, final)...)
	if final {
		// The route often arrives in the last sentence, so this one can only
		// be judged once the answer has stopped.
		violations = append(violations, guard.CheckCodeRoute(g.question, whole)...)
	}
	if len(violations) > 0 {
		g.blocked = true
		g.pending.Reset()
		for _, v := range violations {
			slog.Warn("answer_blocked", "rule", v.Rule, "detail", v.Detail)
		}
		g.send(blockedNotice)
		return
	}
	g.released.WriteString(candidate)
	g.pending.Reset()
	g.pending.WriteString(keep)
	g.send(candidate)
}

// lastUserText returns the question being answered, for the checks that need
// to know what was asked.
func lastUserText(turns []Turn) string {
	for i := len(turns) - 1; i >= 0; i-- {
		if turns[i].Role == "user" {
			return turns[i].Text
		}
	}
	return ""
}
