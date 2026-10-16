package catalogue

import "testing"

func TestFirstQuestion(t *testing.T) {
	for _, tc := range []struct{ name, body, want string }{
		{"bulleted", "Intro.\n\n## Questions this answers\n\n- How do I link records as a HIP?\n- Another one\n\n## Next\n- not this", "How do I link records as a HIP?"},
		{"numbered and quoted", "## Questions this answers\n1. \"401 on the sessions call?\"\n", "401 on the sessions call?"},
		{"no section", "## In plain words\nA thing.", ""},
		{"empty section", "## Questions this answers\n\n## Next\n- not this", ""},
		{"a longer heading is another heading", "## Questions this answers badly\n- not this", "not this"},
	} {
		if got := FirstQuestion(tc.body); got != tc.want {
			t.Errorf("%s: FirstQuestion = %q, want %q", tc.name, got, tc.want)
		}
	}
}
