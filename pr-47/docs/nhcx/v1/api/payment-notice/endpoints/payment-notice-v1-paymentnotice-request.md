# Payer: send a payment notice

`POST /v1/paymentnotice/request`

Payer pushes a Task bundle with PaymentNotice and PaymentReconciliation (amount, TDS, UTR) to the provider via NHCX after approving a claim.

### Business purpose

Every other flow exchanges decisions; the payment notice is the only one that tells the hospital whether the money actually moved. It formally notifies the provider that a payment has been initiated, processed or settled against an approved claim, carrying the net amount, TDS deduction, payment date and the UTR. Hospitals need it to reconcile bank receipts to claims and close the episode; payers need it as the structured, auditable record of settlement.

### When to use

The payer calls it after the final claim is approved, to tell the hospital about the payment. It can be sent up to three times, as the payment is initiated, processed and settled: the workflow code in the header says which.

### Preconditions

- The claim has been approved and the payment has started on the payer's side.
- The payer has a valid access token and the provider's certificate, and encrypts the notice for the provider.
- The notice carries the net amount, the tax deducted and the claim number.
- The payer holds valid bank details for the hospital.

### Postconditions

- NHCX answers `202` and forwards the notice to the provider, who must reply `202` within 30 seconds.
- The payment is closed only after the provider acknowledges on `/v1/paymentnotice/on_request`.

### Common mistakes

- Provider side: expecting a `Claim` or `ClaimResponse`. The notice is a `Task` bundle, with the amounts in `PaymentReconciliation`.
- Provider side: looking for the bank reference (UTR) before the settled notice.
- Provider side: replying with `200` or a bad body, which triggers retries.
- Payer side: sending the notice before the claim is approved.

### Best practices

- Payer: send 30, 31 and 33 as the transfer progresses and populate paymentIdentifier with the UTR at 33; keep TDS and Payment detail lines consistent with the gross claim amount.
- Provider: persist the UTR, TDS and net amount against the claim for audit and dispute resolution, and mark the claim SETTLED only on 33.
- Provider: acknowledge with 202 within 30 seconds, be idempotent on correlation ID, then send the paymentack Task.
- Both: note the source conflict on whether the acknowledgement goes to /v1/paymentnotice/on_request or /v1/task/submit; the API contract supports on_request, so confirm with the counterparty during onboarding.
- Both: use IST timestamps and echo the correlation ID through the acknowledgement.

### Related scenario

Three days after approving claim CL0000000001 for 2430 INR, the state health agency initiates a bank transfer of 2187 INR after 243 INR TDS. Its bridge builds a Task bundle with code deliver, a PaymentNotice with amount 2187 and status paid, and a PaymentReconciliation with the TDS and Payment detail lines, and posts it to /v1/paymentnotice/request under workflow 30. NHCX returns 202 and delivers it to the hospital, which acknowledges within 30 seconds. When the transfer settles the payer sends a second notice under 33 carrying the UTR; the hospital persists it and responds on /v1/paymentnotice/on_request with a paymentack Task.

### Specification

Chapter [Payment notice and acknowledgement](/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/request \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
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

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type payment) and forwards the bundle asynchronously to the provider's registered callback endpoint, which must acknowledge with 202 within 30 seconds.
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
  "timestamp": "27/02/2026 15:36:09:004",
  "api_call_id": "c3d2e1f0-a9b8-4c7d-9e6f-5a4b3c2d1e0f",
  "correlation_id": "c3d2e1f0-a9b8-4c7d-9e6f-5a4b3c2d1e0f",
  "result": {
    "sender_code": "<payer participant code>",
    "recipient_code": "<provider participant code>",
    "entity_type": "payment",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
