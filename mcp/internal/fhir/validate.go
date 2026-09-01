package fhir

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"
)

// Finding is one structural or envelope problem found while validating a
// document bundle. Every finding fills Severity, Location, Problem, Why and
// Fix; Ref is set where a specific NRCES profile informs the rule.
type Finding struct {
	Severity string `json:"severity"` // "error" or "warning"
	Location string `json:"location"` // FHIRPath-style, e.g. "Bundle.entry[3].resource"
	Problem  string `json:"problem"`
	Why      string `json:"why"`           // why ABDM rejects or needs this
	Fix      string `json:"fix"`           // the concrete change to make
	Ref      string `json:"ref,omitempty"` // profile name or atom id that explains it
}

// LimitsTemplate is the honest-limits statement; the tool layer fills in the
// IG version read from the snapshot, so the pinned version has no second
// copy in Go.
const LimitsTemplate = "This is a structural check against the pinned NRCES profiles (ndhm.in %s) plus ABDM transport rules. It does not validate terminology and is not a certification. Run the official HL7 validator with the same IG version for full conformance; the catalogue's validator recipe atom explains how."

// Validate runs tier 1: generic document-bundle shape, reference and
// attachment checks, plus the ABDM envelope (hiType-to-profile
// correspondence) rules. digests maps profile name to digest and must
// include "DocumentBundle"; recordType is the expected hiType, or "" when
// the caller does not know it (per-type checks then key off meta.profile).
func Validate(bundle []byte, recordType string, digests map[string]*ProfileDigest) []Finding {
	var m map[string]any
	if f, ok := checkParse(bundle, &m); !ok {
		return []Finding{f}
	}

	var findings []Finding
	findings = append(findings, checkDocumentShape(m, digests)...)
	findings = append(findings, checkReferences(m)...)
	findings = append(findings, checkAttachments(m)...)
	findings = append(findings, checkEnvelope(m, recordType, digests)...)
	findings = append(findings, checkAgainstDigest(m, recordType, digests)...)
	return dedupFindings(findings)
}

// checkParse unmarshals bundle into *out. On failure it reports the single
// finding the rest of Validate cannot proceed without.
func checkParse(bundle []byte, out *map[string]any) (Finding, bool) {
	if err := json.Unmarshal(bundle, out); err != nil {
		return Finding{
			Severity: "error",
			Location: "Bundle",
			Problem:  fmt.Sprintf("bundle is not valid JSON: %s", err),
			Why:      "The ABDM gateway and the HIU's FHIR processor both expect a JSON-encoded document bundle; a payload that fails to parse is rejected before any profile validation runs.",
			Fix:      "Fix the JSON syntax error and re-submit a well-formed document bundle.",
		}, false
	}
	return Finding{}, true
}

