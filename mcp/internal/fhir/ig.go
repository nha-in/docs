// Package fhir loads the pinned NRCES implementation guide and validates
// document bundles against it. Tier 1 of the two-tier validation story:
// structural and ABDM-envelope checks here, full conformance via the
// official HL7 validator run in the integrator's own environment.
package fhir

import (
	"archive/tar"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"strings"
)

// RecordTypes maps the ABDM hiType wire name to the NRCES profile name.
var RecordTypes = map[string]string{
	"OPConsultation":      "OPConsultRecord",
	"Prescription":        "PrescriptionRecord",
	"DiagnosticReport":    "DiagnosticReportRecord",
	"DischargeSummary":    "DischargeSummaryRecord",
	"ImmunizationRecord":  "ImmunizationRecord",
	"HealthDocumentRecord": "HealthDocumentRecord",
	"WellnessRecord":      "WellnessRecord",
}

// IG is the loaded implementation guide package.
type IG struct {
	Version  string                     // from package/package.json
	Profiles map[string]json.RawMessage // profile name -> StructureDefinition JSON
	Examples map[string]json.RawMessage // file base name -> example resource JSON
}

func LoadIG(tgzPath string) (*IG, error) {
	f, err := os.Open(tgzPath)
	if err != nil {
		return nil, fmt.Errorf("open ig package: %w", err)
	}
	defer f.Close()
	gz, err := gzip.NewReader(f)
	if err != nil {
		return nil, fmt.Errorf("ig package is not gzip: %w", err)
	}
	defer gz.Close()

	ig := &IG{Profiles: map[string]json.RawMessage{}, Examples: map[string]json.RawMessage{}}
	tr := tar.NewReader(gz)
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read ig package: %w", err)
		}
		name := hdr.Name
		base := strings.TrimSuffix(path.Base(name), ".json")
		switch {
		case name == "package/package.json":
			var pkg struct {
				Version string `json:"version"`
			}
			b, err := io.ReadAll(tr)
			if err != nil {
				return nil, err
			}
			if err := json.Unmarshal(b, &pkg); err != nil {
				return nil, fmt.Errorf("parse package.json: %w", err)
			}
			ig.Version = pkg.Version
		case strings.HasPrefix(name, "package/example/") && strings.HasSuffix(name, ".json"):
			b, err := io.ReadAll(tr)
			if err != nil {
				return nil, err
			}
			ig.Examples[base] = b
		case strings.HasPrefix(name, "package/StructureDefinition-") && strings.HasSuffix(name, ".json"):
			b, err := io.ReadAll(tr)
			if err != nil {
				return nil, err
			}
			ig.Profiles[strings.TrimPrefix(base, "StructureDefinition-")] = b
		}
	}
	if ig.Version == "" {
		return nil, fmt.Errorf("ig package has no package/package.json")
	}
	return ig, nil
}
