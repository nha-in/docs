---
id: hiecm.concept.gateway-session
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The gateway session, the first call in every integration
summary: Every gateway call carries a short lived bearer token from one session
  endpoint, which identifies your application, not a person.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/gateway.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/concepts/gateway.mdx#gateway-session.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.gateway-sessions
  errors:
    - hiecm.error.abdm-2500
---

# The gateway session, the first call in every integration

## In plain words

One endpoint issues the token every other call carries. It is the call [M1](/docs/hiecm/v3/getting-started/glossary#m1) uses. [M4](/docs/hiecm/v3/getting-started/glossary#m4) calls carry their own bearer token instead.

**POST** `/api/hiecm/gateway/v3/sessions`

Headers:

| Header | Example value | What it is |
|---|---|---|
| `REQUEST-ID` | `18235d89-cb13-479d-ad71-7a57d5f669a8` | A fresh UUID for this call |
| `TIMESTAMP` | `2022-10-06T15:10:00.587Z` | The time you made the call, ISO 8601 |
| `X-CM-ID` | `sbx` | The consent manager. Use `sbx` for sandbox |
| `Content-Type` | `application/json` | |

No `Authorization` header on this call. It is the one call with no token yet.

Body:

```json
{
  "clientId": "<CLIENT_ID_FROM_SANDBOX_SIGNUP>",
  "clientSecret": "<CLIENT_SECRET_FROM_SANDBOX_SIGNUP>",
  "grantType": "client_credentials"
}
```

Send the client id you were issued.

Response shape:

```json
{
  "accessToken": "<JWT>",
  "expiresIn": 1200,
  "refreshExpiresIn": 1800,
  "refreshToken": "<JWT>",
  "tokenType": "bearer"
}
```

The response carries the token in `accessToken`.

Send the token back as `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other call. Headers per call, and the second token M1 login issues, are on [authentication](/docs/hiecm/v3/reference/authentication). Interactive: [gateway API reference](/reference/hiecm-gateway).

The session token says which application is calling, not which person. [M1](/docs/hiecm/v3/milestones/m1) profile calls also carry a user token in `X-token`, which login returns.

## Before you start

A client id and client secret from sandbox registration, held on your server. Never ship the secret in a mobile or browser build.

## What happens

Call the session endpoint with `clientId`, `clientSecret` and `grantType` set to `client_credentials`. Send the `accessToken` it returns as `Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>` on every other gateway call. Renew before `expiresIn` runs out rather than on a fixed timer.

## How you know it worked

The response carries `accessToken` and `expiresIn`, and the next gateway call with that token is not refused as unauthorised.

## When it goes wrong

Every call returns 401: see [everything returns 401](/docs/hiecm/v3/troubleshooting/everything-returns-401). A profile call is refused while the session token is fresh: the `X-token` is missing, or it holds the short lived token from login verify, which the verify user call exchanges for the user token. `ABDM-1094` reads X-token expired, and the token sent is often the wrong kind rather than an old one.