// checkDocumentShape validates the generic FHIR document-bundle envelope:
// resourceType, Bundle.type, Bundle.timestamp, Bundle.identifier, a
// non-empty entry list, and a Composition as the first entry.
func checkDocumentShape(m map[string]any, digests map[string]*ProfileDigest) []Finding {
	var findings []Finding

	if rt, _ := m["resourceType"].(string); rt != "Bundle" {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.resourceType",
			Problem:  fmt.Sprintf("resourceType is %q; a document bundle must have resourceType \"Bundle\"", rt),
			Why:      "The M2 data push and file upload APIs only accept a FHIR Bundle resource at the top level; anything else is rejected before it reaches profile validation.",
			Fix:      `Set resourceType to "Bundle".`,
			Ref:      "DocumentBundle",
		})
	}

	if bt, _ := m["type"].(string); bt != "document" {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.type",
			Problem:  fmt.Sprintf("Bundle.type is %q; type must be \"document\"", bt),
			Why:      "DocumentBundle fixes Bundle.type to \"document\"; the HIU's FHIR processor treats any other bundle type as a different interaction and drops it.",
			Fix:      `Set Bundle.type to "document".`,
			Ref:      "DocumentBundle",
		})
	}

	if ts, ok := m["timestamp"].(string); !ok || ts == "" {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.timestamp",
			Problem:  "Bundle.timestamp is missing",
			Why:      "DocumentBundle requires Bundle.timestamp so the HIU can order and dedupe records; a bundle without it fails NRCES profile validation.",
			Fix:      "Add Bundle.timestamp as an RFC3339 date-time, e.g. the composition date.",
			Ref:      "DocumentBundle",
		})
	} else if _, err := time.Parse(time.RFC3339, ts); err != nil {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.timestamp",
			Problem:  fmt.Sprintf("Bundle.timestamp %q is not a valid RFC3339 date-time", ts),
			Why:      "The HIU and gateway parse Bundle.timestamp as an instant; a value that is not RFC3339 fails parsing on their side.",
			Fix:      `Format Bundle.timestamp as RFC3339, e.g. "2020-07-09T15:32:26.605+05:30".`,
			Ref:      "DocumentBundle",
		})
	}

	if ident, ok := m["identifier"].(map[string]any); !ok {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.identifier",
			Problem:  "Bundle.identifier is missing",
			Why:      "DocumentBundle requires Bundle.identifier so the HIU can deduplicate document pushes; without it, retries create duplicate records at the HIU.",
			Fix:      "Add Bundle.identifier with system and value.",
			Ref:      "DocumentBundle",
		})
	} else {
		if v, _ := ident["system"].(string); v == "" {
			findings = append(findings, Finding{
				Severity: "error",
				Location: "Bundle.identifier.system",
				Problem:  "Bundle.identifier.system is missing",
				Why:      "DocumentBundle requires identifier.system to namespace Bundle.identifier.value; without it the identifier is ambiguous across HIPs.",
				Fix:      "Add Bundle.identifier.system, e.g. your facility's identifier system URI.",
				Ref:      "DocumentBundle",
			})
		}
		if v, _ := ident["value"].(string); v == "" {
			findings = append(findings, Finding{
				Severity: "error",
				Location: "Bundle.identifier.value",
				Problem:  "Bundle.identifier.value is missing",
				Why:      "DocumentBundle requires identifier.value to uniquely identify this bundle; without it dedup and audit trail both break at the HIU.",
				Fix:      "Add Bundle.identifier.value, e.g. a UUID for this document.",
				Ref:      "DocumentBundle",
			})
		}
	}

	entries, hasEntries := m["entry"].([]any)
	if !hasEntries || len(entries) == 0 {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.entry",
			Problem:  "Bundle.entry is empty",
			Why:      "A document bundle with no entries carries no clinical content; the HIU has nothing to persist.",
			Fix:      "Add at least the Composition entry and the resources it references.",
			Ref:      "DocumentBundle",
		})
		return findings
	}

	first, _ := entries[0].(map[string]any)
	firstResource, _ := first["resource"].(map[string]any)
	firstType, _ := firstResource["resourceType"].(string)
	if firstType != "Composition" {
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.entry[0].resource",
			Problem:  fmt.Sprintf("Bundle.entry[0].resource has resourceType %q; first entry must be a Composition", firstType),
			Why:      "FHIR document bundles require the Composition to be the first entry; the HIU's document parser reads entry[0] to find the document root and fails otherwise.",
			Fix:      "Reorder Bundle.entry so the Composition resource is first.",
			Ref:      "DocumentBundle",
		})
	}

	_ = digests // DocumentBundle's Fixed/Required rules are cited by name (Ref) above; checkAgainstDigest below re-derives them from the digest generically and dedups against these.
	return findings
}

