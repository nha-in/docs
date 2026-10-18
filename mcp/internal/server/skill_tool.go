package server

import (
	"context"
	"fmt"
	"os"
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
	Gateway string `json:"gateway,omitempty" jsonschema:"hiecm, uhi or nhcx: keeps the choice to that gateway's skills. Taken from the task when it names one"`
}

const skillToolDescription = "Load the ABDM integration skill for a task. Call it first for any request to build, integrate, test or debug an ABDM module, such as 'integrate M1' or 'run the M2 test cases', before search or get. " +
	"Pass the task in the person's words, or a skill name. It returns the skill's router: follow it, and load the section it names with this tool again, giving name and section. " +
	"It also gives the commands to install the plugin the skill ships in: ask the person once whether to install it, before the first step. " +
	"With no arguments it lists every skill."

// A skill loaded through this tool lives for one session. Installed as a
// plugin, it loads by itself in every later session, offline, and in clients
// that never call this tool. So every answer asks the person, once, to
// install the plugin for the skill's gateway, with the commands the setup
// prompts publish.

// marketplaceName is the name in .claude-plugin/marketplace.json, which
// `claude plugin install <plugin>@<marketplace>` has to name. A test reads the
// manifest, so a rename there fails here rather than publishing a command
// that points nowhere.
const marketplaceName = "abdm-portal"

// siteURL is where the setup prompts are published.
const siteURL = "https://docs.abdm.gov.in"

// marketplaceRepo is the repository the marketplace is added from: the same
// MARKETPLACE_REPO override the site build reads, then its default.
func marketplaceRepo() string {
	if repo := os.Getenv("MARKETPLACE_REPO"); repo != "" {
		return repo
	}
	return "nha-in/docs"
}

// gatewayPlugin is the plugin that carries a skill, by the skill's prefix,
// and the setup prompt for clients that install from neither marketplace.
var gatewayPlugin = map[string]struct{ plugin, setup string }{
	"abdm": {"abdm-integrators-assistant", "/agent-setup/prompt.md"},
	"uhi":  {"uhi-integrators-assistant", "/agent-setup/uhi.md"},
	"nhcx": {"nhcx", "/agent-setup/nhcx.md"},
}

// installBlock asks the person to install the plugin a skill ships in. It is
// empty for a skill whose prefix names no plugin.
func installBlock(name string) string {
	prefix, _, _ := strings.Cut(name, "-")
	gp, ok := gatewayPlugin[prefix]
	if !ok {
		return ""
	}
	repo := marketplaceRepo()
	return fmt.Sprintf("Install the plugin first. %s ships in the %s plugin. Unless it is already installed in this client, ask the person once, before the first step, whether to install it, and run the command they approve:\n"+
		"- Claude Code: `claude plugin marketplace add %s && claude plugin install %s@%s`\n"+
		"- Codex: `codex plugin marketplace add %s`, then install %s from the plugin directory\n"+
		"- Any other agent: follow %s%s\n"+
		"Installed, the skill loads by itself in every later session and works offline. Until then, keep loading it with this tool. If they decline, carry on with this tool and do not ask again this session.\n",
		name, gp.plugin, repo, gp.plugin, marketplaceName, repo, gp.plugin, siteURL, gp.setup)
}

// A task is on one gateway, and the skill tool keeps it there: it picks only
// among that gateway's skills, names only that gateway's other skills, and
// asks to install only that gateway's plugin. A UHI consultation never pulls
// in an HIE-CM module or the HIE-CM plugin unless the person names it.
var gatewayOfPrefix = map[string]string{"abdm": "hiecm", "uhi": "uhi", "nhcx": "nhcx"}

var gatewayLabel = map[string]string{"hiecm": "HIE-CM", "uhi": "UHI", "nhcx": "NHCX"}

// skillGateway is the gateway a skill belongs to, by its name's prefix.
func skillGateway(name string) string {
	prefix, _, _ := strings.Cut(name, "-")
	return gatewayOfPrefix[prefix]
}

// gatewayArg reads the gateway argument, accepting the ways people write it.
func gatewayArg(arg string) (string, bool) {
	switch strings.ToLower(strings.TrimSpace(arg)) {
	case "":
		return "", true
	case "hiecm", "hie-cm", "hie cm", "abdm":
		return "hiecm", true
	case "uhi":
		return "uhi", true
	case "nhcx":
		return "nhcx", true
	}
	return "", false
}

// taskGateway is the gateway a task names outright, or none.
func taskGateway(task string) string {
	t := words(task)
	switch {
	case strings.Contains(t, " uhi "):
		return "uhi"
	case strings.Contains(t, " nhcx "):
		return "nhcx"
	case strings.Contains(t, " hiecm ") || strings.Contains(t, " hie cm "):
		return "hiecm"
	}
	return ""
}

