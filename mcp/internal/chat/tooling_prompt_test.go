package chat

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

// toolingPage is the one portal path the assistant offers when a reader is
// building an integration. It covers both the agent skills and the MCP
// server, so there is a single place to send people.
const toolingPage = "/docs/hiecm/v3/getting-started/mcp"

func TestPromptOffersTheTooling(t *testing.T) {
	if !strings.Contains(systemPrompt, toolingPage) {
		t.Errorf("system prompt never names %s, so an integrator is never told the skills and the MCP server exist", toolingPage)
	}
}

// The prompt forbids inventing portal URLs. A path it does name has to
// resolve, or the assistant sends readers to a 404 in good faith. This is
// the check that catches the page being moved or renamed.
func TestToolingPageExists(t *testing.T) {
	_, thisFile, _, _ := runtime.Caller(0)
	repo := filepath.Join(filepath.Dir(thisFile), "..", "..", "..")
	rel := strings.TrimPrefix(toolingPage, "/docs/")
	var found string
	for _, ext := range []string{".md", ".mdx"} {
		p := filepath.Join(repo, "site", "docs", filepath.FromSlash(rel)+ext)
		if _, err := os.Stat(p); err == nil {
			found = p
			break
		}
	}
	if found == "" {
		t.Fatalf("prompt offers %s but no page backs it under site/docs", toolingPage)
	}
}

// The offer must be scoped. A citizen asking what an Ayushman card is should
// not be told to install an MCP server, so the rule has to say when it fires.
func TestToolingOfferIsScoped(t *testing.T) {
	idx := strings.Index(systemPrompt, toolingPage)
	if idx < 0 {
		t.Skip("covered by TestPromptOffersTheTooling")
	}
	window := systemPrompt[max(0, idx-600):idx]
	if !strings.Contains(strings.ToLower(window), "building") {
		t.Errorf("the tooling offer does not say it is for readers who are building; it will fire on definition questions too")
	}
}
