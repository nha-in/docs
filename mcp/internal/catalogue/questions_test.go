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
