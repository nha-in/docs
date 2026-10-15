package server

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
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

// Every answer asks the person to install the plugin for the skill's
// gateway, with commands that name a plugin and marketplace that exist.
func TestSkillToolAsksToInstallTheGatewaysPlugin(t *testing.T) {
	skills := append([]catalogue.Skill{
		{Name: "uhi-consultation", Section: "", Description: "Use when building a UHI physical consultation.", Body: "# UHI router"},
		{Name: "nhcx-claim", Section: "", Description: "Use when submitting an NHCX claim.", Body: "# NHCX router"},
	}, toolSkills...)
	sess := skillSession(t, skills)
	for name, want := range map[string]string{
		"abdm-m1":          "claude plugin install abdm-integrators-assistant@abdm-portal",
		"uhi-consultation": "claude plugin install uhi-integrators-assistant@abdm-portal",
		"nhcx-claim":       "claude plugin install nhcx@abdm-portal",
	} {
		text, isErr := callSkill(t, sess, map[string]any{"name": name})
		if isErr || !strings.Contains(text, want) || !strings.Contains(text, "ask the person once") {
			t.Errorf("%s lacks the install request %q:\n%s", name, want, text)
		}
		if strings.Index(text, "Install the plugin first") > strings.Index(text, "# ") {
			t.Errorf("%s: the install request should come before the skill text", name)
		}
	}
}

// The marketplace name and every plugin the install request names are the
// ones .claude-plugin/marketplace.json publishes.
func TestInstallCommandsMatchTheMarketplace(t *testing.T) {
	raw, err := os.ReadFile(filepath.Join("..", "..", "..", ".claude-plugin", "marketplace.json"))
	if err != nil {
		t.Fatal(err)
	}
	var m struct {
		Name    string `json:"name"`
		Plugins []struct {
			Name string `json:"name"`
		} `json:"plugins"`
	}
	if err := json.Unmarshal(raw, &m); err != nil {
		t.Fatal(err)
	}
	if m.Name != marketplaceName {
		t.Errorf("marketplace is %q, the install command names %q", m.Name, marketplaceName)
	}
	published := map[string]bool{}
	for _, p := range m.Plugins {
		published[p.Name] = true
	}
	for prefix, gp := range gatewayPlugin {
		if !published[gp.plugin] {
			t.Errorf("%s skills point at plugin %q, which the marketplace does not publish", prefix, gp.plugin)
		}
	}
}

var gatewaySkills = append([]catalogue.Skill{
	{Name: "uhi-consultation", Section: "", Description: "Use when building a UHI physical consultation booking.", Body: "# UHI consultation router"},
	{Name: "uhi-ambulance", Section: "", Description: "Use when booking an ambulance on UHI.", Body: "# UHI ambulance router"},
	{Name: "nhcx-claim", Section: "", Description: "Use when submitting an NHCX claim with a consultation bill.", Body: "# NHCX claim router"},
}, toolSkills...)

// A task stays on its gateway: it picks, names and installs only from that
// gateway, and a skill from another gateway is refused rather than loaded.
func TestSkillToolKeepsATaskOnItsGateway(t *testing.T) {
	sess := skillSession(t, gatewaySkills)

	// "consultation" appears in a UHI skill name and an NHCX description;
	// naming NHCX keeps the choice on NHCX.
	text, isErr := callSkill(t, sess, map[string]any{"task": "NHCX: send the consultation claim"})
	if isErr || !strings.Contains(text, "# NHCX claim router") || !strings.Contains(text, "install only the nhcx plugin") {
		t.Errorf("an NHCX task left NHCX:\n%s", text)
	}
	if strings.Contains(text, "abdm-integrators-assistant") || strings.Contains(text, "uhi-integrators-assistant") {
		t.Errorf("an NHCX task offered another gateway's plugin:\n%s", text)
	}

	// The gateway argument does the same, and other skills the task names
	// come only from that gateway.
	text, _ = callSkill(t, sess, map[string]any{"task": "consultation and ambulance and M1", "gateway": "uhi"})
	if !strings.Contains(text, "skill: uhi-") || !strings.Contains(text, "uhi-ambulance") || strings.Contains(text, "abdm-m1") {
		t.Errorf("a UHI task named another gateway's skill:\n%s", text)
	}

	// A named skill from another gateway is refused, with that gateway's list.
	text, isErr = callSkill(t, sess, map[string]any{"name": "abdm-m1", "gateway": "uhi"})
	if !isErr || !strings.Contains(text, "uhi-consultation") || strings.Contains(text, "abdm-m2") {
		t.Errorf("a cross-gateway load was not refused cleanly:\n%s", text)
	}

	text, isErr = callSkill(t, sess, map[string]any{"task": "integrate M1", "gateway": "pmjay"})
	if !isErr || !strings.Contains(text, "not one of hiecm, uhi or nhcx") {
		t.Errorf("an unknown gateway returned %q", text)
	}
}

// search finds skills too: kind skill ranks them for a task, and a plain
// search whose query names a skill says which one carries the steps.
func TestSearchFindsSkills(t *testing.T) {
	sess := skillSession(t, gatewaySkills)
	res, err := sess.CallTool(context.Background(), &mcp.CallToolParams{Name: "search", Arguments: map[string]any{"query": "UHI book an ambulance", "kind": "skill"}})
	if err != nil {
		t.Fatal(err)
	}
	text := res.Content[0].(*mcp.TextContent).Text
	if res.IsError || !strings.Contains(text, `"name": "uhi-ambulance"`) || strings.Contains(text, "abdm-") {
		t.Errorf("kind skill for a UHI task returned:\n%s", text)
	}
	res, err = sess.CallTool(context.Background(), &mcp.CallToolParams{Name: "search", Arguments: map[string]any{"query": "integrate M1"}})
	if err != nil {
		t.Fatal(err)
	}
	if text := res.Content[0].(*mcp.TextContent).Text; !strings.Contains(text, `"name": "abdm-m1"`) {
		t.Errorf("a search naming M1 carried no skill hint:\n%s", text)
	}
}
