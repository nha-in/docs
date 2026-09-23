# Coverage eligibility

Coverage eligibility is the pre-check a hospital desk runs before committing a patient to a cashless pathway.

## Calls

| Call                                                                                                                           | Method and path                         | What it does                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [Coverage eligibility check](/docs/main/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-check)       | `POST /v1/coverageeligibility/check`    | Provider asks the payer, via NHCX, whether a beneficiary's policy is in force, what it covers and which documents a preauth will need. |
| [Coverage eligibility callback](/docs/main/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-on-check) | `POST /v1/coverageeligibility/on_check` | Payer returns the CoverageEligibilityResponse (policy in force, benefits, auth requirements) or an error to the provider through NHCX. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                               | Hosted by    |
| ---------------------------------- | ------------ |
| `/v1/coverageeligibility/check`    | The payer    |
| `/v1/coverageeligibility/on_check` | The provider |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Coverage eligibility request](/docs/main/docs/nhcx/v1/reference/fhir/coverage-eligibility-request)
- [Coverage eligibility response](/docs/main/docs/nhcx/v1/reference/fhir/coverage-eligibility-response)

The whole specification, with a request you can send from the page, is the [Coverage eligibility API reference](/docs/main/reference/nhcx-eligibility).
