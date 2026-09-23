# Submit the insurance plan request

`POST /v1/insuranceplan/request`

Provider sends a Task with code poll naming both a policy number and its HFR ID to fetch the payer's machine-readable InsurancePlan for that pairing.

### Business purpose

Policies have traditionally been PDFs that hospital desks interpret by hand, producing ambiguity about benefits, claim conditions and documents, and rework and rejections downstream. The InsurancePlan API replaces that with a structured, provider-specific, policy-specific contract view: empanelled specialities, package codes and rates, implant and stratification qualifiers, claim conditions such as EnhancementAllowed or Standalone, mandatory documents and questionnaires. Hospitals gain an authoritative view before treatment; payers gain fewer malformed preauths and claims. It is one of the most critical APIs for implementors.

### When to use

Call it before any pre-authorisation or claim for a payer and policy, ideally at registration. It fetches the plan: covered treatments, rates and required documents.

### Preconditions

- You have a valid access token and the payer's certificate.
- The request is an FHIR `Task` with both the policy number and the hospital's HFR ID.
- `x-hcx-recipient_code` is the processing ID, not the payer ID, and the correlation ID is new.

### Postconditions

- NHCX answers `202` at once. That is a receipt, not the plan.
- The plan arrives later on `/v1/insuranceplan/on_request`. It may be empty if nothing matches.

### Common mistakes

- Sending a `Task` without both the policy number and the HFR ID.
- Expecting the plan in the `202` response.
- Sending a new request while an earlier one is still with the payer.
- Treating an empty plan as a gateway fault.

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
- `x-hcx-request_id` (string): One per originating request. The Open Protocol page marks it Mandatory; the Technical Specifications page marks it Optional. Optional on the envelope. Send it anyway, as a fresh UUID per originating request: it is cheap and satisfies both readings until NHA rules.
- `x-hcx-correlation_id` (string, required): The thread. See the rule below. Mandatory on the envelope.
- `x-hcx-workflow_id` (string): Which step, or which case. See the two readings below. Optional on the envelope.
- `x-hcx-timestamp` (string, required): See the format note below. Mandatory on the envelope.
- `x-hcx-status` (string, required): Where this message stands. Values below. Mandatory on the envelope.
- `x-hcx-ben-abha-id` (string): The beneficiary's ABHA number. Optional: send it when the beneficiary has an ABHA number. Optional on the envelope.

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
