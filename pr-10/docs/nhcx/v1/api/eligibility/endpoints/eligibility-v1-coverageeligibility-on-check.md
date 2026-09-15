# Coverage eligibility callback

`POST /v1/coverageeligibility/on_check`

Payer returns the CoverageEligibilityResponse (policy in force, benefits, auth requirements) or an error to the provider through NHCX.

### Business purpose

This is the answer leg of the eligibility check. The payer (or a TPA acting for it) tells the provider whether the policy is live, which items are covered or excluded, the allowed amounts, whether preauthorisation is required and which supporting documents the preauth must carry. Delivering this before treatment lets the hospital counsel the patient and assemble the right evidence, and lets the payer avoid adjudicating preauths that were never going to be covered.

### When to use

The payer calls it after it has processed a /v1/coverageeligibility/check request, using the same x-hcx-correlation_id. The protected header carries x-hcx-status response.complete for a final answer (the coverage-eligibility workbook sheets spell this response.completed; the preauth and claim sheets use response.complete), response.partial for a partial answer, or response.error for a protocol-level rejection with x-hcx-error_details populated. The plaintext is a CoverageEligibilityResponseBundle with outcome complete, insurance[*].inforce, item[*].excluded, item[*].authorizationRequired and item[*].authorizationSupporting. A redirect or forward instruction to another payer is an alternate documented outcome.

### Preconditions

- A /v1/coverageeligibility/check request with this correlation ID must exist in NHCX; a callback against an unknown or already deleted correlation ID fails with NHCX-1010.
- The payer has a valid Bearer token and has fetched the provider's certificate to encrypt the response bundle for the provider's private key.
- x-hcx-correlation_id echoes the request's value; x-hcx-api_call_id is a new UUID; sender and recipient codes are swapped relative to the request.
- x-hcx-status is one of response.complete, response.partial or response.error (NHCX-1011 otherwise).
- Business or clinical errors are embedded inside the encrypted CoverageEligibilityResponse, never in the clear header; only protocol errors go in x-hcx-error_details.

### Postconditions

The gateway (and, when the callback reaches it, the provider system) returns HTTP 202 Accepted with the StatusSuccessResponse acknowledgement echoing correlation_id and api_call_id, entity_type coverageeligibility and a protocol_status. NHCX forwards the encrypted response to the provider's registered callback URL; the provider must acknowledge with 202 within 30 seconds or NHCX retries, and after five failed attempts the request under that correlation ID is deleted and the sender is notified via v1/error. On success the eligibility conversation is closed and the provider can decide whether to proceed to preauth.

### Common mistakes

- Returning HTTP 200 or an ad-hoc body instead of the 202 acceptance shape on the receiving side, which NHCX treats as an error and retries up to five times.
- Minting a new correlation ID on the callback instead of echoing the request's (NHCX-1010 no data with given correlation id).
- Sending a JWEPayloadResponse where a ProtocolResponse is expected on error (PAYR-1517), or using the superseded status spelling response.fail versus response.error; the sources disagree, so check which your gateway build accepts.
- Placing patient or clinical error detail in x-hcx-error_details, which the gateway stores for audit.
- Provider side: expecting the response codes to match the request codes verbatim; the payer answers in its own master codes.

### Best practices

- Acknowledge first, process later: return 202 within 30 seconds and queue decryption and business handling.
- Be idempotent on x-hcx-correlation_id; the same callback may be redelivered up to five times.
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
