package server

import (
	"context"
	"fmt"
	"strings"

	"github.com/eka-care/abdm-docs/mcp/internal/index"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// The tools answer a question an agent already knows how to ask. The skills
// answer the question before that: what the steps are, in what order, and
// how to tell when a step worked. They are registered two ways because MCP
// clients reach for them differently. A resource is addressable content the
// client fetches when it wants it; a prompt is something a person picks from
// a menu, which is the closest thing the protocol has to a skill that fires
// on its own.
//
// Both read the same rows, so a skill cannot say one thing on one surface
// and something else on the other.

// skillURI is the resource URI for one section. The router is the bare
// skill, and a section hangs off it, so the URIs read like the folder the
// skill is published as.
func skillURI(name, section string) string {
	if section == "" {
		return "skill://" + name
	}
	return "skill://" + name + "/" + section
}

// sectionLabel describes what a section is for. The compiler writes the
// same four section names for every module, so the descriptions belong here
// rather than repeated in each skill's frontmatter. A section the compiler
// starts emitting that is not listed here still registers, with a plainer
// description.
var sectionLabel = map[string]string{
	"":          "Start here. Routes to the section that fits the task",
	"scaffold":  "Builds the module flow by flow against the sandbox",
	"integrate": "The calls, hosts, headers and request bodies",
	"debug":     "From a failed call to a named fix, and every recorded error code",
	"test":      "The test matrix for the module",
	"generate":  "Builds conformant FHIR bundles",
	"audit":     "Checks bundles an existing FHIR store emits",
}

func describeSection(name, section string) string {
	if label, ok := sectionLabel[section]; ok {
		return fmt.Sprintf("%s: %s.", name, label)
	}
	return fmt.Sprintf("%s: the %s section.", name, section)
}

// addSkills registers every compiled skill in the snapshot as a resource per
// section and a prompt per skill. A snapshot built without a skills
// directory has no rows, so nothing is registered and the server offers
// tools alone, exactly as it did before.
func addSkills(s *mcp.Server, r *index.Reader) error {
	skills, err := r.ListSkills()
	if err != nil {
		return err
	}
	sections := map[string][]string{}
	descriptions := map[string]string{}

	for _, sk := range skills {
		sections[sk.Name] = append(sections[sk.Name], sk.Section)
		if sk.Section == "" {
			descriptions[sk.Name] = sk.Description
		}
		name, section := sk.Name, sk.Section
		s.AddResource(&mcp.Resource{
			URI:         skillURI(name, section),
			Name:        strings.TrimPrefix(skillURI(name, section), "skill://"),
			Description: describeSection(name, section),
			MIMEType:    "text/markdown",
		}, func(ctx context.Context, _ *mcp.ReadResourceRequest) (*mcp.ReadResourceResult, error) {
			// Read throughrather than closing over the body, so a
			// server handed a fresh snapshot serves the new text.
			got, err := r.GetSkill(name, section)
			if err != nil {
				return nil, err
			}
			return &mcp.ReadResourceResult{Contents: []*mcp.ResourceContents{{
				URI:      skillURI(name, section),
				MIMEType: "text/markdown",
				Text:     withVersion(got.Body, r),
			}}}, nil
		})
	}

	for name, secs := range sections {
		name, secs := name, secs
		s.AddPrompt(&mcp.Prompt{
			Name:        name,
			Description: descriptions[name],
			Arguments: []*mcp.PromptArgument{{
				Name: "section",
				Description: fmt.Sprintf(
					"Which part to load: %s. Omit for the router, which says which one to read.",
					strings.Join(namedSections(secs), ", ")),
			}},
		}, func(ctx context.Context, req *mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
			section := ""
			if req.Params != nil {
				section = req.Params.Arguments["section"]
			}
			got, err := r.GetSkill(name, section)
			if err != nil {
				return nil, fmt.Errorf("%w (sections: %s)", err,
					strings.Join(namedSections(secs), ", "))
			}
			return &mcp.GetPromptResult{
				Description: describeSection(name, section),
				Messages: []*mcp.PromptMessage{{
					Role:    "user",
					Content: &mcp.TextContent{Text: withVersion(got.Body, r)},
				}},
			}, nil
		})
	}
	return nil
}

// namedSections drops the router's empty section from a list meant to be
// read by a person choosing one.
func namedSections(secs []string) []string {
	var out []string
	for _, s := range secs {
		if s != "" {
			out = append(out, s)
		}
	}
	return out
}

// withVersion stamps the catalogue version onto skill text the same way
// every tool response carries it. A skill is a snapshot of a moving
// catalogue, so a reader that cannot tell which version it holds cannot tell
// whether it is stale.
func withVersion(body string, r *index.Reader) string {
	return body + fmt.Sprintf("\n\n---\ncatalogue_version: %s\n", r.CatalogueVersion())
}
