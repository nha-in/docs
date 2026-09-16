# Pre-authorisation submit

`POST /v1/preauth/submit`

Provider submits, resubmits, enhances or answers a query on a pre-authorisation Claim bundle (Claim.use preauthorization); NHCX routes it to the payer.

### Business purpose

Pre-authorisation is the provider's formal request for the payer's approval to deliver a specific treatment to a covered beneficiary. An approved preAuthRef is the payer's binding commitment to reimburse the approved amount and is required before the final claim can proceed through NHCX. Settling the money question before the patient enters theatre protects the hospital from unpaid treatment, gives the payer control over admissibility, and gives the patient certainty about cashless cover.

### When to use

Called after eligibility has confirmed cover and the mandatory documents are in hand. The same endpoint carries several business steps; the x-hcx-workflow_id header (and the optional x-hcx-use_case header with values New, Enhancement or Resubmit) is the discriminator: 12 PREAUTH_REQUEST_INITIATED for a new preauth; 121 PREAUTH_REQUEST_RESUBMITTED after a query or rejection; 19 PREAUTH_QUERY_RESPONSE_SUBMITTED to answer a payer query received under 24; 13 ENHANCEMENT_REQUEST_INITIATED for an additional amount on an already approved preauth, with 131 answering an enhancement query (241); and 14 DISCHARGE_SUBMITTED for the provisional pre-discharge submission that the claim chapter describes for non-PMJAY schemes (answered by 261, 262 or 263), with 141 answering a discharge query. Send x-hcx-status request.initiated on every one of these. Cancellation is not sent here; it goes to /v1/task/submit (PC01 or 122).

### Preconditions

- Provider is an active NHCX participant with a valid NPI facility code and a current Bearer token.
- Patient resource carries the PMJAY Member ID and ABHA number; an active Coverage resource with a valid policy identifier is included.
- Diagnosis (ICD-10), procedure (NRCes ndhm-procedure-code), care team and supportingInfo are present, and the mandatory documents named by the InsurancePlan or the eligibility auth-requirements response are attached.
- For a new PMJAY preauth, either biometric authentication or the Authentication Consent questionnaire response is included (PAYR-1256, PAYR-1271).
- For 13, 19, 121 or 131 a prior preauth in the right state exists (PAYR-1212, PAYR-1214, PAYR-1218, PAYR-1219 otherwise) and the message reuses the episode's correlation identity.
- Payer certificate fetched, bundle JWE-encrypted, recipient code taken from processingID, timestamp in IST.

### Postconditions

NHCX returns HTTP 202 Accepted with a StatusSuccessResponse acknowledgement (entity_type preauth, protocol_status request.queued or request.dispatched). This is not an adjudication; the gateway validates structure and open headers, then forwards asynchronously. The payer may first acknowledge under workflow 20, then answer on /v1/preauth/on_submit with a ClaimResponseBundle: 21 approved (preAuthRef issued), 23 rejected, 24 queried, 22 enhancement approved or 241 enhancement queried, 261, 262 or 263 for discharge. Protocol failures return a ProtocolResponse with x-hcx-error_details. Errors marked 400, 404 and 500 carry the same schema.

### Common mistakes

- Answering a query (24) with a fresh 12 instead of 19, or answering an enhancement query (241) with 19 instead of 131; both arrive on the same callback and are easily crossed.
- Sending an enhancement (13) against a preauth that is not yet approved (PAYR-1212) or while another case is in progress (PAYR-1213), or a new 12 when an approved preauth already exists (PAYR-1217).
- Reusing a correlation ID across cycles (NHCX-1006) or after a failure, when NHCX has marked it inactive.
- Leaving out x-hcx-workflow_id and x-hcx-use_case because the spec marks them Optional; without them the payer cannot tell an enhancement from a duplicate.
- Item and amount errors: PAYR-1017 incorrect calculations, PAYR-1209 net amount not greater than zero, PAYR-1248 invalid item code, PAYR-1254 missing STG questionnaire response, PAYR-1270 sending LM100 at preauth stage.
- Branching on ClaimResponse.outcome alone when the callback arrives; complete means approved or rejected depending on adjudication reason.

### Best practices

- Build one ClaimBundle and switch Claim.use between preauthorization and claim; keep careTeamSequence, diagnosisSequence, procedureSequence and informationSequence internally consistent.
- Always send both x-hcx-workflow_id and x-hcx-use_case, and persist them with the correlation ID and the case number.
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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string, required): The beneficiary's ABHA number. Mandatory on every exchange, including those with no beneficiary in the payload. Mandatory on the envelope.
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
