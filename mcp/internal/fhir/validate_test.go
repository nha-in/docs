package fhir

import (
	"encoding/json"
	"os"
	"strings"
	"testing"
)

func fixtureBundle(t *testing.T) []byte {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	b, ok := ig.Examples["Bundle-OPConsultNote-example-05"]
	if !ok {
		t.Fatal("fixture example missing")
	}
	return b
}

func fixtureDigests(t *testing.T) map[string]*ProfileDigest {
	ig, err := LoadIG("testdata/ig-fixture.tgz")
	if err != nil {
		t.Fatal(err)
	}
	out := map[string]*ProfileDigest{}
	for _, name := range []string{"OPConsultRecord", "PrescriptionRecord", "DocumentBundle"} {
		rt := ""
		for k, v := range RecordTypes {
			if v == name {
				rt = k
			}
		}
		d, err := Digest(ig, name, rt)
		if err != nil {
			t.Fatal(err)
		}
		out[name] = d
	}
	return out
}

func mutate(t *testing.T, bundle []byte, f func(m map[string]any)) []byte {
	var m map[string]any
	if err := json.Unmarshal(bundle, &m); err != nil {
		t.Fatal(err)
	}
	f(m)
	out, _ := json.Marshal(m)
	return out
}

func findingAt(fs []Finding, substr string) *Finding {
	for i := range fs {
		if strings.Contains(fs[i].Problem, substr) || strings.Contains(fs[i].Location, substr) {
			return &fs[i]
		}
	}
	return nil
}

func TestValidateGoldenIsClean(t *testing.T) {
	fs := Validate(fixtureBundle(t), "OPConsultation", fixtureDigests(t))
	for _, f := range fs {
		if f.Severity == "error" {
			t.Errorf("golden bundle produced error: %+v", f)
		}
	}
}

func TestValidateNotJSON(t *testing.T) {
	fs := Validate([]byte("not json"), "", fixtureDigests(t))
	if findingAt(fs, "not valid JSON") == nil {
		t.Errorf("want a not-valid-JSON finding, got %+v", fs)
	}
}

func TestValidateGenericRules(t *testing.T) {
	digests := fixtureDigests(t)
	cases := []struct {
		name   string
		mutant []byte
		expect string // substring of the expected finding's Problem
	}{
		{"wrong bundle type", mutate(t, fixtureBundle(t), func(m map[string]any) {
			m["type"] = "collection"
		}), "type must be \"document\""},
		{"composition not first", mutate(t, fixtureBundle(t), func(m map[string]any) {
			e := m["entry"].([]any)
			e[0], e[1] = e[1], e[0]
		}), "first entry must be a Composition"},
		{"dangling reference", mutate(t, fixtureBundle(t), func(m map[string]any) {
			e := m["entry"].([]any)
			m["entry"] = e[:len(e)-1] // drop the last resource; something references it
		}), "reference"},
		{"missing timestamp", mutate(t, fixtureBundle(t), func(m map[string]any) {
			delete(m, "timestamp")
		}), "timestamp"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			f := findingAt(Validate(c.mutant, "OPConsultation", digests), c.expect)
			if f == nil {
				t.Fatalf("no finding matching %q", c.expect)
			}
			if f.Fix == "" || f.Why == "" {
				t.Errorf("finding lacks fix or why: %+v", f)
			}
		})
	}
}

func TestValidateEnvelopeRules(t *testing.T) {
	digests := fixtureDigests(t)
	// Expected record type is Prescription but the bundle is an OP consult:
	// the hiType-to-profile correspondence rule must fire.
	f := findingAt(Validate(fixtureBundle(t), "Prescription", digests), "PrescriptionRecord")
	if f == nil {
		t.Fatal("expected hiType correspondence finding")
	}
	if !strings.Contains(f.Why, "hiType") {
		t.Errorf("why should explain the hiType link: %+v", f)
	}
	// Unknown record type is itself a finding, not a silent pass.
	f2 := findingAt(Validate(fixtureBundle(t), "XRay", digests), "record type")
	if f2 == nil {
		t.Fatal("expected unknown record type finding")
	}
	if f2.Location == "" {
		t.Errorf("unknown record type finding lacks Location: %+v", f2)
	}
}

// attachment returns the fixture's one Attachment object
// (DocumentReference.content[0].attachment), so attachment mutation tests
// don't hard-code entry ordering.
func attachment(t *testing.T, m map[string]any) map[string]any {
	t.Helper()
	for _, e := range m["entry"].([]any) {
		res := e.(map[string]any)["resource"].(map[string]any)
		if res["resourceType"] != "DocumentReference" {
			continue
		}
		content := res["content"].([]any)
		return content[0].(map[string]any)["attachment"].(map[string]any)
	}
	t.Fatal("no DocumentReference entry with an attachment found")
	return nil
}

