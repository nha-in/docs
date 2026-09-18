---
id: nhcx.flow.status-check
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Check the status of a request
summary: >-
  Ask the exchange where a request you sent now stands: still queued, delivered
  to the recipient, or stopped.
sources:
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Status.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Status Description.
- url: https://hcxsbx.abdm.gov.in/statushcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/statushcxservice.json
  hash: sha256:93b6355a234ef56607427fcdfa32da4921124180c9df08ecd73c8af8955c2adf
  fetched: '2026-09-14'
  note: 'API specification: statushcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. path /v1/status; StatusSuccessResponse.'
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 13, Get status.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Error scenario.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 8.
related:
  endpoints:
  - nhcx.endpoint.status
  callbacks:
  - nhcx.callback.on-status
  - nhcx.callback.error
  concepts:
  - nhcx.concept.status-lifecycle
  - nhcx.concept.message-identifiers
  - nhcx.concept.retries-and-expiry
  tests:
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-15
  flows:
  - nhcx.flow.preauth-submit
  - nhcx.flow.claim-submit
  - nhcx.flow.send-a-sealed-request
  decisions:
  - nhcx.decision.status-poll-or-wait
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1012
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  glossary:
  - shared.glossary.nhcx
---

# Check the status of a request

## In plain words

A status check asks the [NHCX](../../shared/glossary/nhcx.md) exchange where a request you sent now stands. It answers with the request's protocol status: still queued at the exchange, delivered to the recipient's system, or stopped.

It does not return the payer's decision. The decision arrives on the request's own callback, such as `/v1/preauth/on_submit`.

Providers and payers both use it, for requests they sent. Use it when a callback is late, before you think of resubmitting. [Poll or wait](../decisions/status-poll-or-wait.md) helps you decide when.

## Before you start

- You sent the request you want to check, and you stored its `x-hcx-api_call_id` and recipient code.
- Your session token and callback endpoint are in place. The status answer arrives on `/v1/on_status`.

## What happens

```mermaid
sequenceDiagram
  participant P as Provider (your system)
  participant N as NHCX
  participant Y as Payer
  P->>N: POST /v1/preauth/submit (earlier request)
  N-->>P: HTTP 202 Accepted
  N->>Y: forwards when the payer's system is reachable
  Note over P: the callback is late
  P->>N: POST /v1/status
  Note right of P: x-hcx-correlation_id is the earlier call's x-hcx-api_call_id
  N-->>P: HTTP 202 Accepted, result.protocol_status
  N->>P: POST /v1/on_status
  P-->>N: HTTP 202 Accepted
  Note left of P: read the status, then wait, or send a fresh request
```

1. Find the `x-hcx-api_call_id` of the request you are checking.
2. Build the protected header. Set `x-hcx-correlation_id` to that earlier `x-hcx-api_call_id`. Use a fresh `x-hcx-api_call_id` for the status call itself.
3. Set `x-hcx-status` to `request.initiated`. Use the same sender and recipient codes as the earlier request, and send `x-hcx-ben-abha-id`.
4. Seal the body as `{"payload": "<JWE_COMPACT_STRING>"}`, as for every call. See [send a sealed request](send-a-sealed-request.md).
5. Call [POST /v1/status](../endpoints/status.md). NHCX answers `202 Accepted`. The body's `result.protocol_status` names where the request stands.
6. Receive [POST /v1/on_status](../callbacks/on-status.md). Its protected header carries the request's attributes, including `x-hcx-status`. Answer `202 Accepted`.
7. Act on the status:

| Status | Meaning | What to do |
|---|---|---|
| `request.queued` | Queued at the exchange, ready to be picked up | Wait. Do not resend |
| `request.dispatched` | Reached the recipient's system | The recipient holds it. Wait for its callback |
| `request.stopped` | Stopped after failed attempts to reach the recipient | It will not be delivered. Check `/v1/error`, then send a fresh request |

A fresh request always gets a new correlation id. After a failure, the old one is inactive.

## How you know it worked

The check is finished when all of these hold:

- NHCX answered `POST /v1/status` with `202` and a `result.protocol_status`.
- You received `POST /v1/on_status` with the correlation id you asked about, and answered `202`.
- You hold one protocol status for the request: `request.queued`, `request.dispatched` or `request.stopped`.
- You acted on it: waited, or sent a fresh request with a new correlation id.

## When it goes wrong

NHCX finds no request. [NHCX-1012](../errors/nhcx-1012.md) means no record matches the api call id you gave. You probably put a new id in `x-hcx-correlation_id`. Use the earlier request's `x-hcx-api_call_id`.

The request was deleted. After five failed delivery attempts, the exchange deletes a request. Its details come back to you on [/v1/error](../callbacks/error.md). Send a fresh request.

You resent instead of checking. [NHCX-1006](../errors/nhcx-1006.md) means a request with that correlation id already exists. A queued request is still being worked on. Check its status rather than resending.

Every call returns 401. [NHCX-401](../errors/nhcx-401.md) means your session token is missing or expired. See [every NHCX call returns 401](../troubleshooting/everything-returns-401.md).
