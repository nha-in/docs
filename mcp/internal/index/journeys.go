package index

import (
	"fmt"
	"strings"

	"gopkg.in/yaml.v3"
)

// Step is what follows an operation in the journey it belongs to.
type Step struct {
	Journey string `json:"journey"`
	Next    string `json:"next"`
}

// unordered marks journeys that group calls rather than order them: a list
// of callbacks, master data or profile calls has no step after a step.
// ponytail: read from the title; give the journey files an explicit
// `ordered: false` when a title this list misses offers a wrong next step.
var unordered = []string{"callbacks", "master data", "manage", "bridge", "locker", "search", "profile", "details", "categories"}

// ParseJourneys reads journey files, each a list of journeys with their
// steps in order, and returns for every operation the one that follows it.
// An operation in two journeys keeps the first. The last step of a journey
// has no entry.
func ParseJourneys(files [][]byte) (map[string]Step, error) {
	out := map[string]Step{}
	for _, raw := range files {
		var journeys []struct {
			Title string `yaml:"title"`
			Steps []struct {
				Op string `yaml:"op"`
			} `yaml:"steps"`
		}
		if err := yaml.Unmarshal(raw, &journeys); err != nil {
			return nil, fmt.Errorf("journeys: %w", err)
		}
	journey:
		for _, j := range journeys {
			for _, word := range unordered {
				if strings.Contains(strings.ToLower(j.Title), word) {
					continue journey
				}
			}
			for i := 0; i+1 < len(j.Steps); i++ {
				if _, seen := out[j.Steps[i].Op]; !seen && j.Steps[i].Op != "" && j.Steps[i+1].Op != "" {
					out[j.Steps[i].Op] = Step{Journey: j.Title, Next: j.Steps[i+1].Op}
				}
			}
		}
	}
	return out, nil
}
