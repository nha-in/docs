package catalogue

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
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

// codesIn recursively yields every {code, message} pair a YAML node holds,
// the same walk scripts/lib/spec-errors.mjs's codesIn performs: an object
// matching the shape is yielded, and every value (including that object's
// own) is still walked, because a real example nests the pair inside a
// wrapper such as {"error": {...}}. Only string scalars count, as the Node
// side checks typeof === 'string'.
func codesIn(n *yaml.Node) []SpecErrorCode {
	n = deref(n)
	if n == nil {
		return nil
	}
	var out []SpecErrorCode
	switch n.Kind {
	case yaml.SequenceNode:
		for _, e := range n.Content {
			out = append(out, codesIn(e)...)
		}
	case yaml.MappingNode:
		code, msg := stringScalar(mapGet(n, "code")), stringScalar(mapGet(n, "message"))
		if code != nil && errorCodeRe.MatchString(code.Value) && msg != nil {
			out = append(out, SpecErrorCode{Code: code.Value, Message: msg.Value})
		}
		for _, kv := range jsEntries(n) {
			out = append(out, codesIn(kv[1])...)
		}
	}
	return out
}

// deref follows aliases and unwraps the document node, as a YAML parse into
// plain JS values does.
func deref(n *yaml.Node) *yaml.Node {
	for n != nil && (n.Kind == yaml.AliasNode || n.Kind == yaml.DocumentNode) {
		if n.Kind == yaml.AliasNode {
			n = n.Alias
		} else if len(n.Content) > 0 {
			n = n.Content[0]
		} else {
			return nil
		}
	}
	return n
}

func stringScalar(n *yaml.Node) *yaml.Node {
	if n = deref(n); n != nil && n.Kind == yaml.ScalarNode && n.ShortTag() == "!!str" {
		return n
	}
	return nil
}

// mapGet returns the value under key in a mapping node, or nil. The last
// duplicate wins, as it does in a JS object.
func mapGet(n *yaml.Node, key string) *yaml.Node {
	if n = deref(n); n == nil || n.Kind != yaml.MappingNode {
		return nil
	}
	var v *yaml.Node
	for i := 0; i+1 < len(n.Content); i += 2 {
		if n.Content[i].Value == key {
			v = n.Content[i+1]
		}
	}
	return v
}

// jsIndexKeyRe matches the keys a JS object enumerates before all others:
// canonical non-negative integers ("0", "400"), in ascending numeric order.
var jsIndexKeyRe = regexp.MustCompile(`^(?:0|[1-9]\d{0,8})$`)

// jsEntries lists a mapping's key/value pairs in the order Object.entries
// yields them for the parsed object: integer-like keys ascending, then every
// other key in document order. This is why response statuses walk 400, 401,
// 500 whatever order the file writes them in.
func jsEntries(n *yaml.Node) [][2]*yaml.Node {
	if n = deref(n); n == nil || n.Kind != yaml.MappingNode {
		return nil
	}
	var ints, rest [][2]*yaml.Node
	for i := 0; i+1 < len(n.Content); i += 2 {
		kv := [2]*yaml.Node{n.Content[i], n.Content[i+1]}
		if jsIndexKeyRe.MatchString(kv[0].Value) {
			ints = append(ints, kv)
		} else {
			rest = append(rest, kv)
		}
	}
	sort.SliceStable(ints, func(a, b int) bool {
		x, _ := strconv.Atoi(ints[a][0].Value)
		y, _ := strconv.Atoi(ints[b][0].Value)
		return x < y
	})
	return append(ints, rest...)
}

var errStatusRe = regexp.MustCompile(`^[45]`)

// specErrorCodes walks every paths and webhooks operation's 4xx/5xx
// responses and yields the error codes their JSON examples carry. No code
// is invented: it is here only because an example returns it. The first
// occurrence of a code wins, matching scripts/lib/spec-errors.mjs, which
// this must produce identical results to, so the walk follows the key order
// that JS sees rather than a sorted one. Read straight from the YAML node
// tree rather than the openapi3.T doc, because kin-openapi does not expose
// webhooks and Go maps lose document order.
func specErrorCodes(specPath, module string, raw []byte) ([]SpecErrorCode, error) {
	var doc yaml.Node
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("%s: %w", specPath, err)
	}
	seen := map[string]bool{}
	var out []SpecErrorCode
	for _, blockKey := range []string{"paths", "webhooks"} {
		for _, pathKV := range jsEntries(mapGet(&doc, blockKey)) {
			for _, method := range errMethods {
				op := mapGet(pathKV[1], method)
				if deref(op) == nil {
					continue
				}
				operationID := ""
				if id := stringScalar(mapGet(op, "operationId")); id != nil {
					operationID = id.Value
				}
				for _, statusKV := range jsEntries(mapGet(op, "responses")) {
					status := statusKV[0].Value
					if !errStatusRe.MatchString(status) {
						continue
					}
					media := mapGet(mapGet(statusKV[1], "content"), "application/json")
					samples := []*yaml.Node{mapGet(media, "example")}
					for _, exKV := range jsEntries(mapGet(media, "examples")) {
						samples = append(samples, mapGet(exKV[1], "value"))
					}
					for _, sample := range samples {
						for _, found := range codesIn(sample) {
							if seen[found.Code] {
								continue
							}
							seen[found.Code] = true
							out = append(out, SpecErrorCode{
								Code: found.Code, Message: strings.TrimSpace(found.Message),
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
