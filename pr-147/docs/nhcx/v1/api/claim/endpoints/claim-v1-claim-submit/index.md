# Provider: submit a claim

`POST /v1/claim/submit`

Provider submits the final itemised Claim bundle (Claim.use claim), or a claim query response or resubmission; NHCX routes it to the payer.

### Business purpose

The claim is where money actually moves. After treatment the provider assembles finalised bills, the complete document set and the preAuthRef, and asks the payer to adjudicate and settle. A well-prepared claim closes within days; a poorly prepared one cycles through queries and resubmissions for weeks. The endpoint gives hospitals a single structured channel for settlement requests and gives payers a complete evidentiary package against which to calculate the approved amount, apply deductions and trigger payment.

### When to use

Use it after discharge to claim payment for a case with an approved pre-authorisation. The same call answers a payer query on the claim: the workflow code in the header says which. A reprocess goes through `/v1/task/submit` instead.

### Preconditions

- An approved pre-authorisation exists, and no claim has been raised for the case yet.
- The bundle is an FHIR `Claim` with `use` set to `claim` and the final bill amounts.
- Discharge details and the required documents are attached. For PMJAY, so is proof of presence at discharge.
- A valid access token, the payer's certificate and a fresh correlation ID.

### Postconditions

- NHCX answers `202` at once. That only means the message was accepted.
- The payer's answers arrive later on `/v1/claim/on_submit`, possibly several times.
- A `response.complete` closes the claim. Nothing more can be sent on it.

### Common mistakes

- Claiming more than the pre-authorisation approved, or items it did not include.
- Answering a claim query as a new claim instead of a query reply.
- Missing documents the payer asked for, which causes a query and delays payment.
- Reusing the pre-authorisation's correlation ID for the claim.

### Best practices

- Start from the approved preauth payload: keep diagnosis and procedure entries, change Claim.use to claim, replace estimates with final amounts and add the full document set.
- Reference preAuthRef and reuse the case number; key every submission on the correlation ID and persist workflow ID and use_case with it.
- Check response.outcome on every callback; partial means the claim is still live, so keep monitoring the same correlation ID.
- Validate supportingInfo value types and discharge codes before encrypting; the PAYR-1098, 1099 and 1501 to 1505 family rejects malformed supporting info.
- For LAMA discharges send stratification with duration; for cyclic procedures send cycle information for every cycle with one biometric record per date (PAYR-1368, PAYR-1369).
- Implement v1/error and use /v1/status with the claim's correlation ID when no callback arrives.

### Related scenario

A patient is discharged home after the corneal grafting approved under preAuthRef PREAUTH-HP-2026-78901. The billing desk takes the preauth bundle, sets Claim.use to claim, records discharge code DTH After Surgery, attaches the discharge summary, operative notes and final itemised bill of 13700 INR, and posts it to /v1/claim/submit under workflow 15 with use_case New and a new correlation ID. NHCX returns 202. The payer sends 25 and 28 as response.partial, then queries under 27 for a missing investigation report; the hospital answers under 151. Approval arrives under 26 as response.complete, and a payment notice follows on /v1/paymentnotice/request.

### Specification

Chapter [Claim request](/docs/nhcx/v1/reference/fhir/claim-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/claim/submit \
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
- `x-hcx-use_case` (string): Values differ by exchange. [Domain headers](/docs/nhcx/v1/reference/envelope-fields#domain-headers) lists them. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type claim) and forwards the request asynchronously.
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
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "correlation_id": "5d4c3b2a-1f0e-4d9c-8b7a-6f5e4d3c2b1a",
  "result": {
    "sender_code": "<provider participant code>",
    "recipient_code": "<payer participant code>",
    "entity_type": "claim",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
