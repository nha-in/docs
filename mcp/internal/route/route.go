// Package route decides, before any model call, what shape of answer a
// question wants and which tools that shape may use. It is rules, not a
// model: the rules are cheap, testable, and wrong in ways that can be read.
package route

import (
	"regexp"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/catalogue"
)

type Shape string

const (
	Define   Shape = "define"
	HowDoI   Shape = "how-do-i"
	Diagnose Shape = "diagnose"
	Compare  Shape = "compare"
	Meta     Shape = "meta"
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
	pathRe  = regexp.MustCompile(`(?i)\b(?:GET|POST|PUT|PATCH|DELETE)?\s*(/(?:api|v3|v3\.1|hiecm|abha|phr)[A-Za-z0-9/_{}.\-]*)`)
	opIDRe  = regexp.MustCompile(`\b([a-z][a-z0-9]*(?:_[a-z0-9]+){2,})\b`)
	failRe  = regexp.MustCompile(`(?i)\b(fail|failing|error|returns? \d{3}|got \d{3}|\b4\d\d\b|\b5\d\d\b|not working|stuck|rejected|invalid)\b`)
	compRe  = regexp.MustCompile(`(?i)\b(difference|differ|vs\.?|versus|same as|the same as|compare|which one)\b`)
	metaRe  = regexp.MustCompile(`(?i)\b(catalogue version|which version|how (?:old|current)|last updated|built)\b`)
	greetRe = regexp.MustCompile(`(?i)^(hi+|hello|hey|hiya|yo|namaste|good (?:morning|afternoon|evening)|thanks?|thank you|ty|ok(?:ay)?|cool|great)(?: there| all| team)?[\s.!?]*$`)
	whRe    = regexp.MustCompile(`(?i)^(what is|what's|whats|what are|what makes|define|meaning of|explain)\b`)
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

	r.Tools = []string{"search_docs"}
	if len(r.ErrorCodes) > 0 || (r.Shape == Diagnose && r.OperationRef == "") {
		r.Tools = append(r.Tools, "decode_error")
	}
	if strings.HasPrefix(r.OperationRef, "/") {
		// A path-shaped ref ("/api/hiecm/gateway/v3/sessions") is not an
		// operationId: get_operation only resolves exact ids, so handing it
		// out here would give the model a tool it can only call by
		// guessing. list_operations can search by path instead.
		r.Tools = append(r.Tools, "list_operations")
	} else if r.OperationRef != "" {
		r.Tools = append(r.Tools, "get_operation")
	}
	if in.HasAttachment {
		r.Tools = append(r.Tools, "validate_request")
	}
	return r
}

// IsGreeting reports whether a message is only a greeting or thanks. Those
// carry nothing to retrieve on, and "hi" retrieves HI type, HIU and HIP.
func IsGreeting(q string) bool { return greetRe.MatchString(strings.TrimSpace(q)) }
