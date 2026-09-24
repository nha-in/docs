# Pre-authorisation

Pre-authorisation is the provider's formal request for the payer's approval to deliver a specific treatment to a covered beneficiary.

## APIs

| Call                                                                                                                      | Called by | Method and path              | What it does                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Provider: submit a pre-authorisation](/docs/pr-41/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)          | Provider  | `POST /v1/preauth/submit`    | Provider submits, resubmits, enhances or answers a query on a pre-authorisation Claim bundle (Claim.use preauthorization); NHCX routes it to the payer. Also sent as pre-authorisation enhancement. |
| [Payer: send the pre-authorisation response](/docs/pr-41/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-on-submit) | Payer     | `POST /v1/preauth/on_submit` | Payer returns the ClaimResponseBundle for a pre-authorisation (approved, partially approved, queried or rejected) to the provider via NHCX.                                                         |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                    | Hosted by    |
| ----------------------- | ------------ |
| `/v1/preauth/submit`    | The payer    |
| `/v1/preauth/on_submit` | The provider |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/pr-41/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Preauthorisation request](/docs/pr-41/docs/nhcx/v1/reference/fhir/preauthorisation-request)
- [Preauthorisation response](/docs/pr-41/docs/nhcx/v1/reference/fhir/preauthorisation-response)
- [Preauthorisation enhancement](/docs/pr-41/docs/nhcx/v1/reference/fhir/preauthorisation-enhancement)
- [Preauthorisation query and answer](/docs/pr-41/docs/nhcx/v1/reference/fhir/preauthorisation-query-and-answer)
- [Resubmission and cancellation of a pre-authorisation](/docs/pr-41/docs/nhcx/v1/roles/provider/preauthorisation#follow-ups-on-the-same-case): resubmission on workflow `121`, cancellation on `PC01`, answered on `PC02`
- [Cancelling a pre-authorisation with a Task](/docs/pr-41/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#cancel)
- [Reprocess, cancel and shortfall calls](/docs/pr-41/docs/nhcx/v1/api/task/): a cancellation is sent on `/v1/task/submit`, not on `/v1/preauth/submit`

The whole specification, with a request you can send from the page, is the [Pre-authorisation API reference](/docs/pr-41/reference/nhcx-preauth).
