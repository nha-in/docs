package server

// The six tools. Each delegates to the Tools method the old tool used, so a
// consolidated call returns exactly what the old one did.

import (
	"context"
	"fmt"
	"regexp"
	"strings"
)

type searchSixIn struct {
	Query          string `json:"query,omitempty" jsonschema:"what you are looking for, in your words; leave empty with filters to list"`
	Kind           string `json:"kind,omitempty" jsonschema:"atom (default), operation or fhir_profile"`
	Type           string `json:"type,omitempty" jsonschema:"atom type filter, one of: concept, flow, endpoint, callback, error, test, glossary, decision, fhir, sandbox, troubleshooting"`
	Milestone      string `json:"milestone,omitempty" jsonschema:"atom milestone filter, M1 to M4"`
	Module         string `json:"module,omitempty" jsonschema:"operation module filter, one of gateway, m1, m2, m3, m4, p1, p2, p3, p4, scan-and-register, scan-and-pay, record-share"`
	Limit          int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
	ResponseFormat string `json:"response_format,omitempty" jsonschema:"concise (default): id, type, title, url, short summary; detailed: adds snippet and milestone"`
}

type getSixIn struct {
	ID string `json:"id" jsonschema:"an atom id (hiecm.error.abdm-1035), an operationId (m1_post_profile_verify), fhir:<profile> (fhir:OPConsultRecord) or fhir-example:<hiType> (fhir-example:OPConsultation)"`
}

type validateSixIn struct {
	Kind        string `json:"kind" jsonschema:"request or fhir"`
	OperationID string `json:"operation_id,omitempty" jsonschema:"kind request: the operationId"`
	Body        string `json:"body,omitempty" jsonschema:"kind request: the candidate request body as raw JSON"`
	BundleJSON  string `json:"bundle_json,omitempty" jsonschema:"kind fhir: the FHIR document bundle as a JSON string"`
	RecordType  string `json:"record_type,omitempty" jsonschema:"kind fhir: optional expected ABDM hiType, for example OPConsultation"`
}

var atomIDRe = regexp.MustCompile(`^(hiecm|nhcx|uhi|shared)\.[a-z]+\.[a-z0-9-]+$`)

// idKind reads which store an id belongs to from its shape alone.
func idKind(id string) string {
	switch {
	case strings.HasPrefix(id, "fhir-example:"):
		return "fhir_example"
	case strings.HasPrefix(id, "fhir:"):
		return "fhir_profile"
	case atomIDRe.MatchString(id):
		return "atom"
	default:
		return "operation"
	}
}

// concise keeps five fields per hit so ten hits stay under 4,000 characters.
func concise(out map[string]any) map[string]any {
	hits, _ := out["hits"].([]map[string]any)
	slim := make([]map[string]any, 0, len(hits))
	for _, h := range hits {
		s, _ := h["summary"].(string)
		if len(s) > 160 {
			s = s[:157] + "..."
		}
		slim = append(slim, map[string]any{"id": h["id"], "type": h["type"], "title": h["title"], "doc_url": h["doc_url"], "summary": s})
	}
	out["hits"] = slim
	return out
}

func (t *Tools) Search(ctx context.Context, in searchSixIn) (map[string]any, error) {
	format := func(out map[string]any, err error) (map[string]any, error) {
		if err != nil || in.ResponseFormat == "detailed" {
			return out, err
		}
		return concise(out), nil
	}
	switch in.Kind {
	case "", "atom":
		if strings.TrimSpace(in.Query) == "" {
			refs, err := t.r.ListAtoms(in.Type, in.Milestone)
			if err != nil {
				return nil, err
			}
			return t.versioned(map[string]any{"atoms": atomRefsJSON(refs)}), nil
		}
		return format(t.SearchDocs(ctx, searchIn{Query: in.Query, Type: in.Type, Milestone: in.Milestone, Limit: in.Limit, Kind: "atom"}))
	case "operation":
		// An intent finds operations by what they do; a module, or no query,
		// lists them as list_operations did.
		if strings.TrimSpace(in.Query) != "" && in.Module == "" {
			return format(t.SearchDocs(ctx, searchIn{Query: in.Query, Limit: in.Limit, Kind: "operation"}))
		}
		return t.ListOperations(ctx, listOpsIn{Module: in.Module, Q: in.Query})
	case "fhir_profile":
		return t.ListFHIRProfiles(ctx, emptyFhirIn{})
	default:
		return nil, fmt.Errorf("kind %q is not one of atom, operation, fhir_profile", in.Kind)
	}
}

func (t *Tools) Get(ctx context.Context, in getSixIn) (map[string]any, error) {
	switch idKind(in.ID) {
	case "atom":
		return t.GetAtom(ctx, getAtomIn{ID: in.ID})
	case "fhir_profile":
		return t.GetFHIRProfile(ctx, getFhirProfileIn{Profile: strings.TrimPrefix(in.ID, "fhir:")})
	case "fhir_example":
		return t.GetFHIRExample(ctx, getFhirExampleIn{RecordType: strings.TrimPrefix(in.ID, "fhir-example:")})
	default:
		return t.GetOperation(ctx, getOpIn{OperationID: in.ID})
	}
}

func (t *Tools) Validate(ctx context.Context, in validateSixIn) (map[string]any, error) {
	switch in.Kind {
	case "request":
		return t.ValidateRequest(ctx, validateIn{OperationID: in.OperationID, Body: in.Body})
	case "fhir":
		return t.ValidateFHIR(ctx, validateFhirIn{BundleJSON: in.BundleJSON, RecordType: in.RecordType})
	default:
		return nil, fmt.Errorf("kind %q is not one of request, fhir", in.Kind)
	}
}

const (
	searchDescription       = "Find catalogue atoms, API operations or FHIR profiles. Use kind: atom (default) for concepts, errors, flows and glossary terms; kind: operation for an endpoint by what it does or its path; kind: fhir_profile to list profiles. Leave query empty with type or milestone to list atoms. Returns ids to pass to get; response_format concise (default) keeps each hit to id, type, title, url and a short summary."
	getDescription          = "Read one item in full by id. The id's shape picks the kind: an atom id (hiecm.error.abdm-1035), an operationId (m1_post_profile_verify), fhir:<profile> or fhir-example:<hiType>. Use search first when you do not have an id."
	validateDescription     = "Check a candidate before you send it. kind: request checks a request body against its operation's schema; kind: fhir checks a FHIR document bundle against the pinned NRCES profiles and ABDM rules. Findings name locations and fixes."
	validateFhirDescription = "Structural pre-flight check of a FHIR document bundle against the pinned NRCES profiles and ABDM transport rules. " +
		"Returns findings with locations and concrete fixes, never a bare pass or fail. " +
		"This is tier 1: it does not validate terminology and does not replace the official HL7 validator, whose recipe the catalogue carries."
	listAtomsDescription = "Enumerate catalogue atoms by type and milestone, for example all M2 test cases. " +
		"Use this to enumerate what the catalogue covers; use search_docs when you have an intent rather than a category."
)

// deprecated is the description an old tool name carries for its last release.
func deprecated(repl, desc string) string {
	return "Deprecated alias for `" + repl + "`; removed in the next release. " + desc
}
