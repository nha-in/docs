package route

import (
	"reflect"
	"testing"
)

func TestRoute(t *testing.T) {
	cases := []struct {
		q     string
		att   bool
		shape Shape
		tools []string
	}{
		{"ABHA", false, Define, []string{"abdm_search"}},
		{"what is a care context", false, Define, []string{"abdm_search"}},
		{"how do i create abha without aadhar", false, HowDoI, []string{"abdm_search"}},
		{"can a phr app register with just a phone number", false, HowDoI, []string{"abdm_search"}},
		{"is abha number the same as abha address", false, Compare, []string{"abdm_search"}},
		{"difference between HIP and HIU", false, Compare, []string{"abdm_search"}},
		{"getting ABDM-1016 on sessions", false, Diagnose, []string{"abdm_search", "abdm_decode_error"}},
		// A path is not an operationId: abdm_search (kind operation) finds the
		// id, and abdm_get then reads the contract.
		{"what headers does POST /api/hiecm/gateway/v3/sessions need", false, HowDoI, []string{"abdm_search", "abdm_get"}},
		{"gateway_sessions_create returns 401", false, Diagnose, []string{"abdm_search", "abdm_get"}},
		{"why is this failing", true, Diagnose, []string{"abdm_search", "abdm_decode_error", "abdm_validate"}},
		{"which version of the catalogue is this", false, Meta, []string{"abdm_search"}},
		{"link record", false, HowDoI, []string{"abdm_search"}},
		{"create abha", false, HowDoI, []string{"abdm_search"}},
		{"what makes an address invalid", false, Define, []string{"abdm_search"}},
	}
	for _, c := range cases {
		got := Route(Input{Question: c.q, HasAttachment: c.att})
		if got.Shape != c.shape {
			t.Errorf("%q: shape %s, want %s", c.q, got.Shape, c.shape)
		}
		if !reflect.DeepEqual(got.Tools, c.tools) {
			t.Errorf("%q: tools %v, want %v", c.q, got.Tools, c.tools)
		}
	}
}

func TestIsGreeting(t *testing.T) {
	for _, q := range []string{"hi", "Hi!", "hello there", "thanks", "ok"} {
		if !IsGreeting(q) {
			t.Errorf("%q should be a greeting", q)
		}
	}
	for _, q := range []string{"hip", "HIU", "hi, what is an ABHA", "ok so how do I link"} {
		if IsGreeting(q) {
			t.Errorf("%q should not be a greeting", q)
		}
	}
}
