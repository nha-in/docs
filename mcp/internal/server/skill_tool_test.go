package server

import (
	"context"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/catalogue"
)

var toolSkills = []catalogue.Skill{
	{Name: "abdm-fhir", Section: "", Description: "Use when generating or auditing NRCES FHIR bundles.", Body: "# FHIR router"},
	{Name: "abdm-m1", Section: "", Description: "Use when building ABHA creation and verification.", Body: "# M1 router"},
	{Name: "abdm-m1", Section: "scaffold", Description: "Use when building M1.", Body: "# M1 scaffold loop"},
	{Name: "abdm-m1", Section: "test", Description: "Use when building M1.", Body: "# M1 test cases"},
	{Name: "abdm-m2", Section: "", Description: "Use when linking care contexts as an HIP.", Body: "# M2 router"},
	{Name: "abdm-scan-and-pay", Section: "", Description: "Use when taking a payment by QR.", Body: "# Scan and Pay router"},
}

func callSkill(t *testing.T, sess *mcp.ClientSession, args map[string]any) (string, bool) {
	t.Helper()
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{Name: "skill", Arguments: args})
	if err != nil {
		t.Fatal(err)
	}
	return res.Content[0].(*mcp.TextContent).Text, res.IsError
}

// "integrate M1" in a client that uses tools alone reaches the M1 router,
// with the sections it can load next and the catalogue version.
func TestSkillToolPicksTheSkillATaskNames(t *testing.T) {
	sess := skillSession(t, toolSkills)
	for task, want := range map[string]string{
		"integrate M1":                       "# M1 router",
		"Build milestone 2 into our HMIS":    "# M2 router",
		"set up scan and pay at the counter": "# Scan and Pay router",
		"check the NRCES bundles we emit":    "# FHIR router",
	} {
		text, isErr := callSkill(t, sess, map[string]any{"task": task})
		if isErr || !strings.Contains(text, want) {
			t.Errorf("task %q returned %q, want %q", task, text, want)
		}
	}
	text, _ := callSkill(t, sess, map[string]any{"task": "integrate M1"})
	for _, want := range []string{"skill: abdm-m1, router", "scaffold", "test", "catalogue_version: 2026.09.16"} {
		if !strings.Contains(text, want) {
			t.Errorf("M1 router lacks %q:\n%s", want, text)
		}
	}
}

func TestSkillToolLoadsASectionByName(t *testing.T) {
	sess := skillSession(t, toolSkills)
	text, isErr := callSkill(t, sess, map[string]any{"name": "abdm-m1", "section": "test"})
	if isErr || !strings.Contains(text, "# M1 test cases") {
		t.Errorf("abdm-m1 test returned %q", text)
	}
	text, isErr = callSkill(t, sess, map[string]any{"name": "abdm-m1", "section": "audit"})
	if !isErr || !strings.Contains(text, "scaffold, test") {
		t.Errorf("a missing section should be an error naming the sections, got %q", text)
	}
	text, isErr = callSkill(t, sess, map[string]any{"name": "abdm-m9"})
	if !isErr || !strings.Contains(text, "abdm-m2") {
		t.Errorf("an unknown skill should be an error listing the skills, got %q", text)
	}
}

func TestSkillToolListsSkillsWithNoArguments(t *testing.T) {
	sess := skillSession(t, toolSkills)
	text, isErr := callSkill(t, sess, map[string]any{})
	if isErr || !strings.Contains(text, "- abdm-scan-and-pay: Use when taking a payment by QR.") {
		t.Errorf("no arguments returned %q", text)
	}
	text, isErr = callSkill(t, sess, map[string]any{"task": "zzz qqq"})
	if !isErr || !strings.Contains(text, "No skill matches") {
		t.Errorf("an unmatched task returned %q", text)
	}
}

// A server with no skills offers no skill tool, and its instructions do not
// tell a client to call one.
func TestSkillToolOnlyWithSkills(t *testing.T) {
	for _, tc := range []struct {
		skills []catalogue.Skill
		want   bool
	}{{toolSkills, true}, {nil, false}} {
		sess := skillSession(t, tc.skills)
		res, err := sess.ListTools(context.Background(), nil)
		if err != nil {
			t.Fatal(err)
		}
		found := false
		for _, tool := range res.Tools {
			found = found || tool.Name == "skill"
		}
		if found != tc.want {
			t.Errorf("skills %d: skill tool listed %v, want %v", len(tc.skills), found, tc.want)
		}
		if got := strings.Contains(sess.InitializeResult().Instructions, "call skill with the task first"); got != tc.want {
			t.Errorf("skills %d: instructions name the skill tool %v, want %v", len(tc.skills), got, tc.want)
		}
	}
}
