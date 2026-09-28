---
id: hiecm.endpoint.m1-auth-token
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Auth token API
summary: The session call that gives a PHR app the access token for its ABHA calls.
generated: true
operation: gateway_post_gateway_v3_sessions
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/gateway_post_gateway_v3_sessions.mdx#m1-auth-token.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Auth token API

## In plain words

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app gets its access token from the same session call as every other integrator. Send your `clientId` and `clientSecret` with `grantType` set to `client_credentials`. Send the `accessToken` that comes back as the bearer token on every [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) call the app makes.

## What happens

The path is `/api/hiecm/gateway/v3/sessions`, plural. The response carries the token and its lifetime in `expiresIn`.

## When it goes wrong

A 401 with `900901` means the client id or secret is wrong for this environment.
