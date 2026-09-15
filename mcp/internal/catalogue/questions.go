package catalogue

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"strings"
)

// QuestionsHeading marks the synthetic chunk that carries an atom's
// questions for embedding. The indexer sets it on that chunk and search.go
// checks it, so the two cannot drift on what "the questions chunk" means.
const QuestionsHeading = "Questions this answers"

// AtomQuestions is what a reader might type that this atom answers,
// generated once per catalogue version by a strong model and committed.
// BodyHash is the atom body the questions were written against, so a
// stale set can be detected without regenerating.
type AtomQuestions struct {
	BodyHash  string   `json:"body_hash"`
	Questions []string `json:"questions"`
}

func BodyHash(a Atom) string {
	sum := sha256.Sum256([]byte(a.Body))
	return "sha256:" + hex.EncodeToString(sum[:8])
}

// ReadQuestions loads catalogue/shared/atom-questions.json. A missing
// file is an empty map, not an error: the index builds without questions,
// it is just worse at matching naive phrasings.
func ReadQuestions(path string) (map[string]AtomQuestions, error) {
	b, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return map[string]AtomQuestions{}, nil
	}
	if err != nil {
		return nil, err
	}
	var out map[string]AtomQuestions
	return out, json.Unmarshal(b, &out)
}

// CleanQuestions drops what a generator produces that a reader never
// would: duplicates, fragments, and questions that leak the atom id.
func CleanQuestions(raw []string, atomID string) []string {
	seen := map[string]bool{}
	var out []string
	for _, q := range raw {
		q = strings.TrimSpace(q)
		key := strings.ToLower(strings.TrimRight(q, "?.! "))
		if len(strings.Fields(key)) < 4 || seen[key] || strings.Contains(key, strings.ToLower(atomID)) {
			continue
		}
		seen[key] = true
		out = append(out, q)
	}
	return out
}
