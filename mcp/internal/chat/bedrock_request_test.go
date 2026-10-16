package chat

import (
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime/types"
)

// The system prompt is identical on every request and on every turn of the
// tool loop. Without a cache point after it, Bedrock charges the whole prefix
// at full price each time; with one, it is charged at the read rate. This
// pins the block shape, since a silent drop costs money rather than breaking.
func TestSystemBlocksCarryACachePoint(t *testing.T) {
	blocks := systemBlocksFor("you are the assistant", true)
	if len(blocks) != 2 {
		t.Fatalf("want text plus cache point, got %d block(s)", len(blocks))
	}
	if _, ok := blocks[0].(*types.SystemContentBlockMemberText); !ok {
		t.Errorf("first block is %T, want the prompt text", blocks[0])
	}
	cache, ok := blocks[1].(*types.SystemContentBlockMemberCachePoint)
	if !ok {
		t.Fatalf("second block is %T, want a cache point", blocks[1])
	}
	if cache.Value.Type != types.CachePointTypeDefault {
		t.Errorf("cache point type is %q, want %q", cache.Value.Type, types.CachePointTypeDefault)
	}
}

// An empty system prompt has no prefix worth caching, and a lone cache point
// would be a request Bedrock rejects.
func TestEmptySystemPromptSendsNoBlocks(t *testing.T) {
	if blocks := systemBlocksFor("", true); len(blocks) != 0 {
		t.Errorf("want no blocks for an empty prompt, got %d", len(blocks))
	}
}

// Bedrock accepts a cache point only from Anthropic and Amazon Nova models;
// any other model rejects the whole request as "did not allow prompt
// caching". The prefix check must see through cross-region profile ids.
func TestPromptCacheableByModelFamily(t *testing.T) {
	cases := map[string]bool{
		"anthropic.claude-3-haiku-20240307-v1:0":          true,
		"global.anthropic.claude-haiku-4-5-20251001-v1:0": true,
		"apac.amazon.nova-pro-v1:0":                       true,
		"global.amazon.nova-2-lite-v1:0":                  true,
		"openai.gpt-oss-120b-1:0":                         false,
		"qwen.qwen3-235b-a22b-2507-v1:0":                  false,
		"mistral.mistral-large-3-675b-instruct":           false,
		"amazon.titan-text-express-v1":                    false,
	}
	for id, want := range cases {
		if got := promptCacheable(id); got != want {
			t.Errorf("promptCacheable(%q) = %v, want %v", id, got, want)
		}
	}
}

// For a model that cannot cache, the prompt still goes, just without the
// cache point: text only, never a lone or trailing cache block.
func TestUncacheableModelGetsTextOnly(t *testing.T) {
	blocks := systemBlocksFor("you are the assistant", false)
	if len(blocks) != 1 {
		t.Fatalf("want text block only, got %d block(s)", len(blocks))
	}
	if _, ok := blocks[0].(*types.SystemContentBlockMemberText); !ok {
		t.Fatalf("want a text block, got %T", blocks[0])
	}
}

// OpenAI's GPT-5 and GPT-6 reasoning models reject a temperature outright, so
// none is sent; every other model, gpt-oss included, keeps the configured one.
func TestTemperatureOmittedForOpenAIReasoningModels(t *testing.T) {
	omitted := []string{
		"global.openai.gpt-6-luna",
		"in.openai.gpt-5.6-luna",
		"us.openai.gpt-6-sol",
		"openai.gpt-5.5",
	}
	for _, id := range omitted {
		if got := temperatureFor(id, 0.1); got != nil {
			t.Errorf("temperatureFor(%q) = %v, want nil", id, *got)
		}
	}
	kept := []string{
		"openai.gpt-oss-120b-1:0",
		"global.anthropic.claude-haiku-4-5-20251001-v1:0",
		"apac.amazon.nova-pro-v1:0",
		"qwen.qwen3-235b-a22b-2507-v1:0",
	}
	for _, id := range kept {
		got := temperatureFor(id, 0.1)
		if got == nil || *got != 0.1 {
			t.Errorf("temperatureFor(%q) = %v, want 0.1", id, got)
		}
	}
}

// Reasoning effort reaches an OpenAI GPT-5 or GPT-6 model as
// additionalModelRequestFields.reasoning.effort, the shape Bedrock's Converse
// accepts for them; the flat reasoning_effort key is rejected as an unknown
// parameter. Any other family gets no field, and an empty effort sends none.
func TestReasoningFieldsGoOnlyToOpenAIReasoningModels(t *testing.T) {
	for _, id := range []string{"global.openai.gpt-5.6-terra", "in.openai.gpt-5.6-terra", "global.openai.gpt-6-luna"} {
		doc := reasoningFieldsFor(id, "medium")
		if doc == nil {
			t.Fatalf("%s: no reasoning field sent", id)
		}
		b, err := doc.MarshalSmithyDocument()
		if err != nil {
			t.Fatal(err)
		}
		if string(b) != `{"reasoning":{"effort":"medium"}}` {
			t.Errorf("%s: sent %s", id, b)
		}
	}
	for _, id := range []string{"global.anthropic.claude-sonnet-5-5", "openai.gpt-oss-120b-1:0", "amazon.nova-pro-v1:0"} {
		if reasoningFieldsFor(id, "medium") != nil {
			t.Errorf("%s: a reasoning field was sent to a model that does not take it", id)
		}
	}
	if reasoningFieldsFor("global.openai.gpt-5.6-terra", "") != nil {
		t.Error("an empty effort must send no field, so the provider default applies")
	}
}

func TestValidReasoningEffort(t *testing.T) {
	for _, e := range []string{"", "none", "low", "medium", "high", "xhigh", "max"} {
		if !ValidReasoningEffort(e) {
			t.Errorf("%q rejected", e)
		}
	}
	for _, e := range []string{"Medium", "minimal", "extreme"} {
		if ValidReasoningEffort(e) {
			t.Errorf("%q accepted", e)
		}
	}
}