// onGateway keeps the skills of one gateway; an empty gateway keeps all.
func onGateway(routers []catalogue.Skill, gateway string) []catalogue.Skill {
	if gateway == "" {
		return routers
	}
	var out []catalogue.Skill
	for _, sk := range routers {
		if skillGateway(sk.Name) == gateway {
			out = append(out, sk)
		}
	}
	return out
}

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

// rankSkills orders the skills a task could mean. A skill the task names
// comes first, the longest name first so "scan and pay" beats a shorter word
// inside it. Then any skill whose description shares words with the task,
// most first. Each comes with why it ranked.
func rankSkills(task string, routers []catalogue.Skill) ([]string, []string) {
	t := words(task)
	type hit struct {
		name, why string
		named     int
		score     int
	}
	var hits []hit
	for _, sk := range routers {
		h := hit{name: sk.Name}
		for _, a := range aliases(sk.Name) {
			if strings.Contains(t, " "+a+" ") && len(a) > h.named {
				h.named, h.why = len(a), fmt.Sprintf("the task names %q", a)
			}
		}
		if h.named == 0 {
			desc := words(sk.Description)
			for _, w := range strings.Fields(t) {
				if len(w) >= 4 && !stop[w] && strings.Contains(desc, " "+w+" ") {
					h.score++
				}
			}
			h.why = fmt.Sprintf("its description shares %d word(s) with the task", h.score)
		}
		if h.named > 0 || h.score > 0 {
			hits = append(hits, h)
		}
	}
	sort.SliceStable(hits, func(i, j int) bool {
		if hits[i].named != hits[j].named {
			return hits[i].named > hits[j].named
		}
		return hits[i].score > hits[j].score
	})
	var names, whys []string
	for _, h := range hits {
		names, whys = append(names, h.name), append(whys, h.why)
	}
	return names, whys
}

// pickSkill chooses the skill a task is about, and the other skills the task
// names on the same gateway. A skill matched only by its description is never
// an "other": that would load guesses.
func pickSkill(task string, routers []catalogue.Skill) (string, string, []string) {
	names, whys := rankSkills(task, routers)
	if len(names) == 0 {
		return "", "", nil
	}
	var others []string
	for i, n := range names[1:] {
		if strings.HasPrefix(whys[i+1], "the task names") && skillGateway(n) == skillGateway(names[0]) {
			others = append(others, n)
		}
	}
	return names[0], whys[0], others
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
	b.WriteString("Skills on this server, by gateway. Load one with name, or describe the task:\n")
	for _, gw := range []string{"hiecm", "uhi", "nhcx"} {
		on := onGateway(routers, gw)
		if len(on) == 0 {
			continue
		}
		fmt.Fprintf(b, "\n%s, in the %s plugin:\n", gatewayLabel[gw], gatewayPlugin[pluginPrefix(gw)].plugin)
		for _, sk := range on {
			fmt.Fprintf(b, "- %s: %s\n", sk.Name, firstSentence(sk.Description))
		}
	}
	return b.String()
}

// pluginPrefix is the skill prefix a gateway's plugin uses.
func pluginPrefix(gateway string) string {
	for prefix, gw := range gatewayOfPrefix {
		if gw == gateway {
			return prefix
		}
	}
	return ""
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
	gateway, ok := gatewayArg(in.Gateway)
	if !ok {
		return toolText(fmt.Sprintf("Gateway %q is not one of hiecm, uhi or nhcx.", in.Gateway), true)
	}
	if gateway == "" {
		gateway = taskGateway(in.Task)
	}
	name, why, others := strings.TrimSpace(in.Name), "named in the call", []string(nil)
	if name != "" && gateway != "" && skillGateway(name) != gateway && hasRouter(routers, name) {
		return toolText(fmt.Sprintf("%s is a %s skill, and this task is on %s. Its skills:\n\n%s",
			name, gatewayLabel[skillGateway(name)], gatewayLabel[gateway], skillList(onGateway(routers, gateway))), true)
	}
	if name == "" {
		candidates := onGateway(routers, gateway)
		if strings.TrimSpace(in.Task) == "" {
			return toolText(skillList(candidates), false)
		}
		name, why, others = pickSkill(in.Task, candidates)
		if name == "" {
			return toolText("No skill matches that task.\n\n"+skillList(candidates), true)
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
	if gw := skillGateway(name); gw != "" {
		fmt.Fprintf(b, "Gateway: %s. Keep this task on it: load only %s-* skills and install only the %s plugin, unless the person names another gateway.\n",
			gatewayLabel[gw], pluginPrefix(gw), gatewayPlugin[pluginPrefix(gw)].plugin)
	}
	b.WriteString("\n")
	if install := installBlock(name); install != "" {
		b.WriteString(install + "\n")
	}
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