// checkReferences collects every entry's fullUrl and "<resourceType>/<id>",
// then walks every entry's resource recursively for {"reference": "..."}
// values, reporting any internal reference that does not resolve to a
// collected target. Absolute http(s) references are external and get a
// warning, not an error.
func checkReferences(m map[string]any) []Finding {
	entries, ok := m["entry"].([]any)
	if !ok {
		return nil
	}

	targets := map[string]bool{}
	for _, e := range entries {
		em, ok := e.(map[string]any)
		if !ok {
			continue
		}
		if fu, ok := em["fullUrl"].(string); ok && fu != "" {
			targets[fu] = true
		}
		if res, ok := em["resource"].(map[string]any); ok {
			rt, _ := res["resourceType"].(string)
			id, _ := res["id"].(string)
			if rt != "" && id != "" {
				targets[rt+"/"+id] = true
			}
		}
	}

	var findings []Finding
	for i, e := range entries {
		em, ok := e.(map[string]any)
		if !ok {
			continue
		}
		res, ok := em["resource"].(map[string]any)
		if !ok {
			continue
		}
		refs := collectReferences(res)
		sort.Strings(refs)
		for _, ref := range refs {
			if ref == "" || strings.HasPrefix(ref, "#") {
				// Empty, or a contained-resource reference; contained
				// resources aren't modeled by entry/fullUrl.
				continue
			}
			if strings.HasPrefix(ref, "http://") || strings.HasPrefix(ref, "https://") {
				findings = append(findings, Finding{
					Severity: "warning",
					Location: fmt.Sprintf("Bundle.entry[%d].resource", i),
					Problem:  fmt.Sprintf("reference %q points outside the bundle", ref),
					Why:      "The M2 data push expects a self-contained document bundle; an absolute external reference may not be reachable when the HIU processes the push later.",
					Fix:      "Inline the referenced resource as a bundle entry, or confirm the HIU can independently resolve the external URL.",
				})
				continue
			}
			if !targets[ref] {
				findings = append(findings, Finding{
					Severity: "error",
					Location: fmt.Sprintf("Bundle.entry[%d].resource", i),
					Problem:  fmt.Sprintf("reference %q does not resolve to any entry in the bundle", ref),
					Why:      "A dangling reference means the HIU cannot assemble the full record; it will either reject the bundle outright or silently drop the linked context.",
					Fix:      "Add the missing resource as a bundle entry, or remove the reference if it is stale.",
				})
			}
		}
	}
	return dedupFindings(findings)
}

// dedupFindings drops repeat findings that share the same Location and
// Problem, preserving the order of first occurrence. checkReferences can
// otherwise report the same dangling or external reference once per
// occurrence when a resource repeats an identical reference string (e.g.
// the same missing target cited from two fields on one resource).
func dedupFindings(findings []Finding) []Finding {
	if len(findings) == 0 {
		return findings
	}
	seen := make(map[string]bool, len(findings))
	out := make([]Finding, 0, len(findings))
	for _, f := range findings {
		key := f.Location + "\x00" + f.Problem
		if seen[key] {
			continue
		}
		seen[key] = true
		out = append(out, f)
	}
	return out
}

// collectReferences recursively walks v (a decoded JSON resource) and
// returns every string value found under a "reference" key.
func collectReferences(v any) []string {
	var out []string
	switch t := v.(type) {
	case map[string]any:
		for k, val := range t {
			if k == "reference" {
				if s, ok := val.(string); ok {
					out = append(out, s)
					continue
				}
			}
			out = append(out, collectReferences(val)...)
		}
	case []any:
		for _, item := range t {
			out = append(out, collectReferences(item)...)
		}
	}
	return out
}

