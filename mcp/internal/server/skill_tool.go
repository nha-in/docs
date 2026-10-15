package server

import (
	"context"
	"fmt"
	"regexp"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/index"
)

// The skills are served as resources and prompts, but a client reaches for
// neither on its own: a prompt is picked by a person from a menu, and a
// resource is read only when the client offers a way to and the model thinks
// to. Many clients use tools alone. So "integrate M1" typed into such a
// client never loaded the M1 skill, and the model worked from search hits
// instead of the skill's interview, loops and exit conditions. The skill tool
// closes that gap: one call, from a task in plain words or a skill name, to
// the skill's text, read from the same rows the resources serve.

type skillIn struct {
	Task    string `json:"task,omitempty" jsonschema:"what the person wants, in their words, such as 'integrate M1' or 'run the M2 test cases'. Picks the skill when name is not given"`
	Name    string `json:"name,omitempty" jsonschema:"a skill name, such as abdm-m1. Omit to pick by task"`
	Section string `json:"section,omitempty" jsonschema:"one section of the skill, such as scaffold, integrate, debug or test. Omit for the router, which says which section to read"`
}

const skillToolDescription = "Load the ABDM integration skill for a task. Call it first for any request to build, integrate, test or debug an ABDM module, such as 'integrate M1' or 'run the M2 test cases', before search or get. " +
	"Pass the task in the person's words, or a skill name. It returns the skill's router: follow it, and load the section it names with this tool again, giving name and section. " +
	"With no arguments it lists every skill."

// skillPrefix is what a skill name carries before the part a person says.
var skillPrefix = regexp.MustCompile(`^(abdm|uhi|nhcx|hiecm)-`)

// aliases are the ways a person names one skill in a sentence: abdm-m1 is
// "abdm m1", "m1" or "milestone 1", and abdm-scan-and-pay is "scan and pay".
func aliases(name string) []string {
	base := skillPrefix.ReplaceAllString(name, "")
	out := []string{strings.ReplaceAll(name, "-", " "), strings.ReplaceAll(base, "-", " ")}
	if m := regexp.MustCompile(`^m([1-4])$`).FindStringSubmatch(base); m != nil {
		out = append(out, "milestone "+m[1])
	}
	return out
}

// words lowercases text and keeps letters and digits, so "M1," and "m1"
// match, and pads it so a match is always a whole word.
func words(text string) string {
	clean := regexp.MustCompile(`[^a-z0-9]+`).ReplaceAllString(strings.ToLower(text), " ")
	return " " + strings.TrimSpace(clean) + " "
}

var stop = map[string]bool{"with": true, "from": true, "that": true, "this": true, "when": true, "into": true, "your": true, "have": true, "what": true, "abdm": true, "integrate": true, "build": true, "using": true, "make": true}

// pickSkill chooses the skill a task is about. A skill the task names wins,
// the longest name first so "scan and pay" beats a shorter word inside it.
// Failing that, the description sharing the most words with the task wins.
// It returns the name, why it was chosen, and any other skill the task names.
func pickSkill(task string, routers []catalogue.Skill) (string, string, []string) {
	t := words(task)
	type hit struct {
		name, alias string
	}
	var hits []hit
	for _, sk := range routers {
		for _, a := range aliases(sk.Name) {
			if strings.Contains(t, " "+a+" ") {
				hits = append(hits, hit{sk.Name, a})
				break
			}
		}
	}
	if len(hits) > 0 {
		sort.SliceStable(hits, func(i, j int) bool { return len(hits[i].alias) > len(hits[j].alias) })
		var others []string
		for _, h := range hits[1:] {
			others = append(others, h.name)
		}
		return hits[0].name, fmt.Sprintf("the task names %q", hits[0].alias), others
	}
	best, score := "", 0
	for _, sk := range routers {
		n := 0
		for _, w := range strings.Fields(t) {
			if len(w) >= 4 && !stop[w] && strings.Contains(words(sk.Description), " "+w+" ") {
				n++
			}
		}
		if n > score {
			best, score = sk.Name, n
		}
	}
	if best == "" {
		return "", "", nil
	}
	return best, fmt.Sprintf("its description shares %d word(s) with the task", score), nil
}

