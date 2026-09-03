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
	blocks := systemBlocksFor("you are the assistant")
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
	if blocks := systemBlocksFor(""); len(blocks) != 0 {
		t.Errorf("want no blocks for an empty prompt, got %d", len(blocks))
	}
}
