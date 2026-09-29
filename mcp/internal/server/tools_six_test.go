package server

import "testing"

func TestIDKindPicksTheToolFromTheIDShape(t *testing.T) {
	for id, want := range map[string]string{
		"hiecm.error.abdm-1062":       "atom",
		"hiecm.glossary.link-token":   "atom",
		"nhcx.endpoint.claim-submit":  "atom",
		"m1_post_profile_verify":      "operation",
		"fhir:OPConsultRecord":        "fhir_profile",
		"fhir-example:OPConsultation": "fhir_example",
	} {
		if got := idKind(id); got != want {
			t.Errorf("idKind(%q) = %q, want %q", id, got, want)
		}
	}
}

func TestConciseTrimsAHitToFiveFields(t *testing.T) {
	long := make([]byte, 400)
	for i := range long {
		long[i] = 'x'
	}
	out := concise(map[string]any{"hits": []map[string]any{{"id": "a", "type": "error", "title": "T", "doc_url": "/d", "summary": string(long), "snippet": "s", "related": []string{"b"}}}})
	h := out["hits"].([]map[string]any)[0]
	if len(h) != 5 {
		t.Fatalf("concise hit has %d fields, want 5: %v", len(h), h)
	}
	if n := len(h["summary"].(string)); n > 160 {
		t.Errorf("summary is %d characters, want at most 160", n)
	}
}