// checkAttachments walks every entry's resource recursively for
// Attachment-shaped objects (an object carrying a "data" key) and validates,
// independently, that data is a base64 string and that contentType is
// present and non-empty.
func checkAttachments(m map[string]any) []Finding {
	entries, ok := m["entry"].([]any)
	if !ok {
		return nil
	}

	var findings []Finding
	for i, e := range entries {
		em, ok := e.(map[string]any)
		if !ok {
			continue
		}
		res, ok := em["resource"].(map[string]any)
		if !ok {
			continue
		}
		for _, att := range collectAttachments(res) {
			// data and contentType are validated independently: a
			// malformed data value must not suppress the contentType
			// check (or vice versa), so neither problem passes silently.
			switch data := att["data"].(type) {
			case string:
				if _, err := base64.StdEncoding.DecodeString(data); err != nil {
					findings = append(findings, Finding{
						Severity: "error",
						Location: fmt.Sprintf("Bundle.entry[%d].resource", i),
						Problem:  "Attachment.data is not valid base64",
						Why:      "DocumentReference and similar resources carry file content as base64 in Attachment.data; invalid base64 fails to decode at the HIU and the attachment is lost.",
						Fix:      "Re-encode the attachment content with standard base64 (encoding/base64 StdEncoding).",
					})
				}
			default:
				findings = append(findings, Finding{
					Severity: "error",
					Location: fmt.Sprintf("Bundle.entry[%d].resource", i),
					Problem:  "Attachment.data is not a base64 string",
					Why:      "DocumentReference and similar resources carry file content as a base64-encoded string in Attachment.data; a non-string value (null, a number) cannot be decoded at the HIU and the attachment is lost.",
					Fix:      "Set Attachment.data to the file content encoded as a base64 string.",
				})
			}
			if ct, _ := att["contentType"].(string); ct == "" {
				findings = append(findings, Finding{
					Severity: "error",
					Location: fmt.Sprintf("Bundle.entry[%d].resource", i),
					Problem:  "Attachment.contentType is missing",
					Why:      "Without contentType the HIU cannot render or open the attached file.",
					Fix:      `Set Attachment.contentType to the file's MIME type, e.g. "application/pdf".`,
				})
			}
		}
	}
	return findings
}

// collectAttachments recursively walks v and returns every object that
// carries a "data" key, i.e. the FHIR Attachment shape. contentType is not
// required for an object to be recognized as an Attachment: a malformed
// Attachment that is missing contentType (or whose data is present but
// invalid) must still be caught, not skipped for failing to look enough
// like a well-formed one.
func collectAttachments(v any) []map[string]any {
	var out []map[string]any
	switch t := v.(type) {
	case map[string]any:
		if _, hasData := t["data"]; hasData {
			out = append(out, t)
		}
		for _, val := range t {
			out = append(out, collectAttachments(val)...)
		}
	case []any:
		for _, item := range t {
			out = append(out, collectAttachments(item)...)
		}
	}
	return out
}

// checkEnvelope validates the ABDM-specific rules: recordType (the hiType)
// must be a recognized wire name, and the first Composition's meta.profile
// must correspond to the NRCES profile that hiType maps to.
func checkEnvelope(m map[string]any, recordType string, digests map[string]*ProfileDigest) []Finding {
	if recordType == "" {
		return nil
	}

	profileName, known := RecordTypes[recordType]
	if !known {
		valid := make([]string, 0, len(RecordTypes))
		for k := range RecordTypes {
			valid = append(valid, k)
		}
		sort.Strings(valid)
		return []Finding{{
			Severity: "error",
			Location: "recordType",
			Problem:  fmt.Sprintf("record type %q is not a recognized ABDM hiType", recordType),
			Why:      "The M2 data push's hiType selects which NRCES profile the HIU expects; an unrecognized hiType has no corresponding profile to validate the bundle against.",
			Fix:      fmt.Sprintf("Use one of the seven recognized hiType values: %s.", strings.Join(valid, ", ")),
		}}
	}

	entries, ok := m["entry"].([]any)
	if !ok || len(entries) == 0 {
		// checkDocumentShape already reported the empty-entry problem.
		return nil
	}
	first, _ := entries[0].(map[string]any)
	firstResource, _ := first["resource"].(map[string]any)
	if rt, _ := firstResource["resourceType"].(string); rt != "Composition" {
		// checkDocumentShape already reported the shape problem.
		return nil
	}

	meta, _ := firstResource["meta"].(map[string]any)
	profiles, _ := meta["profile"].([]any)
	for _, p := range profiles {
		ps, ok := p.(string)
		if !ok {
			continue
		}
		if ps == profileName || strings.HasSuffix(ps, "/"+profileName) {
			return nil
		}
	}

	fix := fmt.Sprintf("Set Composition.meta.profile to the canonical NRCES URL for %s.", profileName)
	if d, ok := digests[profileName]; ok && d.URL != "" {
		fix = fmt.Sprintf("Set Composition.meta.profile to include %q.", d.URL)
	}
	return []Finding{{
		Severity: "error",
		Location: "Bundle.entry[0].resource.meta.profile",
		Problem:  fmt.Sprintf("Composition.meta.profile does not include %s, the profile expected for hiType %q", profileName, recordType),
		Why:      "The M2 data push's hiType tells the HIU what profile to expect; a bundle whose Composition carries a different (or no) profile fails validation on their side.",
		Fix:      fix,
		Ref:      profileName,
	}}
}

