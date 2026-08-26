package catalogue

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"sort"
	"strings"

	"github.com/getkin/kin-openapi/openapi3"
)

type Operation struct {
	OperationID       string
	Method            string
	Path              string
	Summary           string
	Tag               string
	Module            string
	SpecJSON          []byte
	RequestSchemaJSON []byte
	RequiredParams    []string
}

// SpecErrorCode is one row of a specification's top-level x-abdm-errors
// table: the code as the gateway returns it, the recorded message and the
// recommended action, attributed to the module whose spec carries it.
type SpecErrorCode struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Action  string `json:"action"`
	Module  string `json:"module"`
}

// SpecData is everything the indexer ingests from one OpenAPI file.
type SpecData struct {
	Module     string
	Operations []Operation
	ErrorCodes []SpecErrorCode
}

// NormalizeErrorCode trims the noise real gateway responses attach to a
// code, such as a trailing colon and space ("ABDM-1016: "), and upper-cases
// it so lookups match the spec tables exactly.
func NormalizeErrorCode(s string) string {
	return strings.ToUpper(strings.TrimRight(strings.TrimSpace(s), ": \t"))
}

// specModule reads info.x-portal.module, falling back to the filename stem.
func specModule(specPath string, doc *openapi3.T) string {
	if doc.Info != nil {
		if raw, ok := doc.Info.Extensions["x-portal"]; ok {
			var portal struct {
				Module string `json:"module"`
			}
			if b, err := json.Marshal(raw); err == nil {
				if json.Unmarshal(b, &portal) == nil && portal.Module != "" {
					return portal.Module
				}
			}
		}
	}
	base := filepath.Base(specPath)
	return strings.TrimSuffix(base, filepath.Ext(base))
}

// specErrorCodes reads the top-level x-abdm-errors table. A missing or
// empty table is not an error; some specs record their codes elsewhere.
func specErrorCodes(specPath, module string, doc *openapi3.T) ([]SpecErrorCode, error) {
	raw, ok := doc.Extensions["x-abdm-errors"]
	if !ok {
		return nil, nil
	}
	b, err := json.Marshal(raw)
	if err != nil {
		return nil, fmt.Errorf("%s: x-abdm-errors: %w", specPath, err)
	}
	var table struct {
		Codes []struct {
			Code    string `json:"code"`
			Message string `json:"message"`
			Action  string `json:"action"`
		} `json:"codes"`
	}
	if err := json.Unmarshal(b, &table); err != nil {
		return nil, fmt.Errorf("%s: x-abdm-errors: %w", specPath, err)
	}
	var out []SpecErrorCode
	for _, c := range table.Codes {
		code := NormalizeErrorCode(c.Code)
		if code == "" {
			continue
		}
		out = append(out, SpecErrorCode{
			Code: code, Message: c.Message, Action: c.Action, Module: module,
		})
	}
	return out, nil
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

// ParseOperations keeps the operations-only view of ParseSpec.
func ParseOperations(specPath string) ([]Operation, error) {
	data, err := ParseSpec(specPath)
	if err != nil {
		return nil, err
	}
	return data.Operations, nil
}

func ParseSpec(specPath string) (SpecData, error) {
	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = false
	doc, err := loader.LoadFromFile(specPath)
	if err != nil {
		return SpecData{}, fmt.Errorf("%s: %w", specPath, err)
	}
	module := specModule(specPath, doc)
	errCodes, err := specErrorCodes(specPath, module, doc)
	if err != nil {
		return SpecData{}, err
	}
	var ops []Operation
	for path, item := range doc.Paths.Map() {
		for method, op := range item.Operations() {
			if op.OperationID == "" {
				return SpecData{}, fmt.Errorf("%s: %s %s has no operationId; record a correction per openapi-ingest", specPath, method, path)
			}
			frag, err := json.Marshal(op)
			if err != nil {
				return SpecData{}, fmt.Errorf("%s: marshal %s: %w", specPath, op.OperationID, err)
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
						return SpecData{}, fmt.Errorf("%s: request schema %s: %w", specPath, op.OperationID, err)
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
				Module:            module,
				SpecJSON:          frag,
				RequestSchemaJSON: reqSchema,
				RequiredParams:    required,
			})
		}
	}
	sort.Slice(ops, func(i, j int) bool { return ops[i].OperationID < ops[j].OperationID })
	return SpecData{Module: module, Operations: ops, ErrorCodes: errCodes}, nil
}
