package catalogue

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestParseOperations(t *testing.T) {
	ops, err := ParseOperations(filepath.Join("testdata", "catalogue", "openapi", "hiecm-v3.yaml"))
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

func TestParseSpecReadsModuleAndErrorTable(t *testing.T) {
	data, err := ParseSpec(filepath.Join("testdata", "catalogue", "openapi", "hiecm-v3.yaml"))
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
	if len(data.ErrorCodes) != 2 {
		t.Fatalf("ErrorCodes = %+v, want 2", data.ErrorCodes)
	}
	byCode := map[string]SpecErrorCode{}
	for _, e := range data.ErrorCodes {
		byCode[e.Code] = e
	}
	e1016, ok := byCode["ABDM-1016"]
	if !ok || e1016.Message != "Dependent service unavailable" ||
		e1016.Action != "Retry with backoff" || e1016.Module != "m2" {
		t.Errorf("ABDM-1016 = %+v", e1016)
	}
	// The fixture records "ABDM-1035: " with trailing colon and space,
	// as observed in real tables; ingestion must normalize it.
	if _, ok := byCode["ABDM-1035"]; !ok {
		t.Errorf("trailing-colon code not normalized: %+v", data.ErrorCodes)
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
		t.Errorf("want no error codes without x-abdm-errors, got %+v", data.ErrorCodes)
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
