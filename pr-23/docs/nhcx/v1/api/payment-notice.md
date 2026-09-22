# Payment notice

Every other flow exchanges decisions; the payment notice is the only one that tells the hospital whether the money actually moved.

## Calls

| Call                                                                                                                                                             | Method and path                              | What it does                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [Payment notice request](/docs/pr-23/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-request)                                          | `POST /v1/paymentnotice/request`             | Payer pushes a Task bundle with PaymentNotice and PaymentReconciliation (amount, TDS, UTR) to the provider via NHCX after approving a claim.    |
| [Payment notice request (internal) (adapter)](/docs/pr-23/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-internal-v1-paymentnotice-request)            | `POST /internal/v1/paymentnotice/request`    | Internal twin of /v1/paymentnotice/request (operationId paymentNoticeRequestPostInternal) with the same JWEPayload body and response set.       |
| [Payment notice acknowledgement](/docs/pr-23/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-on-request)                               | `POST /v1/paymentnotice/on_request`          | Provider acknowledges a payment notice with a Task bundle (status completed, output paymentack), closing the payment lifecycle via NHCX.        |
| [Payment notice acknowledgement (internal) (adapter)](/docs/pr-23/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-internal-v1-paymentnotice-on-request) | `POST /internal/v1/paymentnotice/on_request` | Internal twin of /v1/paymentnotice/on\_request (operationId paymentNoticeOnRequestPostInternal) with the same JWEPayload body and response set. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path                           | Hosted by    |
| ------------------------------ | ------------ |
| `/v1/paymentnotice/request`    | The provider |
| `/v1/paymentnotice/on_request` | The payer    |

## Base URLs

| Environment             | Base URL                          |
| ----------------------- | --------------------------------- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx`  |
| Production.             | `https://apisprod.nha.gov.in/hcx` |

## Guides that use these calls

- [Payment notice and acknowledgement](/docs/pr-23/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement)

The whole specification, with a request you can send from the page, is the [Payment notice API reference](/docs/pr-23/reference/nhcx-payment-notice).
