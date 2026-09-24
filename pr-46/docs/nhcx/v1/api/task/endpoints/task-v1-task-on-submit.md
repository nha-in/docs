# Payer: send the task outcome

`POST /v1/task/on_submit`

Payer returns a Task bundle with Task.status completed whose Task.output references a ClaimResponse carrying the reprocess or cancellation outcome.

### Business purpose

This callback closes the appeal or cancellation the provider opened on /v1/task/submit. It carries the payer's final decision on a reprocess (approved, partially approved, queried or rejected) or confirms a pre-authorisation cancellation, in the same ClaimResponse shape used for ordinary adjudication so hospitals can reuse their parsers. Because the reprocess response is final within the workflow, it delivers closure, a clean audit trail and reduced ambiguity for both sides, which is the point of moving disputes inside NHCX.

### When to use

The payer calls it to answer a reprocess or cancellation Task. The answer is a completed Task that points at a `ClaimResponse` with the new decision. A cancellation is confirmed on workflow `PC02`.

### Preconditions

- The payer answered the incoming Task with `202` within 30 seconds.
- A valid access token and the provider's certificate.
- The header reuses the Task's `x-hcx-correlation_ID`.
- The `ClaimResponse` inside is built like any other decision.

### Postconditions

- NHCX answers `202` and forwards the answer to the provider.
- The provider reads the `ClaimResponse` the Task points at, like any other decision.
- The reprocess decision is final. A cancelled pre-authorisation needs a new one if treatment resumes.

### Common mistakes

- Looking for the `ClaimResponse` directly in the bundle instead of following the Task's output.
- Reading outcome `complete` as approval. A rejection is also `complete`.
- Sending a new correlation ID on the answer.
- Sending a bare `ClaimResponse` without the Task around it.

### Best practices

- Payer: acknowledge first, re-adjudicate asynchronously, then post the Task bundle with the outcome workflow ID and ClaimResponse nested in Task.output.
- Provider: share the ClaimResponse parser between /v1/claim/on_submit and this callback; only the extraction path differs.
- Branch on adjudication reason as well as outcome; check processNote for reductions or query text.
- "Terminate the appeal branch of the case state machine on 252 or 253. On 254, note that NHCX publishes no workflow code for the answer: the handbook's 19 is the preauthorisation query response code, so confirm with the payer how it wants the answer sent."
- Be idempotent on correlation ID; expect redeliveries.
- Fresh API_call_ID, IST timestamp, responder status on the callback header.

### Related scenario

A scheme payer's TPA receives a reprocess Task on a rejected claim with the missing implant invoice attached. Its endpoint returns 202 and the case reopens for re-adjudication with the original claim, the new document and the justification. The reviewer approves at the package rate, and the TPA posts /v1/task/on_submit: a Task bundle, status completed, Task.output referencing a ClaimResponse with outcome complete, workflow 252, under the claim's correlation ID. The hospital acknowledges within 30 seconds, extracts the ClaimResponse from Task.output, marks the appeal closed and awaits the payment notice on /v1/paymentnotice/request.

### Specification

Chapter [Cancel, reprocess and shortfall](/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/task/on_submit \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "JWEPayload",
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOi4uLn0.encrypted_key.iv.ciphertext.tag"
}'
```

## Authorization

- `bearer_auth` (apiKey, required): Every NHCX call carries the access token from the session call in a header named `bearer_auth`, as the word `Bearer`, a space and the token. NHCX reads `bearer_auth`, not `Authorization`.

## Protected header

These fields go in the JWE protected header of `payload`, not as HTTP headers.

- `alg` (string, required): Key management algorithm. Always `RSA-OAEP-256`: the content key is wrapped with the recipient's RSA public key.
- `enc` (string, required): Content encryption algorithm. Always `A256GCM`.
- `x-hcx-sender_code` (string, required): Your participant code. Mandatory on the envelope.
- `x-hcx-recipient_code` (string, required): The recipient's. For a provider, the processor code from the policy lookup. Mandatory on the envelope.
- `x-hcx-api_call_id` (string, required): Fresh on every message, including responses. Mandatory on the envelope.
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread that ties a request to its answers. [The correlation ID rule](/docs/nhcx/v1/reference/envelope-fields#the-correlation-id-rule-in-full) says when to reuse it. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. [The workflow code](/docs/nhcx/v1/reference/envelope-fields#the-workflow-code-means-two-different-things) explains both readings. Optional on the envelope.
- `x-hcx-timestamp` (string, required): The time the message was made. [Timestamp](/docs/nhcx/v1/reference/envelope-fields#timestamp) gives the format. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. [Status words](/docs/nhcx/v1/reference/envelope-fields#status-words) lists the values. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

## Body

- `type` (string, required): Always `JWEPayload`. Every response (`on_`) call sends it beside `payload`. One of: JWEPayload.
- `payload` (string, required)

## Responses

- `202`: The gateway returns HTTP 202 with the StatusSuccessResponse envelope (400, 404, 500 in the same shape) and forwards the bundle to the provider, which must acknowledge within 30 seconds.
  - `timestamp` (string)
  - `api_call_id` (string)
  - `correlation_id` (string)
  - `result` (object)
  - `result.sender_code` (string)
  - `result.recipient_code` (string)
  - `result.entity_type` (string)
  - `result.protocol_status` (string)
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)

Example 202 response. The values are placeholders:

```json
{
  "timestamp": "26/08/2026 16:30:00:611",
  "api_call_id": "a3b4c5d6-e7f8-9012-6789-123456789012",
  "correlation_id": "66778899-aabb-ccdd-eeff-001122334455",
  "result": {
    "sender_code": "<payer participant code>",
    "recipient_code": "<provider participant code>",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
