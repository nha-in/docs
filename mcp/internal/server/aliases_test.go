package server

import (
	"testing"

	"github.com/nha-in/docs/mcp/internal/embed"
)

// A deprecated alias behaves exactly like the tool it aliases, errors
// included: the same text, the same isError, for the mapped input. Deleted
// with aliases.go in the next release.
func TestAliasesBehaveLikeTheirTool(t *testing.T) {
	sess := connect(t, true, embed.NewFake(64))
	bundle := `{"resourceType":"Bundle","type":"document"}`
	type args = map[string]any
	for _, c := range []struct {
		alias     string
		aliasArgs args
		tool      string
		toolArgs  args
		miss      bool // the id does not exist, so both must be isError
	}{
		{"search_docs", args{"query": "ABDM-1035", "type": "error"},
			"abdm_search", args{"query": "ABDM-1035", "kind": "atom", "type": "error", "response_format": "detailed"}, false},
		{"list_atoms", args{"type": "error"},
			"abdm_search", args{"kind": "atom", "type": "error", "limit": 100}, false},
		{"list_operations", args{"module": "m2"},
			"abdm_search", args{"kind": "operation", "module": "m2", "limit": 100}, false},
		{"list_operations", args{"q": "add-contexts"},
			"abdm_search", args{"kind": "operation", "query": "add-contexts", "limit": 100}, false},
		{"list_fhir_profiles", args{},
			"abdm_search", args{"kind": "fhir_profile", "limit": 100}, false},
		{"get_atom", args{"id": "hiecm.error.abdm-1035"},
			"abdm_get", args{"id": "hiecm.error.abdm-1035"}, false},
		{"get_atom", args{"id": "hiecm.error.abdm-1036"},
			"abdm_get", args{"id": "hiecm.error.abdm-1036"}, true},
		{"get_operation", args{"operation_id": "linkAddContexts"},
			"abdm_get", args{"id": "linkAddContexts"}, false},
		{"get_operation", args{"operation_id": "linkAddContext"},
			"abdm_get", args{"id": "linkAddContext"}, true},
		{"get_fhir_profile", args{"profile": "OPConsultation"},
			"abdm_get", args{"id": "fhir:OPConsultation"}, false},
		{"get_fhir_profile", args{"profile": "NoSuchProfile"},
			"abdm_get", args{"id": "fhir:NoSuchProfile"}, true},
		{"get_fhir_example", args{"record_type": "OPConsultation"},
			"abdm_get", args{"id": "fhir-example:OPConsultation"}, false},
		{"related_atoms", args{"id": "hiecm.flow.m2-link-care-context"},
			"abdm_related", args{"id": "hiecm.flow.m2-link-care-context"}, false},
		{"related_atoms", args{"id": "hiecm.flow.nope"},
			"abdm_related", args{"id": "hiecm.flow.nope"}, true},
		{"decode_error", args{"input": "ABDM-1016"},
			"abdm_decode_error", args{"input": "ABDM-1016"}, false},
		{"validate_request", args{"operation_id": "linkAddContexts", "body": `{"count":"x"}`},
			"abdm_validate", args{"kind": "request", "operation_id": "linkAddContexts", "body": `{"count":"x"}`}, false},
		{"validate_request", args{"operation_id": "nope", "body": `{}`},
			"abdm_validate", args{"kind": "request", "operation_id": "nope", "body": `{}`}, true},
		{"validate_fhir", args{"bundle_json": bundle, "record_type": "OPConsultation"},
			"abdm_validate", args{"kind": "fhir", "bundle_json": bundle, "record_type": "OPConsultation"}, false},
		{"catalogue_info", args{},
			"abdm_catalogue_info", args{}, false},
	} {
		gotTxt, gotErr, _ := callResult(t, sess, c.alias, c.aliasArgs)
		wantTxt, wantErr, _ := callResult(t, sess, c.tool, c.toolArgs)
		if gotErr != c.miss {
			t.Errorf("%s %v: isError=%v, want %v: %s", c.alias, c.aliasArgs, gotErr, c.miss, gotTxt)
		}
		if gotTxt != wantTxt || gotErr != wantErr {
			t.Errorf("%s %v differs from %s %v:\nalias (isError=%v): %s\ntool  (isError=%v): %s",
				c.alias, c.aliasArgs, c.tool, c.toolArgs, gotErr, gotTxt, wantErr, wantTxt)
		}
	}
}
