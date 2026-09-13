# Insurance plan callback

`POST /v1/insuranceplan/on_request`

Payer returns the InsurancePlan collection Bundle (InsurancePlan, Organization, optional Questionnaire) under the request correlation id.

### Business purpose

This callback delivers the digital policy that every later preauth and claim is judged against. The payer publishes, for one policy and one hospital, the empanelled specialities, packages and rates, cost qualifiers for implants and stratification, exclusions, claim conditions and mandatory documents, and the questionnaires for standard treatment guidelines or history. Hospitals use it to select packages and validate submissions before they go out; payers use it to cut malformed requests and to make the MoU an enforceable, machine-readable contract view rather than a PDF.

### When to use

The payer calls it after receiving a /v1/insuranceplan/request Task (code poll), acknowledging it with 202 and assembling the plan for the policyNumber and/or providerId supplied. The bundle is of type collection and follows one of two structures: plan, specificCost, category, benefit, cost, qualifiers (the PMJAY package-master shape) or coverage, benefit, limit. Carry the same x-hcx-correlation_id as the request and a responder x-hcx-status (response.complete, or response.error with x-hcx-error_details when no plan can be produced). The plan may legitimately be empty when no coverage matches.

### Preconditions

- The inbound Task was decrypted, its correlation id captured and the 202 acceptance body already returned.
- Payer registered on NHCX with a valid Bearer token and the provider's certificate for JWE encryption.
- A collection Bundle containing InsurancePlan (with plan.generalCost for the overall sum insured, specificCost per speciality, benefit per package with cost and qualifiers, and the claim-exclusion, claimCondition and claimSupportingInfoRequirement extensions), Organization entries and any Questionnaire resources.
- Protected header echoing the request's correlation id with a fresh api_call_id, IST timestamp and responder status; request body declared as a bare object in the OpenAPI but still a JWE per RFC-7516.

### Postconditions

The gateway returns HTTP 202 with the StatusSuccessResponse envelope (400, 404 and 500 in the same shape) and forwards the bundle to the provider's registered endpoint, which must acknowledge with 202 within 30 seconds. After decryption the provider holds the plan, may cache it, and must enforce its claim conditions and document requirements before preauth. Codes carried in the plan, such as specificCost.category as the speciality code and benefit.type as the procedure code, are what later PAYR-1114, PAYR-1202 and PAYR-1204 validations are checked against. Errors returned instead of a plan use PAYR-1401 to PAYR-1406.

### Common mistakes

- Returning the plan in the synchronous 202 to the request, or before acknowledging the inbound Task within 30 seconds.
- Minting a new correlation id rather than echoing the request's (NHCX-1010).
- Encoding cost.value as the package rate; the IG defines it as the extra amount paid over and above the procedure cost.
- Synthesising codes for claim conditions listed as NA (rules_yn, los, ip_op_flag, incentive_applicable, gst_applicable, gst_percentage).
- Shipping the full package master unfiltered; the response must be provider-specific and contextually filtered per the MoU.
- Provider side: treating an empty plan as a transport failure, or failing to parse both structuring approaches.

### Best practices

- Acknowledge the inbound request first, build the bundle asynchronously, then post this callback.
- Filter to the requesting provider's empanelled specialities and the named policy; include Questionnaire resources for mandatory documents and STGs.
- Use the documented claim-condition codes (GovtReserved, ApprovalNotRequired, EnhancementAllowed, QuantityAllowed, IsDayCare, ImplantApplicable, StratificationAllowed, Standalone, ParentProcedure, Unspecified) so provider systems can enforce them.
- Provider side: cache with periodic refresh, refresh when treatment changes, and validate preauth items against the plan's speciality and package codes.
- Use a fresh api_call_id, IST timestamp and response.complete or response.error.

### Related scenario

A state health agency's payer platform receives a plan discovery Task from an empanelled hospital for policy PMJAY with the hospital's HFR id. It returns 202, then generates the InsurancePlan bundle: General Medicine and Ophthalmology as specificCost categories, each package as a benefit with its rate, implant qualifiers on the packages that allow them, EnhancementAllowed and Standalone conditions, and the proof-of-identity questionnaire. It posts /v1/insuranceplan/on_request under the same correlation id. The hospital acknowledges within 30 seconds, caches the plan, selects a package, and moves to /v1/coverageeligibility/check before submitting the preauth.

### Specification

Chapter [Insurance plan response](/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview) of the NHCX integration specification.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/on_request \
  --header 'bearer_auth: Bearer <access token>' \
  --header 'x-hcx-sender_code: 1518@hcx' \
  --header 'x-hcx-recipient_code: 1000004446@hcx' \
  --header 'x-hcx-api_call_id: <uuid>' \
  --header 'x-hcx-request_id: <uuid>' \
  --header 'x-hcx-correlation_id: <uuid>' \
  --header 'x-hcx-workflow_id: ' \
  --header 'x-hcx-timestamp: <iso timestamp>' \
  --header 'x-hcx-status: response.complete' \
  --header 'x-hcx-ben-abha-id: ' \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIiwieC1oY3gtc2VuZGVyX2NvZGUiOiIxNTE4QGhjeCJ9.encrypted_key.iv.ciphertext.tag"
}'
```
