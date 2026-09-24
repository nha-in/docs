---
id: nhcx.endpoint.session-token
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /api/hiecm/gateway/v3/sessions
summary: >-
  Trade your client id and client secret for the access token, valid for 1200 seconds
  (20 minutes), that every claims exchange call carries.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q2 base URLs; Q3; page 5, Q20.
- url: https://hcxsbx.abdm.gov.in/images/54d18468412741b759f3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Authenticating with NHCX.pdf
  hash: sha256:0ea90b635634844aaf8981e917cbf8b765ddd83a340f3c934883912599a62d8b
  fetched: '2026-09-14'
  note: Authenticating with NHCX, row 3 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. participant onboarding section, Milestone 1 access token.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, items 6 and 9.
related:
  concepts:
  - nhcx.concept.session-token
  endpoints:
  - nhcx.endpoint.get-session
  - nhcx.endpoint.fetch-participants-list
  decisions:
  - nhcx.decision.session-endpoint
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  sandbox:
  - nhcx.sandbox.prerequisites
  - nhcx.sandbox.going-live
---

# POST /api/hiecm/gateway/v3/sessions

## In plain words

This call gives you an access token. Every call you make to the National Health Claims Exchange ([NHCX](../../shared/glossary/nhcx.md)) carries it.

You send the client ID and client secret you received when you registered on the [ABDM](../../shared/glossary/abdm.md) sandbox, `ABDM_CLIENT_ID` and `ABDM_CLIENT_SECRET`. The ABDM [gateway](../../shared/glossary/gateway.md) returns a bearer token that lasts 1200 seconds (20 minutes). You renew it on a timer before the 20 minutes run out. See [the session token](../concepts/session-token.md) for how one token serves every NHCX call.

## Before you start

- You hold an ABDM [sandbox](../../shared/glossary/sandbox.md) client id and client secret. See [sandbox prerequisites](../sandbox/prerequisites.md). A provider that already holds these for ABHA integration uses the same pair for NHCX.
- Your system clock is synchronised, because the `TIMESTAMP` header carries the current time.
- Your code can generate a fresh UUID for every call.

## What happens

Your system posts its credentials to the session address. The gateway answers on the same connection with the token. No callback follows.

| Environment | Session address |
|---|---|
| Sandbox | `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` |
| Production | Issued with your production credentials after [going live](../sandbox/going-live.md) |

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions' \
  -H 'Content-Type: application/json' \
  -H 'REQUEST-ID: <FRESH_UUID_FOR_THIS_CALL>' \
  -H 'TIMESTAMP: <CURRENT_UTC_TIME_ISO_8601_WITH_MILLIS_AND_Z>' \
  -H 'X-CM-ID: sbx' \
  -d '{
    "clientId": "<YOUR_CLIENT_ID>",
    "clientSecret": "<YOUR_CLIENT_SECRET>",
    "grantType": "client_credentials"
  }'
```

- `<YOUR_CLIENT_ID>` and `<YOUR_CLIENT_SECRET>` come from your ABDM sandbox registration.
- [`REQUEST-ID`](../../shared/glossary/request-id.md) is a new UUID for this call. Do not copy one from an example.
- [`TIMESTAMP`](../../shared/glossary/timestamp-header.md) is the current UTC time with milliseconds and a trailing `Z`, for example `2026-09-04T06:15:51.975Z`. Take it from the system clock.
- [`X-CM-ID`](../../shared/glossary/x-cm-id.md) is `sbx` on the sandbox.
- `grantType` is always `client_credentials`.

The earlier address, `https://dev.abdm.gov.in/gateway/v0.5/sessions`, takes the same `clientId`, `clientSecret` and `grantType` body. It also returns `accessToken` and `expiresIn`. [Choosing a session endpoint](../decisions/session-endpoint.md) compares both addresses with [`/get/session`](get-session.md).

The response body has this shape:

```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>",
  "expiresIn": 1200,
  "refreshTokenIn": <REFRESH_LIFETIME_IN_SECONDS>,
  "refreshToken": "<JWT_REFRESH_TOKEN>",
  "tokenType": "bearer"
}
```

Send `accessToken` on every NHCX call as `bearer_auth: Bearer <accessToken>`. The token lasts 1200 seconds (20 minutes). Mint a new token before it runs out, for example after about 18 minutes.

**Idempotency.** Every call mints a new token. Repeating the call is safe. Keep the newest token and drop the old one.

## How you know it worked

You receive HTTP 200 with a non-empty `accessToken` and `expiresIn` set to `1200`.

Your next participant service call, for example [`/fetch/participants/list`](fetch-participants-list.md), returns 200 rather than 401 when it carries the token in `bearer_auth`.

Record the time the token arrived. It is valid until that time plus 1200 seconds (20 minutes).

## When it goes wrong

- **A later call returns 401 with `Sender is not authorized to execute the operation`.** The token has expired. Call this endpoint again, then retry the failed call once with the new token. See [NHCX-401](../errors/nhcx-401.md).
- **A later call returns 401 although the token is fresh.** The token went out without the `Bearer ` prefix. Send `bearer_auth: Bearer <accessToken>`. See [every call returns 401](../troubleshooting/everything-returns-401.md).
- **The session call itself is refused.** Check that the body carries `grantType` set to `client_credentials`, that `REQUEST-ID` is new, and that `TIMESTAMP` comes from a synchronised clock.
- **A retry with a new token also returns 401.** The credentials are wrong or were replaced. Stop retrying and check the client id and secret.
