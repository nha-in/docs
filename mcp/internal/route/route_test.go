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
		{"ABHA", false, Define, []string{"search"}},
		{"what is a care context", false, Define, []string{"search"}},
		{"how do i create abha without aadhar", false, HowDoI, []string{"search"}},
		{"can a phr app register with just a phone number", false, HowDoI, []string{"search"}},
		{"is abha number the same as abha address", false, Compare, []string{"search"}},
		{"difference between HIP and HIU", false, Compare, []string{"search"}},
		{"getting ABDM-1016 on sessions", false, Diagnose, []string{"search", "decode_error"}},
		{"what headers does POST /api/hiecm/gateway/v3/sessions need", false, HowDoI, []string{"search"}},
		{"gateway_sessions_create returns 401", false, Diagnose, []string{"search", "get"}},
		{"why is this failing", true, Diagnose, []string{"search", "decode_error", "validate"}},
		{"which version of the catalogue is this", false, Meta, []string{"search"}},
		{"link record", false, HowDoI, []string{"search"}},
		{"create abha", false, HowDoI, []string{"search"}},
		{"what makes an address invalid", false, Define, []string{"search"}},
		// NHA PHR review, 30 September 2026: a whole build gets the overview,
		// a whole flow the walkthrough, and neither steals a how-do-i.
		{"How to Build a PHR application", false, Overview, []string{"search"}},
		{"Is there a Patient app in ABDM and how do I build one?", false, Overview, []string{"search"}},
		{"What are the milestones in PHR creation", false, Overview, []string{"search"}},
		{"Do I require any additional milestone rather than P1-P4 for building PHR application?", false, Overview, []string{"search"}},
		{"how can i integrate with ABDM", false, Overview, []string{"search"}},
		{"how do I integrate my HMIS with ABDM", false, Overview, []string{"search"}},
		{"how do I create an ABHA in my app", false, HowDoI, []string{"search"}},
		{"how do I build the login screen", false, HowDoI, []string{"search"}},
		{"what is P4", false, Define, []string{"search"}},
		{"Explain the complete consent and data sharing flow from consent request creation until health records are received by the HIU", false, Walkthrough, []string{"search", "get"}},
		{"walk me through linking a care context", false, Walkthrough, []string{"search", "get"}},
		{"what is the consent flow", false, Define, []string{"search"}},
		{"consent flow", false, Define, []string{"search"}},
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
	for _, q := range []string{"hi", "Hi!", "hello there"} {
		if !IsGreeting(q) {
			t.Errorf("%q should be a greeting", q)
		}
	}
	for _, q := range []string{"hip", "HIU", "hi, what is an ABHA", "ok so how do I link", "thanks", "ok"} {
		if IsGreeting(q) {
			t.Errorf("%q should not be a greeting", q)
		}
	}
}

func TestIsThanks(t *testing.T) {
	for _, q := range []string{"thanks", "Thank you!", "ok", "cool", "got it.", "thanks a lot"} {
		if !IsThanks(q) {
			t.Errorf("%q should be thanks", q)
		}
	}
	for _, q := range []string{"hi", "ok so how do I link", "thanks, but what about M3", "great question"} {
		if IsThanks(q) {
			t.Errorf("%q should not be thanks", q)
		}
	}
}

func TestIsAboutAssistant(t *testing.T) {
	for _, q := range []string{"how many languages do you understand", "who are you?", "what can you do", "are you a bot", "do you speak Hindi", "tell me about yourself", "what model are you"} {
		if !IsAboutAssistant(q) {
			t.Errorf("%q should be about the assistant", q)
		}
	}
	for _, q := range []string{"how many ABHA creation ways exist", "can you tell me how to link a care context", "what are the languages supported in FHIR display", "documents/ID required to create ABHA", "do you know the consent flow"} {
		if IsAboutAssistant(q) {
			t.Errorf("%q should not be about the assistant", q)
		}
	}
}

func TestPortalFeature(t *testing.T) {
	for q, want := range map[string]string{
		"scaffold skill": "command", "Integrate command": "command", "debug": "command",
		"agent skills": "skills", "skills": "skills", "MCP server": "mcp", "mcp": "mcp",
		"the plugin": "plugin", "postman collection": "postman", "Postman": "postman",
	} {
		if got := PortalFeature(q); got != want {
			t.Errorf("PortalFeature(%q) = %q, want %q", q, got, want)
		}
	}
	for _, q := range []string{"how do I debug ABDM-1016", "consent design", "scaffold a HIP", "skills for M2", "postman collection for UHI", "link records"} {
		if got := PortalFeature(q); got != "" {
			t.Errorf("PortalFeature(%q) = %q, want none", q, got)
		}
	}
}
