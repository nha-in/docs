package eval

import (
	"encoding/json"
	"regexp"
)

type RetrievalResult struct {
	CaseID  string  `json:"case_id"`
	Scored  bool    `json:"scored"`
	Recall3 float64 `json:"recall_at_3"`
	RR      float64 `json:"reciprocal_rank"`
}

// Retrieval scores what the answer drew on against the case's expected
// sources: recall at 3 is 1 when any expected id sits in the first three
// results, and the reciprocal rank is 1 over the best rank of any expected
// id. Scored separately from the answer, because a wrong answer after a
// right search is a synthesis defect and the reverse is a search defect, and
// the two are fixed in different places.
//
// The results scored are the pack the chat retrieved in code before the
// model spoke, carried in the first call's <passages> block, when there is
// one; otherwise the first search call (search_docs in runs recorded before
// the six tools). A search result lists its ids under "passages" (the
// composite lookup) or "hits" (plain search).
func Retrieval(c Case, t Transcript) RetrievalResult {
	r := RetrievalResult{CaseID: c.ID}
	if len(c.ExpectedSources) == 0 {
		return r
	}
	ids, ok := packIDs(t)
	if !ok {
		ids, ok = firstSearchIDs(t)
	}
	if !ok {
		return r
	}
	want := map[string]bool{}
	for _, id := range c.ExpectedSources {
		want[id] = true
	}
	r.Scored = true
	for i, id := range ids {
		if want[id] {
			r.RR = 1 / float64(i+1)
			if i < 3 {
				r.Recall3 = 1
			}
			return r
		}
	}
	return r
}

var packRe = regexp.MustCompile(`(?s)<passages>\n(.*?)\n</passages>`)

// packIDs reads the pre-retrieved pack from the last user message of the
// first model call, which is where the loop puts it.
func packIDs(t Transcript) ([]string, bool) {
	if len(t.Calls) == 0 || len(t.Calls[0].Messages) == 0 {
		return nil, false
	}
	msgs := t.Calls[0].Messages
	m := packRe.FindStringSubmatch(msgs[len(msgs)-1].Text)
	if m == nil {
		return nil, false
	}
	return resultIDs([]byte(m[1]))
}

func firstSearchIDs(t Transcript) ([]string, bool) {
	for _, call := range t.Calls {
		for _, tr := range call.ToolResults {
			if tr.Name == "search" || tr.Name == "search_docs" {
				return resultIDs(tr.Output)
			}
		}
	}
	return nil, false
}

func resultIDs(raw []byte) ([]string, bool) {
	var out struct {
		Passages []struct {
			ID string `json:"id"`
		} `json:"passages"`
		Hits []struct {
			ID string `json:"id"`
		} `json:"hits"`
	}
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, false
	}
	var ids []string
	for _, p := range out.Passages {
		ids = append(ids, p.ID)
	}
	for _, h := range out.Hits {
		ids = append(ids, h.ID)
	}
	return ids, true
}
