package index

import "testing"

func TestParseJourneysOrdersStepsAndSkipsGroupings(t *testing.T) {
	steps, err := ParseJourneys([][]byte{[]byte(`
- id: a
  title: HIP initiated linking
  steps:
    - op: one
    - {op: two}
    - op: three
- id: b
  title: Callbacks
  steps:
    - op: x
    - op: y
`)})
	if err != nil {
		t.Fatal(err)
	}
	if got := steps["one"]; got.Next != "two" || got.Journey != "HIP initiated linking" {
		t.Errorf("one: %+v", got)
	}
	if _, ok := steps["three"]; ok {
		t.Error("the last step has nothing after it")
	}
	if _, ok := steps["x"]; ok {
		t.Error("a list of callbacks is not a sequence")
	}
}
