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
	out, _ := json.Marshal(map[string]any{"results": hits})
	return ToolTrace{Name: "abdm_search", Input: json.RawMessage(`{"query":"hims"}`), Output: out}
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

// The chat's abdm_search returns a passage pack, not hits; its passages are
// what the model read, so they are what is scored. A transcript recorded
// before the rename still scores under its old name.
func TestRetrievalScoresPassagesAndTheOldName(t *testing.T) {
	out, _ := json.Marshal(map[string]any{"passages": []map[string]any{{"id": "a"}, {"id": "shared.glossary.hmis"}}})
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{{Name: "abdm_search", Output: out}}}}}
	if r := Retrieval(answerCase(), tr); !r.Scored || r.RR != 0.5 {
		t.Fatalf("passages: got %+v", r)
	}
	hits, _ := json.Marshal(map[string]any{"hits": []map[string]any{{"id": "shared.glossary.hmis"}}})
	old := ToolTrace{Name: "search_docs", Output: hits}
	if r := Retrieval(answerCase(), Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{old}}}}); r.RR != 1 {
		t.Fatalf("old name: got %+v", r)
	}
}
