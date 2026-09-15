# Task submit (internal variant) (adapter)

`POST /internal/v1/task/submit`

Internal twin of /v1/task/submit on the taskhcxservice, operationId hcxTaskPostInternal, with the same JWEPayload Task body and 202 envelope.

### Business purpose

The taskhcxservice is one of six NHCX services that publish each operation at both /v1/... and /internal/v1/... with identical descriptions and request bodies, differing only in the operationId suffix. This is the internal form of the provider's reprocess or cancel request: the structured appeal path for rejected or short-paid claims and the withdrawal path for unused pre-authorisations. The specifications document no behavioural difference from the public endpoint.

### When to use

Same circumstances as /v1/task/submit: a reprocess (Task.code reprocess, reasonCode claimrejected or partialpayment, workflow 18) after an adverse adjudication with new evidence, or a preauth cancellation (Task.code cancel with a cancellation reasonCode, workflow 122 or PC01). x-hcx-correlation_id carries the original claim or preauth correlation id. The specs do not say when the internal path applies; default to the public path unless onboarding guidance names this one.

### Preconditions

- As for the public endpoint: active provider with NPI facility code, Bearer token, payer certificate for JWE encryption.
- Body is a JWEPayload whose plaintext is the Task resource with basedOn referencing the original entity by the sender's reference id, Task.input with claimNumber and intimation number, and supporting evidence.
- Protected header with the original correlation id, fresh api_call_id, IST timestamp, workflow id and status request.initiated.
- Confirmation that the internal route is intended for your integration.

### Postconditions

Returns 202 Accepted with StatusSuccessResponse (entity_type task), or 400, 404 or 500 in the same envelope. The payer answers later on the task on_submit callback with a Task bundle wrapping a ClaimResponse: workflows 251 received, 252 approved, 253 rejected, 254 queried, PC02 cancellation accomplished. The decision is final within the workflow context. No additional behaviour is documented for the internal variant.

### Common mistakes

- Expecting the internal path to skip validation of basedOn, correlation id or status; it is documented as identical.
- Omitting Task.basedOn or minting a fresh correlation id.
- Cancelling a preauth not in submitted or approved state (PAYR-1252, PAYR-1253, PAYR-1257, PAYR-1258).
- Hard-coding the internal prefix without confirming the route; a 404 may be a host or prefix mismatch.

### Best practices

- Reuse the public endpoint's Task builder; make only the path prefix configurable.
- Link to the original entity in both basedOn and Task.input; use Task.description with reasonCode other.
- Fresh api_call_id per call, IST timestamps, request.initiated on the outbound header.
- Persist correlation id and workflow id for matching the callback; implement v1/error.

### Related scenario

A hospital integrator generating a client from the taskhcxservice Swagger sees hcxTaskPost and hcxTaskPostInternal with the same description. The team builds one reprocess-and-cancel module that posts to /v1/task/submit by default and can be switched to the internal path if NHCX onboarding requires it. When a surgeon changes the treatment plan after a preauth was approved, the module sends Task.code cancel with reasonCode treatmentplanchanged under the preauth's correlation id, receives 202, and later gets the cancellation confirmation on the task on_submit callback before a new preauth is raised.

### Specification

Chapter [Cancel, reprocess and shortfall](/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/internal/v1/task/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 122' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxMDAwMDA0NDQ2QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
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

## Body

- `payload` (string)

## Responses

- `200`: Returns 202 Accepted with StatusSuccessResponse (entity_type task), or 400, 404 or 500 in the same envelope.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 10:20:00:093",
  "api_call_id": "b4c5d6e7-f8a9-0123-7890-234567890123",
  "correlation_id": "778899aa-bbcc-ddee-ff00-112233445566",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
