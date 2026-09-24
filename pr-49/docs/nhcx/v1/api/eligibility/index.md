# Coverage eligibility

Coverage eligibility is the pre-check a hospital desk runs before committing a patient to a cashless pathway.

## APIs

| Call                                                                                                                                            | Called by | Method and path                         | What it does                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [Provider: check coverage eligibility](/docs/pr-49/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-check)             | Provider  | `POST /v1/coverageeligibility/check`    | Provider asks the payer, via NHCX, whether a beneficiary's policy is in force, what it covers and which documents a preauth will need. |
| [Payer: send the coverage eligibility response](/docs/pr-49/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-on-check) | Payer     | `POST /v1/coverageeligibility/on_check` | Payer returns the CoverageEligibilityResponse (policy in force, benefits, auth requirements) or an error to the provider through NHCX. |

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

- [Building and sending a JWE](/docs/pr-49/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Coverage eligibility request](/docs/pr-49/docs/nhcx/v1/reference/fhir/coverage-eligibility-request)
- [Coverage eligibility response](/docs/pr-49/docs/nhcx/v1/reference/fhir/coverage-eligibility-response)

The whole specification, with a request you can send from the page, is the [Coverage eligibility API reference](/docs/pr-49/reference/nhcx-eligibility).
