package server

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"sort"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"

	"github.com/nha-in/docs/mcp/internal/catalogue"
	"github.com/nha-in/docs/mcp/internal/embed"
	"github.com/nha-in/docs/mcp/internal/index"
)

// The tool contract: every promise the MCP tools make, checked against the
// whole snapshot rather than a sample, through the protocol an agent's
// client speaks. No model is involved, so it is exact and repeatable.
//
// Each check is generated from the catalogue itself. An atom that get
// cannot open, an error code decode_error cannot reach, an operation search
// cannot find by its own path, or an example id in a tool's description that
// does not exist are all things an agent would hit and a unit test on a
// three-atom fixture would not: 900901 was unreachable by code in the
// shipped index while every unit test passed.

// ContractCheck is one promise and how often the snapshot kept it.
type ContractCheck struct {
	Name    string `json:"name"`
	Promise string `json:"promise"`
	Total   int    `json:"total"`
	Failed  int    `json:"failed"`
}

// ContractResult is the whole run. Failures are "check: subject: detail",
// stable across runs so a baseline can record the known ones.
type ContractResult struct {
	CatalogueVersion string          `json:"catalogue_version"`
	Checks           []ContractCheck `json:"checks"`
	Failures         []string        `json:"failures"`
}

type contractRun struct {
	ctx    context.Context
	sess   *mcp.ClientSession
	r      *index.Reader
	res    ContractResult
	checks []*ContractCheck // in the order first asked for; copied into res at the end
}

func (c *contractRun) check(name, promise string) *ContractCheck {
	for _, k := range c.checks {
		if k.Name == name {
			return k
		}
	}
	k := &ContractCheck{Name: name, Promise: promise}
	c.checks = append(c.checks, k)
	return k
}

func (c *contractRun) fail(k *ContractCheck, subject, detail string) {
	k.Failed++
	c.res.Failures = append(c.res.Failures, fmt.Sprintf("%s: %s: %s", k.Name, subject, detail))
}

// call runs one tool the way an agent does and decodes its JSON result. A
// tool error comes back as its message, never as a Go error, because that is
// what the agent sees.
func (c *contractRun) call(tool string, args map[string]any) (map[string]any, string) {
	res, err := c.sess.CallTool(c.ctx, &mcp.CallToolParams{Name: tool, Arguments: args})
	if err != nil {
		return nil, err.Error()
	}
	var text string
	if len(res.Content) > 0 {
		if t, ok := res.Content[0].(*mcp.TextContent); ok {
			text = t.Text
		}
	}
	if res.IsError {
		return nil, firstLine(text)
	}
	var out map[string]any
	if err := json.Unmarshal([]byte(text), &out); err != nil {
		return nil, "result is not a JSON object: " + firstLine(text)
	}
	return out, ""
}

func firstLine(s string) string {
	s, _, _ = strings.Cut(strings.TrimSpace(s), "\n")
	if len(s) > 160 {
		s = s[:157] + "..."
	}
	return s
}

// RunContract checks every tool promise against the snapshot r serves.
// emb may be nil: search then runs keyword-only, which is what CI builds.
func RunContract(ctx context.Context, r *index.Reader, emb embed.Embedder) (ContractResult, error) {
	srv := NewMCPServer(r, emb)
	ct, st := mcp.NewInMemoryTransports()
	if _, err := srv.Connect(ctx, st, nil); err != nil {
		return ContractResult{}, err
	}
	client := mcp.NewClient(&mcp.Implementation{Name: "contract", Version: "0"}, nil)
	sess, err := client.Connect(ctx, ct, nil)
	if err != nil {
		return ContractResult{}, err
	}
	defer sess.Close()

	c := &contractRun{ctx: ctx, sess: sess, r: r,
		res: ContractResult{CatalogueVersion: r.CatalogueVersion()}}
	atoms, err := r.ListAtoms("", "")
	if err != nil {
		return ContractResult{}, err
	}
	ops, err := r.ListOperations("", "", "")
	if err != nil {
		return ContractResult{}, err
	}

	c.checkAtoms(atoms)
	c.checkOperations(ops)
	c.checkFHIR()
	c.checkInfo(atoms)
	if err := c.checkDescriptions(); err != nil {
		return ContractResult{}, err
	}
	for _, k := range c.checks {
		c.res.Checks = append(c.res.Checks, *k)
	}
	sort.Strings(c.res.Failures)
	return c.res, nil
}

