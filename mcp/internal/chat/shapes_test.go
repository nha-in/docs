package chat

import (
	"strings"
	"testing"
)

func TestEveryShapeHasABlockWithBudgetAndExemplar(t *testing.T) {
	for _, s := range []string{"define", "how-do-i", "diagnose", "compare", "meta", "decline"} {
		b := ShapeBlock(s)
		if !strings.Contains(b, "words") || !strings.Contains(b, "Example") {
			t.Errorf("%s: block must state a word budget and carry an example, got %q", s, b)
		}
	}
	if ShapeBlock("nonsense") != ShapeBlock("how-do-i") {
		t.Error("an unknown shape falls back to how-do-i")
	}
}
