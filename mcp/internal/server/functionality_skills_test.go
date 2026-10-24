package server

import (
	"context"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/catalogue"
)

var functionalitySkills = []catalogue.Skill{
	{Name: "abdm-m1", Section: "", Description: "Use when building M1.", Body: "# M1 router"},
	{Name: "abdm-m1", Section: "errors", Description: "Use when building M1.", Body: "# M1 errors"},
	{Name: "abdm-m1", Section: "functionalities/find-abha-mobile", Description: "Use when building M1.", Body: "# Find ABHA by mobile"},
	{Name: "abdm-m1", Section: "run", Description: "Use when building M1.", Body: "# M1 run"},
	{Name: "abdm-m2", Section: "", Description: "Use when building M2.", Body: "# M2 router"},
	{Name: "abdm-m2", Section: "scaffold", Description: "Use when building M2.", Body: "# M2 scaffold"},
}

// A functionality file is listed and fetched like any section: by the skill
// tool, as a skill:// resource, and as a prompt argument.
func TestFunctionalitySectionsAreListedAndFetched(t *testing.T) {
	sess := skillSession(t, functionalitySkills)

	text, isErr := callSkill(t, sess, map[string]any{"name": "abdm-m1"})
	if isErr || !strings.Contains(text, "functionalities/find-abha-mobile") || !strings.Contains(text, "one loop for the find-abha-mobile functionality") {
		t.Fatalf("router listing lacks the functionality:\n%s", text)
	}
	text, isErr = callSkill(t, sess, map[string]any{"name": "abdm-m1", "section": "functionalities/find-abha-mobile"})
	if isErr || !strings.Contains(text, "# Find ABHA by mobile") || !strings.Contains(text, "skill: abdm-m1, functionalities/find-abha-mobile") {
		t.Fatalf("functionality fetch returned %q", text)
	}

	ctx := context.Background()
	read, err := sess.ReadResource(ctx, &mcp.ReadResourceParams{URI: "skill://abdm-m1/functionalities/find-abha-mobile"})
	if err != nil || !strings.Contains(read.Contents[0].Text, "# Find ABHA by mobile") {
		t.Fatalf("resource read: %v %+v", err, read)
	}
	got, err := sess.GetPrompt(ctx, &mcp.GetPromptParams{Name: "abdm-m1", Arguments: map[string]string{"section": "functionalities/find-abha-mobile"}})
	if err != nil || !strings.Contains(got.Messages[0].Content.(*mcp.TextContent).Text, "# Find ABHA by mobile") {
		t.Fatalf("prompt: %v", err)
	}

	// A job file module is unchanged.
	text, isErr = callSkill(t, sess, map[string]any{"name": "abdm-m2", "section": "scaffold"})
	if isErr || !strings.Contains(text, "# M2 scaffold") {
		t.Fatalf("abdm-m2 scaffold returned %q", text)
	}
}
