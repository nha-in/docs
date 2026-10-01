package server

import (
	"context"
	"strings"
	"testing"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// A client that has just connected is told what the server does and what to
// ask, and the start prompt says the same, naming the skills it can serve.
func TestOnboardingReachesClientAndStartPrompt(t *testing.T) {
	sess := skillSession(t, testSkills)
	init := sess.InitializeResult()
	if init == nil || !strings.Contains(init.Instructions, "Try asking") || !strings.Contains(init.Instructions, "abdm-m1") {
		t.Fatalf("instructions = %+v", init)
	}
	got, err := sess.GetPrompt(context.Background(), &mcp.GetPromptParams{
		Name: "start", Arguments: map[string]string{"building": "an HIU"},
	})
	if err != nil {
		t.Fatal(err)
	}
	text := got.Messages[0].Content.(*mcp.TextContent).Text
	for _, want := range []string{"decode_error", "abdm-m1", "an HIU"} {
		if !strings.Contains(text, want) {
			t.Errorf("start prompt lacks %q", want)
		}
	}
}

// A snapshot with no skills offers no start prompt, and its instructions name
// no skill it cannot serve.
func TestOnboardingWithoutSkills(t *testing.T) {
	sess := skillSession(t, nil)
	if strings.Contains(sess.InitializeResult().Instructions, "Prompts:") {
		t.Error("instructions offer prompts on a skill-less snapshot")
	}
}
