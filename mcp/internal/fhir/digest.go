package fhir

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

// SectionRule constrains one Composition.section slice.
type SectionRule struct {
	Slice string `json:"slice"` // e.g. "ChiefComplaints"
	Min   int    `json:"min"`
	Max   string `json:"max"` // "1" or "*"
}

// ElementRule constrains one required snapshot element.
type ElementRule struct {
	Path string `json:"path"` // e.g. "Composition.subject"
	Min  int    `json:"min"`
	Max  string `json:"max"`
	// OptionalParent names the nearest ancestor whose own min is 0, when
	// there is one. A min of 1 binds WITHIN its parent, so an element whose
	// parent is optional is a conditional requirement and not something to
	// emit unconditionally. NRCES's own example carries neither an attester
	// nor a relatesTo, while Composition.attester.mode and
	// Composition.relatesTo.code are both min 1 inside those optional
	// parents. A generator that reads this list as "always emit" produces an
	// attester with no party, which is worse than omitting it, because it is
	// then structurally present and semantically empty.
	OptionalParent string `json:"optional_parent,omitempty"`
}

// FixedRule records a fixedCode / fixedUri / patternCode constraint.
type FixedRule struct {
	Path  string `json:"path"`  // e.g. "Bundle.type"
	Value string `json:"value"` // e.g. "document"
}

// ProfileDigest is the extracted shape of one NRCES profile, sufficient for
// structural validation without re-parsing the full StructureDefinition.
type ProfileDigest struct {
	RecordType  string        `json:"record_type"`  // hiType wire name; "" for DocumentBundle
	ProfileName string        `json:"profile_name"` // e.g. "OPConsultRecord"
	URL         string        `json:"url"`          // canonical profile URL
	Title       string        `json:"title"`
	Description string        `json:"description"`
	Required    []ElementRule `json:"required"` // snapshot elements with min >= 1, top two levels only
	Sections    []SectionRule `json:"sections"` // Composition.section slices (empty for DocumentBundle)
	Fixed       []FixedRule   `json:"fixed"`    // fixedCode / fixedUri / patternCode values
}

// sdElement is the minimal subset of a FHIR ElementDefinition needed to
// build a digest.
type sdElement struct {
	ID          string `json:"id"`
	Min         *int   `json:"min"`
	Max         string `json:"max"`
	FixedCode   string `json:"fixedCode"`
	FixedUri    string `json:"fixedUri"`
	PatternCode string `json:"patternCode"`
}

