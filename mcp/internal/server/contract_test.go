package server

import (
	"context"
	"sort"
	"testing"
)

// The contract walks the whole snapshot through the MCP protocol. On the
// three-atom fixture every atom opens, every related id resolves and every
// error code decodes, so those checks must report their full count and no
// failure; a harness that counted nothing would pass silently otherwise.
func TestRunContractWalksTheWholeSnapshot(t *testing.T) {
	res, err := RunContract(context.Background(), fixtureReader(t, false), nil)
	if err != nil {
		t.Fatal(err)
	}
	byName := map[string]ContractCheck{}
	for _, c := range res.Checks {
		byName[c.Name] = c
	}
	for name, total := range map[string]int{"get-atom": 3, "decode-error": 1, "get-operation": 1, "catalogue-info": 1} {
		c := byName[name]
		if c.Total != total || c.Failed != 0 {
			t.Errorf("%s = %d/%d failed, want %d checked and none failed", name, c.Failed, c.Total, total)
		}
	}
	if !sort.StringsAreSorted(res.Failures) {
		t.Error("failures must be sorted, so a baseline diff is stable")
	}
}
