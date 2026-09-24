# Payer: send the coverage eligibility response

`POST /v1/coverageeligibility/on_check`

Payer returns the CoverageEligibilityResponse (policy in force, benefits, auth requirements) or an error to the provider through NHCX.

### Business purpose

This is the answer leg of the eligibility check. The payer (or a TPA acting for it) tells the provider whether the policy is live, which items are covered or excluded, the allowed amounts, whether preauthorisation is required and which supporting documents the preauth must carry. Delivering this before treatment lets the hospital counsel the patient and assemble the right evidence, and lets the payer avoid adjudicating preauths that were never going to be covered.

### When to use

- The payer calls it after it has processed a `/v1/coverageeligibility/check`, with the same `x-hcx-correlation_ID`.
- Set `x-hcx-status` to one of these:
 - `response.complete` for a final answer. Accept `response.completed` as the same value; some samples spell it that way.
 - `response.partial` for a partial answer.
 - `response.error` for a protocol-level rejection, with `x-hcx-error_details` filled in.
- The payload is a CoverageEligibilityResponseBundle with `outcome` `complete`. It says whether the policy is in force (`insurance[*].inforce`), which items are excluded (`item[*].excluded`), and whether a pre-authorisation is needed and with which documents (`item[*].authorizationRequired`, `item[*].authorizationSupporting`).
- A redirect or forward to another payer is also a valid outcome.

### Preconditions

- A check with this correlation ID exists in NHCX.
- The payer has a valid access token and the provider's certificate, and encrypts the answer for the provider.
- `x-hcx-status` is `response.complete`, `response.partial` or `response.error`.
- Business errors go inside the encrypted answer. Only protocol errors go in `x-hcx-error_details`.

### Postconditions

- NHCX answers `202` and forwards the answer to the provider.
- The provider must reply `202` within 30 seconds, or NHCX retries up to five times.
- On success the check is closed and the provider can move on to pre-authorisation.

### Common mistakes

- Replying with `200` or a custom body on the receiving side, which makes NHCX retry.
- Creating a new correlation ID instead of reusing the request's.
- Putting patient or clinical details in `x-hcx-error_details`.

### Best practices

- Acknowledge first, process later: return 202 within 30 seconds and queue decryption and business handling.
- Be idempotent on x-hcx-correlation_ID; the same callback may be redelivered up to five times.
- Set inforce, disposition, excluded, authorizationRequired and authorizationSupporting explicitly so the desk can act without free-text interpretation.
- Use ProtocolResponse with x-hcx-status response.error and a catalogued error code for protocol rejections; put business errors inside the encrypted resource.
- Providers: whitelist the NHCX NAT IPs, expose the callback on a domain name (not IP or port) on an India-based server, and implement v1/error alongside on_check.

### Related scenario

A state health agency's bridge receives an eligibility check for a beneficiary requesting validation and auth-requirements for package SE012A. Its rules engine confirms the policy is active with sufficient wallet balance and that SE012A needs preauthorisation with documents MAND0409, MAND0104 and MAND0062. The bridge builds a CoverageEligibilityResponseBundle, encrypts it for the hospital, sets x-hcx-status response.complete with the original correlation ID and posts it to /v1/coverageeligibility/on_check. NHCX acknowledges with 202 and delivers it to the hospital's callback, which acknowledges within 30 seconds; the hospital then prepares its /v1/preauth/submit.

### Specification

Chapter [Coverage eligibility response](/docs/nhcx/v1/reference/fhir/coverage-eligibility-response) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/on_check \
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

- `202`: The gateway (and, when the callback reaches it, the provider system) returns HTTP 202 Accepted with the StatusSuccessResponse acknowledgement echoing correlation_id and api_call_id, entity_type coverageeligibility and a protocol_status.
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
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "<payer participant code>",
    "recipient_code": "<provider participant code>",
    "entity_type": "coverageeligibility",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
