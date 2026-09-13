# Claim

The claim is where money actually moves.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Claim submit](/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-submit) | `POST /v1/claim/submit` | Provider submits the final itemised Claim bundle (Claim.use claim), or a claim query response or resubmission; NHCX routes it to the payer. |
| [Claim callback](/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-on-submit) | `POST /v1/claim/on_submit` | Payer returns interim (response.partial) and final (response.complete) ClaimResponseBundles for a claim to the provider via NHCX. |
| [Claim submit (internal) (adapter)](/docs/nhcx/v1/api/claim/endpoints/claim-internal-v1-claim-submit) | `POST /internal/v1/claim/submit` | Internal twin of /v1/claim/submit (operationId claimSubmitPostInternal) with the same JWEPayload body and response set. |
| [Claim callback (internal) (adapter)](/docs/nhcx/v1/api/claim/endpoints/claim-internal-v1-claim-on-submit) | `POST /internal/v1/claim/on_submit` | Internal twin of /v1/claim/on_submit (operationId claimOnSubmitPostInternal) taking the same bare object body. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path | Hosted by |
| --- | --- |
| `/v1/claim/submit` | The payer |
| `/v1/claim/on_submit` | The provider |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx` |

## Guides that use these calls

- [Claim request](/docs/nhcx/v1/reference/fhir/claim-request)
- [Claim response](/docs/nhcx/v1/reference/fhir/claim-response)
- [Claim query and answer](/docs/nhcx/v1/reference/fhir/claim-query-and-answer)

The whole specification, with a request you can send from the page, is the [Claim API reference](/reference/nhcx-claim).
