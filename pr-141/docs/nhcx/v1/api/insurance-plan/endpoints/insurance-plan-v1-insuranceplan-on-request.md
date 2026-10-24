# Payer: send the insurance plan

`POST /v1/insuranceplan/on_request`

Payer returns the InsurancePlan collection Bundle (InsurancePlan, Organisation, optional Questionnaire) under the request correlation ID.

### Business purpose

This callback delivers the digital policy that every later preauth and claim is judged against. The payer publishes, for one policy and one hospital, the empanelled specialities, packages and rates, cost qualifiers for implants and stratification, exclusions, claim conditions and mandatory documents, and the questionnaires for standard treatment guidelines or history. Hospitals use it to select packages and validate submissions before they go out; payers use it to cut malformed requests and to make the MoU an enforceable, machine-readable contract view rather than a PDF.

### When to use

The payer calls it after receiving a plan request, with the same correlation ID. It sends the plan for that policy and hospital, or an error if no plan can be produced.

### Preconditions

- The payer has already replied `202` to the incoming request.
- The payer has a valid access token and the provider's certificate, and encrypts the plan for the provider.
- The bundle holds the `InsurancePlan`, the organisations and any questionnaires.
- The correlation ID matches the request, and the call ID is new.

### Postconditions

- NHCX answers `202` and forwards the plan to the provider, who must reply `202` within 30 seconds.
- The provider may cache the plan and checks later pre-authorisations and claims against it.

### Common mistakes

- Returning the plan in the `202` reply to the request.
- Creating a new correlation ID instead of reusing the request's.
- Sending the full package list instead of the part that applies to this hospital.
- Provider side: treating an empty plan as a transport failure.

### Best practices

- Acknowledge the inbound request first, build the bundle asynchronously, then post this callback.
- Filter to the requesting provider's empanelled specialities and the named policy; include Questionnaire resources for mandatory documents and STGs.
- Use the documented claim-condition codes (GovtReserved, ApprovalNotRequired, EnhancementAllowed, QuantityAllowed, IsDayCare, ImplantApplicable, StratificationAllowed, Standalone, ParentProcedure, Unspecified) so provider systems can enforce them.
- Provider side: cache with periodic refresh, refresh when treatment changes, and validate preauth items against the plan's speciality and package codes.
- Use a fresh API_call_ID, IST timestamp and response.complete or response.error.

### Related scenario

A state health agency's payer platform receives a plan discovery Task from an empanelled hospital for policy PMJAY with the hospital's HFR ID. It returns 202, then generates the InsurancePlan bundle: General Medicine and Ophthalmology as specificCost categories, each package as a benefit with its rate, implant qualifiers on the packages that allow them, EnhancementAllowed and Standalone conditions, and the proof-of-identity questionnaire. It posts /v1/insuranceplan/on_request under the same correlation ID. The hospital acknowledges within 30 seconds, caches the plan, selects a package, and moves to /v1/coverageeligibility/check before submitting the preauth.

### Specification

Chapter [Insurance plan response](/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/on_request \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "JWEPayload",
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

- `type` (string, required): Always `JWEPayload`. Every response (`on_`) call sends it beside `payload`. One of: JWEPayload.
- `payload` (string, required)

## Responses

- `202`: The gateway returns HTTP 202 with the StatusSuccessResponse envelope (400, 404 and 500 in the same shape) and forwards the bundle to the provider's registered endpoint, which must acknowledge with 202 within 30 seconds.
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
  "timestamp": "25/08/2026 09:12:00:502",
  "api_call_id": "c9d0e1f2-a3b4-5678-2345-789012345678",
  "correlation_id": "44556677-8899-aabb-ccdd-eeff00112233",
  "result": {
    "sender_code": "<payer participant code>",
    "recipient_code": "<provider participant code>",
    "entity_type": "insuranceplan",
    "protocol_status": "request.queued"
  },
  "error": {
    "code": "",
    "message": ""
  }
}
```
