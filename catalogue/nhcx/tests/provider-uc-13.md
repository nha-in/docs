---
id: nhcx.test.provider-uc-13
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 13: Get status'
summary: >-
  Prove that your hospital system can ask the claims exchange where one of its earlier
  requests stands, and read the answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 6-7, Tables 6.3 and 7.1, Use case 13.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Status.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Status Description (Protected Header).
- url: https://hcxsbx.abdm.gov.in/statushcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/statushcxservice.json
  hash: sha256:93b6355a234ef56607427fcdfa32da4921124180c9df08ecd73c8af8955c2adf
  fetched: '2026-09-14'
  note: 'API specification: statushcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/status.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14; page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  flows:
  - nhcx.flow.status-check
  - nhcx.flow.send-a-sealed-request
  endpoints:
  - nhcx.endpoint.status
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.on-status
  concepts:
  - nhcx.concept.status-lifecycle
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  decisions:
  - nhcx.decision.status-poll-or-wait
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.callback-url-requirements
  tests:
  - nhcx.test.provider-uc-07
  - nhcx.test.payer-uc-15
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1012
---

# Provider sandbox exit use case 13: Get status

## In plain words

Every request through [NHCX](../../shared/glossary/nhcx.md) is answered later, so a request can seem to vanish. This case proves your system can ask the exchange where one of its own requests stands. The answer arrives on your callback as the protocol headers of that request.

It is one of the thirteen provider use cases for [sandbox exit](../glossary/sandbox-exit.md). The exchange answers this call itself.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You sent a request earlier, for example in [use case 7](provider-uc-07.md), and stored its `x-hcx-api_call_id`.
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).

## What happens

### Send the status request

1. Build the status request as a [JWE](../glossary/jwe.md), as [`/v1/status`](../endpoints/status.md) describes.
2. Set the protected headers. Use a new `x-hcx-api_call_id`. Set `x-hcx-correlation_id` to the `x-hcx-api_call_id` of the request you ask about. Set `x-hcx-recipient_code` to that request's recipient, and `x-hcx-status` to `request.initiated`. `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
3. Send it.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/status' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

4. NHCX answers with HTTP 202.

### Receive the status

1. Wait for `POST /v1/on_status` on your registered endpoint. Answer it with HTTP 202 within 30 seconds.
2. Read the protocol headers it carries. `x-hcx-status` names the stage. `request.queued` means the request waits at the exchange. `request.dispatched` means it reached the recipient's system.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
```

## How you know it worked

The pass criterion for this case:

> Retrieve the status of any request that has been triggered to NHCX
>
> Callback API should be implemented by provider systems. It should accept the payload as ProtocolHeader contains all the attributes.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- NHCX answers your `POST /v1/status` with HTTP 202.
- You receive `POST /v1/on_status` carrying the protocol headers of the request you asked about.
- Your endpoint answers it with HTTP 202 within 30 seconds.
- Your system shows the request's stage from `x-hcx-status`.

## When it goes wrong

- **[NHCX-1012](../errors/nhcx-1012.md), no records for the API call id.** `x-hcx-correlation_id` must be the `x-hcx-api_call_id` of a request your participant sent.
- **The status never arrives.** Check your registered endpoint against the [callback URL requirements](../sandbox/callback-url-requirements.md).
- **The status stays at `request.queued`.** The recipient has not taken the request. See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md) before you resend anything.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
