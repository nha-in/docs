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
	if !strings.Contains(SystemPrompt(""), toolingPage) {
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
	prompt := SystemPrompt("")
	idx := strings.Index(prompt, toolingPage)
	if idx < 0 {
		t.Skip("covered by TestPromptOffersTheTooling")
	}
	window := prompt[max(0, idx-600):idx]
	if !strings.Contains(strings.ToLower(window), "building") {
		t.Errorf("the tooling offer does not say it is for readers who are building; it will fire on definition questions too")
	}
}

// The MCP address is deployment configuration, not a fact of the source:
// a deployment on another hostname must be able to change what the
// assistant says without a code edit.
func TestPromptTakesTheDeploymentsMCPURL(t *testing.T) {
	custom := "https://mcp.docs.abdm.gov.in/mcp"
	got := SystemPrompt(custom)
	if !strings.Contains(got, custom) {
		t.Errorf("SystemPrompt(%q) does not carry the configured address", custom)
	}
	if strings.Contains(got, "{{MCP_URL}}") {
		t.Error("the template placeholder leaked into the rendered prompt")
	}
	if !strings.Contains(SystemPrompt(""), DefaultMCPURL) {
		t.Error("an empty MCPURL should fall back to DefaultMCPURL")
	}
}
