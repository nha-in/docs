package fhir

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

// profileToRecordType is the inverse of RecordTypes: NRCES profile name ->
// ABDM hiType wire name.
var profileToRecordType = func() map[string]string {
	m := make(map[string]string, len(RecordTypes))
	for hiType, profileName := range RecordTypes {
		m[profileName] = hiType
	}
	return m
}()

// resourceTypeOnly decodes just the "resourceType" field. It has no other
// fields, so it cannot type-conflict with any example's shape (a Claim's
// object-valued "type" field, say); a decode error here means the JSON
// itself is malformed, not merely a different resource shape.
type resourceTypeOnly struct {
	ResourceType string `json:"resourceType"`
}

// exampleBundle is the minimal shape needed to classify a Bundle-*.json
// example once it is known to be a Bundle: its Bundle.type, and its first
// entry's resource type and profile.
type exampleBundle struct {
	Type  string `json:"type"`
	Entry []struct {
		Resource struct {
			ResourceType string `json:"resourceType"`
			Meta         struct {
				Profile []string `json:"profile"`
			} `json:"meta"`
		} `json:"resource"`
	} `json:"entry"`
}

// GoldenExamples selects one example document bundle per record type
// present in the IG's examples. The IG names example files by content, not
// by record type, so each example is parsed and classified: a candidate is
// a "document" type Bundle whose first entry is a Composition carrying one
// of the seven record profiles in meta.profile. Where multiple candidates
// exist for a record type, the lexically first file name wins, for
// determinism.
//
// The example directory holds every kind of example resource, not just
// Bundles (individual Claim, Patient, etc. examples live alongside them),
// and some of those (Claim's object-valued "type", for one) would
// type-conflict with exampleBundle's string Type field. Decoding happens in
// two stages so that distinction — "not a Bundle" vs. "malformed JSON" —
// isn't lost: first decode only resourceType (a shape that can't conflict
// with anything), skip non-Bundle examples, then decode the fuller shape
// for Bundles only. A decode error at either stage fails the build loudly,
// matching the indexer's fail-loud rules; silently dropping a corrupted
// Bundle example would defeat that.
func GoldenExamples(ig *IG) (map[string][]byte, error) {
	names := make([]string, 0, len(ig.Examples))
	for name := range ig.Examples {
		names = append(names, name)
	}
	sort.Strings(names)

	result := map[string][]byte{}
	for _, name := range names {
		raw := ig.Examples[name]

		var rt resourceTypeOnly
		if err := json.Unmarshal(raw, &rt); err != nil {
			return nil, fmt.Errorf("parse example %s: %w", name, err)
		}
		if rt.ResourceType != "Bundle" {
			continue
		}

		var b exampleBundle
		if err := json.Unmarshal(raw, &b); err != nil {
			return nil, fmt.Errorf("parse example %s: %w", name, err)
		}
		if b.Type != "document" || len(b.Entry) == 0 {
			continue
		}
		first := b.Entry[0].Resource
		if first.ResourceType != "Composition" {
			continue
		}
		recordType, ok := recordTypeForProfiles(first.Meta.Profile)
		if !ok {
			continue
		}
		if _, exists := result[recordType]; exists {
			// Already have the lexically first candidate for this record
			// type; names is sorted, so keep it.
			continue
		}
		result[recordType] = raw
	}
	return result, nil
}

// recordTypeForProfiles reports the ABDM record type for the first profile
// URL in profiles that ends with one of the seven record profile names.
func recordTypeForProfiles(profiles []string) (string, bool) {
	for _, p := range profiles {
		for profileName, recordType := range profileToRecordType {
			if strings.HasSuffix(p, "/"+profileName) || p == profileName {
				return recordType, true
			}
		}
	}
	return "", false
}
