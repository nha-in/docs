# Submit the pre-authorisation submit

`POST /v1/preauth/submit`

Provider submits, resubmits, enhances or answers a query on a pre-authorisation Claim bundle (Claim.use preauthorization); NHCX routes it to the payer.

### Business purpose

Pre-authorisation is the provider's formal request for the payer's approval to deliver a specific treatment to a covered beneficiary. An approved preAuthRef is the payer's binding commitment to reimburse the approved amount and is required before the final claim can proceed through NHCX. Settling the money question before the patient enters theatre protects the hospital from unpaid treatment, gives the payer control over admissibility, and gives the patient certainty about cashless cover.

### When to use

Use it to ask the payer to approve a treatment before it starts. The same call also sends a resubmission, an enhancement or an answer to a payer query: the workflow code in the header says which.

### Preconditions

- You have a valid access token and the payer's certificate.
- Coverage is confirmed and the documents the payer asks for are ready.
- The bundle is an FHIR `Claim` with `use` set to `preauthorization`, encrypted for the payer.

### Postconditions

- NHCX answers `202` at once. That only means the message was accepted, not approved.
- The payer's decision arrives later on `/v1/preauth/on_submit`.

### Common mistakes

- Sending to the insurer's code instead of the claims processor's.
- Treating the `202` as an approval.
- Reusing a correlation ID after a failed request.

### Best practices

- Build one ClaimBundle and switch Claim.use between preauthorization and claim; keep careTeamSequence, diagnosisSequence, procedureSequence and informationSequence internally consistent.
- Always send both x-hcx-workflow_ID and x-hcx-use_case, and persist them with the correlation ID and the case number.
- Attach every document the auth-requirements response listed (MAND codes) before submitting; the document list is per package, not static.
- Raise enhancements while the patient is admitted, not retrospectively at discharge (PAYR-1018 time limit expired).
- Persist preAuthRef from an approved or partially approved response; it is required at final claim.
- Implement v1/error and /v1/status so a preauth that never reached the payer is visible at the desk.

### Related scenario

After the eligibility callback confirms cover for corneal grafting (SE012A) and lists the required documents, the hospital builds a Claim bundle with use preauthorization, ICD-10 H18.6, a total of 13700 INR and the investigation and consent attachments, and posts it to /v1/preauth/submit under workflow 12 with use_case New. NHCX returns 202. The payer queries under 24 asking for detailed ICPs; the hospital answers on the same endpoint under 19 with the same correlation ID. Approval arrives under 21 with preAuthRef PREAUTH-HP-2026-78901. Two days later the surgeon needs a higher bed category, so the hospital posts an enhancement under 13 with use_case Enhancement, and after discharge it moves to /v1/claim/submit.

### Specification

Chapter [Preauthorisation request](/docs/nhcx/v1/reference/fhir/preauthorisation-request) of the NHCX integration specification.

### Also sent as pre-authorisation enhancement

The same address, with other headers and body.

Provider asks for more against an approved pre-authorisation, a longer stay or an added package, on the same endpoint and case number as the first request, under workflow 13 with x-hcx-use_case Enhancement.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/preauth/submit \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 12' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
  --header 'x-hcx-use_case: New' \
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
- `x-hcx-use_case` (string): Values differ by exchange, see below. Optional on the envelope.

## Body

- `payload` (string)

## Responses

- `202`: NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type preauth, protocol_status request.queued or request.dispatched).

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "preauth",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
