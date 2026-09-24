# Insurance plan

Policies have traditionally been PDFs that hospital desks interpret by hand, producing ambiguity about benefits, claim conditions and documents, and rework and rejections downstream.

## APIs

| Call                                                                                                                                 | Called by | Method and path                     | What it does                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Provider: request an insurance plan](/docs/pr-46/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-request) | Provider  | `POST /v1/insuranceplan/request`    | Provider sends a Task with code poll naming both a policy number and its HFR id to fetch the payer's machine-readable InsurancePlan for that pairing. |
| [Payer: send the insurance plan](/docs/pr-46/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-on-request)   | Payer     | `POST /v1/insuranceplan/on_request` | Payer returns the InsurancePlan collection Bundle (InsurancePlan, Organization, optional Questionnaire) under the request correlation id.             |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                           | Hosted by    |
| ------------------------------ | ------------ |
| `/v1/insuranceplan/request`    | The payer    |
| `/v1/insuranceplan/on_request` | The provider |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/pr-46/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Insurance plan request](/docs/pr-46/docs/nhcx/v1/reference/fhir/insurance-plan-request)
- [Insurance plan response](/docs/pr-46/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview)

The whole specification, with a request you can send from the page, is the [Insurance plan API reference](/docs/pr-46/reference/nhcx-insurance-plan).
