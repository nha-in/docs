---
id: nhcx.decision.status-poll-or-wait
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Poll with /v1/status or wait for the callback
summary: >-
  Wait for the answer to come to you, and ask where a request stands only when its
  answer is overdue.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Status.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q12.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.four-message-legs
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.status-lifecycle
  flows:
  - nhcx.flow.status-check
  endpoints:
  - nhcx.endpoint.status
  callbacks:
  - nhcx.callback.on-status
  - nhcx.callback.error
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1012
  tests:
  - nhcx.test.provider-uc-13
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  glossary:
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
---

# Poll with /v1/status or wait for the callback

## In plain words

When [NHCX](../../shared/glossary/nhcx.md) accepts your request with `202`, the answer comes later on the `on_` callback. `POST /v1/status` tells you where a request stands in the meantime.

Wait for the callback. Call `/v1/status` only when the callback is overdue, then act on what it says. Never resubmit to find out.

## Before you start

- Your callback endpoint answers `202` within 30 seconds. See [the 202 acknowledgement and the 30 second rule](../concepts/synchronous-acknowledgement.md).
- You implement `/v1/error`. See [receiving POST /v1/error](../callbacks/error.md).
- You store each request's api call id and correlation id against the case before you send it.

## What happens

| | Wait for the callback | Call `/v1/status` |
|---|---|---|
| What you learn | The decision itself, sealed in the `on_` callback | Where the request is: `request.queued` or `request.dispatched` |
| Cost | Nothing beyond your callback endpoint | One sealed call per check |
| What follows | Nothing: the callback ends the cycle | `request.queued`: nothing yet; the request is still inside NHCX. `request.dispatched`: the recipient holds it, and a `/v1/on_status` callback follows |

The default is to wait. Every decision, acknowledgement and error reaches you through a callback. `/v1/status` reports transport position only.

When a callback is overdue by your own tolerance, send one [status check](../endpoints/status.md):

- Set `x-hcx-correlation_id` to the api call id of the request you are checking.
- Set `x-hcx-status` to `request.initiated`.
- Use a fresh `x-hcx-api_call_id`.

Set each initiating request's correlation id equal to its api call id. The status call then carries that one value. See [correlation id](../glossary/correlation-id.md).

## How you know it worked

- Callbacks arrive for requests you never checked.
- Each status call you make returns `202` with `protocol_status` `request.queued` or `request.dispatched`.
- Your logs show no `NHCX-1006` from a resubmitted request.

## When it goes wrong

Moving from polling to waiting means deleting scheduled status calls and keeping one check for overdue requests. Nothing is registered, so you can switch at any time.

- `NHCX-1006`: you resubmitted a request with its original correlation id. See [NHCX-1006](../errors/nhcx-1006.md).
- `NHCX-1012`: the status call's correlation id matches no api call id you sent. Use the original request's api call id. See [NHCX-1012](../errors/nhcx-1012.md).
- Status finds nothing for a request you did send: after five failed deliveries, NHCX deletes the request and the failure goes to your `/v1/error`. Start a new cycle. See [gateway retries and the 24 hour expiry window](../concepts/retries-and-expiry.md).
- The callback never comes at all: see [the request was accepted with 202 and no callback arrives](../troubleshooting/accepted-then-no-callback.md).
