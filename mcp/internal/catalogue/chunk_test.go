package catalogue

import (
	"strings"
	"testing"
)

func TestChunkAtomSplitsOnHeadings(t *testing.T) {
	a := Atom{ID: "x", Title: "Link a care context",
		Body: "## In plain words\n\nIntro text.\n\n## What happens\n\nSequence text."}
	chunks := ChunkAtom(a)
	if len(chunks) != 2 {
		t.Fatalf("got %d chunks, want 2", len(chunks))
	}
	if chunks[0].Heading != "In plain words" || chunks[1].Heading != "What happens" {
		t.Errorf("headings = %q, %q", chunks[0].Heading, chunks[1].Heading)
	}
	if !strings.Contains(chunks[0].Text, "Link a care context") ||
		!strings.Contains(chunks[0].Text, "Intro text.") {
		t.Errorf("chunk text not prefixed with title: %q", chunks[0].Text)
	}
}

func TestChunkAtomNoHeadings(t *testing.T) {
	a := Atom{ID: "x", Title: "T", Body: "just prose"}
	chunks := ChunkAtom(a)
	if len(chunks) != 1 || chunks[0].Heading != "" {
		t.Fatalf("chunks = %+v", chunks)
	}
}

func TestChunkAtomEmptyBody(t *testing.T) {
	if got := ChunkAtom(Atom{ID: "x", Title: "T", Body: ""}); len(got) != 0 {
		t.Fatalf("want no chunks for empty body, got %+v", got)
	}
}
