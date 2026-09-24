# Provider: request an insurance plan

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
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
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

## Body

- `payload` (string)

## Responses

- `202`: The gateway returns HTTP 202 with a StatusSuccessResponse whose result carries sender_code, recipient_code, entity_type insuranceplan and protocol_status; 400, 404 and 500 use the same envelope.
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
  "timestamp": "25/08/2026 09:05:00:188",
  "api_call_id": "b8c9d0e1-f2a3-4567-1234-678901234567",
  "correlation_id": "44556677-8899-aabb-ccdd-eeff00112233",
  "result": {
    "sender_code": "<provider participant code>",
    "recipient_code": "<payer participant code>",
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