// checkAgainstDigest is the digest-derived rule layer: it resolves which
// profile digest applies to the bundle's Composition (from recordType when
// given, else by matching the Composition's own meta.profile against a
// digest URL), then checks the Composition against that digest's Required
// elements and Sections, and checks the bundle root against the
// DocumentBundle digest's Fixed and Required rules. When neither recordType
// nor meta.profile resolves a digest, per-type checks are skipped with a
// single warning rather than guessed at.
func checkAgainstDigest(m map[string]any, recordType string, digests map[string]*ProfileDigest) []Finding {
	var findings []Finding

	if comp, ok := firstComposition(m); ok {
		if d := resolveDigest(comp, recordType, digests); d != nil {
			findings = append(findings, checkCompositionProfile(comp, d)...)
			findings = append(findings, checkCompositionRequired(comp, d)...)
			findings = append(findings, checkSections(comp, d)...)
		} else {
			findings = append(findings, Finding{
				Severity: "warning",
				Location: "Bundle.entry[0].resource",
				Problem:  "per-record-type checks were skipped: no profile digest could be resolved",
				Why:      "Without a known hiType or a Composition.meta.profile that matches one of the pinned NRCES record profiles, tier 1 cannot tell which profile's required elements and sections to check the Composition against.",
				Fix:      "Pass the hiType as recordType, or set Composition.meta.profile to one of the seven NRCES record profile URLs.",
			})
		}
	}

	if db, ok := digests["DocumentBundle"]; ok {
		findings = append(findings, checkBundleFixed(m, db)...)
		findings = append(findings, checkBundleRequired(m, db)...)
	}

	return findings
}

// firstComposition returns Bundle.entry[0].resource when it is present and
// is a Composition. checkDocumentShape already reports an empty entry list
// or a non-Composition first entry, so checkAgainstDigest simply has
// nothing to check against in either case.
func firstComposition(m map[string]any) (map[string]any, bool) {
	entries, ok := m["entry"].([]any)
	if !ok || len(entries) == 0 {
		return nil, false
	}
	first, ok := entries[0].(map[string]any)
	if !ok {
		return nil, false
	}
	comp, ok := first["resource"].(map[string]any)
	if !ok {
		return nil, false
	}
	if rt, _ := comp["resourceType"].(string); rt != "Composition" {
		return nil, false
	}
	return comp, true
}

// resolveDigest picks the profile digest to check the Composition against.
// recordType, when non-empty, must map (via RecordTypes) to a digest present
// in digests; there is no fallback once a recordType is given, so a
// recognized-but-undigested or unrecognized recordType resolves to nothing
// rather than silently guessing from meta.profile. When recordType is empty,
// the Composition's own meta.profile is matched against every non-
// DocumentBundle digest's URL, in profile-name order for determinism.
func resolveDigest(comp map[string]any, recordType string, digests map[string]*ProfileDigest) *ProfileDigest {
	if recordType != "" {
		profileName, ok := RecordTypes[recordType]
		if !ok {
			return nil
		}
		return digests[profileName] // nil if not present, by design
	}

	meta, _ := comp["meta"].(map[string]any)
	profiles, _ := meta["profile"].([]any)

	names := make([]string, 0, len(digests))
	for name := range digests {
		names = append(names, name)
	}
	sort.Strings(names)
	for _, name := range names {
		d := digests[name]
		if d.ProfileName == "DocumentBundle" {
			continue
		}
		if profileListContains(profiles, d) {
			return d
		}
	}
	return nil
}

