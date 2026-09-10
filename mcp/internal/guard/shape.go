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
	// listMarkerRe matches a leading list marker ("1. ", "1) ", "- ", "* ")
	// so the first sentence check reads the sentence itself, not the marker
	// stopping it from matching a terminal punctuation mark right away.
	listMarkerRe = regexp.MustCompile(`^\s*(?:\d+[.)]|[-*])\s+`)
	stopWords    = map[string]bool{"a": true, "an": true, "the": true, "using": true, "from": true, "create": true, "with": true, "to": true, "of": true, "and": true, "for": true, "in": true}
)

// firstSentence returns the first sentence of answer, with a leading list
// marker stripped first. When no terminal ".!?" is found (a heading-style
// first line with no punctuation), it falls back to the first line, or the
// whole answer when there is no newline either.
func firstSentence(answer string) string {
	s := listMarkerRe.ReplaceAllString(answer, "")
	if m := firstSentenceRe.FindString(s); m != "" {
		return m
	}
	if i := strings.IndexByte(s, '\n'); i >= 0 {
		return s[:i]
	}
	return s
}

// titleWords lowercases a title and splits it into trimmed words.
func titleWords(title string) []string {
	var words []string
	for _, w := range strings.Fields(strings.ToLower(title)) {
		w = strings.Trim(w, ",.:;()")
		if w != "" {
			words = append(words, w)
		}
	}
	return words
}

// sharedPrefix is the first three words of a title, lowercased. Flow titles
// that share this prefix are siblings in the same flow family: "Create an
// ABHA using Aadhaar OTP" and "Create an ABHA using face authentication"
// share "create an abha".
func sharedPrefix(words []string) string {
	n := 3
	if len(words) < n {
		n = len(words)
	}
	return strings.Join(words[:n], " ")
}

// routeKey is the two most specific words of a title's words, lowercased:
// for the suffix after a flow's shared prefix, "using Aadhaar face
// authentication" -> "face authentication". An answer names the route when
// both words appear within four words of each other, in either order.
func routeKey(words []string) []string {
	var out []string
	for _, w := range words {
		if !stopWords[w] && w != "abha" && w != "aadhaar" {
			out = append(out, w)
		}
	}
	if len(out) > 2 {
		out = out[len(out)-2:]
	}
	return out
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
//
// A route is only demanded of the answer when it has a sibling: titles are
// grouped by their shared first-three-words prefix (sharedPrefix), and only
// groups of two or more are checked. A title alone in its group describes
// one flow on its own terms and nothing forces its wording into a two-word
// key, so it is never checked.
func CheckShape(shape, answer string, pack PackFacts) []string {
	if shape != "how-do-i" && shape != "compare" && shape != "diagnose" {
		return nil
	}
	var f []string
	groups := map[string]int{}
	titleWordsByTitle := make([][]string, len(pack.FlowTitles))
	for i, t := range pack.FlowTitles {
		w := titleWords(t)
		titleWordsByTitle[i] = w
		groups[sharedPrefix(w)]++
	}
	for i, t := range pack.FlowTitles {
		w := titleWordsByTitle[i]
		p := sharedPrefix(w)
		if groups[p] < 2 {
			continue
		}
		suffix := w[len(strings.Fields(p)):]
		if !namesRoute(answer, routeKey(suffix)) {
			f = append(f, fmt.Sprintf("route not named: %s", t))
		}
	}
	if pack.MentionsABHANumber && pack.MentionsABHAAddress {
		first := strings.ToLower(firstSentence(answer))
		if !strings.Contains(first, "abha number") && !strings.Contains(first, "abha address") {
			f = append(f, "first sentence names neither ABHA number nor ABHA address")
		}
	}
	return f
}