func hitIDs(out map[string]any) []string {
	hits, _ := out["hits"].([]any)
	var ids []string
	for _, h := range hits {
		if m, ok := h.(map[string]any); ok {
			id, _ := m["id"].(string)
			ids = append(ids, id)
		}
	}
	return ids
}

func anyIn(ids, want []string) bool {
	for _, w := range want {
		if rankOf(ids, w) > 0 {
			return true
		}
	}
	return false
}

func rankOf(ids []string, want string) int {
	for i, id := range ids {
		if id == want {
			return i + 1
		}
	}
	return 0
}

func (c *contractRun) checkAtoms(atoms []index.AtomRef) {
	get := c.check("get-atom", "get opens every atom by its id")
	rel := c.check("related-resolves", "every id related returns is an atom get can open")
	dec := c.check("decode-error", "decode_error returns each error atom for every code it carries")
	title := c.check("search-atom-by-title", "search finds every atom by its own title in the top 5")
	known := make(map[string]bool, len(atoms))
	for _, a := range atoms {
		known[a.ID] = true
	}
	for _, a := range atoms {
		get.Total++
		out, errMsg := c.call("get", map[string]any{"id": a.ID})
		if errMsg != "" || out["id"] != a.ID {
			c.fail(get, a.ID, "not opened: "+errMsg)
			continue
		}

		relOut, errMsg := c.call("related", map[string]any{"id": a.ID})
		if errMsg != "" {
			rel.Total++
			c.fail(rel, a.ID, "related failed: "+errMsg)
		}
		groups, _ := relOut["related"].(map[string]any)
		for _, g := range groups {
			list, _ := g.([]any)
			for _, item := range list {
				m, _ := item.(map[string]any)
				to, _ := m["id"].(string)
				rel.Total++
				if !known[to] {
					c.fail(rel, a.ID+" -> "+to, "no such atom")
				}
			}
		}

		if a.Type == "error" {
			codes, err := c.r.ErrorCodesOf(a.ID)
			if err == nil && len(codes) == 0 {
				dec.Total++
				c.fail(dec, a.ID, "carries no code, so decode_error cannot reach it")
			}
			for _, code := range codes {
				dec.Total++
				d, errMsg := c.call("decode_error", map[string]any{"input": code})
				if errMsg != "" || !decodeReturns(d, a.ID) {
					c.fail(dec, a.ID, "decode_error "+code+" does not return it "+errMsg)
				}
			}
		}

		if strings.TrimSpace(a.Title) != "" {
			title.Total++
			s, errMsg := c.call("search", map[string]any{"query": a.Title, "limit": 5})
			if errMsg != "" {
				c.fail(title, a.ID, "search failed: "+errMsg)
			} else if rankOf(hitIDs(s), a.ID) == 0 {
				c.fail(title, a.ID, "not in the top 5 for its title")
			}
		}
	}
}

func decodeReturns(out map[string]any, id string) bool {
	matches, _ := out["matches"].(map[string]any)
	for _, m := range matches {
		mm, _ := m.(map[string]any)
		list, _ := mm["atoms"].([]any)
		for _, a := range list {
			if am, ok := a.(map[string]any); ok && am["id"] == id {
				return true
			}
		}
	}
	return false
}

