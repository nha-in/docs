package catalogue

import "testing"

func TestCleanQuestionsFiltersNoise(t *testing.T) {
	got := CleanQuestions([]string{
		"How do I create an ABHA without Aadhaar?",
		"how do i create an abha without aadhaar", // duplicate after normalising
		"ABHA?", // too short
		"Explain hiecm.flow.p1-create-abha-address", // leaks the id
		"can a phr app register someone with just a phone number",
	}, "hiecm.flow.p1-create-abha-address")
	want := 2
	if len(got) != want {
		t.Fatalf("got %d questions %q, want %d", len(got), got, want)
	}
}

// Fixed value the JS lint (scripts/lint-atom-questions.mjs) must reproduce
// byte for byte, since it hashes atom bodies the same way for staleness
// checks. The lint trims the body before hashing, so the shared input is
// the already-trimmed body "hello"; hex is the first 16 chars of
// sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b982.
// See task-B4-report.md for the matching Node run.
func TestBodyHashKnownValue(t *testing.T) {
	got := BodyHash(Atom{Body: "hello"})
	want := "sha256:2cf24dba5fb0a30e"
	if got != want {
		t.Fatalf("BodyHash(%q) = %q, want %q", "hello", got, want)
	}
}

func TestBodyHashChangesWithBody(t *testing.T) {
	a := Atom{ID: "x", Body: "one"}
	b := Atom{ID: "x", Body: "two"}
	if BodyHash(a) == BodyHash(b) {
		t.Error("hash must change when the body changes")
	}
	if BodyHash(a) != BodyHash(a) {
		t.Error("hash must be stable")
	}
}
