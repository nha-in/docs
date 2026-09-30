// Package route decides, before any model call, what shape of answer a
// question wants and which tools that shape may use. It is rules, not a
// model: the rules are cheap, testable, and wrong in ways that can be read.
package route

import (
	"regexp"
	"strings"

	"github.com/nha-in/docs/mcp/internal/catalogue"
)

type Shape string

const (
	Define   Shape = "define"
	HowDoI   Shape = "how-do-i"
	Diagnose Shape = "diagnose"
	Compare  Shape = "compare"
	Meta     Shape = "meta"
	Self     Shape = "self"
	// Topic is chosen after retrieval, not by Route: a two or three word
	// noun phrase whose top passage is a flow is a topic, and a topic wants
	// orientation and a choice rather than a definition.
	Topic Shape = "topic"
)

type Input struct {
	Question      string
	HasAttachment bool
}

type Result struct {
	Shape        Shape
	ErrorCodes   []string
	OperationRef string
	Tools        []string
}

var (
	pathRe   = regexp.MustCompile(`(?i)\b(?:GET|POST|PUT|PATCH|DELETE)?\s*(/(?:api|v3|v3\.1|hiecm|abha|phr)[A-Za-z0-9/_{}.\-]*)`)
	opIDRe   = regexp.MustCompile(`\b([a-z][a-z0-9]*(?:_[a-z0-9]+){2,})\b`)
	failRe   = regexp.MustCompile(`(?i)\b(fail|failing|error|returns? \d{3}|got \d{3}|\b4\d\d\b|\b5\d\d\b|not working|stuck|rejected|invalid)\b`)
	compRe   = regexp.MustCompile(`(?i)\b(difference|differ|vs\.?|versus|same as|the same as|compare|which one)\b`)
	metaRe   = regexp.MustCompile(`(?i)\b(catalogue version|which version|how (?:old|current)|last updated|built)\b`)
	greetRe  = regexp.MustCompile(`(?i)^(hi+|hello|hey|hiya|yo|namaste|good (?:morning|afternoon|evening))(?: there| all| team)?[\s.!?]*$`)
	thanksRe = regexp.MustCompile(`(?i)^(thanks?|thank you|thank you (?:so|very) much|ty|ok(?:ay)?|cool|great|got it|perfect|nice)(?: there| all| team| a lot)?[\s.!?]*$`)
	selfRe   = regexp.MustCompile(`(?i)\b(?:who|what) are you\b|\bwhat can you (?:do|help)|\b(?:how many |which |what )languages?\b.*\byou\b|\bdo you (?:understand|speak|remember)\b|\bcan you (?:speak|understand)\b|\bare you (?:an? )?(?:bot|ai|human|robot|real|person|chatgpt|gpt|claude|llm)\b|\bwho (?:made|built|created|trained|runs) you\b|\bwhat (?:model|llm) (?:are|is) (?:you|this)\b|\byour (?:name|capabilit\w*|limit\w*)\b|\babout yourself\b|\bhow (?:do|does) (?:you|this assistant) work\b`)
	whRe     = regexp.MustCompile(`(?i)^(what is|what's|whats|what are|what makes|define|meaning of|explain)\b`)
	// featureRe matches a bare portal feature name: the command chips, the
	// agent skills, the MCP server, the plugin, the Postman collections. A
	// reader typing one wants the portal's page, not an ABDM definition,
	// and without this the define fallback builds one from neighbours.
	featureRe = regexp.MustCompile(`(?i)^(?:the )?(?:(scaffold|design|integrate|debug)(?: (?:command|skill|mode|chip))?|(?:agent |claude )?(skills?)|(mcp)(?: server)?|(plugins?)|(postman)(?: collections?)?)[\s.!?]*$`)
)

// imperativeVerbs are bare how-to imperatives ("link record", "reset
// password"). Checked by first word only, lowercased, so a definitional use
// of the same word later in a longer question ("what makes an address
// invalid") never matches here.
var imperativeVerbs = map[string]bool{
	"create": true, "link": true, "get": true, "send": true, "register": true,
	"delete": true, "reset": true, "update": true, "share": true, "fetch": true,
	"verify": true, "add": true, "make": true, "generate": true,
}

func Route(in Input) Result {
	q := strings.TrimSpace(in.Question)
	r := Result{ErrorCodes: catalogue.ExtractErrorCodes(q)}
	if m := pathRe.FindStringSubmatch(q); m != nil {
		r.OperationRef = m[1]
	} else if m := opIDRe.FindStringSubmatch(q); m != nil {
		r.OperationRef = m[1]
	}
	words := strings.Fields(q)

	switch {
	case in.HasAttachment, len(r.ErrorCodes) > 0:
		r.Shape = Diagnose
	case whRe.MatchString(q):
		r.Shape = Define
	case failRe.MatchString(q):
		r.Shape = Diagnose
	case compRe.MatchString(q):
		r.Shape = Compare
	case metaRe.MatchString(q):
		r.Shape = Meta
	case len(words) > 0 && imperativeVerbs[strings.ToLower(words[0])]:
		r.Shape = HowDoI
	case len(words) <= 3 && !strings.Contains(q, "?") && !strings.HasPrefix(strings.ToLower(q), "how"):
		r.Shape = Define
	default:
		r.Shape = HowDoI
	}

	r.Tools = []string{"search"}
	if len(r.ErrorCodes) > 0 || (r.Shape == Diagnose && r.OperationRef == "") {
		r.Tools = append(r.Tools, "decode_error")
	}
	// A path-shaped ref is found with search, kind operation; an exact
	// operationId is read with get.
	if r.OperationRef != "" && !strings.HasPrefix(r.OperationRef, "/") {
		r.Tools = append(r.Tools, "get")
	}
	if in.HasAttachment {
		r.Tools = append(r.Tools, "validate")
	}
	return r
}

// IsAboutAssistant reports whether a message asks about the assistant
// itself: who it is, what it can do, which languages it reads. The catalogue
// holds nothing on that, so a lookup only retrieves unrelated atoms and cites
// them.
func IsAboutAssistant(q string) bool { return selfRe.MatchString(q) }

// IsGreeting reports whether a message is only a greeting. Those carry
// nothing to retrieve on, and "hi" retrieves HI type, HIU and HIP.
func IsGreeting(q string) bool { return greetRe.MatchString(strings.TrimSpace(q)) }

// IsThanks reports whether a message is only thanks or an acknowledgement.
// It used to count as a greeting, so a reader closing with "thanks" was
// asked what they were building as if they had just arrived.
func IsThanks(q string) bool { return thanksRe.MatchString(strings.TrimSpace(q)) }

// PortalFeature reports which portal feature a bare phrase names, or an
// empty string: "command" for scaffold, design, integrate and debug,
// "skills", "mcp", "plugin" or "postman". A phrase with any other word in it
// is a question about ABDM and takes the ordinary path.
func PortalFeature(q string) string {
	m := featureRe.FindStringSubmatch(strings.TrimSpace(q))
	if m == nil {
		return ""
	}
	switch {
	case m[1] != "":
		return "command"
	case m[2] != "":
		return "skills"
	case m[3] != "":
		return "mcp"
	case m[4] != "":
		return "plugin"
	default:
		return "postman"
	}
}
