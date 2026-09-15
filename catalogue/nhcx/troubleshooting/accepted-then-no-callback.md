---
id: nhcx.troubleshooting.accepted-then-no-callback
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The request was accepted with 202 and no callback arrives
summary: >-
  Your request was accepted and the answer never came back. The checks that find
  where it stopped, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q12, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, items 7 and 8.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Status Description (Protected Header).
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Status.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet NHCX Error Codes, NHCX-1006.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.four-message-legs
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.message-identifiers
  endpoints:
  - nhcx.endpoint.status
  - nhcx.endpoint.participant-get-policies
  callbacks:
  - nhcx.callback.error
  - nhcx.callback.on-status
  decisions:
  - nhcx.decision.status-poll-or-wait
  errors:
  - nhcx.error.nhcx-1001
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1012
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.recipient-cannot-decrypt
  - nhcx.troubleshooting.bundle-rejected
  sandbox:
  - nhcx.sandbox.support-contacts
  glossary:
  - nhcx.glossary.tpa
---

# The request was accepted with 202 and no callback arrives

## In plain words

Your call returned `202` and no `on_` callback has come. The `202` only means [NHCX](../../shared/glossary/nhcx.md) accepted the request. The answer travels three more legs, and any of them can stop it, so you have to find which one.

## Before you start

- You have the request's api call id, correlation id and timestamp. See [correlation id, API call id and workflow id](../concepts/message-identifiers.md).
- You know which leg is which. See [the four legs of every exchange](../concepts/four-message-legs.md).

## What happens

Work through these in order.

1. **Did `/v1/error` receive anything?** When NHCX cannot deliver your request, the failure comes back to your `/v1/error` endpoint. Check its log before anything else. See [receiving POST /v1/error](../callbacks/error.md).
2. **Can NHCX reach your callback endpoint at all?** Domain name, India hosting, whitelisted addresses and routing all matter. See [your callback URL is rejected or never called](../troubleshooting/callback-url-rejected.md).
3. **Does your endpoint answer `202` within 30 seconds, with the acceptance body?** A slow or malformed acknowledgement counts as a failed delivery. NHCX retries five times, then deletes the request. See [the 202 acknowledgement and the 30 second rule](../concepts/synchronous-acknowledgement.md) and [gateway retries and the 24 hour expiry window](../concepts/retries-and-expiry.md).
4. **Did you address the right recipient?** When a [TPA](../glossary/tpa.md) processes the policy, `x-hcx-recipient_code` must be the `processingid` from [`/participant/get/policies`](../endpoints/participant-get-policies.md), not the payer's code.
5. **Where does the request stand?** Send one [status check](../endpoints/status.md) with the request's api call id as its correlation id. `request.queued` means it is still inside NHCX. `request.dispatched` means the recipient holds it, and a [`/v1/on_status`](../callbacks/on-status.md) callback follows. See [poll with /v1/status or wait for the callback](../decisions/status-poll-or-wait.md).
6. **Did the recipient reject it?** A recipient that cannot process your request answers with a clear-text `ProtocolResponse`, `x-hcx-status` `response.error`, instead of a sealed payload. If your handler only accepts sealed bodies, you drop it. Read `x-hcx-error_details`, then see [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md) or [the payer rejects your FHIR bundle](../troubleshooting/bundle-rejected.md).

## How you know it worked

The `on_` callback reaches your endpoint carrying the correlation id you sent. Your endpoint answers it `202` within 30 seconds, with the acceptance body, and the next request of the same kind completes the same way.

## When it goes wrong

Do not resubmit with the same correlation id: it is refused as a duplicate. Once you know the old cycle failed, start a new one with a new correlation id.

If every check above passes and nothing arrives, contact NHCX support. Give the api call id, the correlation id, the timestamp and the `202` body. See [support contacts](../sandbox/support-contacts.md).

The errors this symptom can surface:

- [NHCX-1001](../errors/nhcx-1001.md): the receiver system is not reachable.
- [NHCX-1006](../errors/nhcx-1006.md): a request with the same correlation id already exists.
- [NHCX-1010](../errors/nhcx-1010.md): no data for the correlation id of a callback.
- [NHCX-1012](../errors/nhcx-1012.md): no records for the api call id of a status check.
