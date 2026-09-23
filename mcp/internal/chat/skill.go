package chat

import (
	"fmt"
	"regexp"
	"slices"
	"sort"
	"strings"
	"unicode/utf8"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
)

// Commands are the sections of a module's agent skill a reader can point a
// question at, from the pills under the Ask AI composer. Each names a file
// under the compiled skill's references/ folder.
var Commands = []string{"scaffold", "design", "integrate", "debug"}

// Command is what the reader picked for this question. The zero value is no
// command, which is every request an older client sends and every request
// that leaves the pills alone.
//
// Only the name travels, and optionally the module the reader chose when the
// server asked. The skill's text never comes from the client: the server has
// it, and text a client could put in front of the model as if it were a skill
// would be a way to tell the model anything.
type Command struct {
	Name   string
	Module string
}

var moduleNameRe = regexp.MustCompile(`^abdm-[a-z0-9]+(?:-[a-z0-9]+)*$`)

// ValidateCommand checks the command fields the HTTP layer decoded. A module
// without a command is refused, because it could only be a client bug.
func ValidateCommand(c Command) error {
	if c.Name == "" {
		if c.Module != "" {
			return fmt.Errorf("chat: module %q given without a command", c.Module)
		}
		return nil
	}
	if !slices.Contains(Commands, c.Name) {
		return fmt.Errorf("chat: unknown command %q", c.Name)
	}
	if c.Module != "" && !moduleNameRe.MatchString(c.Module) {
		return fmt.Errorf("chat: module %q is not a skill name", c.Module)
	}
	return nil
}

// SkillUse is the skill event: which section a command used, sent once and
// before any text so the panel can say what the answer draws on.
//
// Status is "used" when the section went in front of the model, "missing"
// when the module has no such section and the answer comes from the docs
// alone, and "unresolved" when the module could not be worked out, in which
// case the model is not called and Candidates are the modules to ask about.
type SkillUse struct {
	Module     string   `json:"module,omitempty"`
	Section    string   `json:"section"`
	Status     string   `json:"status"`
	ResolvedBy string   `json:"resolved_by,omitempty"`
	Truncated  bool     `json:"truncated,omitempty"`
	URI        string   `json:"uri,omitempty"`
	Href       string   `json:"href,omitempty"`
	Candidates []string `json:"candidates,omitempty"`
}

var (
	// A page under a module's own part of the site: its milestone page, or
	// its API reference. The attached page's URL may be absolute and may end
	// in /index.md or .md; only the path segment after the section matters.
	pageModuleRe = regexp.MustCompile(`/docs/[a-z]+/v[0-9.]+/(?:milestones|api)/([a-z0-9-]+)`)
	// "M2", "p1", "milestone 3". Word bounded, so "m2m" or "hmp1" do not count.
	questionModuleRe = regexp.MustCompile(`(?i)\b(?:milestone\s*([1-4])|([mp][1-4]))\b`)
	// The named modules, in the words a reader uses for them.
	namedModules = []struct {
		re     *regexp.Regexp
		module string
	}{
		{regexp.MustCompile(`(?i)\bscan[\s-]*(?:and|&|n)[\s-]*pay\b`), "abdm-scan-and-pay"},
		{regexp.MustCompile(`(?i)\bscan[\s-]*(?:and|&|n)[\s-]*register\b`), "abdm-scan-and-register"},
		{regexp.MustCompile(`(?i)\brecord[\s-]*shar(?:e|ing)\b`), "abdm-record-share"},
		{regexp.MustCompile(`(?i)\bsubscriptions?\b`), "abdm-subscription"},
		{regexp.MustCompile(`(?i)\bgateway\b`), "abdm-gateway"},
	}
)

// ResolveModule works out which module's skill a command should use. The
// first rule that finds a module this deployment has wins: the reader's own
// pick, then the page they attached, then a module named in the question. An
// empty module means none of them said, and the reader is asked.
//
// known is the list of module skills this deployment carries. A rule that
// names a module not in it does not count: a question about "M5" is asked
// about rather than answered from a skill that does not exist.
func ResolveModule(cmd Command, page *Page, question string, known []string) (module, by string) {
	has := func(m string) bool { return slices.Contains(known, m) }
	if cmd.Module != "" && has(cmd.Module) {
		return cmd.Module, "pick"
	}
	if page != nil {
		if m := pageModuleRe.FindStringSubmatch(page.URL); m != nil && has("abdm-"+m[1]) {
			return "abdm-" + m[1], "page"
		}
	}
	if m := questionModuleRe.FindStringSubmatch(question); m != nil {
		id := strings.ToLower(m[2])
		if m[1] != "" {
			id = "m" + m[1]
		}
		if has("abdm-" + id) {
			return "abdm-" + id, "question"
		}
	}
	for _, n := range namedModules {
		if n.re.MatchString(question) && has(n.module) {
			return n.module, "question"
		}
	}
	return "", ""
}

