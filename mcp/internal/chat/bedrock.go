package chat

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/document"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/types"
)

// bedrockModel is the real Model, backed by Amazon Bedrock's ConverseStream
// API. It carries no state across calls beyond the client and model ID.
type bedrockModel struct {
	client  *bedrockruntime.Client
	modelID string
}

// NewBedrockModel resolves credentials through the SDK default chain: the
// task role in production, an OIDC-assumed role in CI, a configured profile
// on a laptop. No key material is ever passed in here. Follows the same
// config-loading idiom as internal/embed's Bedrock adapter.
func NewBedrockModel(ctx context.Context, region, modelID string) (Model, error) {
	opts := []func(*awsconfig.LoadOptions) error{}
	if region != "" {
		opts = append(opts, awsconfig.WithRegion(region))
	}
	cfg, err := awsconfig.LoadDefaultConfig(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("bedrock model: load aws config: %w", err)
	}
	return &bedrockModel{client: bedrockruntime.NewFromConfig(cfg), modelID: modelID}, nil
}

// toBedrockMessages maps our provider-agnostic Message shape onto Bedrock's
// Converse message format. A Message can carry more than one of Text,
// ToolUse, and ToolResult at once -- notably an assistant round that
// streamed text before calling a tool -- and each set field becomes its own
// content block on the same types.Message, in that order: text, then
// tool-use (input decoded into a document.Interface), then tool-result
// (content a single text block, Status set to error when IsError is set). A
// Message with none of the three set (an empty assistant turn, e.g. from a
// filtered stop) is dropped rather than emitted as an empty text block:
// Bedrock rejects those outright.
func toBedrockMessages(msgs []Message) []types.Message {
	out := make([]types.Message, 0, len(msgs))
	for _, m := range msgs {
		role := types.ConversationRoleUser
		if m.Role == "assistant" {
			role = types.ConversationRoleAssistant
		}

		var blocks []types.ContentBlock
		if m.Text != "" {
			blocks = append(blocks, &types.ContentBlockMemberText{Value: m.Text})
		}
		if m.ToolUse != nil {
			var input map[string]any
			// A decode failure just yields a nil/empty document rather than
			// failing the whole conversion; the model asked for this input,
			// so we pass along whatever we can parse of it.
			_ = json.Unmarshal(m.ToolUse.Input, &input)
			blocks = append(blocks, &types.ContentBlockMemberToolUse{
				Value: types.ToolUseBlock{
					ToolUseId: aws.String(m.ToolUse.ID),
					Name:      aws.String(m.ToolUse.Name),
					Input:     document.NewLazyDocument(input),
				},
			})
		}
		if m.ToolResult != nil {
			status := types.ToolResultStatusSuccess
			if m.ToolResult.IsError {
				status = types.ToolResultStatusError
			}
			blocks = append(blocks, &types.ContentBlockMemberToolResult{
				Value: types.ToolResultBlock{
					ToolUseId: aws.String(m.ToolResult.ID),
					Status:    status,
					Content: []types.ToolResultContentBlock{
						&types.ToolResultContentBlockMemberText{
							Value: string(m.ToolResult.Content),
						},
					},
				},
			})
		}
		if len(blocks) == 0 {
			continue
		}

		out = append(out, types.Message{
			Role:    role,
			Content: blocks,
		})
	}
	return out
}

// toBedrockTools maps our tool definitions to Bedrock's ToolConfiguration,
// wrapping each JSON schema in a document.Interface the way Bedrock expects.
func toBedrockTools(defs []ToolDef) (*types.ToolConfiguration, error) {
	if len(defs) == 0 {
		return nil, nil
	}
	tools := make([]types.Tool, 0, len(defs))
	for _, d := range defs {
		schemaJSON, err := json.Marshal(d.InputSchema)
		if err != nil {
			return nil, fmt.Errorf("bedrock model: marshal schema for %q: %w", d.Name, err)
		}
		var schema map[string]any
		if err := json.Unmarshal(schemaJSON, &schema); err != nil {
			return nil, fmt.Errorf("bedrock model: decode schema for %q: %w", d.Name, err)
		}
		tools = append(tools, &types.ToolMemberToolSpec{
			Value: types.ToolSpecification{
				Name:        aws.String(d.Name),
				Description: aws.String(d.Description),
				InputSchema: &types.ToolInputSchemaMemberJson{
					Value: document.NewLazyDocument(schema),
				},
			},
		})
	}
	return &types.ToolConfiguration{Tools: tools}, nil
}