// profileListContains reports whether profiles (Composition.meta.profile,
// decoded) contains d's canonical URL, or a value that ends with "/"+
// ProfileName as a pragmatic fallback for a URL recorded under a different
// base.
func profileListContains(profiles []any, d *ProfileDigest) bool {
	for _, p := range profiles {
		ps, ok := p.(string)
		if !ok {
			continue
		}
		if ps == d.ProfileName {
			return true
		}
		if d.URL != "" && ps == d.URL {
			return true
		}
		if strings.HasSuffix(ps, "/"+d.ProfileName) {
			return true
		}
	}
	return false
}

// checkCompositionProfile checks that Composition.meta.profile declares d's
// canonical URL. This mirrors checkEnvelope's hiType-to-profile check but is
// keyed off the resolved digest rather than the RecordTypes table. When
// recordType was given, this can disagree with the meta.profile the digest
// was resolved from and is worth checking independently; when recordType
// was empty, the digest came from matching meta.profile in the first place
// (see resolveDigest), so this re-check is expected to always pass.
func checkCompositionProfile(comp map[string]any, d *ProfileDigest) []Finding {
	meta, _ := comp["meta"].(map[string]any)
	profiles, _ := meta["profile"].([]any)
	if profileListContains(profiles, d) {
		return nil
	}
	return []Finding{{
		Severity: "error",
		Location: "Bundle.entry[0].resource.meta.profile",
		Problem:  fmt.Sprintf("Composition.meta.profile does not include %s", d.URL),
		Why:      fmt.Sprintf("%s requires Composition.meta.profile to declare %s so the HIU's profile validation can match the bundle against it.", d.ProfileName, d.URL),
		Fix:      fmt.Sprintf("Set Composition.meta.profile to include %q.", d.URL),
		Ref:      d.ProfileName,
	}}
}

// checkCompositionRequired reports Composition elements that d's digest
// marks required (min >= 1) but that are absent or empty. Only paths of the
// form "Composition.<field>" (top-level, exactly two segments) are checked:
// tier 1 confirms the field is present, not that it satisfies min > 1 or a
// nested cardinality, which tier 2's full conformance run owns.
func checkCompositionRequired(comp map[string]any, d *ProfileDigest) []Finding {
	var findings []Finding
	for _, r := range d.Required {
		parts := strings.Split(r.Path, ".")
		if len(parts) != 2 || parts[0] != "Composition" {
			continue
		}
		key := parts[1]
		if v, ok := comp[key]; ok && !isEmptyValue(v) {
			continue
		}
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.entry[0].resource." + key,
			Problem:  fmt.Sprintf("%s is missing", r.Path),
			Why:      fmt.Sprintf("%s requires %s (min %d); a Composition without it fails NRCES profile validation.", d.ProfileName, r.Path, r.Min),
			Fix:      fmt.Sprintf("Add %s to the Composition.", r.Path),
			Ref:      d.ProfileName,
		})
	}
	return findings
}

// checkSections reports each of d's SectionRules with Min >= 1 whose slice
// name has no matching entry in Composition.section. A section "matches" a
// slice by title or code.text, case-insensitively: NRCES section slices are
// really discriminated by code, but title/code.text matching is tier 1's
// pragmatic proxy. Slices with Min 0, and any section present in the bundle
// that doesn't correspond to a known slice, are never flagged — tier 1 never
// errors on additions the profile might allow.
func checkSections(comp map[string]any, d *ProfileDigest) []Finding {
	var findings []Finding
	sections, _ := comp["section"].([]any)
	for _, rule := range d.Sections {
		if rule.Min < 1 {
			continue
		}
		if sectionPresent(sections, rule.Slice) {
			continue
		}
		findings = append(findings, Finding{
			Severity: "error",
			Location: "Bundle.entry[0].resource.section",
			Problem:  fmt.Sprintf("required section %q is missing", rule.Slice),
			Why:      fmt.Sprintf("%s requires the %s section (min %d). NRCES section slices are discriminated by code; tier 1 approximates that by matching a section's title or code.text against the slice name, case-insensitively.", d.ProfileName, rule.Slice, rule.Min),
			Fix:      fmt.Sprintf("Add a Composition.section entry whose title or code.text is %q.", rule.Slice),
			Ref:      d.ProfileName,
		})
	}
	return findings
}

