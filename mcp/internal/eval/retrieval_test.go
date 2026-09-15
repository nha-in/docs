package eval

import (
	"encoding/json"
	"testing"
)

func searchTrace(ids ...string) ToolTrace {
	hits := make([]map[string]any, 0, len(ids))
	for _, id := range ids {
		hits = append(hits, map[string]any{"id": id})
	}
	out, _ := json.Marshal(map[string]any{"hits": hits})
	return ToolTrace{Name: "search_docs", Input: json.RawMessage(`{"query":"hims"}`), Output: out}
}

func TestRetrievalScoresTheFirstSearch(t *testing.T) {
	c := answerCase() // expects shared.glossary.hmis
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{searchTrace("shared.glossary.hip", "shared.glossary.hmis")}}}}
	r := Retrieval(c, tr)
	if !r.Scored || r.Recall3 != 1 || r.RR != 0.5 {
		t.Fatalf("got %+v", r)
	}
}

func TestRetrievalMissIsZero(t *testing.T) {
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{searchTrace("a", "b", "c", "shared.glossary.hmis")}}}}
	r := Retrieval(answerCase(), tr)
	if r.Recall3 != 0 || r.RR != 0.25 {
		t.Fatalf("got %+v", r)
	}
}

func TestRetrievalUnscoredWithoutASearch(t *testing.T) {
	if r := Retrieval(answerCase(), Transcript{}); r.Scored {
		t.Fatal("scored a case that made no search")
	}
}
