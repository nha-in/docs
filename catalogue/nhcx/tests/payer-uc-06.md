---
id: nhcx.test.payer-uc-06
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 6: Get the auth token'
summary: >-
  Prove that your insurance system can obtain, and keep fresh, the access token
  every call to the claims exchange must carry.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Tables 1.6 and 2.1, Use case 6.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.1 Token Request.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, items 6, 9 and 10.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3; page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  endpoints:
  - nhcx.endpoint.get-session
  - nhcx.endpoint.session-token
  decisions:
  - nhcx.decision.session-endpoint
  concepts:
  - nhcx.concept.session-token
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.prerequisites
  tests:
  - nhcx.test.payer-uc-04
  - nhcx.test.provider-uc-04
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  errors:
  - nhcx.error.nhcx-401
---

# Payer sandbox exit use case 6: Get the auth token

## In plain words

Every call to [NHCX](../../shared/glossary/nhcx.md) carries an access token. This case proves your system can obtain one with its client credentials and replace it before it expires.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- You hold your sandbox client id and client secret. See [sandbox prerequisites](../sandbox/prerequisites.md).
- Use the client id your participant was created with. Policy linking accepts only that one.
- You know which token endpoint to call. See [which session token endpoint to call](../decisions/session-endpoint.md).

## What happens

### Run the call

1. Call [`POST /get/session`](../endpoints/get-session.md) with a form-encoded body:

```text
client_id=<YOUR_CLIENT_ID>&client_secret=<YOUR_CLIENT_SECRET>&grant_type=client_credentials
```

2. Read `access_token` and `expires_in` from the response. `expires_in` is `1200`: the token lasts 20 minutes.
3. Send the token on every later call as the header `bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>`.
4. Schedule a refresh before the 20 minutes run out.
5. Prove the token works: run [use case 4](payer-uc-04.md) with it.

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

> To generate the token to authenticate the API calls

What you observe:

- You receive HTTP 200 with `access_token`, `expires_in` `1200` and `token_type` `Bearer`.
- A call to `/fetch/participants/list` with the token returns HTTP 200, not 401.
- Your system replaces the token before it expires, with no manual step.

## When it goes wrong

- **The token call itself fails.** The client id or secret is wrong, or belongs to another environment.
- **Later calls return 401.** The token expired, lacks the `Bearer ` prefix, or went in the wrong header. See [NHCX-401](../errors/nhcx-401.md) and [every NHCX call returns 401](../troubleshooting/everything-returns-401.md).