// Stream calls Bedrock's ConverseStream and drains the event stream into one
// assembled Reply, invoking onText as text deltas arrive.
func (b *bedrockModel) Stream(ctx context.Context, system string, tools []ToolDef,
	msgs []Message, maxTokens int, onText func(string)) (Reply, error) {

	toolConfig, err := toBedrockTools(tools)
	if err != nil {
		return Reply{}, err
	}

	var systemBlocks []types.SystemContentBlock
	if system != "" {
		systemBlocks = []types.SystemContentBlock{
			&types.SystemContentBlockMemberText{Value: system},
		}
	}

	out, err := b.client.ConverseStream(ctx, &bedrockruntime.ConverseStreamInput{
		ModelId:    aws.String(b.modelID),
		System:     systemBlocks,
		Messages:   toBedrockMessages(msgs),
		ToolConfig: toolConfig,
		InferenceConfig: &types.InferenceConfiguration{
			MaxTokens: aws.Int32(int32(maxTokens)),
		},
	})
	if err != nil {
		return Reply{}, fmt.Errorf("bedrock model: converse stream: %w", err)
	}
	stream := out.GetStream()
	defer stream.Close()

	asm := newStreamAssembler(onText)
	for event := range stream.Events() {
		asm.handle(event)
	}

	if err := stream.Err(); err != nil {
		return Reply{}, fmt.Errorf("bedrock model: stream: %w", err)
	}

	return asm.reply, nil
}

// pendingToolCall accumulates one tool-use content block's input fragments
// as they stream in, between its ContentBlockStart and ContentBlockStop.
type pendingToolCall struct {
	id, name string
	input    string
}

// streamAssembler folds a sequence of ConverseStream events into one Reply.
// It holds no AWS types beyond the SDK's event values, so it can be driven
// with a hand-built slice of events in tests, without a live client.
type streamAssembler struct {
	onText func(string)
	reply  Reply
	// pending accumulates a tool-use block between its ContentBlockStart and
	// the ToolUseInputDelta fragments that follow it, keyed by content block
	// index since deltas only carry the index, not the tool use ID.
	pending map[int32]*pendingToolCall
}

func newStreamAssembler(onText func(string)) *streamAssembler {
	return &streamAssembler{onText: onText, pending: map[int32]*pendingToolCall{}}
}

// handle folds one event into the assembler's running Reply.
func (a *streamAssembler) handle(event types.ConverseStreamOutput) {
	switch e := event.(type) {
	case *types.ConverseStreamOutputMemberContentBlockStart:
		if tu, ok := e.Value.Start.(*types.ContentBlockStartMemberToolUse); ok {
			a.pending[blockIndex(e.Value.ContentBlockIndex)] = &pendingToolCall{
				id:   aws.ToString(tu.Value.ToolUseId),
				name: aws.ToString(tu.Value.Name),
			}
		}
	case *types.ConverseStreamOutputMemberContentBlockDelta:
		switch d := e.Value.Delta.(type) {
		case *types.ContentBlockDeltaMemberText:
			a.reply.Text += d.Value
			if a.onText != nil {
				a.onText(d.Value)
			}
		case *types.ContentBlockDeltaMemberToolUse:
			idx := blockIndex(e.Value.ContentBlockIndex)
			if p, ok := a.pending[idx]; ok && d.Value.Input != nil {
				p.input += *d.Value.Input
			}
		}
	case *types.ConverseStreamOutputMemberContentBlockStop:
		idx := blockIndex(e.Value.ContentBlockIndex)
		if p, ok := a.pending[idx]; ok {
			// A zero-argument tool call (e.g. catalogue_info) never gets a
			// ToolUseInputDelta, so p.input stays "". json.RawMessage("")
			// is not valid JSON, and every tool's Call handler does
			// json.Unmarshal(raw, &in) — default to an empty object so
			// zero-arg tools decode cleanly.
			input := p.input
			if input == "" {
				input = "{}"
			}
			a.reply.ToolCalls = append(a.reply.ToolCalls, ToolCall{
				ID:    p.id,
				Name:  p.name,
				Input: json.RawMessage(input),
			})
			delete(a.pending, idx)
		}
	case *types.ConverseStreamOutputMemberMessageStop:
		a.reply.StopReason = normalizeStopReason(e.Value.StopReason)
	}
}

// normalizeStopReason maps Bedrock's nine-value StopReason enum onto the
// three values the chat loop (Task 5) understands: "end_turn", "tool_use",
// "max_tokens". model_context_window_exceeded is treated as a max_tokens
// cutoff; every other reason (stop_sequence, guardrail_intervened,
// content_filtered, malformed_model_output, malformed_tool_use, and any
// future value the SDK adds) collapses to "end_turn" since the model has, in
// every case, stopped producing further content for this turn.
func normalizeStopReason(r types.StopReason) string {
	switch r {
	case types.StopReasonToolUse:
		return "tool_use"
	case types.StopReasonMaxTokens, types.StopReasonModelContextWindowExceeded:
		return "max_tokens"
	default:
		return "end_turn"
	}
}

func blockIndex(p *int32) int32 {
	if p == nil {
		return 0
	}
	return *p
}
