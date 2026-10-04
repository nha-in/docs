package catalogue

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"slices"
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
	// What an operation chunk is built from: the gateway its specification
	// sits under, every parameter name, the documented response codes, and
	// the error codes its response examples return.
	Gateway       string
	Params        []string
	ResponseCodes []string
	ErrorCodes    []string
	// Callback marks an operation from the spec's webhooks: a call ABDM makes
	// to your bridge, at Path relative to your callback URL, rather than one
	// you make.
	Callback bool
}

// ChunkOperation is an operation as one flat search chunk: method and path,
// summary, then parameter names, response codes and error codes. No example
// payloads and no nested schemas: raw schema JSON is noise to an embedder,
// flattened field names are signal.
func ChunkOperation(op Operation) Chunk {
	var b strings.Builder
	b.WriteString(op.Gateway + " > operation > " + strings.ToUpper(op.Method) + " " + op.Path)
	if s := strings.TrimSpace(op.Summary); s != "" {
		b.WriteString("\n" + s)
	}
	for _, f := range []struct {
		label string
		vals  []string
	}{{"parameters", op.Params}, {"responses", op.ResponseCodes}, {"errors", op.ErrorCodes}} {
		if len(f.vals) > 0 {
			b.WriteString("\n" + f.label + ": " + strings.Join(f.vals, ", "))
		}
	}
	return Chunk{AtomID: op.OperationID, Heading: "operation", Text: b.String(), Kind: "operation"}
}

// specGateway is the gateway a specification belongs to: the folder holding
// its openapi/ (catalogue/hiecm/openapi/v3/...), or, where a gateway's specs
// have not moved yet, the folder under openapi/ (catalogue/openapi/nhcx/v1/...).
func specGateway(specPath string) string {
	parts := strings.Split(filepath.ToSlash(specPath), "/")
	for i := len(parts) - 2; i >= 0; i-- {
		if parts[i] != "openapi" {
			continue
		}
		if i > 0 && gatewayNames[parts[i-1]] {
			return parts[i-1]
		}
		return parts[i+1]
	}
	return ""
}

var gatewayNames = map[string]bool{"hiecm": true, "nhcx": true, "uhi": true, "shared": true}

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
	// NHA's own list for the module, from errors/<module>.yaml beside the
	// specifications, follows in NHA's order. It names no HTTP status and no
	// call. A row an example already carries, by code and message, is not
	// repeated. Same rule as scripts/lib/spec-errors.mjs.
	listed, err := listedErrorCodes(filepath.Join(filepath.Dir(specPath), "errors", module+".yaml"), module)
	if err != nil {
		return nil, err
	}
	have := map[string]bool{}
	for _, e := range out {
		have[e.Code+"|"+e.Message] = true
	}
	for _, e := range listed {
		key := e.Code + "|" + e.Message
		if have[key] {
			continue
		}
		have[key] = true
		out = append(out, e)
	}
	return out, nil
}

// listedErrorCodes reads one errors/<module>.yaml, the code list NHA supplied
// for a module without tying the codes to calls. A missing file is no list.
func listedErrorCodes(path, module string) ([]SpecErrorCode, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}
	var list struct {
		Codes []struct {
			Code    string `yaml:"code"`
			Message string `yaml:"message"`
		} `yaml:"codes"`
	}
	if err := yaml.Unmarshal(raw, &list); err != nil {
		return nil, fmt.Errorf("%s: %w", path, err)
	}
	var out []SpecErrorCode
	for _, c := range list.Codes {
		out = append(out, SpecErrorCode{Code: c.Code, Message: strings.TrimSpace(c.Message), Module: module})
	}
	return out, nil
}

// inlineRefs clears $ref markers recursively (depth-capped) so the schema
// marshals with component contents inlined and can be validated standalone
// at query time. A reference back to a schema already on the current path,
// such as NHA's UHI Ack whose ack property refers to Ack, keeps its $ref:
// clearing it would leave a pointer cycle that json.Marshal never leaves.
func inlineRefs(ref *openapi3.SchemaRef, depth int) {
	inlineRefsOn(ref, depth, map[*openapi3.Schema]bool{})
}

func inlineRefsOn(ref *openapi3.SchemaRef, depth int, path map[*openapi3.Schema]bool) {
	if ref == nil || depth > 10 {
		return
	}
	s := ref.Value
	if s != nil && path[s] {
		return
	}
	ref.Ref = ""
	if s == nil {
		return
	}
	path[s] = true
	defer delete(path, s)
	for _, p := range s.Properties {
		inlineRefsOn(p, depth+1, path)
	}
	inlineRefsOn(s.Items, depth+1, path)
	for _, sub := range s.AllOf {
		inlineRefsOn(sub, depth+1, path)
	}
	for _, sub := range s.AnyOf {
		inlineRefsOn(sub, depth+1, path)
	}
	for _, sub := range s.OneOf {
		inlineRefsOn(sub, depth+1, path)
	}
	if s.AdditionalProperties.Schema != nil {
		inlineRefsOn(s.AdditionalProperties.Schema, depth+1, path)
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
	codesByOp := map[string][]string{}
	for _, c := range errCodes {
		if !slices.Contains(codesByOp[c.OperationID], c.Code) {
			codesByOp[c.OperationID] = append(codesByOp[c.OperationID], c.Code)
		}
	}
	gateway := specGateway(specPath)
	// Callbacks are OpenAPI 3.1 webhooks in the module spec that owns them.
	// They are read with the paths, because an integrator has to receive
	// them: left out, every M2 callback was unreachable through search and
	// get, and its body was nowhere an agent could read it.
	type entry struct {
		path     string
		item     *openapi3.PathItem
		callback bool
	}
	var entries []entry
	for path, item := range doc.Paths.Map() {
		entries = append(entries, entry{path, item, false})
	}
	for path, item := range doc.Webhooks {
		entries = append(entries, entry{path, item, true})
	}
	var ops []Operation
	for _, e := range entries {
		path, item := e.path, e.item
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
			var params []string
			for _, p := range paramMap {
				if p.Value != nil && !slices.Contains(params, p.Value.Name) {
					params = append(params, p.Value.Name)
				}
			}
			sort.Strings(params)
			var responses []string
			if op.Responses != nil {
				for code := range op.Responses.Map() {
					responses = append(responses, code)
				}
			}
			sort.Strings(responses)
			codes := codesByOp[op.OperationID]
			sort.Strings(codes)
			ops = append(ops, Operation{
				Gateway:           gateway,
				Params:            params,
				ResponseCodes:     responses,
				ErrorCodes:        codes,
				OperationID:       op.OperationID,
				Method:            method,
				Path:              actualPath(path, op),
				Summary:           op.Summary,
				Tag:               tag,
				Module:            module,
				SpecJSON:          frag,
				RequestSchemaJSON: reqSchema,
				RequiredParams:    required,
				Callback:          e.callback,
			})
		}
	}
	sort.Slice(ops, func(i, j int) bool { return ops[i].OperationID < ops[j].OperationID })
	return SpecData{Module: module, Operations: ops, ErrorCodes: errCodes}, nil
}

// actualPath is the endpoint an operation is sent to. A path key may carry a
// #suffix so one endpoint appears more than once in a file, as M1's split per
// use case and UHI's two directions of on_update do; x-actual-path names the
// real one, and without it the suffix is dropped.
func actualPath(path string, op *openapi3.Operation) string {
	if v, ok := op.Extensions["x-actual-path"].(string); ok && v != "" {
		return v
	}
	if i := strings.Index(path, "#"); i >= 0 {
		return path[:i]
	}
	return path
}
