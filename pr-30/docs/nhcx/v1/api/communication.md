# Communication

Every other NHCX exchange is provider-initiated and expects a matching response.

## Calls

| Call                                                                                                                                                                           | Method and path                              | What it does                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Communication request](/docs/pr-30/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-request)                                                           | `POST /v1/communication/request`             | Payer pushes a Task plus Communication bundle to a provider mid-claim: TAT alerts, wallet or policy changes, grievances or extra-information requests.  |
| [Communication acknowledgement callback](/docs/pr-30/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-on-request)                                       | `POST /v1/communication/on_request`          | Provider returns the acknowledgement Task bundle for a payer communication, echoing the reason code and correlation id so the payer can close the loop. |
| [Communication request (internal variant) (adapter)](/docs/pr-30/docs/nhcx/v1/api/communication/endpoints/communication-internal-v1-communication-request)                     | `POST /internal/v1/communication/request`    | Internal twin of /v1/communication/request: same JWEPayload body, description and 202 envelope, operationId communicationRequestPostInternal.           |
| [Communication acknowledgement callback (internal variant) (adapter)](/docs/pr-30/docs/nhcx/v1/api/communication/endpoints/communication-internal-v1-communication-on-request) | `POST /internal/v1/communication/on_request` | Internal twin of /v1/communication/on\_request: the provider acknowledgement Task bundle, operationId communicationOnRequestPostInternal.               |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                           | Hosted by    |
| ------------------------------ | ------------ |
| `/v1/communication/request`    | The provider |
| `/v1/communication/on_request` | The payer    |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Communication](/docs/pr-30/docs/nhcx/v1/reference/fhir/communication)

The whole specification, with a request you can send from the page, is the [Communication API reference](/docs/pr-30/reference/nhcx-communication).
