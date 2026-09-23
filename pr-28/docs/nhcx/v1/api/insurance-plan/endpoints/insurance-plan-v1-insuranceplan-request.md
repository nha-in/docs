# Submit the insurance plan request

`POST /v1/insuranceplan/request`

Provider sends a Task with code poll naming a policy number and/or its HFR ID to fetch the payer's machine-readable InsurancePlan for that pairing.

### Business purpose

Policies have traditionally been PDFs that hospital desks interpret by hand, producing ambiguity about benefits, claim conditions and documents, and rework and rejections downstream. The InsurancePlan API replaces that with a structured, provider-specific, policy-specific contract view: empanelled specialities, package codes and rates, implant and stratification qualifiers, claim conditions such as EnhancementAllowed or Standalone, mandatory documents and questionnaires. Hospitals gain an authoritative view before treatment; payers gain fewer malformed preauths and claims. It is one of the most critical APIs for implementors.

### When to use

Call it before any preauth or claim for a given payer and policy, ideally at patient registration or admission and before treatment planning and cost estimation, alongside coverage eligibility. The request carries no clinical content: a Task with status requested, intent order, code poll (system https://nhcx.ABDM.gov.in/api) and at least one input, policyNumber or providerId (the HFR ID). Send x-hcx-status request.initiated. No dedicated workflow code for InsurancePlan appears in the workflow tables; the Services reference marks x-hcx-workflow_ID optional. The plan arrives asynchronously on /v1/insuranceplan/on_request.

### Preconditions

- Both provider and payer registered on NHCX; valid Bearer token from the client-credentials session call.
- Payer certificate fetched via /fetch/certs and verified before encryption; JWE with RSA-OAEP-256 and A256GCM.
- Task bundle with at least one of policyNumber or providerId in Task.input; both may be supplied for precision.
- Protected header with sender_code, recipient_code, fresh API_call_ID, a fresh UUID correlation_ID for this discovery cycle, IST timestamp and status request.initiated.
- Recipient code taken from processingID in the get/Policies response, not PayerID.
- HTTP headers Accept, Content-Type and bearer_auth.

### Postconditions

The gateway returns HTTP 202 with a StatusSuccessResponse whose result carries sender_code, recipient_code, entity_type insuranceplan and protocol_status; 400, 404 and 500 use the same envelope. The 202 is a receipt, never the plan. The payer later posts an InsurancePlan collection Bundle (InsurancePlan, Organisation, optional Questionnaire) to /v1/insuranceplan/on_request under the same correlation ID, and the provider must acknowledge that with 202 within 30 seconds. The payer may return an empty plan or an error if no coverage matches the policy-provider combination; an empty plan is a business outcome, not a transport failure. Plans may be cached but should be refreshed periodically or when treatment changes.

### Common mistakes

- Sending a Task with no input at all; at least one of policyNumber or providerId is mandatory.
- Expecting the plan in the synchronous response.
- Resubmitting while a previous request is still with the payer: PAYR-1406 rejects a new request until the earlier correlation ID completes (wait 15 to 60 minutes).
- Requesting a policy the hospital is not allowed to use (PAYR-1401), a policy with no payer (PAYR-1402), a renewal not linked to the policy (PAYR-1403), or from an HFR ID or sender ID with no enrolled hospital (PAYR-1405).
- Using the wrong registry ID in production; providers must use the HFR ID.
- Treating an empty plan (PAYR-1404, no treatment under any speciality) as a gateway fault.

### Best practices

- Integrate deeply: call at registration or admission, before cost estimation, and together with coverage eligibility.
- Cache the returned plan and refresh on a schedule or when the treatment plan changes; it is provider-, policy- and MoU-specific.
- Enforce the returned claim conditions (GovtReserved, EnhancementAllowed, QuantityAllowed, ImplantApplicable, Standalone, ParentProcedure, Unspecified) locally before building preauths.
- Persist the correlation ID so the on_request callback can be matched; mint a new one for each discovery cycle.
- Use IST timestamps and a fresh API_call_ID per call.
- Stand up the on_request receiver and v1/error before the first request.

### Related scenario

A PMJAY beneficiary arrives at an empanelled hospital's admission desk. After the desk fetches the patient's policies through the participant registry and resolves the processingID, the integration posts /v1/insuranceplan/request with a Task carrying policyNumber and the hospital's HFR ID. The gateway returns 202. Minutes later the payer's package master arrives on /v1/insuranceplan/on_request: the hospital's empanelled specialities, package codes, rates, implant qualifiers and the mandatory-document questionnaire. The desk selects the relevant package, checks the claim conditions, and proceeds to /v1/coverageeligibility/check and then /v1/preauth/submit.

### Specification

Chapter [Insurance plan request](/docs/nhcx/v1/reference/fhir/insurance-plan-request) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1000004446@hcx' \
  --header 'x-hcx-recipient_code: 1518@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: ' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: request.initiated' \
  --header 'x-hcx-ben-abha-id: ' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxMDAwMDA0NDQ2QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
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

## Body

- `payload` (string)

## Responses

- `202`: The gateway returns HTTP 202 with a StatusSuccessResponse whose result carries sender_code, recipient_code, entity_type insuranceplan and protocol_status; 400, 404 and 500 use the same envelope.

Shape of the 202 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "timestamp": "25/08/2026 09:05:00:188",
  "api_call_id": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "correlation_id": "44556677-8899-aabb-ccdd-eeff00112233",
  "result": {
    "sender_code": "1000004446@hcx",
    "recipient_code": "1518@hcx",
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
