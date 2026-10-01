package server

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/index"
)

// A person who has just connected this server has no way to know what it is
// for or what to ask it. The instructions tell the client at initialize, and
// the start prompt tells the person, from the same text, so both say the same
// thing. The skills named are the ones in the snapshot, so a server never
// offers a skill it cannot serve.

// startPrompts are questions any snapshot can answer: none names an error
// code or a path, which a new specification can drop.
var startPrompts = []string{
	"Which module covers linking a care context, and which calls does it make, in order?",
	"Why did my call fail? Here is the response body.",
	"Check this request body against its operation before I send it.",
	"Check this FHIR bundle against the NRCES profiles.",
	"What has to be in place before my first M1 call?",
}

// onboarding is what this server can do, the prompts to start from, and what
// to do when nobody has said what they want.
func onboarding(skills []string) string {
	b := &strings.Builder{}
	b.WriteString("abdm-docs serves the ABDM Developer Portal: the documentation for HIE-CM, UHI and NHCX, every API operation in their specifications, the NRCES FHIR profiles, and the compiled integration skills.\n\n")
	b.WriteString("Tools:\n")
	b.WriteString("- search finds pages and operations by what they do.\n")
	b.WriteString("- get reads one page, operation or FHIR profile by the id search returned.\n")
	b.WriteString("- related walks from one page to the pages it links to and from.\n")
	b.WriteString("- validate checks a request body or a FHIR bundle before it is sent.\n")
	b.WriteString("- decode_error turns an error code or a response body into its cause and fix.\n")
	b.WriteString("- catalogue_info says which catalogue version is served.\n")
	if len(skills) > 0 {
		fmt.Fprintf(b, "\nPrompts: start introduces this server. Each skill is a prompt of its own that opens its router: %s.\n", strings.Join(skills, ", "))
	}
	b.WriteString("\nTry asking:\n")
	for _, p := range startPrompts {
		fmt.Fprintf(b, "- %q\n", p)
	}
	b.WriteString("\nWhen the person has not said what they want, say in three lines what this server can do, offer three of the prompts above, and ask what they are building. Cite the doc_url of every page an answer rests on.")
	return b.String()
}

// skillNames lists each skill in the snapshot once, sorted. A snapshot built
// before skills were indexed lists none.
func skillNames(r *index.Reader) []string {
	all, err := r.ListSkills()
	if err != nil {
		return nil
	}
	seen := map[string]bool{}
	var out []string
	for _, sk := range all {
		if !seen[sk.Name] {
			seen[sk.Name] = true
			out = append(out, sk.Name)
		}
	}
	sort.Strings(out)
	return out
}

// addStartPrompt registers the start prompt. It carries the same text as the
// instructions, so a person who picks it from a menu sees what the client was
// told.
func addStartPrompt(s *mcp.Server, skills []string) {
	s.AddPrompt(&mcp.Prompt{
		Name:        "start",
		Description: "What this server can do, with prompts to start from.",
		Arguments: []*mcp.PromptArgument{{
			Name:        "building",
			Description: "What you are building, if you know. The answer is tailored to it.",
		}},
	}, func(ctx context.Context, req *mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
		text := onboarding(skills)
		if req.Params != nil && req.Params.Arguments["building"] != "" {
			text += fmt.Sprintf("\n\nThe person is building: %s. Pick the prompts and the skill that fit it.", req.Params.Arguments["building"])
		} else {
			text += "\n\nThe person has not said what they want yet."
		}
		return &mcp.GetPromptResult{
			Description: "What this server can do",
			Messages:    []*mcp.PromptMessage{{Role: "user", Content: &mcp.TextContent{Text: text}}},
		}, nil
	})
}
