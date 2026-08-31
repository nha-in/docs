// Package guard holds the checks that run around the agent rather than
// inside its prompt.
//
// The support agent playbook draws the line this package exists to enforce:
// a rule that lives only in the system prompt is guidance, not a control. The
// model follows it most of the time. These run every time, on the way in and
// on the way out, whether the model cooperated or not.
//
// Two directions:
//
//   - MaskPII runs on what a reader typed, before it reaches the model or any
//     log. This is a health system, and the support surface is exactly where
//     somebody pastes a failing request with a live patient identifier in it.
//   - CheckAnswer runs on what the model produced, before a reader sees it.
//
// Everything here is a pure function over a string so it can be tested
// without a model, a database or a network.
package guard

import (
	"regexp"
	"strings"
)

// ---------- Input: personal data ----------

// A masker replaces one kind of identifier with a typed placeholder. Order
// matters: the longer, more specific patterns run first, so a 14 digit ABHA
// number is not first chewed up by the 12 digit Aadhaar rule.
type masker struct {
	label string
	re    *regexp.Regexp
}

var maskers = []masker{
	// ABHA address: a readable handle, name@abdm or name@sbx.
	{"ABHA_ADDRESS", regexp.MustCompile(`\b[A-Za-z0-9._-]{2,}@(?:abdm|sbx|pmjay)\b`)},
	// Email. Runs after the ABHA address so an @abdm handle keeps its own label.
	{"EMAIL", regexp.MustCompile(`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`)},
	// ABHA number: 14 digits, usually written in 2-4-4-4 groups.
	{"ABHA_NUMBER", regexp.MustCompile(`\b\d{2}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b`)},
	// Aadhaar: 12 digits, often in 4-4-4 groups.
	{"AADHAAR", regexp.MustCompile(`\b\d{4}[- ]?\d{4}[- ]?\d{4}\b`)},
	// Indian mobile, with or without the country code.
	{"MOBILE", regexp.MustCompile(`\b(?:\+?91[- ]?)?[6-9]\d{9}\b`)},
	// Bearer tokens and client secrets, which are credentials rather than
	// personal data but must not be stored or forwarded either.
	{"TOKEN", regexp.MustCompile(`(?i)\bBearer\s+[A-Za-z0-9._~+/-]{16,}=*`)},
	{"SECRET", regexp.MustCompile(`(?i)\b(?:client[_-]?secret|password|passwd)\s*[:=]\s*\S+`)},
}

// otpRe needs its surrounding words: a bare six digit number is far more
// often a port, a count or part of a code than an OTP, and masking those
// makes answers worse for no gain.
var otpRe = regexp.MustCompile(`(?i)\b(otp|pin|code)\b(\s*(?:is|=|:)?\s*)(\d{4,8})\b`)

// MaskPII replaces personal data and credentials with typed placeholders,
// and reports which kinds it found. The replacement is one way on purpose:
// nothing anywhere can turn <MASKED_AADHAAR> back into the number, so a
// value that is masked here cannot leak from a log, a stored transcript or a
// model provider's retention later.
//
// It deliberately over-masks. A redacted question that produces a slightly
// worse answer is an acceptable cost; a stored patient identifier is not.
func MaskPII(s string) (string, []string) {
	var found []string
	seen := map[string]bool{}
	note := func(label string) {
		if !seen[label] {
			seen[label] = true
			found = append(found, label)
		}
	}
	out := otpRe.ReplaceAllStringFunc(s, func(m string) string {
		parts := otpRe.FindStringSubmatch(m)
		note("OTP")
		return parts[1] + parts[2] + "<MASKED_OTP>"
	})
	for _, m := range maskers {
		out = m.re.ReplaceAllStringFunc(out, func(string) string {
			note(m.label)
			return "<MASKED_" + m.label + ">"
		})
	}
	return out, found
}

// ---------- Output: what a reader may be shown ----------

type Violation struct {
	Rule   string // stable identifier, for metrics
	Detail string // what was seen, for the log
}

