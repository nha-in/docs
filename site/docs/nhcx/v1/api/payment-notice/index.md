---
title: Payment notice
sidebar_label: Overview
sidebar_position: 0
description: "The Payment notice calls on NHCX: what each one does, the hosts they go to, and the guides that use them."
verification: unverified
source: nhcx-package/apis/06-payment-notice
generated: true
---

# Payment notice

Every other flow exchanges decisions; the payment notice is the only one that tells the hospital whether the money actually moved.

## Calls

| Call | Method and path | What it does |
| --- | --- | --- |
| [Payment notice request](/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-request) | `POST /v1/paymentnotice/request` | Payer pushes a Task bundle with PaymentNotice and PaymentReconciliation (amount, TDS, UTR) to the provider via NHCX after approving a claim. |
| [Payment notice request (internal) (adapter)](/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-internal-v1-paymentnotice-request) | `POST /internal/v1/paymentnotice/request` | Internal twin of /v1/paymentnotice/request (operationId paymentNoticeRequestPostInternal) with the same JWEPayload body and response set. |
| [Payment notice acknowledgement](/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-on-request) | `POST /v1/paymentnotice/on_request` | Provider acknowledges a payment notice with a Task bundle (status completed, output paymentack), closing the payment lifecycle via NHCX. |
| [Payment notice acknowledgement (internal) (adapter)](/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-internal-v1-paymentnotice-on-request) | `POST /internal/v1/paymentnotice/on_request` | Internal twin of /v1/paymentnotice/on_request (operationId paymentNoticeOnRequestPostInternal) with the same JWEPayload body and response set. |

## Callbacks you host

The exchange posts these to the `endpoint_url` you registered. Answer each with HTTP 202 first.

| Path | Hosted by |
| --- | --- |
| `/v1/paymentnotice/request` | The provider |
| `/v1/paymentnotice/on_request` | The payer |

## Base URLs

| Environment | Base URL |
| --- | --- |
| Sandbox, NHCX exchange. | `https://apisbx.abdm.gov.in/hcx` |

## Guides that use these calls

- [Payment notice and acknowledgement](/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement)

The whole specification, with a request you can send from the page, is the [Payment notice API reference](/reference/nhcx-payment-notice).
