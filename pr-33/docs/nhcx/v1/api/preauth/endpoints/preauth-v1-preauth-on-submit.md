# Submit the pre-authorisation callback

`POST /v1/preauth/on_submit`

Payer returns the ClaimResponseBundle for a pre-authorisation (approved, partially approved, queried or rejected) to the provider via NHCX.

### Business purpose

This callback carries the payer's decision on a preauth. For the hospital it is the moment the money question is settled: an approval with a preAuthRef lets treatment proceed under a binding commitment, a partial approval tells the desk the amount was capped and why, a query says what evidence is missing, and a rejection closes the request. For the payer it is the channel through which adjudication results, package-rate caps and query text reach the provider in a structured, auditable form.

### When to use

The payer calls it after deciding on a pre-authorisation, with the same correlation ID. It carries an approval, a partial approval, a query or a rejection: the workflow code in the header says which.

### Preconditions

- A pre-authorisation with this correlation ID exists in NHCX.
- The payer has a valid access token and the provider's certificate, and encrypts the decision for the provider.
- The correlation ID matches the request, the call ID is new, and sender and recipient are swapped.
- An approval carries the `preAuthRef`, and any cut in the amount is explained.

### Postconditions

- NHCX answers `202` and forwards the decision to the provider, who must reply `202` within 30 seconds.
- On approval the provider stores the `preAuthRef` and may treat. A query keeps the request open. A rejection closes it.

### Common mistakes

- Provider side: deciding on `outcome` alone. The adjudication reason says whether it was approved or rejected.
- Provider side: replying with `200` or a bare body, which triggers retries.
- Payer side: creating a new correlation ID instead of reusing the request's.

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