func (c *contractRun) checkOperations(ops []index.OperationSummary) {
	get := c.check("get-operation", "get opens every operation by its operationId")
	path := c.check("search-operation-by-path", "search with kind operation finds every operation by its own path in the top 3")
	val := c.check("validate-request-empty", "validate kind request rejects an empty body for an operation whose schema requires fields")
	// NHA's specifications give several operations one path, told apart only
	// by their body: six variants share POST /abha/api/v3/enrollment/auth/byAbdm.
	// A path alone cannot pick one of them, so any operation on the same
	// method and path counts as found.
	samePath := map[string][]string{}
	for _, o := range ops {
		k := o.Method + " " + o.Path
		samePath[k] = append(samePath[k], o.OperationID)
	}
	for _, o := range ops {
		get.Total++
		if _, errMsg := c.call("get", map[string]any{"id": o.OperationID}); errMsg != "" {
			c.fail(get, o.OperationID, "not opened: "+errMsg)
		}

		path.Total++
		s, errMsg := c.call("search", map[string]any{"kind": "operation", "query": o.Path, "limit": 3})
		if errMsg != "" {
			c.fail(path, o.OperationID, "search failed: "+errMsg)
		} else if !anyIn(hitIDs(s), samePath[o.Method+" "+o.Path]) {
			c.fail(path, o.OperationID, "not in the top 3 for "+o.Path)
		}

		v, err := c.r.GetOperationValidation(o.OperationID)
		if err != nil || !schemaRequiresFields(v.RequestSchemaJSON) {
			continue
		}
		val.Total++
		out, errMsg := c.call("validate", map[string]any{"kind": "request", "operation_id": o.OperationID, "body": "{}"})
		if errMsg != "" {
			c.fail(val, o.OperationID, "validate failed: "+errMsg)
		} else if out["valid"] != false {
			c.fail(val, o.OperationID, "an empty body passed")
		}
	}
}

func schemaRequiresFields(raw []byte) bool {
	var s struct {
		Required []string `json:"required"`
	}
	return len(raw) > 0 && json.Unmarshal(raw, &s) == nil && len(s.Required) > 0
}

func (c *contractRun) checkFHIR() {
	prof := c.check("get-fhir-profile", "get opens every profile search lists, as fhir:<profile>")
	golden := c.check("validate-fhir-golden", "validate kind fhir passes each golden example with no error finding")
	broken := c.check("validate-fhir-broken", "validate kind fhir reports an error for a golden example with its Composition removed")
	list, errMsg := c.call("search", map[string]any{"kind": "fhir_profile"})
	if errMsg != "" {
		prof.Total++
		c.fail(prof, "search kind fhir_profile", errMsg)
		return
	}
	profiles, _ := list["profiles"].([]any)
	for _, p := range profiles {
		pm, _ := p.(map[string]any)
		name, _ := pm["profile_name"].(string)
		recordType, _ := pm["record_type"].(string)
		prof.Total++
		if _, errMsg := c.call("get", map[string]any{"id": "fhir:" + name}); errMsg != "" {
			c.fail(prof, name, "not opened: "+errMsg)
		}

		ex, errMsg := c.call("get", map[string]any{"id": "fhir-example:" + recordType})
		if errMsg != "" {
			continue // not every record type ships a golden example
		}
		bundle, err := json.Marshal(ex["example"])
		if err != nil {
			continue
		}
		golden.Total++
		out, errMsg := c.call("validate", map[string]any{"kind": "fhir", "bundle_json": string(bundle), "record_type": recordType})
		if errMsg != "" {
			c.fail(golden, recordType, "validate failed: "+errMsg)
		} else if n := errorFindings(out); n > 0 {
			c.fail(golden, recordType, fmt.Sprintf("the golden example has %d error findings", n))
		}

		broken.Total++
		out, errMsg = c.call("validate", map[string]any{"kind": "fhir", "bundle_json": withoutComposition(bundle), "record_type": recordType})
		if errMsg != "" {
			c.fail(broken, recordType, "validate failed: "+errMsg)
		} else if errorFindings(out) == 0 {
			c.fail(broken, recordType, "a bundle with no Composition raised no error")
		}
	}
}