// structureDefinition is the minimal subset of a FHIR StructureDefinition
// needed to build a digest.
type structureDefinition struct {
	URL         string `json:"url"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	Snapshot    struct {
		Element []sdElement `json:"element"`
	} `json:"snapshot"`
	Differential struct {
		Element []sdElement `json:"element"`
	} `json:"differential"`
}

const sectionPrefix = "Composition.section:"

// Digest extracts one profile's digest. profileName is the NRCES name
// ("OPConsultRecord"); recordType is the hiType or "" for DocumentBundle.
func Digest(ig *IG, profileName, recordType string) (*ProfileDigest, error) {
	raw, ok := ig.Profiles[profileName]
	if !ok {
		return nil, fmt.Errorf("profile %s not found in IG", profileName)
	}
	var sd structureDefinition
	if err := json.Unmarshal(raw, &sd); err != nil {
		return nil, fmt.Errorf("parse StructureDefinition %s: %w", profileName, err)
	}

	// DocumentBundle's snapshot buries its handful of constraints in
	// hundreds of inherited Bundle base elements; its differential is
	// exactly the constraint set, so prefer it. Otherwise use the
	// snapshot, falling back to the differential if it is absent.
	elements := sd.Snapshot.Element
	if profileName == "DocumentBundle" || len(elements) == 0 {
		if len(sd.Differential.Element) > 0 {
			elements = sd.Differential.Element
		}
	}

	// Every element's own min, by id, so a required element can name the
	// nearest ancestor that is itself optional. Built before the pass below
	// because an ancestor can appear after its child in a differential.
	minByID := make(map[string]int, len(elements))
	for _, e := range elements {
		if e.Min != nil {
			minByID[e.ID] = *e.Min
		}
	}

	digest := &ProfileDigest{
		RecordType:  recordType,
		ProfileName: profileName,
		URL:         sd.URL,
		Title:       sd.Title,
		Description: sd.Description,
		Required:    []ElementRule{},
		Sections:    []SectionRule{},
		Fixed:       []FixedRule{},
	}

	for _, e := range elements {
		if slice, ok := sectionSlice(e.ID); ok {
			min := 0
			if e.Min != nil {
				min = *e.Min
			}
			digest.Sections = append(digest.Sections, SectionRule{
				Slice: slice,
				Min:   min,
				Max:   e.Max,
			})
			continue
		}

		if strings.Contains(e.ID, ":") {
			// Part of some other slice (or a nested path within a
			// section slice); not a top-level element.
			continue
		}

		topTwoLevels := strings.Count(e.ID, ".") <= 2

		// Fixed values are recorded at any depth. The two-level cut that
		// applies to Required would drop every one that matters: NRCES
		// fixes the SNOMED code typing a Composition at
		// Composition.type.coding.code, three levels down, so digests
		// reported no fixed values at all and validate_fhir could not
		// check the one code every document Composition must carry.
		if fixed, val := fixedValue(e); fixed {
			digest.Fixed = append(digest.Fixed, FixedRule{Path: e.ID, Value: val})
		}

		if e.Min != nil && *e.Min >= 1 && topTwoLevels {
			digest.Required = append(digest.Required, ElementRule{
				Path:           e.ID,
				Min:            *e.Min,
				Max:            e.Max,
				OptionalParent: optionalAncestor(e.ID, minByID),
			})
		}
	}

	return digest, nil
}

// sectionSlice reports whether id is exactly "Composition.section:<Slice>"
// (one colon, nothing after the slice name) and returns the slice name.
func sectionSlice(id string) (string, bool) {
	if !strings.HasPrefix(id, sectionPrefix) {
		return "", false
	}
	rest := id[len(sectionPrefix):]
	if rest == "" || strings.ContainsAny(rest, ".:") {
		return "", false
	}
	return rest, true
}

// optionalAncestor returns the nearest ancestor of id whose min is 0, or ""
// when every ancestor is itself required. It walks up one path segment at a
// time, so Composition.attester.mode resolves through Composition.attester.
func optionalAncestor(id string, minByID map[string]int) string {
	parts := strings.Split(id, ".")
	for i := len(parts) - 1; i > 1; i-- {
		ancestor := strings.Join(parts[:i], ".")
		if min, ok := minByID[ancestor]; ok && min == 0 {
			return ancestor
		}
	}
	return ""
}

// fixedValue reports whether e carries a fixedCode, fixedUri or
// patternCode, and returns whichever is set.
func fixedValue(e sdElement) (bool, string) {
	switch {
	case e.FixedCode != "":
		return true, e.FixedCode
	case e.FixedUri != "":
		return true, e.FixedUri
	case e.PatternCode != "":
		return true, e.PatternCode
	default:
		return false, ""
	}
}

// AllDigests returns the seven record type digests plus the DocumentBundle
// digest (RecordType ""), erroring if any profile is missing from the IG.
func AllDigests(ig *IG) ([]*ProfileDigest, error) {
	digests := make([]*ProfileDigest, 0, len(RecordTypes)+1)
	for hiType, profileName := range RecordTypes {
		d, err := Digest(ig, profileName, hiType)
		if err != nil {
			return nil, err
		}
		digests = append(digests, d)
	}
	d, err := Digest(ig, "DocumentBundle", "")
	if err != nil {
		return nil, err
	}
	digests = append(digests, d)

	sort.Slice(digests, func(i, j int) bool {
		return digests[i].ProfileName < digests[j].ProfileName
	})
	return digests, nil
}
