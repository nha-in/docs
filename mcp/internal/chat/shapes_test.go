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

// TestEveryShapeCarriesTheStandingDecline pins that a model told any shape,
// named or not, is still free to drop it and decline: standingDecline must
// be on the end of every block ShapeBlock can return.
func TestEveryShapeCarriesTheStandingDecline(t *testing.T) {
	for _, s := range []string{"define", "how-do-i", "diagnose", "compare", "meta", "decline", "unknown-shape"} {
		b := ShapeBlock(s)
		if !strings.HasSuffix(b, standingDecline) {
			t.Errorf("%s: block does not end with standingDecline, got %q", s, b)
		}
	}
}

// Every shape but the assistant's own asks for plain words first, and the
// diagnose shape says what to do with a symptom that carries no code.
func TestShapesAskForPlainWordsAndASituationalDiagnosis(t *testing.T) {
	for _, s := range []string{"define", "how-do-i", "diagnose", "compare", "meta", "topic", "overview", "walkthrough", "decline"} {
		if !strings.Contains(ShapeBlock(s), standingVoice) {
			t.Errorf("%s: block does not carry standingVoice", s)
		}
	}
	if strings.Contains(ShapeBlock("self"), standingVoice) {
		t.Error("the self shape has its own voice and takes no standing line")
	}
	if !strings.Contains(ShapeBlock("diagnose"), "most likely first") {
		t.Error("the diagnose shape lost its situational mode")
	}
}