func TestValidateAttachmentRules(t *testing.T) {
	digests := fixtureDigests(t)
	cases := []struct {
		name   string
		mutant []byte
		expect string
	}{
		{"data is null", mutate(t, fixtureBundle(t), func(m map[string]any) {
			attachment(t, m)["data"] = nil
		}), "Attachment.data"},
		{"missing contentType with valid data", mutate(t, fixtureBundle(t), func(m map[string]any) {
			delete(attachment(t, m), "contentType")
		}), "Attachment.contentType is missing"},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			f := findingAt(Validate(c.mutant, "OPConsultation", digests), c.expect)
			if f == nil {
				t.Fatalf("no finding matching %q", c.expect)
			}
			if f.Fix == "" || f.Why == "" {
				t.Errorf("finding lacks fix or why: %+v", f)
			}
		})
	}
}

func TestValidateDigestRules(t *testing.T) {
	digests := fixtureDigests(t)
	cases := []struct {
		name   string
		mutant []byte
		expect string
	}{
		{"missing meta.profile on composition", mutate(t, fixtureBundle(t), func(m map[string]any) {
			comp := m["entry"].([]any)[0].(map[string]any)["resource"].(map[string]any)
			delete(comp, "meta")
		}), "meta.profile"},
		{"missing required composition element", mutate(t, fixtureBundle(t), func(m map[string]any) {
			comp := m["entry"].([]any)[0].(map[string]any)["resource"].(map[string]any)
			delete(comp, "subject") // OPConsultRecord requires Composition.subject (confirmed in testdata/golden/digests.json)
		}), "Composition.subject"},
		{"unknown section slice is tolerated", fixtureBundle(t), ""}, // control: no new errors on golden
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			fs := Validate(c.mutant, "OPConsultation", digests)
			if c.expect == "" {
				for _, f := range fs {
					if f.Severity == "error" {
						t.Errorf("control produced error: %+v", f)
					}
				}
				return
			}
			f := findingAt(fs, c.expect)
			if f == nil {
				t.Fatalf("no finding matching %q in %+v", c.expect, fs)
			}
			if f.Ref == "" {
				t.Errorf("digest-derived finding should carry Ref: %+v", f)
			}
		})
	}
}

// TestValidateDigestRulesSyntheticSection covers the required-section rule
// with a hand-built digest. Every OPConsultRecord section slice in the
// pinned IG version is Min 0 (see testdata/golden/digests.json), so the
// golden fixture has no positive case for "a Min>=1 section is missing" —
// this test supplies one synthetically rather than leaving the rule
// unexercised.
func TestValidateDigestRulesSyntheticSection(t *testing.T) {
	digests := fixtureDigests(t)
	base := digests["OPConsultRecord"]
	synthetic := *base
	synthetic.Sections = append(append([]SectionRule{}, base.Sections...), SectionRule{
		Slice: "SyntheticRequiredSection",
		Min:   1,
		Max:   "1",
	})
	syntheticDigests := map[string]*ProfileDigest{
		"OPConsultRecord": &synthetic,
		"DocumentBundle":  digests["DocumentBundle"],
	}

	fs := Validate(fixtureBundle(t), "OPConsultation", syntheticDigests)
	f := findingAt(fs, "SyntheticRequiredSection")
	if f == nil {
		t.Fatalf("expected a finding for the missing required section, got %+v", fs)
	}
	if f.Severity != "error" {
		t.Errorf("missing required section should be an error: %+v", f)
	}
	if f.Ref == "" {
		t.Errorf("digest-derived finding should carry Ref: %+v", f)
	}
}

// TestRealGoldenExamplesClean is the strongest regression net for tier 1:
// it runs Validate against real published NRCES examples (not the trimmed
// test fixture) for every one of the seven record types, using digests
// built from the same real IG package, and asserts none of them produce an
// error-severity finding. Skips when the raw package isn't present locally
// (it is committed, so CI has it; a from-scratch clone that hasn't fetched
// LFS/large-file content might not).
func TestRealGoldenExamplesClean(t *testing.T) {
	raw := "../../../catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz"
	if _, err := os.Stat(raw); err != nil {
		t.Skip("raw NRCES package not present")
	}
	ig, err := LoadIG(raw)
	if err != nil {
		t.Fatal(err)
	}

	digestList, err := AllDigests(ig)
	if err != nil {
		t.Fatal(err)
	}
	digests := make(map[string]*ProfileDigest, len(digestList))
	for _, d := range digestList {
		digests[d.ProfileName] = d
	}

	examples, err := GoldenExamples(ig)
	if err != nil {
		t.Fatal(err)
	}
	if len(examples) != len(RecordTypes) {
		t.Fatalf("got %d real golden examples, want %d (one per record type): %v", len(examples), len(RecordTypes), keys(examples))
	}

	for recordType, bundle := range examples {
		t.Run(recordType, func(t *testing.T) {
			fs := Validate(bundle, recordType, digests)
			for _, f := range fs {
				if f.Severity == "error" {
					t.Errorf("real golden example produced error: %+v", f)
				}
			}
		})
	}
}
