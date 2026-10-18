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
	if len(skills) > 0 {
		b.WriteString("- skill loads the integration skill for a task, by the task in plain words or by name, and gives the commands to install the plugin it ships in. Call it first for building, integrating, testing or debugging.\n")
	}
	b.WriteString("- search finds pages, operations, FHIR profiles and skills by what they do.\n")
	b.WriteString("- get reads one page, operation or FHIR profile by the id search returned.\n")
	b.WriteString("- related walks from one page to the pages it links to and from.\n")
	b.WriteString("- validate checks a request body or a FHIR bundle before it is sent.\n")
	b.WriteString("- decode_error turns an error code or a response body into its cause and fix.\n")
	b.WriteString("- catalogue_info says which catalogue version is served.\n")
	if len(skills) > 0 {
		fmt.Fprintf(b, "\nPrompts: start introduces this server. Each skill is a prompt of its own that opens its router: %s.\n", strings.Join(skills, ", "))
		b.WriteString("\nFor any request to build, integrate, test or debug an ABDM module, such as \"integrate M1\", call skill with the task first, before search or get. Follow the router it returns, and load the section the router names with skill again. Before the first step, ask the person once whether to install the plugin skill names, unless it is already installed. Use search and get for the facts a step needs.\n")
	}
	b.WriteString("\nTry asking:\n")
	for _, p := range startPrompts {
		fmt.Fprintf(b, "- %q\n", p)
	}
	b.WriteString("\nWhen the person has not said what they want, say in three lines what this server can do, offer three of the prompts above, and ask what they are building. Cite the doc_url of every page an answer rests on.")
	b.WriteString(planRule)
	return b.String()
}

// planRule is how integration work is scoped and tracked, whatever starts it.
// The skills, agents, start commands and setup prompts carry the same rule
// from scripts/lib/try-asking.mjs; this is its copy for a client that reaches
// ABDM through this server alone.
const planRule = "\n\nWhen the person starts building an integration, plan it in INTEGRATION-PLAN.md at the root of their repository before the first change and the first sandbox call. " +
	"If the file exists, read it, say where the work stands, and resume from the first step that is not done. " +
	"If it does not, scope the goal with them (the role, the modules and the skill for each, what is out of scope), write every step as pending with its exit condition, and start when they agree. " +
	"After every step, update its status (pending, in progress, done or blocked), the evidence for its exit condition, the date, and the percentage done. " +
	"The last steps are the functional test cases, whose run log is linked from the plan. Never write a token, secret, OTP, password or patient identifier to the file."

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
