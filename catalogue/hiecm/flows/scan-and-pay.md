---
id: hiecm.flow.scan-and-pay
type: flow
gateway: hiecm
milestone: n/a
version: abdm-v3
title: "Scan and Pay: take payment for a patient's open orders"
summary: A patient scans the QR code at your counter, sees their open orders in
  their PHR app, pays there, and your system learns the payment status.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/use-cases/scan-and-pay.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/use-cases/scan-and-pay.mdx#scan-and-pay-calls. Edit the
      page, never this file.
related:
  flows:
    - hiecm.flow.p2-scan-and-share
  glossary:
    - hiecm.glossary.hip
    - hiecm.glossary.hiu
    - hiecm.glossary.bridge
    - shared.glossary.phr
    - shared.glossary.hie-cm
---

# Scan and Pay: take payment for a patient's open orders

## In plain words

| Step | Who calls | Path | Carries |
|---|---|---|---|
| 1 | PHR app to HIE-CM | `POST /patient/share/open-order` | The patient's payment details |
| 2 | HIE-CM to your bridge | `POST /v3/patient/share/open-order` | The same, with a transaction id |
| 3 | You to HIE-CM | `POST /patient/on-share/open-order` | Every open order for the patient |
| 4 | PHR app to HIE-CM | `POST /patient/selection` | The open orders the patient picked |
| 5 | HIE-CM to your bridge | `POST /v3/patient/selection` | The selection |
| 6 | You to HIE-CM | `POST /patient/on-selection` | The payment bundle with its procedures |
| 7 | You to HIE-CM | `POST /patient/scan-pay/notify` | The payment status |
| 8 | PHR app to HIE-CM | `POST /patient/scan-pay/on-notify` | Confirmation that the status arrived |
| Later | Either side | `POST /patient/scan-pay/order-status` and `on-order-status` | A status check and its answer |
| Any time | PHR app to HIE-CM | `GET /patient/scan-pay/details` | Everything held for the patient |

The request and response bodies, with every field, are on the
[Scan and Pay API reference](/docs/hiecm/v3/api/scan-and-pay/endpoints/scan-and-pay-abdm-scan-pay-hip/01-scan-and-pay-post-v3-patient-share-open-order).

## Before you start

Your system is a HIP with a bridge registered for M2, and the counter shows the same QR code as Scan and Register. Paths are under `/api/hiecm/scan-gateway/v3` on the gateway, and under `/v3` on your bridge. Every call carries `REQUEST-ID`, `TIMESTAMP`, the gateway `Authorization` token and `X-CM-ID`.

## What happens

The patient scans the counter QR code and the PHR app sends their payment details. You answer with every open order for the patient. The app sends back the orders the patient picked, and you answer with the payment bundle and its procedures. After the patient pays, you send the payment status and the app confirms it received it. Either side can ask for the order status later. Every callback is a POST on your bridge: answer 202 at once, then send the matching reply.

## How you know it worked

Step 2 arrives on your bridge, your step 3 and step 6 return 202, and step 8 comes back on your bridge with the same transaction id after you send the payment status.

## When it goes wrong

No selection after step 3: the patient may not have picked anything yet. No step 8 after step 7: check the status callback URL is registered for your bridge, then use the order status pair to ask. A share for a counter you do not know: reject it rather than guess.
