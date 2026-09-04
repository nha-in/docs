package eval

import "encoding/json"

type RetrievalResult struct {
	CaseID  string  `json:"case_id"`
	Scored  bool    `json:"scored"`
	Recall3 float64 `json:"recall_at_3"`
	RR      float64 `json:"reciprocal_rank"`
}

// Retrieval scores the first search_docs call of a transcript against the
// case's expected sources: recall at 3 is 1 when any expected id sits in the
// first three hits, and the reciprocal rank is 1 over the best rank of any
// expected id. Scored separately from the answer, because a wrong answer
// after a right search is a synthesis defect and the reverse is a search
// defect, and the two are fixed in different places.
func Retrieval(c Case, t Transcript) RetrievalResult {
	r := RetrievalResult{CaseID: c.ID}
	if len(c.ExpectedSources) == 0 {
		return r
	}
	want := map[string]bool{}
	for _, id := range c.ExpectedSources {
		want[id] = true
	}
	for _, call := range t.Calls {
		for _, tr := range call.ToolResults {
			if tr.Name != "search_docs" {
				continue
			}
			var out struct {
				Hits []struct {
					ID string `json:"id"`
				} `json:"hits"`
			}
			if err := json.Unmarshal(tr.Output, &out); err != nil {
				return r
			}
			r.Scored = true
			for i, h := range out.Hits {
				if want[h.ID] {
					r.RR = 1 / float64(i+1)
					if i < 3 {
						r.Recall3 = 1
					}
					return r
				}
			}
			return r
		}
	}
	return r
}
