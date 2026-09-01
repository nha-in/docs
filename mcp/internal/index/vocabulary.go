package index

import (
	"os"
	"sort"
	"strings"

	"gopkg.in/yaml.v3"
)

// Vocabulary is the synonym table from catalogue/shared/vocabulary.yaml.
//
// Readers do not use this catalogue's words. They ask about a health ID
// when they mean an ABHA number, and about an HMIS when they mean the
// provider facing side of the HIE-CM. A query carrying one term is widened
// with the rest of its set before the keyword search runs.
//
// It holds synonyms only. Terms that are merely related belong in atom
// prose and in the related graph, not here: see the file's own header and
// shared.decision.vocabulary-in-one-file.
//
// A nil *Vocabulary is valid and expands nothing, so the server runs
// unchanged when the file is absent.
type Vocabulary struct {
	// sets are the synonym groups, lowercased.
	sets [][]string
	// byTerm maps a lowercased term to the indexes of every set holding it.
	// A term may sit in more than one set.
	byTerm map[string][]int
	// maxWords is the longest phrase in any set, which bounds how far the
	// phrase scan has to look ahead.
	maxWords int
}

type vocabEntry struct {
	Terms []string `yaml:"terms"`
	Note  string   `yaml:"note"`
}

// LoadVocabulary reads the vocabulary file. A missing file is not an error:
// it yields a nil Vocabulary, and search behaves as it did before.
func LoadVocabulary(path string) (*Vocabulary, error) {
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return ParseVocabulary(data)
}

// ParseVocabulary builds a Vocabulary from the file's bytes.
func ParseVocabulary(data []byte) (*Vocabulary, error) {
	var entries []vocabEntry
	if err := yaml.Unmarshal(data, &entries); err != nil {
		return nil, err
	}
	v := &Vocabulary{byTerm: map[string][]int{}}
	for _, e := range entries {
		if len(e.Terms) < 2 {
			// A set of one expands to nothing. Skip it rather than
			// carrying a row that can never fire.
			continue
		}
		set := make([]string, 0, len(e.Terms))
		for _, t := range e.Terms {
			t = strings.ToLower(strings.TrimSpace(t))
			if t == "" {
				continue
			}
			set = append(set, t)
			if n := len(strings.Fields(t)); n > v.maxWords {
				v.maxWords = n
			}
		}
		if len(set) < 2 {
			continue
		}
		i := len(v.sets)
		v.sets = append(v.sets, set)
		for _, t := range set {
			v.byTerm[t] = append(v.byTerm[t], i)
		}
	}
	return v, nil
}

// Expand returns the terms worth adding to a query, meaning every member of
// every synonym set the query touches, minus the ones it already carries.
// The result is sorted so a query produces the same FTS expression every
// time, which keeps the cache and the tests stable.
//
// Matching is on whole words and on phrases, never on substrings: "emr"
// must not fire on "emergency".
func (v *Vocabulary) Expand(query string) []string {
	if v == nil || len(v.sets) == 0 {
		return nil
	}
	words := strings.Fields(strings.ToLower(query))
	if len(words) == 0 {
		return nil
	}

	present := map[string]bool{}  // terms the query already carries
	hitSets := map[int]bool{}     // sets the query touched
	for i := range words {
		// Longest phrase first, so "hospital information system" wins
		// over a bare "system" that happens to sit in another set.
		for n := min(v.maxWords, len(words)-i); n >= 1; n-- {
			phrase := strings.Join(words[i:i+n], " ")
			// Trim punctuation that rides along in natural questions.
			phrase = strings.Trim(phrase, ".,?!;:()\"'")
			sets, ok := v.byTerm[phrase]
			if !ok {
				continue
			}
			present[phrase] = true
			for _, s := range sets {
				hitSets[s] = true
			}
			break
		}
	}

	var out []string
	seen := map[string]bool{}
	for s := range hitSets {
		for _, t := range v.sets[s] {
			if present[t] || seen[t] {
				continue
			}
			seen[t] = true
			out = append(out, t)
		}
	}
	sort.Strings(out)
	return out
}

// ftsQuery builds the FTS5 MATCH expression for a query, widening it with
// any synonyms the vocabulary knows.
//
// The original query keeps its existing semantics, which is an implicit AND
// across its terms. Each expansion is offered as a whole alternative:
//
//	("aadhaar" "otp") OR ("adhaar") OR ("uidai number")
//
// so a reader using a word this catalogue never uses still reaches the
// atoms, and bm25 decides the order. Expansions are alternatives rather
// than extra required terms, because requiring them would make a widened
// query stricter than the one the reader typed.
func ftsQuery(query string, v *Vocabulary) string {
	base := ftsQuote(query)
	expansions := v.Expand(query)
	if base == "" || len(expansions) == 0 {
		return base
	}
	parts := make([]string, 0, len(expansions)+1)
	parts = append(parts, "("+base+")")
	for _, e := range expansions {
		if q := ftsQuote(e); q != "" {
			parts = append(parts, "("+q+")")
		}
	}
	return strings.Join(parts, " OR ")
}
