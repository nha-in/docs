package server

import (
	"context"
)

// The thirteen tool names this server served before the six, kept for one
// release so a client, skill or prompt that names one keeps working. Each
// takes its old input, maps it to one of the six and returns exactly what
// that tool returns, errors included. Delete this file and aliases_test.go
// in the next release, and the "tools/list" entries go with them.

type searchDocsIn struct {
	Query     string `json:"query" jsonschema:"the search query"`
	Type      string `json:"type,omitempty" jsonschema:"optional atom type filter"`
	Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter, M1 to M4"`
	Limit     int    `json:"limit,omitempty" jsonschema:"max results, default 10, cap 25"`
}

type listAtomsIn struct {
	Type      string `json:"type,omitempty" jsonschema:"optional atom type filter"`
	Milestone string `json:"milestone,omitempty" jsonschema:"optional milestone filter"`
}

type listOpsIn struct {
	Tag    string `json:"tag,omitempty" jsonschema:"optional exact tag filter"`
	Module string `json:"module,omitempty" jsonschema:"optional exact module filter"`
	Q      string `json:"q,omitempty" jsonschema:"optional case-insensitive filter over operation_id, summary and path"`
}

type getAtomIn struct {
	ID string `json:"id" jsonschema:"the atom id, for example hiecm.error.abdm-1035"`
}

type getOpIn struct {
	OperationID string `json:"operation_id" jsonschema:"the operationId"`
}

type getFhirProfileIn struct {
	Profile string `json:"profile" jsonschema:"the NRCES profile name, for example OPConsultRecord, or an ABDM hiType such as OPConsultation"`
}

type getFhirExampleIn struct {
	RecordType string `json:"record_type" jsonschema:"the ABDM hiType, for example OPConsultation"`
}

type validateFhirIn struct {
	BundleJSON string `json:"bundle_json" jsonschema:"the FHIR document bundle to check, as a JSON string"`
	RecordType string `json:"record_type,omitempty" jsonschema:"optional expected ABDM hiType, for example OPConsultation"`
}

func deprecated(target, how string) string {
	return "Deprecated alias for `" + target + "`; removed in the next release. " + how
}

// aliasDefs returns the thirteen aliases. Their output schema is their
// target's, because their output is their target's.
func (t *Tools) aliasDefs() []ToolDef {
	typeEnum := map[string][]any{"type": atomTypeValues}
	return []ToolDef{
		def("search_docs", deprecated(toolSearch, `Call abdm_search with kind "atom" and response_format "detailed".`),
			schemaWithEnums[searchDocsIn](typeEnum), searchOut,
			func(ctx context.Context, in searchDocsIn) (map[string]any, error) {
				return t.Search(ctx, searchIn{Query: in.Query, Kind: "atom", Type: in.Type,
					Milestone: in.Milestone, Limit: in.Limit, ResponseFormat: "detailed"})
			}),
		def("list_atoms", deprecated(toolSearch, `Call abdm_search with kind "atom" and no query.`),
			schemaWithEnums[listAtomsIn](typeEnum), searchOut,
			func(ctx context.Context, in listAtomsIn) (map[string]any, error) {
				return t.Search(ctx, searchIn{Kind: "atom", Type: in.Type, Milestone: in.Milestone, Limit: maxLimit})
			}),
		def("list_operations", deprecated(toolSearch, `Call abdm_search with kind "operation".`),
			mustSchemaFor[listOpsIn](), searchOut,
			func(ctx context.Context, in listOpsIn) (map[string]any, error) {
				return t.Search(ctx, searchIn{Query: in.Q, Kind: "operation", Module: in.Module, Limit: maxLimit, tag: in.Tag})
			}),
		def("list_fhir_profiles", deprecated(toolSearch, `Call abdm_search with kind "fhir_profile".`),
			mustSchemaFor[emptyIn](), searchOut,
			func(ctx context.Context, in emptyIn) (map[string]any, error) {
				return t.Search(ctx, searchIn{Kind: "fhir_profile", Limit: maxLimit})
			}),
		def("get_atom", deprecated(toolGet, "Call abdm_get with the atom id."),
			mustSchemaFor[getAtomIn](), getOut,
			func(ctx context.Context, in getAtomIn) (map[string]any, error) {
				return t.Get(ctx, getIn{ID: in.ID, kind: "atom"})
			}),
		def("get_operation", deprecated(toolGet, "Call abdm_get with the operationId as id."),
			mustSchemaFor[getOpIn](), getOut,
			func(ctx context.Context, in getOpIn) (map[string]any, error) {
				return t.Get(ctx, getIn{ID: in.OperationID, kind: "operation"})
			}),
		def("get_fhir_profile", deprecated(toolGet, `Call abdm_get with id "fhir:<profile or hiType>".`),
			mustSchemaFor[getFhirProfileIn](), getOut,
			func(ctx context.Context, in getFhirProfileIn) (map[string]any, error) {
				return t.Get(ctx, getIn{ID: "fhir:" + in.Profile})
			}),
		def("get_fhir_example", deprecated(toolGet, `Call abdm_get with id "fhir-example:<hiType>".`),
			mustSchemaFor[getFhirExampleIn](), getOut,
			func(ctx context.Context, in getFhirExampleIn) (map[string]any, error) {
				return t.Get(ctx, getIn{ID: "fhir-example:" + in.RecordType})
			}),
		def("related_atoms", deprecated(toolRelated, "Call abdm_related."),
			mustSchemaFor[getAtomIn](), relatedOut,
			func(ctx context.Context, in getAtomIn) (map[string]any, error) {
				return t.Related(ctx, relatedIn{ID: in.ID})
			}),
		def("decode_error", deprecated(toolDecode, "Call abdm_decode_error."),
			mustSchemaFor[decodeIn](), decodeOut, t.DecodeError),
		def("validate_request", deprecated(toolValidate, `Call abdm_validate with kind "request".`),
			mustSchemaFor[validateRequestIn](), validateOut,
			func(ctx context.Context, in validateRequestIn) (map[string]any, error) {
				return t.Validate(ctx, validateIn{Kind: "request", OperationID: in.OperationID, Body: in.Body})
			}),
		def("validate_fhir", deprecated(toolValidate, `Call abdm_validate with kind "fhir".`),
			mustSchemaFor[validateFhirIn](), validateOut,
			func(ctx context.Context, in validateFhirIn) (map[string]any, error) {
				return t.Validate(ctx, validateIn{Kind: "fhir", BundleJSON: in.BundleJSON, RecordType: in.RecordType})
			}),
		def("catalogue_info", deprecated(toolInfo, "Call abdm_catalogue_info."),
			mustSchemaFor[emptyIn](), infoOut, t.CatalogueInfo),
	}
}
