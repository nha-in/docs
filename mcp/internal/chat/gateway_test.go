package chat

import "testing"

func TestVariantTerm(t *testing.T) {
	for _, tc := range []struct{ q, theirs, ours string }{
		{"how do I register an HMIS?", "HMIS", "HIMS"},
		{"what is a health id", "health id", "ABHA"},
		{"LIMS onboarding", "LIMS", "LIS"},
		{"what is a HIMS", "", ""},
		{"claims", "", ""},
		{"the hmisx field", "", ""},
	} {
		theirs, ours := variantTerm(tc.q)
		if theirs != tc.theirs || ours != tc.ours {
			t.Errorf("variantTerm(%q) = %q, %q; want %q, %q", tc.q, theirs, ours, tc.theirs, tc.ours)
		}
	}
}
