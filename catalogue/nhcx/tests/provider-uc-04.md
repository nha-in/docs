---
id: nhcx.test.provider-uc-04
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 4: Get the auth token'
summary: >-
  Prove that your hospital system can obtain, and keep fresh, the access token every
  call to the claims exchange must carry.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.4, Use case 4.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.1 Token Request; Section 2.3.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3; page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, items 6 and 9.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.get-session
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-participants-list
  decisions:
  - nhcx.decision.session-endpoint
  concepts:
  - nhcx.concept.session-token
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.prerequisites
  tests:
  - nhcx.test.provider-uc-01
  - nhcx.test.payer-uc-06
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  errors:
  - nhcx.error.nhcx-401
---

# Provider sandbox exit use case 4: Get the auth token

## In plain words

Every call to [NHCX](../../shared/glossary/nhcx.md) carries an access token. This case proves your system can obtain one with its client credentials and replace it before it expires.

It is one of the thirteen provider use cases for [sandbox exit](../glossary/sandbox-exit.md). The exchange issues the token; no payer takes part.

## Before you start

- You hold your sandbox client id and client secret. [Sandbox prerequisites](../sandbox/prerequisites.md) covers how you get them.
- You know which token endpoint to call. See [which session token endpoint to call](../decisions/session-endpoint.md).

## What happens

### Run the call

1. Call [`POST /get/session`](../endpoints/get-session.md) with a form-encoded body:

```text
client_id=<YOUR_CLIENT_ID>&client_secret=<YOUR_CLIENT_SECRET>&grant_type=client_credentials
```

2. Read `access_token` and `expires_in` from the response.
3. Send the token on every later call. Participant service calls take it as `bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>`. Exchange calls take the same value on both `bearer_auth` and `Authorization`.
4. Schedule a refresh before `expires_in` runs out. Do not wait for a 401.
5. Prove the token works: run [use case 1](provider-uc-01.md) with it.

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

> To generate the token to authenticate NHCX API calls

What you observe:

- You receive HTTP 200 with `access_token`, `expires_in` and `token_type` `Bearer`.
- A call to `/fetch/participants/list` with the token returns HTTP 200, not 401.
- Your system replaces the token before it expires, with no manual step.

## When it goes wrong

- **The token call itself fails.** The client id or secret is wrong, or belongs to another environment. Use your sandbox credentials.
- **Later calls return 401 after a while.** The token expired. The message `Sender is not authorized to execute the operation` means the same. See [NHCX-401](../errors/nhcx-401.md).
- **Later calls return 401 at once.** The token went in without the `Bearer ` prefix, or in the wrong header. See [every NHCX call returns 401](../troubleshooting/everything-returns-401.md).
