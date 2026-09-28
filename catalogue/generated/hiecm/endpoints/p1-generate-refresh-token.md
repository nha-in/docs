---
id: hiecm.endpoint.p1-generate-refresh-token
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Generate Refresh Token
summary: Exchanges the refresh token from a login for a new access token and
  refresh token.
generated: true
operation: p2_get_v3_phr_app_login_profile_request_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_request_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_v3_phr_app_login_profile_request_token.mdx#p1-generate-refresh-token.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Generate Refresh Token

## In plain words

Exchanges the refresh token from a login for a new set of `tokens`. The person stays signed in to a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app without logging in again. Send the refresh token in the `R-token` header. The call takes no body.

## Before you start

The `refreshToken` from a login, an enrolment or a verify user response.

## How you know it worked

The response carries `tokens` with a new `token` and `refreshToken`. `refreshExpiresIn` is `1296000`, fifteen days in seconds. Replace both stored tokens.

## When it goes wrong

A `401` with `900902` and `Missing Credentials` means the header is missing. Send the person back to login.
