package embed

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
)

// fakeInvoker answers like Titan Text Embeddings V2: one embedding per call,
// derived from the input so the test can tell responses apart.
type fakeInvoker struct {
	calls  int
	failOn int // 1-based call number to fail on; 0 never fails
}

func (f *fakeInvoker) InvokeModel(_ context.Context, params *bedrockruntime.InvokeModelInput,
	_ ...func(*bedrockruntime.Options)) (*bedrockruntime.InvokeModelOutput, error) {
	f.calls++
	if f.failOn == f.calls {
		return nil, fmt.Errorf("throttled")
	}
	var in struct {
		InputText string `json:"inputText"`
	}
	if err := json.Unmarshal(params.Body, &in); err != nil {
		return nil, err
	}
	body, _ := json.Marshal(map[string]any{
		"embedding": []float32{float32(len(in.InputText)), 1, 0},
	})
	return &bedrockruntime.InvokeModelOutput{Body: body}, nil
}

func TestBedrockEmbedsOnePerCall(t *testing.T) {
	inv := &fakeInvoker{}
	b := &Bedrock{client: inv, modelID: "amazon.titan-embed-text-v2:0"}

	got, err := b.Embed(context.Background(), []string{"ab", "abcd"})
	if err != nil {
		t.Fatal(err)
	}
	if inv.calls != 2 {
		t.Errorf("calls = %d, want one per text", inv.calls)
	}
	if got[0][0] != 2 || got[1][0] != 4 {
		t.Errorf("embeddings = %v, want first components 2 and 4", got)
	}
}

func TestBedrockModelIsProviderQualified(t *testing.T) {
	b := &Bedrock{modelID: "amazon.titan-embed-text-v2:0"}
	if b.Model() != "bedrock/amazon.titan-embed-text-v2:0" {
		t.Errorf("model = %q", b.Model())
	}
}

func TestBedrockSurfacesInvokeErrors(t *testing.T) {
	b := &Bedrock{client: &fakeInvoker{failOn: 2}, modelID: "m"}
	if _, err := b.Embed(context.Background(), []string{"a", "b"}); err == nil {
		t.Fatal("want error from second call")
	}
}
