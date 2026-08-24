package embed

import (
	"context"
	"fmt"
	"hash/fnv"
	"strings"
)

type Fake struct{ dim int }

func NewFake(dim int) *Fake   { return &Fake{dim: dim} }
func (f *Fake) Model() string { return fmt.Sprintf("fake-%d", f.dim) }

func (f *Fake) Embed(_ context.Context, texts []string) ([][]float32, error) {
	out := make([][]float32, len(texts))
	for i, t := range texts {
		v := make([]float32, f.dim)
		for _, w := range strings.Fields(strings.ToLower(t)) {
			h := fnv.New32a()
			h.Write([]byte(w))
			v[int(h.Sum32())%f.dim]++
		}
		var norm float32
		for _, x := range v {
			norm += x * x
		}
		if norm > 0 {
			n := sqrt32(norm)
			for j := range v {
				v[j] /= n
			}
		}
		out[i] = v
	}
	return out, nil
}
