# Submit the coverage eligibility check

`POST /v1/coverageeligibility/check`

Provider asks the payer, via NHCX, whether a beneficiary's policy is in force, what it covers and which documents a preauth will need.

### Business purpose

Coverage eligibility is the pre-check a hospital desk runs before committing a patient to a cashless pathway. It confirms three things the desk needs: that the policy is active, what benefits and wallet balance are available, and whether a specific procedure needs authorisation at all. A rejection that would otherwise surface days later at preauth or claim adjudication surfaces in seconds while the patient is still at the counter, which benefits the hospital (less rework), the payer (fewer malformed preauths) and the patient (earlier certainty).

### When to use

Call it at registration or admission, before you submit a pre-authorisation. The `purpose` field says what you want back, such as whether the policy is active or whether a procedure needs approval.

### Preconditions

- You have a valid access token and the payer's certificate.
- `x-hcx-recipient_code` is the processing ID from the policy lookup, not the payer ID.
- `x-hcx-correlation_ID` is a new UUID for this check.
- The bundle names the patient, the coverage, the hospital and the insurer, encrypted for the payer.

### Postconditions

- NHCX answers `202` at once. That only means the message was accepted.
- The payer's answer arrives later on `/v1/coverageeligibility/on_check`.

### Common mistakes

- Treating the `202` as the eligibility answer.
- Using the payer ID as the recipient code instead of the processing ID.
- Reusing a correlation ID from an earlier check.
- Sending a status other than `request.initiated`.

### Best practices

- Persist the correlation ID against the patient episode before posting; it is the only key for matching the callback.
- Refresh the token automatically before the 1200-second expiry and treat a 401 as refresh-and-retry-once.
- Run discovery first only when get/policies gives no policy code, then validation, then auth-requirements for the chosen package; store the returned MAND codes and STG questionnaire references and attach them to the preauth.
- "Match response items to your request by `productOrService` code: the payer answers in the package codes you sent, for example `MG004A`, as NHA's published PMJAY bundles show. The numbers in the handbook's response table (100005, 100478, 100063, 100012) are not item codes; in the published bundles they are questionnaire, document-requirement and question identifiers."
- Use IST timestamps with the +05:30 offset in the protected header.
- Log the 202 body (protocol_status, API_call_ID) so a missing callback can be traced with /v1/status.

### Related scenario

A patient arrives at a district hospital with a PMJAY card. The desk calls /participant/get/policies and receives a processingID for the state health agency. Because the treating doctor wants a corneal grafting package, the desk builds a CoverageEligibilityRequest with purpose validation and auth-requirements, encrypts it for the payer and posts it to /v1/coverageeligibility/check, receiving a 202 with protocol_status request.queued. Minutes later the payer's answer lands on /v1/coverageeligibility/on_check with inforce true, authorizationRequired true and MAND0409 and MAND0104 listed as supporting documents. The desk collects those documents and proceeds to /v1/preauth/submit under workflow 12.

### Specification

Chapter [Coverage eligibility request](/docs/nhcx/v1/reference/fhir/coverage-eligibility-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: 11' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: 91711234567890' \
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

## Body

- `payload` (string)

## Responses

- `202`: NHCX replies synchronously with HTTP 202 Accepted and a StatusSuccessResponse acknowledgement (timestamp, api_call_id, correlation_id, result with sender_code, recipient_code, entity_type coverageeligibility and protocol_status such as request.queued or request.dispatched, plus an empty error object).

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "19/03/2026 11:46:35:120",
  "api_call_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "correlation_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "coverageeligibility",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
