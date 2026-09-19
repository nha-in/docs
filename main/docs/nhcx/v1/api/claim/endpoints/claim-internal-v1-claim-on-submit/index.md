# Claim callback (internal) (adapter)

`POST /internal/v1/claim/on_submit`

Internal twin of /v1/claim/on_submit (operationId claimOnSubmitPostInternal) taking the same bare object body.

### Business purpose

Mirror of the public claim callback: the payer or TPA returns interim and final ClaimResponseBundles, or a protocol error, to the provider through NHCX. It serves the same settlement purpose of communicating the adjudication decision that triggers payment. No separate business role is documented for the internal route.

### When to use

Documented as the internal variant of the claim callback, consumed by payers. Called after each adjudication step with the request's correlation ID and x-hcx-status response.partial (25, 28, 29), response.complete (26 approved or a rejection) or response.error; queries arrive under 27. The OpenAPI specs expose this operation twice, at /v1/... and at /internal/v1/..., with identical descriptions, request bodies and response sets; only the operationId differs (an Internal suffix). The specs do not document what makes the internal variant different beyond that suffix, so treat it as a mirror of the public path and integrate against the public /v1 path unless NHCX onboarding tells you otherwise.

### Preconditions

Identical to the public callback: an in-flight claim request with this correlation ID that has not been closed by a response.complete, the provider's certificate for encryption, a new API_call_ID, swapped sender and recipient codes, a valid responder status, and business errors inside the encrypted ClaimResponse rather than the header.

### Postconditions

Same as /v1/claim/on_submit: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement, asynchronous delivery to the provider's callback with the 30-second acknowledgement rule and five retries before deletion, the claim remaining open after a partial and closing permanently after a complete, and an approval starting the payment notices 30, 31 and 33.

### Common mistakes

- Treating the internal callback as a different contract; the spec gives it the same object body and response set.
- All public claim-callback pitfalls apply: outcome complete misread as approval without checking the reason code, monitoring stopped after the first partial, 200 returned instead of the 202 acceptance body, new correlation ID minted, JWEPayloadResponse sent instead of ProtocolResponse (PAYR-1517).

### Best practices

- Route both callback variants into one handler keyed on x-hcx-correlation_ID.
- Acknowledge with 202 inside 30 seconds and process asynchronously; be idempotent under redelivery.
- Use the public /v1 path unless NHCX onboarding specifies the internal one.

### Related scenario

A TPA that adjudicates claims for several insurers builds one response pipeline that emits 25, 28, 27 and 26 with the correct outcome and reason codes and echoes the claim's correlation ID. It posts to /v1/claim/on_submit by default and keeps /internal/v1/claim/on_submit as a configurable alternative in case NHCX requires it. The hospital callback acknowledges each message and, on 26, awaits the payment notice.

### Specification

Chapter [Claim response](/docs/nhcx/v1/reference/fhir/claim-response) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/claim/on_submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 26' \
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

- `202`: Same as /v1/claim/on_submit: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement, asynchronous delivery to the provider's callback with the 30-second acknowledgement rule and five retries before deletion, the claim remaining open after a partial and closing permanently after a complete, and an approval starting the payment notices 30, 31 and 33.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d",
  "correlation_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "claim",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
