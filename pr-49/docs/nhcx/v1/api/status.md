# Status and search

Asynchronous exchanges lose messages, stall in queues and outlive the shift of the desk operator who started them.

## APIs

| Call                                                                                                                     | Called by                                | Method and path             | What it does                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Sender: check the status of a request](/docs/pr-49/docs/nhcx/v1/api/status/endpoints/status-v1-status)                  | Any participant, about a request it sent | `POST /v1/status`           | Sender asks NHCX where its own in-flight request stands; the gateway answers request.queued or request.dispatched, and only dispatched yields a callback. |
| [Authorised entity: search for claim information](/docs/pr-49/docs/nhcx/v1/api/status/endpoints/status-v1-search-submit) | NHA or a regulator                       | `POST /v1/search/submit`    | Authorised entity such as NHA or IRDAI sends a Task to retrieve claim information for a case; the payer returns the documents on the search callback.     |
| [Payer: send the search result](/docs/pr-49/docs/nhcx/v1/api/status/endpoints/status-v1-search-on-submit)                | Payer                                    | `POST /v1/search/on_submit` | Callback returning a search result for task type code=poll; for a claim-document search the payload is the ClaimResponse for the reference number.        |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                   | Hosted by                                                        |
| ---------------------- | ---------------------------------------------------------------- |
| `/v1/status`           | The payer                                                        |
| `/v1/search/submit`    | The payer                                                        |
| `/v1/search/on_submit` | The participant that sent the search, such as NHA or a regulator |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/pr-49/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Status and search](/docs/pr-49/docs/nhcx/v1/reference/fhir/status-and-search)
- [Accepted with 202, and no callback arrives](/docs/pr-49/docs/nhcx/v1/troubleshooting/accepted-then-no-callback)
- [Responses arrive against the wrong request](/docs/pr-49/docs/nhcx/v1/troubleshooting/responses-arrive-against-the-wrong-request)

The whole specification, with a request you can send from the page, is the [Status and search API reference](/docs/pr-49/reference/nhcx-status).
