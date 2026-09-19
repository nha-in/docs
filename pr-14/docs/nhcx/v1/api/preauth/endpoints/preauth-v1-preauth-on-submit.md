# Submit the pre-authorisation callback

`POST /v1/preauth/on_submit`

Payer returns the ClaimResponseBundle for a pre-authorisation (approved, partially approved, queried or rejected) to the provider via NHCX.

### Business purpose

This callback carries the payer's decision on a preauth. For the hospital it is the moment the money question is settled: an approval with a preAuthRef lets treatment proceed under a binding commitment, a partial approval tells the desk the amount was capped and why, a query says what evidence is missing, and a rejection closes the request. For the payer it is the channel through which adjudication results, package-rate caps and query text reach the provider in a structured, auditable form.

### When to use

Called by the payer or its TPA after adjudicating a /v1/preauth/submit message, using the same correlation ID. The x-hcx-workflow_ID identifies the outcome: 20 received, 21 approved, 23 rejected, 24 queried, 22 enhancement approved, 241 enhancement queried, 231 enhancement denied, 261, 262 and 263 for discharge. The NHA status sheet frames approvals and rejections as response.complete and queries (24, 241) as request.initiated because the payer is authoring a new request to the provider. ClaimResponse.outcome is complete for approved and rejected, partial for partially approved and queried; adjudication[0].reason.coding.code (approved, queried, cancelled) is the real discriminator.

### Preconditions

- A preauth request with this correlation ID exists in NHCX and has not been deleted after failed deliveries (NHCX-1010 otherwise).
- The payer holds a valid Bearer token and the provider's certificate, and encrypts the ClaimResponseBundle for the provider.
- x-hcx-correlation_ID is echoed from the request; x-hcx-API_call_ID is new; sender and recipient codes are swapped.
- x-hcx-status is response.complete, response.partial or response.error; on error the body is a ProtocolResponse with x-hcx-error_details mandatory.
- preAuthRef is populated on approval and partial approval; processNote explains any reduction; clinical or business error detail stays inside the encrypted resource.

### Postconditions

HTTP 202 Accepted with the StatusSuccessResponse acknowledgement (entity_type preauth) from NHCX, then asynchronous delivery to the provider's registered /v1/preauth/on_submit. The provider must acknowledge with 202 within 30 seconds; otherwise NHCX retries, and after five failures the request is deleted and the sender is notified via v1/error. On an approved or partially approved response the provider persists preAuthRef and may treat; on a query the conversation stays open awaiting 19, 131 or 121; on a rejection the preauth is closed and a new case number is needed to proceed.

### Common mistakes

- Provider side: branching on outcome alone; complete plus reason cancelled is a rejection, complete plus approved is an approval.
- Provider side: treating the pipe-delimited query audit trail (USER~datetime~type~comment~trust) as an FHIR coding and failing to parse it.
- Provider side: returning 200 or a bare body instead of the 202 acceptance shape, which triggers retries and eventual deletion.
- Payer side: minting a new correlation ID, or sending a JWEPayloadResponse where a ProtocolResponse is expected (PAYR-1517).
- Payer side: using the superseded status spelling; the sources show both response.fail and response.error for failures, and the technical specification vocabulary is response.error.
- Both sides: relying on the position of ClaimResponse.total[] entries rather than total[].category.coding.code.

### Best practices

- Provider: acknowledge first, adjudicate later; queue the decrypt and state change and be idempotent on correlation ID.
- Provider: branch on x-hcx-workflow_ID, ClaimResponse.outcome and adjudication[0].reason.coding.code together, and surface processNote text to the desk.
- Provider: persist preAuthRef and the payer identifier (identifier[0].value) against the case for the claim stage.
- Payer: fill disposition, adjudication categories (submitted, eligible, copay, benefit) and processNote so a partial approval is explainable.
- Payer: put protocol errors in x-hcx-error_details with catalogued codes and business errors inside the encrypted ClaimResponse.
- Provider: expose the callback on a domain name on an India-based server and whitelist the NHCX NAT IPs.

### Related scenario

The insurer's adjudication engine reviews a corneal grafting preauth submitted for 25000 INR and caps it at the package rate of 13700 INR. Its bridge builds a ClaimResponseBundle with outcome partial, preAuthRef PREAUTH-HP-2026-78902 and a processNote explaining the cap, sets x-hcx-workflow_ID 21 and x-hcx-status response.complete with the request's correlation ID, encrypts it for the hospital and posts to /v1/preauth/on_submit. NHCX acknowledges with 202 and delivers it to the hospital, whose callback acknowledges inside 30 seconds and shows the desk the reduced amount and reason. Treatment proceeds, and after discharge the hospital submits the final claim on /v1/claim/submit referencing that preAuthRef.

### Specification

Chapter [Preauthorisation response](/docs/nhcx/v1/reference/fhir/preauthorisation-response) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/preauth/on_submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 21' \
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

- `202`: HTTP 202 Accepted with the StatusSuccessResponse acknowledgement (entity_type preauth) from NHCX, then asynchronous delivery to the provider's registered /v1/preauth/on_submit.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1518@hcx",
    "recipient_code": "1000004446@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.dispatched"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
