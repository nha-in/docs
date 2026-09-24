---
id: nhcx.decision.session-endpoint
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Which session token endpoint to call
summary: >-
  Get the token that every exchange call carries from one place in your code, and
  set the address it calls per environment.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, Q2 base URLs; Page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.1 Token Request.
- url: https://hcxsbx.abdm.gov.in/images/54d18468412741b759f3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Authenticating with NHCX.pdf
  hash: sha256:0ea90b635634844aaf8981e917cbf8b765ddd83a340f3c934883912599a62d8b
  fetched: '2026-09-14'
  note: Authenticating with NHCX, row 3 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 4 Get the auth token.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 6 Get the auth token.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, items 6 and 9.
related:
  concepts:
  - nhcx.concept.session-token
  endpoints:
  - nhcx.endpoint.session-token
  - nhcx.endpoint.get-session
  errors:
  - nhcx.error.nhcx-401
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.payer-uc-06
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  sandbox:
  - nhcx.sandbox.environments-and-base-urls
  glossary:
  - shared.glossary.request-id
  - shared.glossary.timestamp-header
  - shared.glossary.x-cm-id
---

# Which session token endpoint to call

## In plain words

Every call you make to [NHCX](../../shared/glossary/nhcx.md) carries a bearer token. You mint it from the client ID and secret issued at onboarding. Two token calls are published: the [ABDM](../../shared/glossary/abdm.md) gateway sessions call and the participant service `/get/session` call. Both take the same client credentials and return a token that lasts 1200 seconds (20 minutes).

Put token acquisition behind one client in your code. Make its address, body format and response field names configuration. Set it to the gateway sessions call at `/api/hiecm/gateway/v3/sessions` by default.

## Before you start

- You hold the client ID and secret you received when you registered on the ABDM [sandbox](../../shared/glossary/sandbox.md), `ABDM_CLIENT_ID` and `ABDM_CLIENT_SECRET`. No separate NHCX credentials are issued. See [onboard as a participant in the NHCX sandbox](../flows/sandbox-onboarding.md).
- You know which environment you are calling. See [environments and base URLs](../sandbox/environments-and-base-urls.md).
- You have read [the session token every NHCX call carries](../concepts/session-token.md).

## What happens

| | ABDM gateway sessions | Participant service `/get/session` |
|---|---|---|
| Sandbox address | `POST https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` | `POST /get/session` on `apisbx.abdm.gov.in` |
| Request headers | `Content-Type: application/json`, [`REQUEST-ID`](../../shared/glossary/request-id.md), [`TIMESTAMP`](../../shared/glossary/timestamp-header.md), [`X-CM-ID`](../../shared/glossary/x-cm-id.md) `sbx` | `Content-Type: application/x-www-form-urlencoded` |
| Body | `clientId`, `clientSecret`, `grantType` `client_credentials` | `client_id`, `client_secret`, `grant_type=client_credentials` |
| Token field in the response | `accessToken` | `access_token` |
| Lifetime field in the response | `expiresIn`, 1200 seconds | `expires_in`, 1200 seconds |

The same gateway call is also published at `/gateway/v0.5/sessions`, taking `clientId` and `clientSecret`. Point new builds at the v3 address, which requires `grantType`.

The default is the gateway sessions call at the v3 address. It is the session address in the sandbox base URL list. It takes the sandbox client ID and secret you already hold. One token from it serves every NHCX call.

Whichever address you configure, these rules hold:

1. Read the token from `accessToken` or `access_token`, whichever is present.
2. The token lasts 1200 seconds (20 minutes) from either call. The response states it as `expiresIn` or `expires_in`.
3. Store the token with the time you received it. Fetch a new one before the 20 minutes run out.
4. On a `401`, fetch a new token and retry that call once. A second `401` means the credentials are wrong or revoked: stop and alert.
5. Send the token as `Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>` in the `bearer_auth` header.
6. Never log the token or the client secret.

## How you know it worked

You chose correctly when all of these hold:

- A token call returns a token with a lifetime of 1200 seconds, and your client stores the token with the time it arrived.
- A call made with that token, such as `POST /fetch/participants/list`, returns its normal response, not `401`.
- Pointing the configuration at the other address needs no code change.

Sandbox exit use case 4 for providers and use case 6 for payers name `/get/session` as the auth token call. Point the configuration there when you demonstrate those cases. See [provider use case 4](../tests/provider-uc-04.md) and [payer use case 6](../tests/payer-uc-06.md).

## When it goes wrong

Switching is a configuration change: the address, the body encoding and the two response field names. Nothing is registered against either call, so you can switch at any time, including after go-live. Production addresses come with production access; see [going live](../sandbox/going-live.md).

If your client never refreshes the token, or reads the wrong field name, calls fail 20 minutes after each new token. You see `401` with `Sender is not authorized to execute the operation`. See [every NHCX call returns 401](../troubleshooting/everything-returns-401.md) and [NHCX-401](../errors/nhcx-401.md).

If the token call itself answers `400`, the body does not match the address. The gateway call takes JSON; `/get/session` takes form encoding with `grant_type=client_credentials`.
