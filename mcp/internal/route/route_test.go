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
		{"ABHA", false, Define, []string{"search_docs"}},
		{"what is a care context", false, Define, []string{"search_docs"}},
		{"how do i create abha without aadhar", false, HowDoI, []string{"search_docs"}},
		{"can a phr app register with just a phone number", false, HowDoI, []string{"search_docs"}},
		{"is abha number the same as abha address", false, Compare, []string{"search_docs"}},
		{"difference between HIP and HIU", false, Compare, []string{"search_docs"}},
		{"getting ABDM-1016 on sessions", false, Diagnose, []string{"search_docs", "decode_error"}},
		{"what headers does POST /api/hiecm/gateway/v3/sessions need", false, HowDoI, []string{"search_docs", "list_operations"}},
		{"gateway_sessions_create returns 401", false, Diagnose, []string{"search_docs", "get_operation"}},
		{"why is this failing", true, Diagnose, []string{"search_docs", "decode_error", "validate_request"}},
		{"which version of the catalogue is this", false, Meta, []string{"search_docs"}},
		{"link record", false, HowDoI, []string{"search_docs"}},
		{"create abha", false, HowDoI, []string{"search_docs"}},
		{"what makes an address invalid", false, Define, []string{"search_docs"}},
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
