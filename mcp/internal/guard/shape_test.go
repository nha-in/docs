package guard

import "testing"

func TestCheckShapeNamesEveryRoute(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{
		"Create an ABHA using an Aadhaar OTP",
		"Create an ABHA using Aadhaar face authentication",
		"Create an ABHA from an identity document",
	}}
	two := "There are two routes: Aadhaar OTP and face authentication. Call the OTP endpoint first."
	if f := CheckShape("how-do-i", two, pack); len(f) == 0 {
		t.Error("an answer naming two of three routes must fail")
	}
	three := "Three routes: Aadhaar OTP, face authentication, and an identity document such as a driving licence."
	if f := CheckShape("how-do-i", three, pack); len(f) != 0 {
		t.Errorf("all three named, got %v", f)
	}
}

// TestCheckShapeOnlyDemandsRoutesWithASibling covers the sharedPrefix
// grouping: "Find somebody's ABHA when they do not know it" and "Log
// somebody in to their existing ABHA" are each alone in their group (no
// other flow title shares their first three words), so neither is ever
// demanded of the answer, even though an answer naming only the three
// create routes never mentions either of them.
func TestCheckShapeOnlyDemandsRoutesWithASibling(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{
		"Create an ABHA using an Aadhaar OTP",
		"Create an ABHA using Aadhaar face authentication",
		"Create an ABHA from an identity document",
		"Find somebody's ABHA when they do not know it",
		"Log somebody in to their existing ABHA",
	}}
	answer := "Three routes: Aadhaar OTP, face authentication, and an identity document such as a driving licence."
	if f := CheckShape("how-do-i", answer, pack); len(f) != 0 {
		t.Errorf("a title alone in its group must not be demanded of the answer, got %v", f)
	}
}

func TestCheckShapeDisambiguatesIdentifiers(t *testing.T) {
	pack := PackFacts{MentionsABHANumber: true, MentionsABHAAddress: true}
	vague := "You need Aadhaar to create it. Then choose a username."
	if f := CheckShape("how-do-i", vague, pack); len(f) == 0 {
		t.Error("first sentence names neither identifier; must fail")
	}
	clear := "An ABHA address needs no ABHA number: a mobile OTP is enough."
	if f := CheckShape("how-do-i", clear, pack); len(f) != 0 {
		t.Errorf("first sentence names the identifier, got %v", f)
	}
}

func TestCheckShapeFirstSentenceStripsListMarker(t *testing.T) {
	pack := PackFacts{MentionsABHANumber: true, MentionsABHAAddress: true}
	answer := "1. Use an ABHA number to log in."
	if f := CheckShape("how-do-i", answer, pack); len(f) != 0 {
		t.Errorf("a leading list marker must not stop the identifier from being read, got %v", f)
	}
}

func TestCheckShapeFirstSentenceFallsBackToFirstLine(t *testing.T) {
	pack := PackFacts{MentionsABHANumber: true, MentionsABHAAddress: true}
	answer := "An ABHA address needs no ABHA number\nmore text"
	if f := CheckShape("how-do-i", answer, pack); len(f) != 0 {
		t.Errorf("a first line with no terminal punctuation must still be read, got %v", f)
	}
}

func TestCheckShapeSkipsDefineAndDecline(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{"A", "B"}, MentionsABHANumber: true, MentionsABHAAddress: true}
	for _, s := range []string{"define", "decline", "meta"} {
		if f := CheckShape(s, "Short.", pack); len(f) != 0 {
			t.Errorf("%s should not be route or identifier checked, got %v", s, f)
		}
	}
}
