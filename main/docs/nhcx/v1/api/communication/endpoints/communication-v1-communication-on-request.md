# Provider: acknowledge the communication

`POST /v1/communication/on_request`

Provider returns the acknowledgement Task bundle for a payer communication, echoing the reason code and correlation ID so the payer can close the loop.

### Business purpose

A payer that has pushed a TAT alert, grievance, wallet update, policy change or document request needs proof that the hospital received it, because the next adjudication step or SLA clock often depends on it. This callback is that proof. The provider posts a bundle of identical structure to the request, with Task.status completed confirming receipt, and the payer's system can then continue, escalate or wait for the documents. It keeps the entire exchange inside NHCX, auditable by correlation ID, rather than in phone calls and email.

### When to use

The provider calls it to acknowledge a `/v1/communication/request`. It comes after the quick `202` reply and reuses the request's correlation ID and reason.

### Preconditions

- You decrypted the incoming request and answered it `202` within 30 seconds.
- A valid access token and the payer's certificate.
- The acknowledgement mirrors the request and reuses its `x-hcx-correlation_ID`.

### Postconditions

NHCX answers `202` and forwards the acknowledgement to the payer. It only confirms receipt, so the issue itself may still be open.

### Common mistakes

- Using a new correlation ID, so the payer cannot link the acknowledgement.
- Keeping the connection open while someone reads the message, missing the 30-second limit.
- Closing the hospital case because the Communication says `completed`.

### Best practices

- Acknowledge first, process later: return 202 with the acceptance body, queue the bundle, then build and post the on_request acknowledgement asynchronously.
- Switch on Task.reasonCode.code to route: tatquery to the claims desk, walletupdate to the benefit cache, policychange to package rate tables.
- Be idempotent on x-hcx-correlation_ID; the same communication may be redelivered.
- Validate x-hcx-workflow_ID against the workflow of the associated claim or preauth before acting.
- Use IST timestamps and a fresh x-hcx-API_call_ID on the acknowledgement call.
- Log the reason code, category, priority and correlation ID for the audit trail.

### Related scenario

A district hospital receives a communication from the scheme payer on its registered callback: reasonCode additionalinfo, category instruction, asking for an updated discharge summary on a claim submitted last week. The endpoint returns 202 immediately and queues the bundle. The claims desk is notified, and the integration posts the acknowledgement Task on /v1/communication/on_request with the same correlation ID and reasonCode. The desk then attaches the discharge summary through the claim's resubmission path, and the final adjudication arrives later on /v1/claim/on_submit, possibly followed by a payment notice on /v1/paymentnotice/request.

### Specification

Chapter [Communication](/docs/nhcx/v1/reference/fhir/communication) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/communication/on_request \
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

- `202`: The gateway returns HTTP 202 with the StatusSuccessResponse envelope (timestamp, api_call_id, correlation_id, result, error) and forwards the bundle to the payer.
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
  "timestamp": "25/08/2026 11:56:35:004",
  "api_call_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "<provider participant code>",
    "recipient_code": "<payer participant code>",
    "entity_type": "task",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
