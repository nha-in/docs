# Payment notice

Every other flow exchanges decisions; the payment notice is the only one that tells the hospital whether the money actually moved.

## APIs

| Call                                                                                                                                         | Called by | Method and path                     | What it does                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [Payer: send a payment notice](/docs/pr-45/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-request)                | Payer     | `POST /v1/paymentnotice/request`    | Payer pushes a Task bundle with PaymentNotice and PaymentReconciliation (amount, TDS, UTR) to the provider via NHCX after approving a claim. |
| [Provider: acknowledge the payment notice](/docs/pr-45/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-on-request) | Provider  | `POST /v1/paymentnotice/on_request` | Provider acknowledges a payment notice with a Task bundle (status completed, output paymentack), closing the payment lifecycle via NHCX.     |

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

- [Building and sending a JWE](/docs/pr-45/docs/nhcx/v1/getting-started/building-and-sending-a-jwe)
- [Payment notice and acknowledgement](/docs/pr-45/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement)

The whole specification, with a request you can send from the page, is the [Payment notice API reference](/docs/pr-45/reference/nhcx-payment-notice).
