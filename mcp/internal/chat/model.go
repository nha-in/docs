package chat

import (
	"context"
	"encoding/json"

	"github.com/google/jsonschema-go/jsonschema"
)

// Message is one turn in a conversation, as the chat loop (Task 5) builds and
// consumes it. Role is "user" or "assistant". Text carries plain prose; a
// message instead carries ToolUse (assistant asking to call a tool) or
// ToolResult (user handing the result back), never more than one of the
// three at once in practice, though the shape does not enforce that.
type Message struct {
	Role       string      // "user" or "assistant"
	Text       string      // may be empty when carrying tool traffic
	ToolUse    *ToolCall   // assistant message asking for a tool
	ToolResult *ToolResult // user message carrying the result back
}

// ToolCall is a model's request to invoke one tool.
type ToolCall struct {
	ID    string
	Name  string
	Input json.RawMessage
}

// ToolResult carries a tool's output back to the model.
type ToolResult struct {
	ID      string
	Content []byte
	IsError bool
}

// Reply is one complete model turn: the assembled text, any tool calls the
// model asked for, and why it stopped.
type Reply struct {
	Text       string
	ToolCalls  []ToolCall
	StopReason string // "end_turn", "tool_use", "max_tokens"
}

// ToolDef is the chat loop's own view of one callable tool: its wire-visible
// name, description, JSON input schema, and the handler that runs it. It
// mirrors server.ToolDef field-for-field on purpose, but is defined here
// rather than imported: package server (Task 6's HTTP handler in
// particular) needs to import chat for chat.Service, and chat already needs
// server.ToolDef for the tools the loop executes, so one of the two
// directions has to give. Chat, the lower layer server depends on, stays
// import-free of server; the HTTP layer converts a []server.ToolDef into
// []ToolDef at the boundary (see server.ChatTools).
type ToolDef struct {
	Name        string
	Description string
	InputSchema *jsonschema.Schema
	// Call unmarshals raw into the tool's input struct and runs it.
	Call func(ctx context.Context, raw json.RawMessage) (map[string]any, error)
}

// Model is the seam between the chat loop and whichever provider answers it.
// A fake implementation lets the loop (Task 5) be tested without AWS.
type Model interface {
	// Stream produces one model reply; text deltas hit onText as they arrive.
	Stream(ctx context.Context, system string, tools []ToolDef,
		msgs []Message, maxTokens int, onText func(string)) (Reply, error)
}
