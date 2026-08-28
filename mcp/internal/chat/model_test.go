package chat

import (
	"encoding/json"
	"testing"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/types"
	"github.com/google/jsonschema-go/jsonschema"
)

func TestBedrockMessageConversion(t *testing.T) {
	msgs := []Message{
		{Role: "user", Text: "what is the timestamp format?"},
		{Role: "assistant", ToolUse: &ToolCall{ID: "t1", Name: "search_docs",
			Input: json.RawMessage(`{"query":"timestamp"}`)}},
		{Role: "user", ToolResult: &ToolResult{ID: "t1", Content: []byte(`{"hits":[]}`)}},
	}
	out := toBedrockMessages(msgs)
	if len(out) != 3 {
		t.Fatalf("got %d messages", len(out))
	}
	// Role mapping and content block kinds, per message.
	if out[0].Role != types.ConversationRoleUser {
		t.Errorf("msg 0 role %v", out[0].Role)
	}
	if _, ok := out[1].Content[0].(*types.ContentBlockMemberToolUse); !ok {
		t.Errorf("msg 1 content %T, want tool use", out[1].Content[0])
	}
	if _, ok := out[2].Content[0].(*types.ContentBlockMemberToolResult); !ok {
		t.Errorf("msg 2 content %T, want tool result", out[2].Content[0])
	}
}

func TestBedrockMessageConversionSkipsEmptyMessages(t *testing.T) {
	// Bedrock rejects a content block with empty text outright, so a Message
	// with no Text, ToolUse, or ToolResult set (an empty assistant turn from
	// a filtered stop, say) must be dropped rather than passed through as an
	// empty text block that would poison the whole conversation.
	msgs := []Message{
		{Role: "user", Text: "hi"},
		{Role: "assistant", Text: ""},
		{Role: "assistant", Text: "hello"},
	}
	out := toBedrockMessages(msgs)
	if len(out) != 2 {
		t.Fatalf("got %d messages, want 2 (the empty one dropped): %+v", len(out), out)
	}
	txt, ok := out[1].Content[0].(*types.ContentBlockMemberText)
	if !ok || txt.Value != "hello" {
		t.Errorf("msg 1 = %+v, want text block %q", out[1].Content[0], "hello")
	}
}

func TestBedrockMessageConversionCombinesTextAndToolUse(t *testing.T) {
	// A single Message can carry both Text (streamed before the tool call)
	// and ToolUse; both must land as separate content blocks on the same
	// types.Message, not one overwriting the other.
	msgs := []Message{
		{Role: "assistant", Text: "checking", ToolUse: &ToolCall{
			ID: "t1", Name: "search_docs", Input: json.RawMessage(`{"query":"x"}`)}},
	}
	out := toBedrockMessages(msgs)
	if len(out) != 1 {
		t.Fatalf("got %d messages, want 1", len(out))
	}
	if len(out[0].Content) != 2 {
		t.Fatalf("got %d content blocks, want 2 (text + tool use): %+v", len(out[0].Content), out[0].Content)
	}
	txt, ok := out[0].Content[0].(*types.ContentBlockMemberText)
	if !ok || txt.Value != "checking" {
		t.Errorf("block 0 = %+v, want text block %q", out[0].Content[0], "checking")
	}
	if _, ok := out[0].Content[1].(*types.ContentBlockMemberToolUse); !ok {
		t.Errorf("block 1 = %T, want tool use", out[0].Content[1])
	}
}

func TestToBedrockToolsEmpty(t *testing.T) {
	cfg, err := toBedrockTools(nil)
	if err != nil {
		t.Fatalf("toBedrockTools(nil): %v", err)
	}
	if cfg != nil {
		t.Errorf("toBedrockTools(nil) = %+v, want nil ToolConfiguration", cfg)
	}
}

func TestToBedrockToolsMapsNameDescriptionSchema(t *testing.T) {
	defs := []ToolDef{
		{
			Name:        "search_docs",
			Description: "search the catalogue",
			InputSchema: &jsonschema.Schema{
				Type: "object",
				Properties: map[string]*jsonschema.Schema{
					"query": {Type: "string"},
				},
			},
		},
	}
	cfg, err := toBedrockTools(defs)
	if err != nil {
		t.Fatalf("toBedrockTools: %v", err)
	}
	if len(cfg.Tools) != 1 {
		t.Fatalf("got %d tools", len(cfg.Tools))
	}
	spec, ok := cfg.Tools[0].(*types.ToolMemberToolSpec)
	if !ok {
		t.Fatalf("tool 0 is %T, want ToolMemberToolSpec", cfg.Tools[0])
	}
	if aws.ToString(spec.Value.Name) != "search_docs" {
		t.Errorf("name = %q", aws.ToString(spec.Value.Name))
	}
	if aws.ToString(spec.Value.Description) != "search the catalogue" {
		t.Errorf("description = %q", aws.ToString(spec.Value.Description))
	}
	schemaJSON, ok := spec.Value.InputSchema.(*types.ToolInputSchemaMemberJson)
	if !ok {
		t.Fatalf("input schema is %T, want ToolInputSchemaMemberJson", spec.Value.InputSchema)
	}
	// document.Interface only exposes MarshalSmithyDocument for a
	// client-built (lazy) document; decode the raw bytes ourselves rather
	// than round-tripping through UnmarshalSmithyDocument, which is for
	// documents the SDK itself parsed out of a response.
	raw, err := schemaJSON.Value.MarshalSmithyDocument()
	if err != nil {
		t.Fatalf("marshal schema document: %v", err)
	}
	var decoded map[string]any
	if err := json.Unmarshal(raw, &decoded); err != nil {
		t.Fatalf("decode schema document: %v", err)
	}
	if decoded["type"] != "object" {
		t.Errorf("schema type = %v, want object", decoded["type"])
	}
}

