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

// TestCheckShapeObjectPhraseSplitsSiblingsFromLookalikes covers the real
// case that broke the old shared-first-three-words rule: "Create an ABHA
// address in a PHR application" starts with the same three words as the
// three M1 create routes, but its object phrase ("create an abha address")
// differs from theirs ("create an abha"), so it is never grouped with them
// and an answer naming only the three M1 routes passes.
func TestCheckShapeObjectPhraseSplitsSiblingsFromLookalikes(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{
		"Create an ABHA using an Aadhaar OTP",
		"Create an ABHA using Aadhaar face authentication",
		"Create an ABHA from an identity document",
		"Create an ABHA address in a PHR application",
	}}
	answer := "Three routes: Aadhaar OTP, face authentication, and an identity document such as a driving licence."
	if f := CheckShape("how-do-i", answer, pack); len(f) != 0 {
		t.Errorf("the PHR-application title has a different object phrase and must not be demanded, got %v", f)
	}
}

// TestCheckShapeNoConnectorNeverASibling covers a title with no connector
// word at all: it has no object phrase, so it can never be grouped with
// another title, even one with identical wording.
func TestCheckShapeNoConnectorNeverASibling(t *testing.T) {
	pack := PackFacts{FlowTitles: []string{
		"Manage your ABHA profile",
		"Manage your ABHA profile",
	}}
	if f := CheckShape("how-do-i", "Nothing about profiles here.", pack); len(f) != 0 {
		t.Errorf("a title with no connector word must never be demanded of the answer, got %v", f)
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
