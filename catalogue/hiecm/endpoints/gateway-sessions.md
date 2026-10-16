---
id: hiecm.endpoint.gateway-sessions
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create a session and get an access token
summary: Exchanges your client id and client secret for the access token every
  ABDM call carries.
generated: true
operation: gateway_post_gateway_v3_sessions
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx#gateway-sessions.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2403
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Create a session and get an access token

## In plain words

Every call to [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) carries an access token, and this call issues it. Send the `clientId` and `clientSecret` issued to you at registration, with `grantType` set to `client_credentials`. It is the one gateway call that needs no bearer token.

The response carries `accessToken`, its lifetime in `expiresIn`, and a `refreshToken`. Read the lifetime from the response rather than assuming one. Create a new session before the token runs out, instead of waiting for a 401.

## Before you start

The client id and client secret for the environment you are calling. Send `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` on this call too.

## How you know it worked

A 202 whose body carries `accessToken` and `expiresIn`. Send the token as `Authorization: Bearer <gateway token>` on every later call.

## When it goes wrong

A 401 with `900901` means the client id or secret is wrong for this environment. A 400 with `ABDM-1015` means the body was refused: check that `grantType` is `client_credentials`.
