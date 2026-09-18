---
id: nhcx.endpoint.get-session
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /get/session
summary: >-
  Trade your client id and client secret, sent as a form, for an access token to
  use on claims exchange calls.
sources:
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.1 Token Request and Token Response.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Use case 4 Get the auth token.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1-2, Use case 6 Get the auth token.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./get/session.post.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3; page 5, Q20.
related:
  concepts:
  - nhcx.concept.session-token
  endpoints:
  - nhcx.endpoint.session-token
  - nhcx.endpoint.fetch-certs
  decisions:
  - nhcx.decision.session-endpoint
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.payer-uc-06
---

# POST /get/session

## In plain words

`/get/session` returns an access token for [NHCX](../../shared/glossary/nhcx.md) calls. You post your client id and client secret as a form. The response carries `access_token` and its lifetime in `expires_in`.

Get the auth token is use case 4 of the provider [sandbox exit](../glossary/sandbox-exit.md) and use case 6 of the payer sandbox exit. Both use cases name this call. The ABDM [session call](session-token.md) also issues NHCX tokens. [Choosing a session endpoint](../decisions/session-endpoint.md) compares the two. Use one of them across your whole integration.

## Before you start

- Your client id and client secret for the environment you are calling. Sandbox credentials do not work in production.
- No token is needed for this call itself.

## What happens

Your system posts a form to the sandbox host. The service answers on the same connection with the token. No callback follows.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/get/session' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'client_id=<YOUR_CLIENT_ID>' \
  --data-urlencode 'client_secret=<YOUR_CLIENT_SECRET>' \
  --data-urlencode 'grant_type=client_credentials'
```

`grant_type` is always `client_credentials`. The two credentials are the only values you change. The body is a form, not JSON.

A production address for this call is not yet published.

The response body has this shape:

```json
{
  "access_token": "<JWT_ACCESS_TOKEN>",
  "expires_in": <LIFETIME_IN_SECONDS>,
  "token_type": "Bearer"
}
```

Send `access_token` on every NHCX call as `bearer_auth: Bearer <access_token>`. Read `expires_in` from each response and renew the token before it runs out.

**Idempotency.** Each call mints a new token. Repeating it is safe. Keep the newest token.

## How you know it worked

You receive HTTP 200 with a non-empty `access_token`, `token_type` set to `Bearer` and an integer `expires_in`.

A participant service call such as [`/fetch/certs`](fetch-certs.md) then returns 200 when it carries the token in `bearer_auth`.

The token is valid for `expires_in` seconds from the moment it arrived.

## When it goes wrong

- **400 on this call.** The body went as JSON, or `grant_type` is missing or misspelt. Send `Content-Type: application/x-www-form-urlencoded` with all three fields.
- **Calls start returning 401 after a while.** The token lapsed. Mint a new one and retry the failed call once. See [NHCX-401](../errors/nhcx-401.md).
- **401 with a fresh token.** The `Bearer ` prefix is missing from `bearer_auth`. See [every call returns 401](../troubleshooting/everything-returns-401.md).
- **401 again after a retry with a new token.** The credentials are wrong or were replaced. Stop retrying and check the client id and secret.
