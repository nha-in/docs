package eval

import "testing"

func TestAgreementCountsMatches(t *testing.T) {
	owner := map[string]string{"a": "A", "b": "B", "c": "C", "d": "A"}
	judge := []Grade{{CaseID: "a", Grade: "A"}, {CaseID: "b", Grade: "A"}, {CaseID: "c", Grade: "C"}, {CaseID: "d", Grade: "unstable"}, {CaseID: "zzz", Grade: "A"}}
	agree, total := Agreement(owner, judge)
	if agree != 2 || total != 4 {
		t.Fatalf("agree=%d total=%d", agree, total)
	}
}
