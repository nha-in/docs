package catalogue

import (
	"bytes"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestParseOperations(t *testing.T) {
	ops, err := ParseOperations(filepath.Join("testdata", "catalogue", "openapi", "hiecm", "v3", "hiecm-v3.yaml"))
	if err != nil {
		t.Fatal(err)
	}
	if len(ops) != 2 {
		t.Fatalf("got %d operations, want 2", len(ops))
	}
	byID := map[string]Operation{}
	for _, o := range ops {
		byID[o.OperationID] = o
	}
	link, ok := byID["linkAddContexts"]
	if !ok {
		t.Fatal("linkAddContexts not found")
	}
	if link.Method != "POST" || link.Path != "/links/link/add-contexts" || link.Tag != "links" {
		t.Errorf("operation mismatch: %+v", link)
	}
	var frag map[string]any
	if err := json.Unmarshal(link.SpecJSON, &frag); err != nil {
		t.Fatalf("SpecJSON is not valid JSON: %v", err)
	}
	if frag["summary"] != "Add care contexts" {
		t.Errorf("SpecJSON summary = %v", frag["summary"])
	}
	var schema map[string]any
	if err := json.Unmarshal(link.RequestSchemaJSON, &schema); err != nil {
		t.Fatalf("RequestSchemaJSON invalid: %v", err)
	}
	if schema["type"] != "object" {
		t.Errorf("request schema = %v", schema)
	}
	if want := []string{"X-HIP-ID (header)"}; len(link.RequiredParams) != 1 || link.RequiredParams[0] != want[0] {
		t.Errorf("RequiredParams = %v, want %v", link.RequiredParams, want)
	}
	if health := byID["healthCheck"]; health.RequestSchemaJSON != nil {
		t.Errorf("healthCheck should have no request schema")
	}
}

func TestParseSpecReadsModuleAndErrorCodes(t *testing.T) {
	data, err := ParseSpec(filepath.Join("testdata", "catalogue", "openapi", "hiecm", "v3", "hiecm-v3.yaml"))
	if err != nil {
		t.Fatal(err)
	}
	if data.Module != "m2" {
		t.Errorf("Module = %q, want m2 from info.x-portal.module", data.Module)
	}
	for _, op := range data.Operations {
		if op.Module != "m2" {
			t.Errorf("operation %s Module = %q, want m2", op.OperationID, op.Module)
		}
	}
	// The fixture's /health 200 example also carries a code/message pair;
	// only the 400 and 409 examples are error responses, so only their
	// codes are extracted.
	if len(data.ErrorCodes) != 2 {
		t.Fatalf("ErrorCodes = %+v, want 2", data.ErrorCodes)
	}
	byCode := map[string]SpecErrorCode{}
	for _, e := range data.ErrorCodes {
		byCode[e.Code] = e
	}
	if _, ok := byCode["ABDM-9999"]; ok {
		t.Errorf("2xx example's code must not be extracted: %+v", data.ErrorCodes)
	}
	e1013, ok := byCode["ABDM-1013"]
	if !ok || e1013.Message != "Invalid ABHA Number" || e1013.HTTP != "400" ||
		e1013.OperationID != "healthCheck" || e1013.Module != "m2" {
		t.Errorf("ABDM-1013 = %+v", e1013)
	}
	e1035, ok := byCode["ABDM-1035"]
	if !ok || e1035.Message != "Facility is not registered with the bridge" || e1035.HTTP != "409" {
		t.Errorf("ABDM-1035 = %+v", e1035)
	}
}

func TestParseSpecModuleFallsBackToFilenameStem(t *testing.T) {
	spec := []byte("openapi: 3.0.3\ninfo: {title: x, version: v}\npaths:\n  /a:\n    get:\n      operationId: getA\n      responses: {\"200\": {description: ok}}\n")
	p := filepath.Join(t.TempDir(), "hiecm-m9.yaml")
	if err := os.WriteFile(p, spec, 0o644); err != nil {
		t.Fatal(err)
	}
	data, err := ParseSpec(p)
	if err != nil {
		t.Fatal(err)
	}
	if data.Module != "hiecm-m9" {
		t.Errorf("Module = %q, want filename stem hiecm-m9", data.Module)
	}
	if len(data.ErrorCodes) != 0 {
		t.Errorf("want no error codes when no response example carries one, got %+v", data.ErrorCodes)
	}
}

func TestNormalizeErrorCode(t *testing.T) {
	for in, want := range map[string]string{
		"ABDM-1016":     "ABDM-1016",
		"ABDM-1016: ":   "ABDM-1016",
		" abdm-1016:\t": "ABDM-1016",
		"ABDM-1016::":   "ABDM-1016",
	} {
		if got := NormalizeErrorCode(in); got != want {
			t.Errorf("NormalizeErrorCode(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestParseOperationsRejectsMissingOperationID(t *testing.T) {
	spec := []byte("openapi: 3.0.3\ninfo: {title: x, version: v}\npaths:\n  /a:\n    get:\n      summary: no id\n      responses: {\"200\": {description: ok}}\n")
	p := filepath.Join(t.TempDir(), "bad.yaml")
	if err := os.WriteFile(p, spec, 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := ParseOperations(p); err == nil {
		t.Fatal("want error for missing operationId")
	}
}

func TestParseOperationsPathItemParameters(t *testing.T) {
	// Test that path-item-level parameters are collected,
	// and operation-level parameters override them.
	spec := []byte(`openapi: 3.0.3
info: {title: x, version: v}
paths:
  /users/{id}:
    parameters:
      - name: X-API-Key
        in: header
        required: true
        schema: {type: string}
    get:
      operationId: getUser
      summary: Get user
      responses:
        "200":
          description: OK
    post:
      operationId: updateUser
      parameters:
        - name: X-API-Key
          in: header
          required: false
          schema: {type: string}
        - name: X-Request-ID
          in: header
          required: true
          schema: {type: string}
      summary: Update user
      responses:
        "200":
          description: OK
`)
	p := filepath.Join(t.TempDir(), "pathparams.yaml")
	if err := os.WriteFile(p, spec, 0o644); err != nil {
		t.Fatal(err)
	}
	ops, err := ParseOperations(p)
	if err != nil {
		t.Fatal(err)
	}
	byID := map[string]Operation{}
	for _, o := range ops {
		byID[o.OperationID] = o
	}

	// getUser should inherit required X-API-Key from path-item level
	getOp := byID["getUser"]
	if len(getOp.RequiredParams) != 1 || getOp.RequiredParams[0] != "X-API-Key (header)" {
		t.Errorf("getUser RequiredParams = %v, want [X-API-Key (header)]", getOp.RequiredParams)
	}

	// updateUser should override X-API-Key (now not required) and add X-Request-ID (required)
	updateOp := byID["updateUser"]
	if len(updateOp.RequiredParams) != 1 || updateOp.RequiredParams[0] != "X-Request-ID (header)" {
		t.Errorf("updateUser RequiredParams = %v, want [X-Request-ID (header)]", updateOp.RequiredParams)
	}
}

func TestParseOperationsInlineRefs(t *testing.T) {
	// Test that $ref markers in request schema are inlined.
	spec := []byte(`openapi: 3.0.3
info: {title: x, version: v}
paths:
  /items:
    post:
      operationId: createItem
      summary: Create item
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Item'
      responses:
        "201":
          description: Created
components:
  schemas:
    Item:
      type: object
      required: [name]
      properties:
        name:
          type: string
        metadata:
          $ref: '#/components/schemas/Metadata'
    Metadata:
      type: object
      properties:
        tags:
          type: array
          items:
            type: string
`)
	p := filepath.Join(t.TempDir(), "refs.yaml")
	if err := os.WriteFile(p, spec, 0o644); err != nil {
		t.Fatal(err)
	}
	ops, err := ParseOperations(p)
	if err != nil {
		t.Fatal(err)
	}
	if len(ops) != 1 {
		t.Fatalf("expected 1 operation, got %d", len(ops))
	}

	op := ops[0]
	if op.RequestSchemaJSON == nil {
		t.Fatal("RequestSchemaJSON is nil")
	}

	// Verify no $ref substring in RequestSchemaJSON
	if string(op.RequestSchemaJSON) != "" && containsString(op.RequestSchemaJSON, "$ref") {
		t.Errorf("RequestSchemaJSON still contains $ref: %s", op.RequestSchemaJSON)
	}

	// Verify the inlined properties are present
	var schema map[string]any
	if err := json.Unmarshal(op.RequestSchemaJSON, &schema); err != nil {
		t.Fatalf("RequestSchemaJSON invalid: %v", err)
	}

	// Check that metadata property exists and has the inlined Metadata schema
	if props, ok := schema["properties"].(map[string]any); ok {
		if metadata, ok := props["metadata"].(map[string]any); ok {
			if metadata["type"] != "object" {
				t.Errorf("inlined metadata should be object type, got %v", metadata["type"])
			}
		} else {
			t.Errorf("metadata property not found in inlined schema")
		}
	} else {
		t.Errorf("properties not found in schema")
	}
}

// Helper function to check if byte slice contains a string
func containsString(b []byte, s string) bool {
	return len(b) > 0 && bytes.Contains(b, []byte(s))
}

// SpecJSON is the blob get_operation hands an agent, so a $ref left in it is
// a dangling pointer: the agent has no components section to resolve it
// against. Parameters, request body and responses all reach it by reference
// in NHA's specifications.
func TestParseOperationsInlinesRefsInSpecJSON(t *testing.T) {
	spec := []byte(`openapi: 3.0.3
info: {title: x, version: v}
paths:
  /sessions:
    post:
      operationId: gateway_sessions_create
      summary: Create a session
      parameters:
        - $ref: '#/components/parameters/RequestId'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SessionRequest'
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SessionResponse'
components:
  parameters:
    RequestId:
      name: REQUEST-ID
      in: header
      required: true
      schema: {type: string, format: uuid}
  schemas:
    SessionRequest:
      type: object
      required: [clientId]
      properties:
        clientId: {type: string}
    SessionResponse:
      type: object
      properties:
        accessToken: {type: string}
`)
	p := filepath.Join(t.TempDir(), "sessions.yaml")
	if err := os.WriteFile(p, spec, 0o644); err != nil {
		t.Fatal(err)
	}
	ops, err := ParseOperations(p)
	if err != nil {
		t.Fatal(err)
	}
	if len(ops) != 1 {
		t.Fatalf("expected 1 operation, got %d", len(ops))
	}
	op := ops[0]

	if containsString(op.SpecJSON, "$ref") {
		t.Errorf("SpecJSON still carries a $ref: %s", op.SpecJSON)
	}
	// The point of inlining is that the content arrives, not merely that the
	// marker is gone.
	for _, want := range []string{"REQUEST-ID", "clientId", "accessToken"} {
		if !containsString(op.SpecJSON, want) {
			t.Errorf("SpecJSON lost %q after inlining: %s", want, op.SpecJSON)
		}
	}
}

// The real M1 spec's first-occurrence rows must be the ones the generated
// errors page (site/docs/hiecm/v3/api/m1/errors.md) shows. A sorted walk
// named different operations for these three codes.
func TestSpecErrorCodesFollowDocumentOrder(t *testing.T) {
	data, err := ParseSpec(filepath.Join(repoRoot, "catalogue", "openapi", "hiecm", "v3", "hiecm-m1.yaml"))
	if err != nil {
		t.Fatal(err)
	}
	got := map[string]SpecErrorCode{}
	for _, c := range data.ErrorCodes {
		got[c.Code] = c
	}
	for _, want := range []SpecErrorCode{
		{Code: "900901", HTTP: "401", Message: "Invalid Credentials", OperationID: "m1_post_v3_enrollment_request_otp", Module: "m1"},
		{Code: "900902", HTTP: "401", Message: "Missing Credentials", OperationID: "m1_post_v3_profile_benefit_search", Module: "m1"},
		{Code: "ABDM-1211", HTTP: "400", Message: "User not found.", OperationID: "m1_post_v3_phr_web_login_abha_search", Module: "m1"},
	} {
		if got[want.Code] != want {
			t.Errorf("%s: got %+v, want %+v", want.Code, got[want.Code], want)
		}
	}
}

// Every module's rows must equal what scripts/lib/spec-errors.mjs produces,
// since the errors pages and the debug skills are built from that. Skipped
// when node or the repo's node_modules are not present.
func TestSpecErrorCodesMatchNode(t *testing.T) {
	if _, err := exec.LookPath("node"); err != nil {
		t.Skip("node not on PATH")
	}
	if _, err := os.Stat(filepath.Join(repoRoot, "node_modules", "yaml")); err != nil {
		t.Skip("node_modules/yaml not installed")
	}
	root, _ := filepath.Abs(repoRoot)
	specs, _ := filepath.Glob(filepath.Join(root, "catalogue", "openapi", "hiecm", "v3", "hiecm-*.yaml"))
	if len(specs) == 0 {
		t.Fatal("no specs found")
	}
	script := `import {parse} from 'yaml'; import {readFileSync} from 'node:fs';
import {errorsFromSpec} from './scripts/lib/spec-errors.mjs';
const out = {};
for (const f of process.argv.slice(1)) out[f] = errorsFromSpec(parse(readFileSync(f, 'utf8')));
console.log(JSON.stringify(out));`
	cmd := exec.Command("node", append([]string{"--input-type=module", "-e", script}, specs...)...)
	cmd.Dir = repoRoot
	cmd.Stderr = os.Stderr
	raw, err := cmd.Output()
	if err != nil {
		t.Fatalf("node: %v", err)
	}
	var node map[string][]struct{ Code, HTTP, Message, OperationID string }
	if err := json.Unmarshal(raw, &node); err != nil {
		t.Fatal(err)
	}
	for _, spec := range specs {
		data, err := ParseSpec(spec)
		if err != nil {
			t.Fatal(err)
		}
		want := map[string]string{}
		for _, r := range node[spec] {
			want[r.Code] = r.HTTP + "|" + r.Message + "|" + r.OperationID
		}
		got := map[string]string{}
		for _, r := range data.ErrorCodes {
			got[r.Code] = r.HTTP + "|" + r.Message + "|" + r.OperationID
		}
		if len(got) != len(want) {
			t.Errorf("%s: %d codes, node has %d", filepath.Base(spec), len(got), len(want))
		}
		for code, w := range want {
			if got[code] != w {
				t.Errorf("%s %s: go %q, node %q", filepath.Base(spec), code, got[code], w)
			}
		}
	}
}

var repoRoot = filepath.Join("..", "..", "..")
