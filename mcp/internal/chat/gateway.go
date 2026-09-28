package chat

import (
	"context"
	"regexp"
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

// scopeFor decides the scope for one question. The page's gateway applies
// unless the question names a different gateway, in which case the reader
// has said what they want and nothing is filtered out. A gateway this server
// does not know is no scope at all.
func scopeFor(page, question string) string {
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

// gatewayNote tells the model which documentation the reader is in. It rides
// in the last user turn with the other per-question text, never in the
// system prompt, which stays byte identical so its cache point holds.
func gatewayNote(gateway string) string {
	label := gatewayLabels[gateway]
	return "<reader_context>The reader is reading the " + label + " documentation. Answer for " + label +
		" unless they ask about another gateway, and do not bring in another gateway's calls or fields.</reader_context>"
}

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