// atomIDRe matches the catalogue's internal id shape, gateway.type.slug.
// These are our filing codes. A reader has no idea what one means, and the
// playbook's vocabulary rule keeps them off every integrator-facing surface.
var atomIDRe = regexp.MustCompile(`\b[a-z0-9]+\.(?:concept|flow|endpoint|callback|error|test|decision|glossary|fhir|sandbox)\.[a-z0-9-]+\b`)

// internalWords are ours, not the reader's. "Catalogue" and "atom" describe
// how this portal is built; "unverified" and "stale" are frontmatter values.
// The honest meaning survives in plain words, which the prompt asks for.
var internalWords = []*regexp.Regexp{
	regexp.MustCompile(`(?i)\bthe catalogue\b`),
	regexp.MustCompile(`(?i)\batom(?:s|\sid)?\b`),
	regexp.MustCompile(`(?i)\bfrontmatter\b`),
	regexp.MustCompile(`(?i)\bverification[_ ]status\b`),
	regexp.MustCompile(`(?i)\bmarked (?:unverified|stale)\b`),
}

// openerRe catches the filler the reward model taught and the prompt bans:
// praising the question, apologising, or restating it back. Anchored to the
// start, because the same words mid-answer are usually legitimate.
var openerRe = regexp.MustCompile(`(?i)^\s*(?:(?:that(?:'s| is)|what) an? )?(?:great|good|excellent|interesting|fantastic|fair)\s+(?:question|point|catch)|^\s*(?:i(?:'m| am) sorry|sorry|i apologi[sz]e|my apologies)\b|^\s*(?:you(?:'re| are) (?:asking|wondering)|so you want)\b`)

// fenceRe pulls each fenced block with its info string, so a block can be
// judged by what it claims to be.
var fenceRe = regexp.MustCompile("(?s)```([^\n]*)\n(.*?)```")

// allowedFence lists what a fenced block may hold. curl is the agent's main
// tool and is a statement of a documented request rather than code for
// somebody's codebase. Response bodies and headers are documentation too.
// Anything else is a language the reader would paste into their project.
var allowedFence = map[string]bool{
	"": true, "curl": true, "bash": true, "sh": true, "shell": true,
	"json": true, "http": true, "yaml": true, "yml": true, "text": true,
}

// codeTokens appear in a block that claims no language but is plainly code.
var codeTokens = []*regexp.Regexp{
	regexp.MustCompile(`(?m)^\s*(?:func|function|def|class|public|private|import|package)\s`),
	regexp.MustCompile(`=>`),
	regexp.MustCompile(`(?m)^\s*(?:const|let|var)\s+\w+\s*=`),
	regexp.MustCompile(`(?i)\bSELECT\b.+\bFROM\b`),
}

// CheckAnswer returns every rule the rendered answer breaks. An empty slice
// means it may be shown to a reader.
//
// It is deliberately blunt about code: the playbook forbids writing code for
// an integrator's codebase outright, so a fenced block in a language is a
// violation regardless of how good the code is.
func CheckAnswer(s string) []Violation {
	var out []Violation
	add := func(rule, detail string) {
		out = append(out, Violation{Rule: rule, Detail: detail})
	}

	if m := openerRe.FindString(s); m != "" {
		add("sycophantic_opener", strings.TrimSpace(m))
	}
	if m := atomIDRe.FindString(s); m != "" {
		add("internal_vocabulary", m)
	} else {
		for _, re := range internalWords {
			if m := re.FindString(s); m != "" {
				add("internal_vocabulary", m)
				break
			}
		}
	}
	// An em dash is banned across everything this portal publishes, and the
	// same rule applies to an answer.
	if strings.Contains(s, "—") {
		add("style", "em dash")
	}

	for _, block := range fenceRe.FindAllStringSubmatch(s, -1) {
		lang := strings.ToLower(strings.TrimSpace(block[1]))
		body := block[2]
		if !allowedFence[lang] {
			add("generated_code", "fenced block marked "+lang)
			continue
		}
		// A shell block has to actually be a shell command. "```bash" around a
		// Python function is the obvious way past a language check.
		if lang == "curl" || lang == "bash" || lang == "sh" || lang == "shell" {
			if !strings.Contains(body, "curl") {
				add("generated_code", "shell block that does not run curl")
				continue
			}
		}
		if lang == "" {
			for _, re := range codeTokens {
				if re.MatchString(body) {
					add("generated_code", "unlabelled block containing "+re.String())
					break
				}
			}
		}
	}
	return out
}