func TestStreamAssemblerText(t *testing.T) {
	var gotDeltas []string
	asm := newStreamAssembler(func(s string) { gotDeltas = append(gotDeltas, s) })

	asm.handle(&types.ConverseStreamOutputMemberContentBlockDelta{
		Value: types.ContentBlockDeltaEvent{
			ContentBlockIndex: aws.Int32(0),
			Delta:             &types.ContentBlockDeltaMemberText{Value: "hello "},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberContentBlockDelta{
		Value: types.ContentBlockDeltaEvent{
			ContentBlockIndex: aws.Int32(0),
			Delta:             &types.ContentBlockDeltaMemberText{Value: "world"},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberMessageStop{
		Value: types.MessageStopEvent{StopReason: types.StopReasonEndTurn},
	})

	if asm.reply.Text != "hello world" {
		t.Errorf("text = %q", asm.reply.Text)
	}
	if len(gotDeltas) != 2 || gotDeltas[0] != "hello " || gotDeltas[1] != "world" {
		t.Errorf("onText deltas = %v", gotDeltas)
	}
	if asm.reply.StopReason != "end_turn" {
		t.Errorf("stop reason = %q", asm.reply.StopReason)
	}
}

func TestStreamAssemblerToolUse(t *testing.T) {
	asm := newStreamAssembler(nil)

	asm.handle(&types.ConverseStreamOutputMemberContentBlockStart{
		Value: types.ContentBlockStartEvent{
			ContentBlockIndex: aws.Int32(0),
			Start: &types.ContentBlockStartMemberToolUse{
				Value: types.ToolUseBlockStart{
					ToolUseId: aws.String("t1"),
					Name:      aws.String("search_docs"),
				},
			},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberContentBlockDelta{
		Value: types.ContentBlockDeltaEvent{
			ContentBlockIndex: aws.Int32(0),
			Delta:             &types.ContentBlockDeltaMemberToolUse{Value: types.ToolUseBlockDelta{Input: aws.String(`{"que`)}},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberContentBlockDelta{
		Value: types.ContentBlockDeltaEvent{
			ContentBlockIndex: aws.Int32(0),
			Delta:             &types.ContentBlockDeltaMemberToolUse{Value: types.ToolUseBlockDelta{Input: aws.String(`ry":"x"}`)}},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberContentBlockStop{
		Value: types.ContentBlockStopEvent{ContentBlockIndex: aws.Int32(0)},
	})
	asm.handle(&types.ConverseStreamOutputMemberMessageStop{
		Value: types.MessageStopEvent{StopReason: types.StopReasonToolUse},
	})

	if len(asm.reply.ToolCalls) != 1 {
		t.Fatalf("got %d tool calls", len(asm.reply.ToolCalls))
	}
	call := asm.reply.ToolCalls[0]
	if call.ID != "t1" || call.Name != "search_docs" {
		t.Errorf("call = %+v", call)
	}
	if string(call.Input) != `{"query":"x"}` {
		t.Errorf("input = %s", call.Input)
	}
	if asm.reply.StopReason != "tool_use" {
		t.Errorf("stop reason = %q", asm.reply.StopReason)
	}
}

// TestStreamAssemblerZeroArgToolCall covers a zero-argument tool call (e.g.
// catalogue_info): Bedrock emits a ContentBlockStart and ContentBlockStop for
// it with no ToolUseInputDelta in between, since there is no input to send.
// The accumulated input must default to "{}", not "", so the tool's
// json.Unmarshal(raw, &in) handler doesn't choke on an empty byte slice.
func TestStreamAssemblerZeroArgToolCall(t *testing.T) {
	asm := newStreamAssembler(nil)

	asm.handle(&types.ConverseStreamOutputMemberContentBlockStart{
		Value: types.ContentBlockStartEvent{
			ContentBlockIndex: aws.Int32(0),
			Start: &types.ContentBlockStartMemberToolUse{
				Value: types.ToolUseBlockStart{
					ToolUseId: aws.String("t1"),
					Name:      aws.String("catalogue_info"),
				},
			},
		},
	})
	asm.handle(&types.ConverseStreamOutputMemberContentBlockStop{
		Value: types.ContentBlockStopEvent{ContentBlockIndex: aws.Int32(0)},
	})

	if len(asm.reply.ToolCalls) != 1 {
		t.Fatalf("got %d tool calls", len(asm.reply.ToolCalls))
	}
	call := asm.reply.ToolCalls[0]
	if string(call.Input) != "{}" {
		t.Errorf("input = %q, want {}", call.Input)
	}
}

func TestStreamAssemblerNormalizesStopReason(t *testing.T) {
	asm := newStreamAssembler(nil)
	asm.handle(&types.ConverseStreamOutputMemberMessageStop{
		Value: types.MessageStopEvent{StopReason: types.StopReasonGuardrailIntervened},
	})
	if asm.reply.StopReason != "end_turn" {
		t.Errorf("stop reason = %q, want end_turn", asm.reply.StopReason)
	}
}
