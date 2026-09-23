# Submit the coverage eligibility callback

`POST /v1/coverageeligibility/on_check`

Payer returns the CoverageEligibilityResponse (policy in force, benefits, auth requirements) or an error to the provider through NHCX.

### Business purpose

This is the answer leg of the eligibility check. The payer (or a TPA acting for it) tells the provider whether the policy is live, which items are covered or excluded, the allowed amounts, whether preauthorisation is required and which supporting documents the preauth must carry. Delivering this before treatment lets the hospital counsel the patient and assemble the right evidence, and lets the payer avoid adjudicating preauths that were never going to be covered.

### When to use

The payer calls it after processing an eligibility check, with the same correlation ID. It says whether the policy is active, what is covered and whether a pre-authorisation is needed.

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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.
- `x-hcx-debug_flag` (string): `Error`, `Info` or `Debug`. A server may ignore it. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: The gateway (and, when the callback reaches it, the provider system) returns HTTP 202 Accepted with the StatusSuccessResponse acknowledgement echoing correlation_id and api_call_id, entity_type coverageeligibility and a protocol_status.

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
