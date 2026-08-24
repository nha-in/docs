package catalogue

import (
	"encoding/json"
	"fmt"
	"sort"

	"github.com/getkin/kin-openapi/openapi3"
)

type Operation struct {
	OperationID       string
	Method            string
	Path              string
	Summary           string
	Tag               string
	SpecJSON          []byte
	RequestSchemaJSON []byte
	RequiredParams    []string
}

// inlineRefs clears $ref markers recursively (depth-capped against
// cycles) so the schema marshals with component contents inlined and can
// be validated standalone at query time.
func inlineRefs(ref *openapi3.SchemaRef, depth int) {
	if ref == nil || depth > 10 {
		return
	}
	ref.Ref = ""
	s := ref.Value
	if s == nil {
		return
	}
	for _, p := range s.Properties {
		inlineRefs(p, depth+1)
	}
	inlineRefs(s.Items, depth+1)
	for _, sub := range s.AllOf {
		inlineRefs(sub, depth+1)
	}
	for _, sub := range s.AnyOf {
		inlineRefs(sub, depth+1)
	}
	for _, sub := range s.OneOf {
		inlineRefs(sub, depth+1)
	}
	if s.AdditionalProperties.Schema != nil {
		inlineRefs(s.AdditionalProperties.Schema, depth+1)
	}
}

func ParseOperations(specPath string) ([]Operation, error) {
	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = false
	doc, err := loader.LoadFromFile(specPath)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", specPath, err)
	}
	var ops []Operation
	for path, item := range doc.Paths.Map() {
		for method, op := range item.Operations() {
			if op.OperationID == "" {
				return nil, fmt.Errorf("%s: %s %s has no operationId; record a correction per openapi-ingest", specPath, method, path)
			}
			frag, err := json.Marshal(op)
			if err != nil {
				return nil, fmt.Errorf("%s: marshal %s: %w", specPath, op.OperationID, err)
			}
			tag := ""
			if len(op.Tags) > 0 {
				tag = op.Tags[0]
			}
			var reqSchema []byte
			if op.RequestBody != nil && op.RequestBody.Value != nil {
				if media := op.RequestBody.Value.Content.Get("application/json"); media != nil && media.Schema != nil {
					inlineRefs(media.Schema, 0)
					reqSchema, err = json.Marshal(media.Schema)
					if err != nil {
						return nil, fmt.Errorf("%s: request schema %s: %w", specPath, op.OperationID, err)
					}
				}
			}
			// Merge path-item parameters with operation parameters.
			// Start with item parameters, let operation parameters override by (name, in).
			paramMap := make(map[string]*openapi3.ParameterRef)

			// Add item-level parameters
			for _, p := range item.Parameters {
				if p.Value != nil {
					key := fmt.Sprintf("%s:%s", p.Value.Name, p.Value.In)
					paramMap[key] = p
				}
			}

			// Override with operation-level parameters
			for _, p := range op.Parameters {
				if p.Value != nil {
					key := fmt.Sprintf("%s:%s", p.Value.Name, p.Value.In)
					paramMap[key] = p
				}
			}

			// Collect required parameters
			var required []string
			for _, p := range paramMap {
				if p.Value != nil && p.Value.Required {
					required = append(required, fmt.Sprintf("%s (%s)", p.Value.Name, p.Value.In))
				}
			}
			sort.Strings(required)
			ops = append(ops, Operation{
				OperationID:       op.OperationID,
				Method:            method,
				Path:              path,
				Summary:           op.Summary,
				Tag:               tag,
				SpecJSON:          frag,
				RequestSchemaJSON: reqSchema,
				RequiredParams:    required,
			})
		}
	}
	sort.Slice(ops, func(i, j int) bool { return ops[i].OperationID < ops[j].OperationID })
	return ops, nil
}
