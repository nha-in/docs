package guard

import (
	"regexp"
	"strings"
)

var fencedBlockRe = regexp.MustCompile("(?s)```.*?```")

// WordBudget is the ceiling per answer shape. The shape blocks in
// chat/shapes.go set the target; this sits above it on purpose. The prompt
// shapes a good answer, this catches one that has stopped being an answer.
var WordBudget = map[string]int{
	"define": 150, "how-do-i": 260, "diagnose": 260, "compare": 260, "meta": 150, "decline": 80,
}

// Words counts prose words with fenced blocks removed: a worked example is
// not verbose because its curl is long.
func Words(s string) int {
	return len(strings.Fields(fencedBlockRe.ReplaceAllString(s, " ")))
}

// OverBudget returns the count and ceiling when an answer of this shape is
// too long, else ok is false.
func OverBudget(shape, answer string) (n, max int, over bool) {
	max, ok := WordBudget[shape]
	if !ok {
		return 0, 0, false
	}
	n = Words(answer)
	return n, max, n > max
}