func errorFindings(out map[string]any) int {
	list, _ := out["findings"].([]any)
	n := 0
	for _, f := range list {
		if fm, ok := f.(map[string]any); ok && fm["severity"] == "error" {
			n++
		}
	}
	return n
}

// withoutComposition drops every Composition entry, which a document bundle
// must open with, so the validator has something it cannot miss.
func withoutComposition(bundle []byte) string {
	var b map[string]any
	if json.Unmarshal(bundle, &b) != nil {
		return string(bundle)
	}
	entries, _ := b["entry"].([]any)
	var kept []any
	for _, e := range entries {
		em, _ := e.(map[string]any)
		res, _ := em["resource"].(map[string]any)
		if res["resourceType"] != "Composition" {
			kept = append(kept, e)
		}
	}
	b["entry"] = kept
	out, _ := json.Marshal(b)
	return string(out)
}

func (c *contractRun) checkInfo(atoms []index.AtomRef) {
	k := c.check("catalogue-info", "catalogue_info reports the snapshot's own version and atom count")
	k.Total++
	out, errMsg := c.call("catalogue_info", map[string]any{})
	if errMsg != "" {
		c.fail(k, "catalogue_info", errMsg)
		return
	}
	if out["catalogue_version"] != c.r.CatalogueVersion() {
		c.fail(k, "catalogue_info", fmt.Sprintf("version %v, snapshot is %s", out["catalogue_version"], c.r.CatalogueVersion()))
	}
	counts, _ := out["atoms"].(map[string]any)
	byType, _ := counts["by_type"].(map[string]any)
	total := 0
	for _, n := range byType {
		if f, ok := n.(float64); ok {
			total += int(f)
		}
	}
	if total != len(atoms) {
		c.fail(k, "catalogue_info", fmt.Sprintf("counts %d atoms by type, the snapshot lists %d", total, len(atoms)))
	}
}

// The ids a tool's description or input schema offers as examples. An agent
// copies these; one that does not exist sends it to "not found" on its first
// call, which is where m1_post_profile_verify in get's own schema did.
var (
	exampleAtomRe = regexp.MustCompile(`\b(?:hiecm|nhcx|uhi|shared)\.[a-z]+\.[a-z0-9-]+\b`)
	exampleOpRe   = regexp.MustCompile(`\b[a-z0-9]+(?:_[a-z0-9]+)*_(?:get|post|put|patch|delete)_[a-z0-9_]+\b`)
	exampleCodeRe = regexp.MustCompile(`\b(?:ABDM|NHCX|PAYR)-\d{3,5}\b`)
)

func (c *contractRun) checkDescriptions() error {
	k := c.check("description-examples", "every atom id, operationId and error code a tool description or schema offers as an example exists")
	tools, err := c.sess.ListTools(c.ctx, nil)
	if err != nil {
		return err
	}
	for _, t := range tools.Tools {
		schema, _ := json.Marshal(t.InputSchema)
		text := t.Description + "\n" + string(schema)
		seen := map[string]bool{}
		for _, id := range exampleAtomRe.FindAllString(text, -1) {
			if seen[id] {
				continue
			}
			seen[id] = true
			k.Total++
			if _, errMsg := c.call("get", map[string]any{"id": id}); errMsg != "" {
				c.fail(k, t.Name+" "+id, "example atom does not exist")
			}
		}
		for _, id := range exampleOpRe.FindAllString(text, -1) {
			if seen[id] {
				continue
			}
			seen[id] = true
			k.Total++
			if _, errMsg := c.call("get", map[string]any{"id": id}); errMsg != "" {
				c.fail(k, t.Name+" "+id, "example operationId does not exist")
			}
		}
		for _, code := range exampleCodeRe.FindAllString(text, -1) {
			if seen[code] {
				continue
			}
			seen[code] = true
			k.Total++
			refs, err := c.r.AtomsByErrorCode(catalogue.NormalizeErrorCode(code))
			if err != nil || len(refs) == 0 {
				c.fail(k, t.Name+" "+code, "example error code has no atom")
			}
		}
	}
	return nil
}
