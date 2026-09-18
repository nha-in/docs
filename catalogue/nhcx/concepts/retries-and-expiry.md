---
id: nhcx.concept.retries-and-expiry
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Gateway retries and the 24 hour expiry window
summary: >-
  The exchange retries a delivery up to five times and then drops the request and
  tells the sender, and a payer refuses any request whose timestamp is 24 hours
  or more out.
sources:
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q14.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 8.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, PAYR-1005.
related:
  concepts:
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.message-identifiers
  - nhcx.concept.protocol-headers
  - nhcx.concept.status-lifecycle
  - nhcx.concept.error-code-spaces
  callbacks:
  - nhcx.callback.error
  flows:
  - nhcx.flow.report-a-processing-error
  errors:
  - nhcx.error.payr-1005
  - nhcx.error.nhcx-1001
  - nhcx.error.nhcx-1006
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# Gateway retries and the 24 hour expiry window

## In plain words

NHCX does not give up on the first failed delivery. If the recipient does not accept a message, NHCX sends it again, up to five times. After that it drops the request and tells the sender through the sender's `/v1/error` endpoint.

Messages also go stale. A payer refuses a request whose timestamp is 24 hours or more away from the payer's own clock.

## Before you start

Read [the 202 acknowledgement](./synchronous-acknowledgement.md). Your system needs a `/v1/error` endpoint to hear about requests that were dropped.

## What happens

### The retry loop

```mermaid
graph TD
  D["NHCX delivers the message"] --> A{"202 with the acceptance body<br/>within 30 seconds?"}
  A -->|yes| OK["Delivered"]
  A -->|no, or rejected| R{"Fewer than 5 attempts?"}
  R -->|yes| D
  R -->|no| T["Request terminated<br/>and deleted"]
  T --> E["Rejection sent to the sender's /v1/error"]
```

NHCX counts a delivery as failed when the recipient rejects it, answers with the wrong format, or does not answer with 202 within 30 seconds. The interval between attempts is not published.

After the fifth failure, NHCX deletes the request for that correlation id and marks the correlation id inactive. The sender learns about it on `/v1/error`.

### What this means for each side

| You are | Your duty |
|---|---|
| The recipient | Accept within 30 seconds with the right body, or the same message arrives again |
| The recipient | Treat a repeat of a message you already accepted as the same message. Key your inbox on `x-hcx-api_call_id` and `x-hcx-correlation_id` |
| The sender | Implement `/v1/error`, record the rejection and alert your users |
| The sender | Resend a dropped request with a new correlation id |

### The 24 hour window

`x-hcx-timestamp` must be the time you actually send the message. The PMJAY payer refuses a request whose timestamp is 24 hours or more away from its current time. Keep your server clock synchronised, and never reuse a stored timestamp on a resend.

## How you know it worked

You have understood this when you can answer both of these.

1. Your endpoint was down for an hour. A payer's claim response was delivered during that time. What did NHCX do, and how does the payer find out?
2. You resend a request that was dropped yesterday, with the same headers. Name two things that make it fail.

## When it goes wrong

**The same message processed twice.** Your acknowledgement arrived late, so NHCX retried. Deduplicate on the identifiers above before you act.

**Resending with the old correlation id.** NHCX refuses it with [NHCX-1006](../errors/nhcx-1006.md). A dropped request's correlation id is inactive. Use a new one.

**Stale timestamp.** The PMJAY payer refuses it with the message "Maximum time limit exceeded in receiving the request". On the standard payer list [PAYR-1005](../errors/payr-1005.md) means something else, so read the message text.

**Receiver unreachable.** The sender sees [NHCX-1001](../errors/nhcx-1001.md). See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).