// sectionPresent reports whether sections (Composition.section, decoded)
// contains an entry whose title or code.text case-insensitively equals
// slice.
func sectionPresent(sections []any, slice string) bool {
	for _, s := range sections {
		sm, ok := s.(map[string]any)
		if !ok {
			continue
		}
		if title, _ := sm["title"].(string); strings.EqualFold(title, slice) {
			return true
		}
		if code, ok := sm["code"].(map[string]any); ok {
			if text, _ := code["text"].(string); strings.EqualFold(text, slice) {
				return true
			}
		}
	}
	return false
}

// checkBundleFixed reports Bundle-root fields where d's digest fixes a
// value (e.g. Bundle.type = "document") but the bundle carries something
// else. Only handles top-level "Bundle.<field>" paths: the digest's only
// Fixed entries today are at that depth. The message format matches
// checkDocumentShape's hand-written Bundle.type check exactly, so the two
// collapse into one finding via dedupFindings when both fire.
func checkBundleFixed(m map[string]any, d *ProfileDigest) []Finding {
	var findings []Finding
	for _, r := range d.Fixed {
		parts := strings.Split(r.Path, ".")
		if len(parts) != 2 || parts[0] != "Bundle" {
			continue
		}
		key := parts[1]
		v, _ := m[key].(string)
		if v == r.Value {
			continue
		}
		findings = append(findings, Finding{
			Severity: "error",
			Location: r.Path,
			Problem:  fmt.Sprintf("%s is %q; %s must be %q", r.Path, v, key, r.Value),
			Why:      fmt.Sprintf("%s fixes %s to %q; the HIU's FHIR processor treats any other value as a different interaction and drops it.", d.ProfileName, r.Path, r.Value),
			Fix:      fmt.Sprintf("Set %s to %q.", r.Path, r.Value),
			Ref:      d.ProfileName,
		})
	}
	return findings
}

// checkBundleRequired reports Bundle-root elements where d's digest
// requires a value (min >= 1) that is absent or empty, at any depth (e.g.
// "Bundle.meta.versionId" walks m["meta"]["versionId"]). Its messages match
// checkDocumentShape's hand-written Bundle.identifier/.timestamp checks
// exactly for the fields both cover, so they collapse into one finding via
// dedupFindings; Bundle.meta and Bundle.meta.versionId are new checks
// Task 6 did not hand-write.
func checkBundleRequired(m map[string]any, d *ProfileDigest) []Finding {
	var findings []Finding
	for _, r := range d.Required {
		if !strings.HasPrefix(r.Path, "Bundle.") {
			continue
		}
		if elementExists(m, r.Path) {
			continue
		}
		findings = append(findings, Finding{
			Severity: "error",
			Location: r.Path,
			Problem:  fmt.Sprintf("%s is missing", r.Path),
			Why:      fmt.Sprintf("DocumentBundle requires %s (min %d); a bundle without it fails NRCES profile validation.", r.Path, r.Min),
			Fix:      fmt.Sprintf("Add %s.", r.Path),
			Ref:      d.ProfileName,
		})
	}
	return findings
}

// elementExists walks root along path's segments after the leading resource
// name (e.g. "Bundle.meta.versionId" walks root["meta"]["versionId"]) and
// reports whether a present, non-empty value is found at the end.
func elementExists(root map[string]any, path string) bool {
	parts := strings.Split(path, ".")
	if len(parts) < 2 {
		return false
	}
	var cur any = root
	for _, key := range parts[1:] {
		m, ok := cur.(map[string]any)
		if !ok {
			return false
		}
		v, ok := m[key]
		if !ok {
			return false
		}
		cur = v
	}
	return !isEmptyValue(cur)
}

// isEmptyValue reports whether a decoded JSON value counts as "absent" for
// a required-element check: nil, an empty string, or an empty array/object.
// A present false or 0 is not empty; those are meaningful values, not
// missing ones.
func isEmptyValue(v any) bool {
	switch t := v.(type) {
	case nil:
		return true
	case string:
		return t == ""
	case []any:
		return len(t) == 0
	case map[string]any:
		return len(t) == 0
	default:
		return false
	}
}