// asksForCode reports whether the reader asked for code to put in their own
// project. Used to require that a refusal names one of the three routes
// rather than being a bare no.
var asksForCodeRe = regexp.MustCompile(`(?i)\b(?:write|give|show|generate|create|implement|fix|refactor|debug)\b[^.?!]{0,40}\b(?:code|function|class|method|snippet|implementation|script|sdk|client)\b|\bin (?:python|java|javascript|typescript|node|go|golang|ruby|php|c#|kotlin|swift)\b`)

// routeOffered looks for the three routes the playbook requires a code
// refusal to carry: an agent skill, a documentation link, or the MCP server.
var routeOfferedRe = regexp.MustCompile(`(?i)\bskill\b|\bmcp\b|/docs/|\bdocumentation\b|\bcurl\b`)

// CheckCodeRoute enforces that a request for code is answered with a route
// rather than a bare refusal. A refusal with nowhere to go is the failure
// mode that makes an integrator give up and guess.
func CheckCodeRoute(question, answer string) []Violation {
	if !asksForCodeRe.MatchString(question) {
		return nil
	}
	if routeOfferedRe.MatchString(answer) {
		return nil
	}
	return []Violation{{
		Rule:   "code_request_without_route",
		Detail: "the reader asked for code and the answer named no skill, link or curl",
	}}
}

// ---------- Output: grounding ----------

// The literals an integrator will copy into their own system, and where a
// wrong one costs them hours. These are checked against what the tools
// actually returned. Prose is not checked: a model that paraphrases badly is
// a quality problem, but a model that invents a header name is a defect that
// looks exactly like a fact.
var (
	groundedCodeRe   = regexp.MustCompile(`\b(?:ABDM|GATEWAY|MIS|EKA)-\d{3,5}\b`)
	groundedHeaderRe = regexp.MustCompile(`\bX-[A-Z][A-Za-z0-9-]{2,}\b`)
	groundedPathRe   = regexp.MustCompile(`/(?:api|v\d[\d.]*)/[A-Za-z0-9/_{}.-]{3,}`)
	// Portal navigation, not an API path. The prompt allows /docs/support.
	portalPathRe = regexp.MustCompile(`^/docs/`)
)

// CheckGrounding compares the literals in an answer against the text the
// tools returned, plus the reader's own question.
//
// corpus is everything the tools handed back this turn. question is included
// because a reader quoting their own failing header is not the model
// inventing one, and echoing it back is the right thing to do.
//
// cited is how many sources the answer ended up with. An answer full of API
// literals and no sources is the failure the retrieval gate exists to stop:
// the model answered from training rather than from the portal, and it reads
// identically to a grounded answer.
// final says the answer has stopped. The literal check runs on every
// release, because a literal absent from the corpus is invented whether or
// not more text follows, and waiting until the end would mean the text was
// already on screen. The uncited check waits, because a source can still
// arrive while the answer streams.
func CheckGrounding(answer, corpus string, cited int, final bool) []Violation {
	var out []Violation
	haystack := strings.ToLower(corpus)
	var literals []string
	seen := map[string]bool{}
	collect := func(re *regexp.Regexp, skip func(string) bool) {
		for _, m := range re.FindAllString(answer, -1) {
			if seen[m] || (skip != nil && skip(m)) {
				continue
			}
			seen[m] = true
			literals = append(literals, m)
		}
	}
	collect(groundedCodeRe, nil)
	collect(groundedHeaderRe, nil)
	collect(groundedPathRe, func(p string) bool { return portalPathRe.MatchString(p) })

	for _, lit := range literals {
		if !strings.Contains(haystack, strings.ToLower(lit)) {
			out = append(out, Violation{
				Rule:   "invented_identifier",
				Detail: lit + " appears in neither the retrieved documentation nor the question",
			})
		}
	}
	if final && len(literals) > 0 && cited == 0 {
		out = append(out, Violation{
			Rule:   "ungrounded_answer",
			Detail: "the answer states API specifics but drew on no source",
		})
	}
	return out
}
