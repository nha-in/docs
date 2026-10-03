package chat

import (
	"strings"
	"testing"
)

// The prompt is a file so it can be read, diffed and versioned on its own.
// These checks are what stop it drifting from the rules every answer is
// held to: the version in the file name is the version answers record, the
// house style has no em dash, the cache point holds only while the text
// stays short, and the one placeholder the renderer fills is still there.
func TestSystemPromptFile(t *testing.T) {
	if systemPromptTemplate == "" {
		t.Fatal("prompt/v5.md embedded empty")
	}
	if !strings.Contains(systemPromptTemplate, "{{MCP_URL}}") {
		t.Error("prompt lost its {{MCP_URL}} placeholder")
	}
	if strings.Contains(systemPromptTemplate, "—") {
		t.Error("prompt contains an em dash")
	}
	if n := len(strings.Fields(systemPromptTemplate)); n > 1200 {
		t.Errorf("prompt is %d words, over the 1200 ceiling for the cached core", n)
	}
	// The system prompt file sets the major version; a change to the shape
	// blocks alone, which ride in the user turn, moves the minor.
	if !strings.HasPrefix(PromptVersion, "v5") {
		t.Errorf("PromptVersion is %q but the embedded file is prompt/v5.md; bump both together", PromptVersion)
	}
	rendered := SystemPrompt("https://example.test/mcp")
	if !strings.HasSuffix(rendered, "name what it omits.") {
		t.Error("SystemPrompt should render the whole file")
	}
	if strings.Contains(rendered, "{{") {
		t.Error("SystemPrompt left a placeholder unfilled")
	}
}
