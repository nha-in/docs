// Package embed provides text embedding for hybrid retrieval: an Ollama
// client for production and a deterministic fake for tests.
package embed

import "context"

type Embedder interface {
	Embed(ctx context.Context, texts []string) ([][]float32, error)
	Model() string
}

func Cosine(a, b []float32) float32 {
	if len(a) != len(b) || len(a) == 0 {
		return 0
	}
	var dot, na, nb float32
	for i := range a {
		dot += a[i] * b[i]
		na += a[i] * a[i]
		nb += b[i] * b[i]
	}
	if na == 0 || nb == 0 {
		return 0
	}
	return dot / (sqrt32(na) * sqrt32(nb))
}

func sqrt32(f float32) float32 {
	// Newton iteration is enough here; avoids importing math for float64 churn.
	if f <= 0 {
		return 0
	}
	x := f
	for i := 0; i < 20; i++ {
		x = 0.5 * (x + f/x)
	}
	return x
}
