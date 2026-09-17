package catalogue

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"

	"github.com/getkin/kin-openapi/openapi3"
	"gopkg.in/yaml.v3"
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

// SpecErrorCode is one error code found in a specification's 4xx/5xx
// response examples: the code as the gateway returns it, the recorded
// message, the HTTP status and the operationId that returned it, and the
// module whose spec carries it.
type SpecErrorCode struct {
	Code        string `json:"code"`
	Message     string `json:"message"`
	HTTP        string `json:"http"`
	OperationID string `json:"operation_id"`
	Module      string `json:"module"`
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

// errorCodeRe matches a code as ABDM returns it, either "ABDM-1234" style
// or a bare numeric HTTP-adjacent code. Mirrors scripts/lib/spec-errors.mjs.
var errorCodeRe = regexp.MustCompile(`^[A-Z]{2,5}-\d{3,5}$|^\d{3,6}$`)

// errMethods is every HTTP method an operation can be keyed under, in the
// order scripts/lib/spec-errors.mjs checks them.
var errMethods = []string{"get", "post", "put", "patch", "delete"}

// codesIn recursively yields every {code, message} pair value holds, the
// same walk scripts/lib/spec-errors.mjs's codesIn performs: an object
// matching the shape is yielded, and every value (including that object's
// own) is still walked, because a real example nests the pair inside a
// wrapper such as {"error": {...}}.
func codesIn(value any) []SpecErrorCode {
	var out []SpecErrorCode
	switch v := value.(type) {
	case []any:
		for _, e := range v {
			out = append(out, codesIn(e)...)
		}
	case map[string]any:
		if code, ok := v["code"].(string); ok && errorCodeRe.MatchString(code) {
			if msg, ok := v["message"].(string); ok {
				out = append(out, SpecErrorCode{Code: code, Message: msg})
			}
		}
		for _, key := range sortedKeys(v) {
			out = append(out, codesIn(v[key])...)
		}
	}
	return out
}

func sortedKeys(m map[string]any) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

var errStatusRe = regexp.MustCompile(`^[45]`)

// specErrorCodes walks every paths and webhooks operation's 4xx/5xx
// responses and yields the error codes their JSON examples carry. No code
// is invented: it is here only because an example returns it. The first
// occurrence of a code wins, matching scripts/lib/spec-errors.mjs, which
// this must produce identical results to. Read straight from the parsed
// YAML rather than the openapi3.T doc, because kin-openapi does not expose
// webhooks.
func specErrorCodes(specPath, module string, raw []byte) ([]SpecErrorCode, error) {
	var doc map[string]any
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("%s: %w", specPath, err)
	}
	seen := map[string]bool{}
	var out []SpecErrorCode
	for _, blockKey := range []string{"paths", "webhooks"} {
		block, _ := doc[blockKey].(map[string]any)
		for _, pathKey := range sortedKeys(block) {
			item, _ := block[pathKey].(map[string]any)
			for _, method := range errMethods {
				op, ok := item[method].(map[string]any)
				if !ok {
					continue
				}
				operationID, _ := op["operationId"].(string)
				responses, _ := op["responses"].(map[string]any)
				for _, status := range sortedKeys(responses) {
					if !errStatusRe.MatchString(status) {
						continue
					}
					response, _ := responses[status].(map[string]any)
					content, _ := response["content"].(map[string]any)
					media, _ := content["application/json"].(map[string]any)
					var samples []any
					if example, ok := media["example"]; ok {
						samples = append(samples, example)
					}
					examples, _ := media["examples"].(map[string]any)
					for _, exKey := range sortedKeys(examples) {
						entry, _ := examples[exKey].(map[string]any)
						samples = append(samples, entry["value"])
					}
					for _, sample := range samples {
						for _, found := range codesIn(sample) {
							if seen[found.Code] {
								continue
							}
							seen[found.Code] = true
							out = append(out, SpecErrorCode{
								Code: found.Code, Message: found.Message,
								HTTP: status, OperationID: operationID, Module: module,
							})
						}
					}
				}
			}
		}
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

// inlineOperationRefs clears every $ref marker reachable from one operation,
// so marshalling it yields a self-contained document. inlineRefs above covers
// schemas only, and a schema is not the only thing an operation reaches by
// reference: NHA's specifications put the shared REQUEST-ID, TIMESTAMP and
// X-CM-ID headers in components/parameters and point at them. Until this ran,
// the blob get_operation returns carried pointers into a components section
// the caller never receives, so an agent reading it saw
// `#/components/parameters/RequestId` and had no way to resolve it.
func inlineOperationRefs(op *openapi3.Operation) {
	if op == nil {
		return
	}
	for _, p := range op.Parameters {
		inlineParameterRef(p)
	}
	if op.RequestBody != nil {
		op.RequestBody.Ref = ""
		if op.RequestBody.Value != nil {
			inlineContentRefs(op.RequestBody.Value.Content)
		}
	}
	if op.Responses == nil {
		return
	}
	for _, r := range op.Responses.Map() {
		if r == nil {
			continue
		}
		r.Ref = ""
		if r.Value == nil {
			continue
		}
		inlineContentRefs(r.Value.Content)
		for _, h := range r.Value.Headers {
			if h == nil {
				continue
			}
			h.Ref = ""
			if h.Value != nil {
				inlineParameterRef(&openapi3.ParameterRef{Value: &h.Value.Parameter})
			}
		}
	}
}

func inlineParameterRef(p *openapi3.ParameterRef) {
	if p == nil {
		return
	}
	p.Ref = ""
	if p.Value == nil {
		return
	}
	inlineRefs(p.Value.Schema, 0)
	inlineContentRefs(p.Value.Content)
}

func inlineContentRefs(content openapi3.Content) {
	for _, media := range content {
		if media == nil {
			continue
		}
		inlineRefs(media.Schema, 0)
		for _, ex := range media.Examples {
			if ex != nil {
				ex.Ref = ""
			}
		}
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
	raw, err := os.ReadFile(specPath)
	if err != nil {
		return SpecData{}, err
	}
	errCodes, err := specErrorCodes(specPath, module, raw)
	if err != nil {
		return SpecData{}, err
	}
	var ops []Operation
	for path, item := range doc.Paths.Map() {
		for method, op := range item.Operations() {
			if op.OperationID == "" {
				return SpecData{}, fmt.Errorf("%s: %s %s has no operationId; record a correction per openapi-ingest", specPath, method, path)
			}
			// Inline before marshalling, not after: SpecJSON is what
			// get_operation hands back, and a caller holding it has no
			// components section to resolve a $ref against.
			inlineOperationRefs(op)
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
					// Already inlined by inlineOperationRefs above.
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
