# Coverage eligibility callback (internal) (adapter)

`POST /internal/v1/coverageeligibility/on_check`

Internal twin of /v1/coverageeligibility/on_check taking the same bare object body; only the operationId differs.

### Business purpose

Mirror of the public eligibility callback: the payer or TPA returns the CoverageEligibilityResponseBundle, or a protocol error, to the provider through NHCX. It serves the same settlement purpose, letting the hospital know before treatment whether the policy is in force and which documents the preauth will need. No separate business role is documented for the internal route.

### When to use

Documented as the internal variant of the eligibility callback (operationId coverageeligibilityOnCheckPostInternal), tagged V1.0 APIs-Provider side. Called after processing a check request, with the request's correlation ID and x-hcx-status response.complete, response.partial or response.error. The OpenAPI specs expose this operation twice, at /v1/... and at /internal/v1/..., with identical descriptions, request bodies and response sets; only the operationId differs (an Internal suffix). The specs do not document what makes the internal variant different beyond that suffix, so treat it as a mirror of the public path and integrate against the public /v1 path unless NHCX onboarding tells you otherwise.

### Preconditions

Identical to the public callback: an in-flight check request with this correlation ID, the provider's certificate for encryption, a new api_call_id, swapped sender and recipient codes, a valid responder status, and business errors embedded inside the encrypted resource rather than the header.

### Postconditions

Same as /v1/coverageeligibility/on_check: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement, asynchronous delivery to the provider's callback URL with the 30-second acknowledgement rule, five retries then deletion on failure, and closure of the eligibility conversation on success.

### Common mistakes

- Treating the internal callback as a different contract; the spec gives it the same object body and response set as the public path.
- Every public on_check pitfall applies: returning 200 instead of the 202 acceptance body, minting a new correlation ID, sending a JWEPayloadResponse instead of a ProtocolResponse on error (PAYR-1517), and leaking business errors into x-hcx-error_details.

### Best practices

- Route both callback variants to the same handler keyed on x-hcx-correlation_id so behaviour cannot diverge.
- Acknowledge with 202 inside 30 seconds and process asynchronously; be idempotent under redelivery.
- Use the public /v1 path unless NHCX onboarding specifies the internal one.

### Related scenario

A TPA bridge that processes eligibility checks on behalf of an insurer sees both on_check operations in the service spec. It implements a single response builder that populates inforce, excluded and authorizationRequired, echoes the correlation ID and posts to /v1/coverageeligibility/on_check by default, with the internal path configurable if NHCX requires it. The hospital's callback acknowledges with 202 and the desk moves on to the preauth.

### Specification

Chapter [Coverage eligibility response](/docs/nhcx/v1/reference/fhir/coverage-eligibility-response) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/coverageeligibility/on_check \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 11' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'x-hcx-debug_flag: INFO' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOi4uLn0.encrypted_key.iv.ciphertext.tag"
}'
```

## Authorization

- `Authorization` (bearer token, required): On every NHCX call, the token goes in a header called `bearer_auth`, with the word `Bearer` and a space in front. The sources are not unanimous: the authentication page and the FAQ both write the example as `Authorization`, and the notification endpoint uses `Authorization`. The safe course, and what the adapter does, is to send both headers with the same value.

## Headers

- `bearer_auth` (string, required): It is `bearer_auth`, not `Authorization`, on NHCX's own endpoints.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.
- `x-hcx-debug_flag` (string): `Error`, `Info` or `Debug`. A server may ignore it. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: Same as /v1/coverageeligibility/on_check: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement, asynchronous delivery to the provider's callback URL with the 30-second acknowledgement rule, five retries then deletion on failure, and closure of the eligibility conversation on success.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "coverageeligibility",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
