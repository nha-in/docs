# Provider: acknowledge the payment notice

`POST /v1/paymentnotice/on_request`

Provider acknowledges a payment notice with a Task bundle (status completed, output paymentack), closing the payment lifecycle via NHCX.

### Business purpose

The acknowledgement confirms to the payer that the provider has received and recorded the payment notice for a specific claim. It closes the payment lifecycle from the provider side and completes the audit trail from claim approval through settlement. Failure to acknowledge does not block the payer, but the acknowledgement is required for complete lifecycle tracking, which matters for reconciliation, dispute resolution and scheme reporting.

### When to use

The provider calls it after receiving a payment notice, with the same correlation ID and `x-hcx-status` `response.complete`. It tells the payer the payment was received and recorded.

### Preconditions

- A payment notice with this correlation ID has been received and answered with `202`.
- The provider has a valid access token and the payer's certificate, and encrypts the reply for the payer.
- The `Task` is `completed` and carries `paymentack` and the claim number from the notice.
- The provider is now the sender and requester. The payer is the recipient and owner.

### Postconditions

- NHCX answers `202` and forwards the acknowledgement to the payer.
- On success the payment for that claim is closed on both sides.

### Common mistakes

- Using other text such as `ACKNOWLEDGED` instead of `paymentack`.
- Keeping the notice's direction, with the payer still as requester.
- Creating a new correlation ID instead of reusing the notice's.
- Skipping the acknowledgement, which leaves the payment open.

### Best practices

- Send the acknowledgement only after the UTR, TDS and net amount have been persisted against the claim.
- Echo the claim number from PaymentNotice.identifier (type CLN) into Task.output[1].valueString so the payer can match it without decrypting the original.
- Confirm with the payer during onboarding whether it expects the acknowledgement here or on /v1/task/submit, given the documented source conflict.
- Be idempotent: if the same notice is redelivered, acknowledge again with the same content rather than creating a second ledger entry.
- Log API_call_ID and correlation ID for the acknowledgement so the closed lifecycle can be evidenced.

### Related scenario

The hospital finance team receives the settlement notice under workflow 33 for claim CL0000000001 with UTR UTR000000000001, net 2187 INR and TDS 243 INR. After matching the bank credit and persisting the UTR, the HMIS builds a Task with status completed, code status, output paymentack and claimNumber CL0000000001, encrypts it for the payer and posts it to /v1/paymentnotice/on_request under workflow 17 with the notice's correlation ID. NHCX returns 202 and delivers it to the payer's bridge, which acknowledges within 30 seconds; the claim is now closed on both ledgers.

### Specification

Chapter [Payment notice and acknowledgement](/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/on_request \
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
- `x-hcx-debug_flag` (string): `Error`, `Info` or `Debug`. A server may ignore it. Optional on the envelope.

## Body

- `type` (string, required): Always `JWEPayload`. Every response (`on_`) call sends it beside `payload`. One of: JWEPayload.
- `payload` (string, required)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type payment) and forwards the Task to the payer asynchronously; the payer's endpoint must acknowledge with 202 within 30 seconds or NHCX retries up to five times.
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
  "timestamp": "27/02/2026 10:06:19:310",
  "api_call_id": "b1a2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "correlation_id": "c3d2e1f0-a9b8-4c7d-9e6f-5a4b3c2d1e0f",
  "result": {
    "sender_code": "<provider participant code>",
    "recipient_code": "<payer participant code>",
    "entity_type": "payment",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
