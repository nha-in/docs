package catalogue

import "strings"

type Chunk struct {
	AtomID  string
	Heading string
	Text    string
}

// ChunkAtom splits a body into one chunk per "## " section. The chunk
// text is prefixed with the atom title and heading so short sections
// stay distinguishable when embedded.
func ChunkAtom(a Atom) []Chunk {
	body := strings.TrimSpace(a.Body)
	if body == "" {
		return nil
	}
	var chunks []Chunk
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