// skillCutNote closes a section that was cut to fit, so the model knows its
// copy stops early and can say so rather than fill the gap.
const skillCutNote = "\n\n[This guide was cut to fit. The outline above names every section in it; say so if the answer needs one that was left out.]"

type skillBlockPart struct {
	heading string
	body    string
}

// CutSection fits a skill section into budget characters. A section already
// inside it goes in whole, which is most of them. A longer one keeps its
// preamble and a full outline of its headings, then as many of its ## and ###
// blocks as fit, the ones that share the most with the question first and an
// exact error code the question names above everything, put back in the
// order the section has them. Headings inside fenced code are not headings.
func CutSection(body, question string, budget int) (string, bool) {
	if utf8.RuneCountInString(body) <= budget {
		return body, false
	}
	var pre strings.Builder
	var blocks []skillBlockPart
	fenced := false
	for _, line := range strings.SplitAfter(body, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "```") {
			fenced = !fenced
		}
		if !fenced && (strings.HasPrefix(line, "## ") || strings.HasPrefix(line, "### ")) {
			blocks = append(blocks, skillBlockPart{heading: strings.TrimSpace(line)})
		}
		if len(blocks) == 0 {
			pre.WriteString(line)
		} else {
			blocks[len(blocks)-1].body += line
		}
	}

	var outline strings.Builder
	outline.WriteString("Sections in this guide:\n")
	for _, b := range blocks {
		outline.WriteString("- " + strings.TrimLeft(b.heading, "# ") + "\n")
	}

	head := pre.String()
	if limit := budget / 4; utf8.RuneCountInString(head) > limit {
		head = string([]rune(head)[:limit])
	}
	used := utf8.RuneCountInString(head) + utf8.RuneCountInString(outline.String()) +
		utf8.RuneCountInString(skillCutNote) + 2
	if used > budget {
		// An outline longer than the budget leaves no room for any block;
		// what fits of the preamble and outline is still the most useful cut.
		kept := []rune(head + "\n" + outline.String())
		room := budget - utf8.RuneCountInString(skillCutNote)
		if room < 0 {
			room = 0
		}
		if len(kept) > room {
			kept = kept[:room]
		}
		return string(kept) + skillCutNote, true
	}

	words := questionWords(question)
	codes := catalogue.ExtractErrorCodes(question)
	order := make([]int, len(blocks))
	scores := make([]int, len(blocks))
	for i, b := range blocks {
		order[i] = i
		scores[i] = blockScore(b, words, codes)
	}
	sort.SliceStable(order, func(a, c int) bool { return scores[order[a]] > scores[order[c]] })

	keep := make([]bool, len(blocks))
	for _, i := range order {
		n := utf8.RuneCountInString(blocks[i].body)
		if used+n > budget {
			continue
		}
		keep[i] = true
		used += n
	}

	var out strings.Builder
	out.WriteString(head)
	out.WriteString("\n")
	out.WriteString(outline.String())
	out.WriteString("\n")
	for i, b := range blocks {
		if keep[i] {
			out.WriteString(b.body)
		}
	}
	out.WriteString(skillCutNote)
	return out.String(), true
}

var questionStopWords = map[string]bool{
	"the": true, "and": true, "for": true, "how": true, "what": true, "does": true,
	"with": true, "this": true, "that": true, "from": true, "into": true, "are": true,
	"why": true, "can": true, "get": true, "use": true, "when": true, "where": true,
}

// questionWords is the question's own vocabulary, lowercased, for scoring
// blocks against it: words of three letters or more that carry meaning.
func questionWords(q string) []string {
	var out []string
	seen := map[string]bool{}
	for _, w := range strings.FieldsFunc(strings.ToLower(q), func(r rune) bool {
		return !(r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == '-')
	}) {
		if len(w) < 3 || questionStopWords[w] || seen[w] {
			continue
		}
		seen[w] = true
		out = append(out, w)
	}
	return out
}

func blockScore(b skillBlockPart, words, codes []string) int {
	score := 0
	for _, c := range codes {
		if strings.Contains(b.body, c) {
			score += 100
		}
	}
	heading := strings.ToLower(b.heading)
	text := strings.ToLower(b.body)
	for _, w := range words {
		switch {
		case strings.Contains(heading, w):
			score += 3
		case strings.Contains(text, w):
			score++
		}
	}
	return score
}

// scaffoldRule goes in front of a scaffold section. The section is written
// for a coding agent to generate code from, and this panel does not write
// code for the reader's codebase; the panel offers the agent instead.
const scaffoldRule = "This guide is written for a coding agent. Use it to explain what gets built, in what order, and against which endpoints. Show curl only, and do not reproduce its code."

// skillBlock is the section as it goes into the last user turn, beside the
// passages and the page.
func skillBlock(module, section, body string) string {
	rule := ""
	if section == "scaffold" {
		rule = scaffoldRule + "\n\n"
	}
	return fmt.Sprintf("<skill module=%q section=%q>\n%s%s\n</skill>", module, section, rule, body)
}
