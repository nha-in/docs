# Other

Claims are often not fully approved first time, for mundane reasons: missing documents, policy interpretation differences, package or pricing discrepancies.

## Calls

| Call                                                                                                                          | Method and path                                 | What it does                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Task submit (reprocess or cancel)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-task-submit)                        | `POST /v1/task/submit`                          | Provider sends a FHIR Task asking the payer to reprocess a rejected or short-paid claim or to cancel a preauth; Task.code and reasonCode set the intent. |
| [Task callback (reprocess or cancel outcome)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-task-on-submit)           | `POST /v1/task/on_submit`                       | Payer returns a Task bundle with Task.status completed whose Task.output references a ClaimResponse carrying the reprocess or cancellation outcome.      |
| [Task submit (internal variant) (adapter)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-internal-v1-task-submit)        | `POST /internal/v1/task/submit`                 | Internal twin of /v1/task/submit on the taskhcxservice, operationId hcxTaskPostInternal, with the same JWEPayload Task body and 202 envelope.            |
| [Task callback (internal variant) (adapter)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-internal-v1-task-on-submit)   | `POST /internal/v1/task/on_submit`              | Internal twin of /v1/task/on\_submit (hcxOnTaskPostInternal): the payer Task bundle wrapping the ClaimResponse outcome of a reprocess or cancel.         |
| [Notification subscribe](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-notification-subscribe)                        | `POST /v1/notification/subscribe`               | A Beneficiary Service Provider (PHR app) subscribes an ABHA id to notification topics; NHCX persists it synchronously, Last-Linked-Wins per ABHA id.     |
| [Notification on\_subscribe](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-notification-on-subscribe)                 | `POST /v1/notification/on_subscribe`            | BSP-side subscription acknowledgement; the same name denotes the callback where NHCX pushes claim-event notifications for a subscribed ABHA id.          |
| [Delete records (troubleshooting)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-delete)                              | `POST /v1/delete`                               | Internal troubleshooting operation on the claim service that deletes records by correlationid and action; not part of the business transaction flows.    |
| [OpenAPI 3 document (status service)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v3-api-docs)                         | `GET /v3/api-docs`                              | Serves the status service's OpenAPI 3 document, optionally filtered by a group query parameter; a discovery endpoint, not a protocol API.                |
| [Swagger 2 document (status service)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v2-api-docs)                         | `GET /v2/api-docs`                              | Serves the status service's Swagger 2 document, optionally filtered by a group query parameter; a discovery endpoint, not a protocol API.                |
| [Swagger resources list](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-swagger-resources)                                | `GET /swagger-resources`                        | Lists the Swagger resources (API document locations) exposed by the status service; used by Swagger UI, not by integrations.                             |
| [Swagger UI configuration](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-swagger-resources-configuration-ui)             | `GET /swagger-resources/configuration/ui`       | Returns the Swagger UI display configuration for the status service; consumed by Swagger UI, not by integrations.                                        |
| [Swagger security configuration](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-swagger-resources-configuration-security) | `GET /swagger-resources/configuration/security` | Returns the Swagger UI security configuration for the status service; consumed by Swagger UI, not by integrations.                                       |
| [Status callback](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-on-status)                                            | `POST /v1/on_status`                            | The answer to a status request, delivered to the sender that asked.                                                                                      |
| [Error report (callback)](/docs/pr-21/docs/nhcx/v1/api/other/endpoints/other-v1-error)                                        | `POST /v1/error`                                | Where the exchange tells a sender that a request could not be delivered after five attempts.                                                             |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                 | Hosted by         |
| -------------------- | ----------------- |
| `/v1/task/submit`    | The payer         |
| `/v1/task/on_submit` | The provider      |
| `/v1/on_status`      | The provider      |
| `/v1/error`          | Every participant |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Cancel, reprocess and shortfall](/docs/pr-21/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall)
- [Predetermination, status and search](/docs/pr-21/docs/nhcx/v1/reference/fhir/predetermination-status-and-search)
- [Notifications and patient apps](/docs/pr-21/docs/nhcx/v1/reference/notifications-and-patient-apps)
- [Accepted with 202, and no callback arrives](/docs/pr-21/docs/nhcx/v1/troubleshooting/accepted-then-no-callback)

The whole specification, with a request you can send from the page, is the [Other API reference](/docs/pr-21/reference/nhcx-other).
