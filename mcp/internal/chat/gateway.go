package chat

import (
	"context"
	"regexp"
	"strings"
)

// The gateway a question is asked from.
//
// The panel is hosted on pages that each belong to one gateway, /docs/hiecm/
// or /docs/nhcx/, and a reader on an HIE-CM page asking how to raise a
// consent request wants the HIE-CM answer. With no scope, search ranked
// across the whole catalogue, where NHCX carries most of the atoms, and a
// question about the assistant itself came back as an NHCX payer query.

type gatewayKey struct{}

// WithGateway records the gateway every search in this request is scoped to.
// Empty means no scope.
func WithGateway(ctx context.Context, gateway string) context.Context {
	return context.WithValue(ctx, gatewayKey{}, gateway)
}

// GatewayFrom returns the gateway WithGateway recorded, or "".
func GatewayFrom(ctx context.Context) string {
	g, _ := ctx.Value(gatewayKey{}).(string)
	return g
}

// gatewayNames is how a reader names a gateway in a question. The ids are
// the folder names under catalogue/openapi and site/docs.
var gatewayNames = map[string]*regexp.Regexp{
	"hiecm": regexp.MustCompile(`(?i)\bhie-?cm\b`),
	"nhcx":  regexp.MustCompile(`(?i)\bnhcx\b|\bhealth claims? exchange\b`),
	"uhi":   regexp.MustCompile(`(?i)\buhi\b|\bunified health interface\b`),
}

// gatewayLabels is the name a reader sees for each gateway.
var gatewayLabels = map[string]string{"hiecm": "HIE-CM", "nhcx": "NHCX", "uhi": "UHI"}

// claimsVocabulary is how a reader asks about the claims exchange without
// naming it.
var claimsVocabulary = regexp.MustCompile(`(?i)\b(claims?|insurers?|payers?|pre-?auth\w*|tpas?|polic(?:y|ies)|coverage|participant codes?|correlation ids?|jwe)\b`)

// scopeFor decides the scope for one question. The page's gateway applies
// unless the question names a different gateway, in which case the reader
// has said what they want and nothing is filtered out. A page that belongs
// to no gateway infers one from the question. A gateway this server does not
// know is no scope at all.
func scopeFor(page, question string) string {
	if page == "" {
		return inferScope(question)
	}
	if _, known := gatewayLabels[page]; !known {
		return ""
	}
	for id, re := range gatewayNames {
		if id != page && re.MatchString(question) {
			return ""
		}
	}
	return page
}

// inferScope scopes a question asked from a page that belongs to no gateway:
// the landing page, support, What's New. Searching the whole catalogue there
// let NHCX, most of the atoms, answer HIE-CM questions. A question naming one
// gateway gets it and naming two gets no scope; claims vocabulary means NHCX;
// anything else is HIE-CM, the portal's main gateway.
func inferScope(question string) string {
	named := ""
	for id, re := range gatewayNames {
		if re.MatchString(question) {
			if named != "" {
				return ""
			}
			named = id
		}
	}
	if named != "" {
		return named
	}
	if claimsVocabulary.MatchString(question) {
		return "nhcx"
	}
	return "hiecm"
}

// gatewayNote tells the model which documentation the reader is in. It rides
// in the last user turn with the other per-question text, never in the
// system prompt, which stays byte identical so its cache point holds.
// fromPage is false when the scope was inferred from the question, and the
// note then says so rather than naming a page the reader is not on.
func gatewayNote(gateway string, fromPage bool) string {
	label := gatewayLabels[gateway]
	where := "The reader is reading the " + label + " documentation."
	if !fromPage {
		where = "The question reads as a " + label + " question."
	}
	return "<reader_context>" + where + " Answer for " + label +
		" unless they ask about another gateway, and do not bring in another gateway's calls or fields.</reader_context>"
}

// thanksReply is the fixed reply to thanks or an acknowledgement. It is not
// the greeting: a reader closing a conversation is not asked what they are
// building.
const thanksReply = "You're welcome. Ask again whenever the next call gives you trouble."

// greetingFor is the fixed reply to a greeting, pointed at what the reader's
// gateway covers.
func greetingFor(gateway string) string {
	switch gateway {
	case "hiecm":
		return "Hi. What are you building? Ask about creating an ABHA, linking records, consent, or an error code you are seeing."
	case "nhcx":
		return "Hi. What are you building? Ask about a claim or a pre-authorisation, building a JWE, or an error code you are seeing."
	default:
		return "Hi. What are you building? Ask how to make a call, what a field means, or what an error code is telling you."
	}
}

// variantTerms maps a spelling readers use to the term this portal uses.
// Keys are lower case and matched on word boundaries. Kept short on purpose:
// a row earns its place when the eval shows readers typing it.
var variantTerms = []struct{ theirs, ours string }{
	{"hmis", "HIMS"},
	{"lims", "LIS"},
	{"health id", "ABHA"},
	{"phr address", "ABHA address"},
	{"abha id", "ABHA number"},
}

// variantTerm returns the reader's spelling and the portal's term when the
// question uses a known variant, and empty strings otherwise. The reader's
// spelling is returned as they wrote it so the note quotes them exactly.
func variantTerm(question string) (theirs, ours string) {
	lower := strings.ToLower(question)
	for _, v := range variantTerms {
		i := strings.Index(lower, v.theirs)
		for i >= 0 {
			before := i == 0 || !isWordChar(lower[i-1])
			end := i + len(v.theirs)
			after := end == len(lower) || !isWordChar(lower[end])
			if before && after {
				return question[i:end], v.ours
			}
			next := strings.Index(lower[i+1:], v.theirs)
			if next < 0 {
				break
			}
			i += 1 + next
		}
	}
	return "", ""
}

func isWordChar(b byte) bool {
	return b == '_' || (b >= '0' && b <= '9') || (b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z')
}

// featureReply is the fixed reply to a bare portal feature name. Two
// sentences and a portal page, the decline shape's own limits, so the eval
// scores it the same way it scores a model decline.
func featureReply(feature string) string {
	switch feature {
	case "command":
		return "Scaffold, Design, Integrate and Debug are the chips under the box: pick one and the module it is about, and the answer draws on that module's skill section. The same sections ship as files for your coding agent, on [agent skills and the MCP server](/docs/hiecm/v3/getting-started/build-with-ai)."
	case "postman":
		return "Each module's API reference offers a Postman collection and the shared sandbox environment from its overview page under /docs/hiecm/v3/api/. Pick the module, for example M1 for ABHA or M3 for consent, and the download sits at the top of its page."
	default: // skills, mcp, plugin
		return "Agent skills and the MCP server put this documentation inside your coding agent: the skills as files it loads once, the server as tools it queries as it works. Install steps for Claude Code, Cursor and VS Code are on [agent skills and the MCP server](/docs/hiecm/v3/getting-started/build-with-ai)."
	}
}
