package server

import (
	"context"
	"path/filepath"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/index"
)

var testSkills = []catalogue.Skill{
	{Name: "abdm-m1", Section: "", Description: "Use when building M1.", Body: "# M1 router"},
	{Name: "abdm-m1", Section: "scaffold", Description: "Use when building M1.", Body: "# M1 scaffold loop"},
}

// skillSession builds a snapshot carrying skills, serves it, and connects a
// real client over an in-memory transport, the same way the tool tests do.
func skillSession(t *testing.T, skills []catalogue.Skill) *mcp.ClientSession {
	t.Helper()
	dbPath := filepath.Join(t.TempDir(), "catalogue.db")
	meta := index.Meta{
		CatalogueVersion: "2026.09.16",
		BuiltAt:          "2026-09-16T00:00:00Z",
		Skills:           skills,
	}
	if err := index.Build(dbPath, nil, nil, nil, nil, nil, nil, nil, meta); err != nil {
		t.Fatal(err)
	}
	r, err := index.Open(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { r.Close() })

	srv := NewMCPServer(r, nil)
	ct, st := mcp.NewInMemoryTransports()
	ctx := context.Background()
	if _, err := srv.Connect(ctx, st, nil); err != nil {
		t.Fatal(err)
	}
	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "0"}, nil)
	sess, err := client.Connect(ctx, ct, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { sess.Close() })
	return sess
}

func TestSkillPromptServesRouterAndSection(t *testing.T) {
	sess := skillSession(t, testSkills)
	ctx := context.Background()

	got, err := sess.GetPrompt(ctx, &mcp.GetPromptParams{Name: "abdm-m1"})
	if err != nil {
		t.Fatal(err)
	}
	text := promptText(t, got)
	if !strings.Contains(text, "# M1 router") {
		t.Errorf("prompt without a section returned %q, want the router", text)
	}
	// A skill is a snapshot of a moving catalogue, so a reader has to be
	// able to tell which version it is holding.
	if !strings.Contains(text, "catalogue_version: 2026.09.16") {
		t.Errorf("prompt text carries no catalogue version: %q", text)
	}

	got, err = sess.GetPrompt(ctx, &mcp.GetPromptParams{
		Name: "abdm-m1", Arguments: map[string]string{"section": "scaffold"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if text := promptText(t, got); !strings.Contains(text, "# M1 scaffold loop") {
		t.Errorf("section prompt returned %q", text)
	}
}

func TestSkillPromptListedWithItsDescription(t *testing.T) {
	sess := skillSession(t, testSkills)
	res, err := sess.ListPrompts(context.Background(), nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(res.Prompts) != 1 {
		t.Fatalf("listed %d prompts, want 1", len(res.Prompts))
	}
	p := res.Prompts[0]
	if p.Name != "abdm-m1" || p.Description != "Use when building M1." {
		t.Errorf("prompt = %+v", p)
	}
	// The section argument has to name the sections that exist, or a
	// caller has nothing to go on but a guess.
	if len(p.Arguments) != 1 || !strings.Contains(p.Arguments[0].Description, "scaffold") {
		t.Errorf("arguments = %+v", p.Arguments)
	}
}

func TestSkillResourcesServeEachSection(t *testing.T) {
	sess := skillSession(t, testSkills)
	ctx := context.Background()
	res, err := sess.ListResources(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(res.Resources) != 2 {
		t.Fatalf("listed %d resources, want 2: %+v", len(res.Resources), res.Resources)
	}
	read, err := sess.ReadResource(ctx, &mcp.ReadResourceParams{URI: "skill://abdm-m1/scaffold"})
	if err != nil {
		t.Fatal(err)
	}
	if len(read.Contents) != 1 || !strings.Contains(read.Contents[0].Text, "# M1 scaffold loop") {
		t.Errorf("resource contents = %+v", read.Contents)
	}
	if read.Contents[0].MIMEType != "text/markdown" {
		t.Errorf("mime = %q", read.Contents[0].MIMEType)
	}
}

// An unknown section must name the sections that exist, because the caller
// guessing again is the only other way forward.
func TestSkillPromptUnknownSectionListsSections(t *testing.T) {
	sess := skillSession(t, testSkills)
	_, err := sess.GetPrompt(context.Background(), &mcp.GetPromptParams{
		Name: "abdm-m1", Arguments: map[string]string{"section": "nope"},
	})
	if err == nil {
		t.Fatal("want an error for an unknown section")
	}
	if !strings.Contains(err.Error(), "scaffold") {
		t.Errorf("error %q does not name the sections that exist", err)
	}
}

// A snapshot built before skills were indexed still has to serve its tools.
func TestSnapshotWithoutSkillsStillServes(t *testing.T) {
	sess := skillSession(t, nil)
	ctx := context.Background()
	res, err := sess.ListPrompts(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(res.Prompts) != 0 {
		t.Errorf("listed %d prompts on a skill-less snapshot", len(res.Prompts))
	}
	tools, err := sess.ListTools(ctx, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(tools.Tools) == 0 {
		t.Error("no tools on a skill-less snapshot")
	}
}

func TestSkillResourceURIs(t *testing.T) {
	if got := skillURI("abdm-m1", ""); got != "skill://abdm-m1" {
		t.Errorf("router URI = %q", got)
	}
	if got := skillURI("abdm-m1", "debug"); got != "skill://abdm-m1/debug" {
		t.Errorf("section URI = %q", got)
	}
}

func promptText(t *testing.T, res *mcp.GetPromptResult) string {
	t.Helper()
	if len(res.Messages) != 1 {
		t.Fatalf("got %d messages, want 1", len(res.Messages))
	}
	tc, ok := res.Messages[0].Content.(*mcp.TextContent)
	if !ok {
		t.Fatalf("content is %T, want text", res.Messages[0].Content)
	}
	return tc.Text
}
