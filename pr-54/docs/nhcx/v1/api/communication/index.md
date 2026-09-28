# Communication

Every other NHCX exchange is provider-initiated and expects a matching response.

## APIs

| Call                                                                                                                                      | Called by | Method and path                     | What it does                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Payer: send a communication request](/docs/pr-54/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-request)        | Payer     | `POST /v1/communication/request`    | Payer pushes a Task plus Communication bundle to a provider mid-claim: TAT alerts, wallet or policy changes, grievances or extra-information requests.  |
| [Provider: acknowledge the communication](/docs/pr-54/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-on-request) | Provider  | `POST /v1/communication/on_request` | Provider returns the acknowledgement Task bundle for a payer communication, echoing the reason code and correlation id so the payer can close the loop. |

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

- [Building and sending a JWE](/docs/pr-54/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Communication](/docs/pr-54/docs/nhcx/v1/reference/fhir/communication)

Each call has its own page in the sidebar, with a request you can send from it. The whole specification downloads as [YAML](/docs/pr-54/assets/files/nhcx-communication-db28d4c088685f0858d3bfa640da6e65.yaml) or [JSON](/docs/pr-54/assets/files/nhcx-communication-05c8f2ac1b431806c4c93809523b0044.json).
