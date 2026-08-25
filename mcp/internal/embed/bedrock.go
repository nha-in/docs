package embed

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
)

// bedrockInvoker is the one Bedrock call this package makes, held as an
// interface so tests never touch AWS.
type bedrockInvoker interface {
	InvokeModel(ctx context.Context, params *bedrockruntime.InvokeModelInput,
		optFns ...func(*bedrockruntime.Options)) (*bedrockruntime.InvokeModelOutput, error)
}

// Bedrock embeds text through Amazon Bedrock's InvokeModel API. Titan Text
// Embeddings V2 takes one input per call, so Embed loops; the catalogue is
// small enough that this stays well inside a CI minute.
type Bedrock struct {
	client  bedrockInvoker
	modelID string
}

// NewBedrock resolves credentials through the SDK default chain: the task
// role in production, an OIDC-assumed role in CI, a configured profile on a
// laptop. No key material is ever passed in here.
func NewBedrock(ctx context.Context, region, modelID string) (*Bedrock, error) {
	opts := []func(*awsconfig.LoadOptions) error{}
	if region != "" {
		opts = append(opts, awsconfig.WithRegion(region))
	}
	cfg, err := awsconfig.LoadDefaultConfig(ctx, opts...)
	if err != nil {
		return nil, fmt.Errorf("bedrock: load aws config: %w", err)
	}
	return &Bedrock{client: bedrockruntime.NewFromConfig(cfg), modelID: modelID}, nil
}

// Model is provider-qualified so an index built by one provider can never be
// served by another without the startup mismatch error firing.
func (b *Bedrock) Model() string { return "bedrock/" + b.modelID }

func (b *Bedrock) Embed(ctx context.Context, texts []string) ([][]float32, error) {
	out := make([][]float32, len(texts))
	for i, text := range texts {
		body, err := json.Marshal(map[string]any{"inputText": text})
		if err != nil {
			return nil, err
		}
		res, err := b.client.InvokeModel(ctx, &bedrockruntime.InvokeModelInput{
			ModelId:     aws.String(b.modelID),
			ContentType: aws.String("application/json"),
			Accept:      aws.String("application/json"),
			Body:        body,
		})
		if err != nil {
			return nil, fmt.Errorf("bedrock invoke %q: %w", b.modelID, err)
		}
		var parsed struct {
			Embedding []float32 `json:"embedding"`
		}
		if err := json.Unmarshal(res.Body, &parsed); err != nil {
			return nil, fmt.Errorf("bedrock: decode response: %w", err)
		}
		if len(parsed.Embedding) == 0 {
			return nil, fmt.Errorf("bedrock: empty embedding for text %d", i)
		}
		out[i] = parsed.Embedding
	}
	return out, nil
}
