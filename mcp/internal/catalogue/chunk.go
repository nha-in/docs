package catalogue

import "strings"

type Chunk struct {
	AtomID  string
	Heading string
	Text    string
}

// ChunkAtom emits one leading chunk of title plus frontmatter summary,
// then splits the body into one chunk per "## " section. The section
// chunk text is prefixed with the atom title and heading so short
// sections stay distinguishable when embedded. The summary chunk matters
// because summaries carry the searcher's vocabulary; without it the
// embedder never sees them.
func ChunkAtom(a Atom) []Chunk {
	var chunks []Chunk
	if summary := strings.TrimSpace(a.Summary); summary != "" {
		chunks = append(chunks, Chunk{AtomID: a.ID, Heading: "",
			Text: a.Title + "\n" + summary})
	}
	body := strings.TrimSpace(a.Body)
	if body == "" {
		return chunks
	}
	add := func(heading, text string) {
		text = strings.TrimSpace(text)
		if text == "" {
			return
		}
		prefix := a.Title
		if heading != "" {
			prefix += ": " + heading
		}
		chunks = append(chunks, Chunk{AtomID: a.ID, Heading: heading,
			Text: prefix + "\n" + text})
	}
	parts := strings.Split("\n"+body, "\n## ")
	// parts[0] is any preamble before the first heading.
	add("", parts[0])
	for _, p := range parts[1:] {
		heading, rest, _ := strings.Cut(p, "\n")
		add(strings.TrimSpace(heading), rest)
	}
	return chunks
}
