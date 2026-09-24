# Other

Calls that belong to no single use case: notification subscription, deletion, the status callback and the protocol error report.

Reprocess, cancellation and shortfall have their own group: [Reprocess, cancel and shortfall](/docs/main/docs/nhcx/v1/api/task/).

## APIs

| Call                                                                                                                                   | Called by                                        | Method and path                      | What it does                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Patient app: subscribe an ABHA number to notifications](/docs/main/docs/nhcx/v1/api/other/endpoints/other-v1-notification-subscribe)  | Beneficiary app                                  | `POST /v1/notification/subscribe`    | A Beneficiary Service Provider (PHR app) subscribes an ABHA id to notification topics; NHCX persists it synchronously, Last-Linked-Wins per ABHA id.  |
| [Patient app: acknowledge a notification subscription](/docs/main/docs/nhcx/v1/api/other/endpoints/other-v1-notification-on-subscribe) | NHCX, to the beneficiary app                     | `POST /v1/notification/on_subscribe` | BSP-side subscription acknowledgement; the same name denotes the callback where NHCX pushes claim-event notifications for a subscribed ABHA id.       |
| [Support: delete records by correlation ID](/docs/main/docs/nhcx/v1/api/other/endpoints/other-v1-delete)                               | Any participant, when NHCX support asks          | `POST /v1/delete`                    | Internal troubleshooting operation on the claim service that deletes records by correlationid and action; not part of the business transaction flows. |
| [Recipient: answer a status check](/docs/main/docs/nhcx/v1/api/other/endpoints/other-v1-on-status)                                     | NHCX or the recipient, in answer to `/v1/status` | `POST /v1/on_status`                 | The answer to a status request, delivered to the sender that asked.                                                                                   |
| [NHCX: report a request it could not deliver](/docs/main/docs/nhcx/v1/api/other/endpoints/other-v1-error)                              | NHCX, to the sender                              | `POST /v1/error`                     | Where the exchange tells a sender that a request could not be delivered after five attempts.                                                          |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path            | Hosted by                                 |
| --------------- | ----------------------------------------- |
| `/v1/on_status` | Every participant that sends `/v1/status` |
| `/v1/error`     | Every participant                         |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Building and sending a JWE](/docs/main/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Status and search](/docs/main/docs/nhcx/v1/reference/fhir/status-and-search)
- [Notifications and patient apps](/docs/main/docs/nhcx/v1/reference/notifications-and-patient-apps)
- [Accepted with 202, and no callback arrives](/docs/main/docs/nhcx/v1/troubleshooting/accepted-then-no-callback)

The whole specification, with a request you can send from the page, is the [Other API reference](/docs/main/reference/nhcx-other).