// skillCatalogue is every skill's router and its sections, in name order.
func skillCatalogue(r *index.Reader) ([]catalogue.Skill, map[string][]string, error) {
	all, err := r.ListSkills()
	if err != nil {
		return nil, nil, err
	}
	var routers []catalogue.Skill
	sections := map[string][]string{}
	for _, sk := range all {
		if sk.Section == "" {
			routers = append(routers, sk)
		} else {
			sections[sk.Name] = append(sections[sk.Name], sk.Section)
		}
	}
	return routers, sections, nil
}

func skillList(routers []catalogue.Skill) string {
	b := &strings.Builder{}
	b.WriteString("Skills on this server. Load one with name, or describe the task:\n")
	for _, sk := range routers {
		fmt.Fprintf(b, "- %s: %s\n", sk.Name, firstSentence(sk.Description))
	}
	return b.String()
}

func firstSentence(text string) string {
	text = strings.TrimSpace(text)
	if i := strings.Index(text, ". "); i > 0 && i < 200 {
		return text[:i+1]
	}
	if len(text) > 200 {
		return text[:200] + "..."
	}
	return text
}

func toolText(text string, isError bool) (*mcp.CallToolResult, any, error) {
	return &mcp.CallToolResult{IsError: isError, Content: []mcp.Content{&mcp.TextContent{Text: text}}}, nil, nil
}

// loadSkill answers one call of the skill tool.
func loadSkill(r *index.Reader, in skillIn) (*mcp.CallToolResult, any, error) {
	routers, sections, err := skillCatalogue(r)
	if err != nil {
		return nil, nil, err
	}
	if len(routers) == 0 {
		return toolText("This server holds no skills. Use search and get.", true)
	}
	name, why, others := strings.TrimSpace(in.Name), "named in the call", []string(nil)
	if name == "" {
		if strings.TrimSpace(in.Task) == "" {
			return toolText(skillList(routers), false)
		}
		name, why, others = pickSkill(in.Task, routers)
		if name == "" {
			return toolText("No skill matches that task.\n\n"+skillList(routers), true)
		}
	}
	got, err := r.GetSkill(name, strings.TrimSpace(in.Section))
	if err != nil {
		if _, ok := sections[name]; !ok && !hasRouter(routers, name) {
			return toolText(fmt.Sprintf("No skill %q.\n\n%s", name, skillList(routers)), true)
		}
		return toolText(fmt.Sprintf("Skill %s has no section %q. Its sections: %s.", name, in.Section, strings.Join(sections[name], ", ")), true)
	}

	b := &strings.Builder{}
	section := "router"
	if got.Section != "" {
		section = got.Section
	}
	fmt.Fprintf(b, "skill: %s, %s. Chosen because %s.\n", name, section, why)
	if len(others) > 0 {
		fmt.Fprintf(b, "The task also names: %s. Load each when the work reaches it.\n", strings.Join(others, ", "))
	}
	if secs := sections[name]; len(secs) > 0 {
		b.WriteString("Sections, each loaded with this tool, giving name and section:\n")
		for _, s := range secs {
			fmt.Fprintf(b, "- %s\n", describeSection(s, s))
		}
	}
	b.WriteString("\n")
	b.WriteString(withVersion(got.Body, r))
	return toolText(b.String(), false)
}

func hasRouter(routers []catalogue.Skill, name string) bool {
	for _, sk := range routers {
		if sk.Name == name {
			return true
		}
	}
	return false
}

// addSkillTool registers the skill tool. A snapshot with no skills gets no
// tool, so a server never offers what it cannot serve.
func addSkillTool(s *mcp.Server, r *index.Reader) {
	mcp.AddTool(s, &mcp.Tool{
		Name:        "skill",
		Annotations: &mcp.ToolAnnotations{ReadOnlyHint: true},
		Description: skillToolDescription,
		InputSchema: mustSchemaFor[skillIn](),
	}, func(ctx context.Context, req *mcp.CallToolRequest, in skillIn) (*mcp.CallToolResult, any, error) {
		return loadSkill(r, in)
	})
}
