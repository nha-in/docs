# Insurance plan

Policies have traditionally been PDFs that hospital desks interpret by hand, producing ambiguity about benefits, claim conditions and documents, and rework and rejections downstream.

## Calls

| Call                                                                                                                                                              | Method and path                              | What it does                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Insurance plan request](/docs/pr-19/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-request)                                           | `POST /v1/insuranceplan/request`             | Provider sends a Task with code poll naming a policy number and/or its HFR id to fetch the payer's machine-readable InsurancePlan for that pairing. |
| [Insurance plan callback](/docs/pr-19/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-on-request)                                       | `POST /v1/insuranceplan/on_request`          | Payer returns the InsurancePlan collection Bundle (InsurancePlan, Organization, optional Questionnaire) under the request correlation id.           |
| [Insurance plan request (internal variant) (adapter)](/docs/pr-19/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-internal-v1-insuranceplan-request)     | `POST /internal/v1/insuranceplan/request`    | Internal twin of /v1/insuranceplan/request on the insuranceplanhcxservice: same TaskBundle payload, same 202 envelope, distinct operationId.        |
| [Insurance plan callback (internal variant) (adapter)](/docs/pr-19/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-internal-v1-insuranceplan-on-request) | `POST /internal/v1/insuranceplan/on_request` | Internal twin of /v1/insuranceplan/on\_request: the payer InsuranceplanBundle callback with identical semantics, distinct operationId.              |

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

- [Insurance plan request](/docs/pr-19/docs/nhcx/v1/reference/fhir/insurance-plan-request)
- [Insurance plan response](/docs/pr-19/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview)

The whole specification, with a request you can send from the page, is the [Insurance plan API reference](/docs/pr-19/reference/nhcx-insurance-plan).
