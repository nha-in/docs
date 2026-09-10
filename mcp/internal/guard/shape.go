package guard

import (
	"fmt"
	"regexp"
	"strings"
)

// PackFacts is what a verifier needs from the passage pack: the flow
// titles it carried, and whether both ABHA identifiers were in play.
type PackFacts struct {
	FlowTitles          []string
	MentionsABHANumber  bool
	MentionsABHAAddress bool
}

var (
	firstSentenceRe = regexp.MustCompile(`^[^.!?\n]*[.!?]`)
	stopWords       = map[string]bool{"a": true, "an": true, "the": true, "using": true, "from": true, "create": true, "with": true, "to": true, "of": true, "and": true, "for": true, "in": true}
)

// routeKey is the two most specific words of a flow title, lowercased:
// "Create an ABHA using Aadhaar face authentication" -> "face authentication".
// An answer names the route when both words appear within four words of
// each other, in either order.
func routeKey(title string) []string {
	var words []string
	for _, w := range strings.Fields(strings.ToLower(title)) {
		w = strings.Trim(w, ",.:;()")
		if !stopWords[w] && w != "abha" && w != "aadhaar" {
			words = append(words, w)
		}
	}
	if len(words) > 2 {
		words = words[len(words)-2:]
	}
	return words
}

func namesRoute(answer string, key []string) bool {
	if len(key) == 0 {
		return true
	}
	lower := strings.ToLower(answer)
	if len(key) == 1 {
		return strings.Contains(lower, key[0])
	}
	pat := regexp.MustCompile(regexp.QuoteMeta(key[0]) + `(?:\W+\w+){0,3}\W+` + regexp.QuoteMeta(key[1]) +
		`|` + regexp.QuoteMeta(key[1]) + `(?:\W+\w+){0,3}\W+` + regexp.QuoteMeta(key[0]))
	return pat.MatchString(lower)
}

// CheckShape runs the two rules that turned real answers wrong: naming
// fewer routes than the passages carried, and talking about "it" when both
// ABHA identifiers were in play. Only shapes that explain a procedure or a
// comparison are checked; a definition or a decline has no routes to omit.
func CheckShape(shape, answer string, pack PackFacts) []string {
	if shape != "how-do-i" && shape != "compare" && shape != "diagnose" {
		return nil
	}
	var f []string
	if len(pack.FlowTitles) >= 2 {
		for _, t := range pack.FlowTitles {
			if !namesRoute(answer, routeKey(t)) {
				f = append(f, fmt.Sprintf("route not named: %s", t))
			}
		}
	}
	if pack.MentionsABHANumber && pack.MentionsABHAAddress {
		first := strings.ToLower(firstSentenceRe.FindString(answer))
		if !strings.Contains(first, "abha number") && !strings.Contains(first, "abha address") {
			f = append(f, "first sentence names neither ABHA number nor ABHA address")
		}
	}
	return f
}
