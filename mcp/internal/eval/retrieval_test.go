package eval

import (
	"encoding/json"
	"testing"

	"github.com/nha-in/docs/mcp/internal/chat"
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
	c := answerCase() // expects hiecm.glossary.hmis
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{searchTrace("hiecm.glossary.hip", "hiecm.glossary.hmis")}}}}
	r := Retrieval(c, tr)
	if !r.Scored || r.Recall3 != 1 || r.RR != 0.5 {
		t.Fatalf("got %+v", r)
	}
}

func TestRetrievalMissIsZero(t *testing.T) {
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{searchTrace("a", "b", "c", "hiecm.glossary.hmis")}}}}
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

func passagesJSON(ids ...string) string {
	ps := make([]map[string]any, 0, len(ids))
	for _, id := range ids {
		ps = append(ps, map[string]any{"id": id, "body": "..."})
	}
	out, _ := json.Marshal(map[string]any{"passages": ps, "related": []any{}})
	return string(out)
}

// The chat retrieves in code before the model speaks and hands the pack over
// as a <passages> block; that pack is what the answer drew on, so it is what
// recall scores, even when the model never calls search itself.
func TestRetrievalScoresThePreRetrievedPack(t *testing.T) {
	first := ModelCall{Messages: []chat.Message{{Role: "user",
		Text: "<passages>\n" + passagesJSON("hiecm.glossary.hip", "hiecm.glossary.hmis") + "\n</passages>\n\nwhat is hims"}}}
	later := ModelCall{ToolResults: []ToolTrace{searchTrace("x", "y", "z")}}
	r := Retrieval(answerCase(), Transcript{Calls: []ModelCall{first, later}})
	if !r.Scored || r.Recall3 != 1 || r.RR != 0.5 {
		t.Fatalf("got %+v, want the pack scored ahead of a later search", r)
	}
}

// Without a pack, the first search counts, in the composite lookup's
// "passages" shape as well as the older "hits".
func TestRetrievalReadsPassagesFromASearch(t *testing.T) {
	tr := Transcript{Calls: []ModelCall{{ToolResults: []ToolTrace{{Name: "search",
		Output: json.RawMessage(passagesJSON("a", "hiecm.glossary.hmis"))}}}}}
	r := Retrieval(answerCase(), tr)
	if !r.Scored || r.Recall3 != 1 || r.RR != 0.5 {
		t.Fatalf("got %+v", r)
	}
}
