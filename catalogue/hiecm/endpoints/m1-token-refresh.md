---
id: hiecm.endpoint.m1-token-refresh
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get a new user token from a refresh token
summary: Issues a new X-token from a refresh token without a new sign in.
generated: true
operation: m1_get_v3_profile_account_request_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_account_request_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_account_request_token.mdx#m1-token-refresh.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Get a new user token from a refresh token

## In plain words

Issues a new `X-token` without making the person sign in again. Send the refresh token from login or enrolment in the `R-token` header. The response carries a new `token` and `refreshToken`, with their lifetimes in `expiresIn` and `refreshExpiresIn`. Read the lifetimes from the response rather than assuming them.

## Before you start

The `refreshToken` from login or enrolment, sent in the `R-token` header as `Bearer <token>`.

## When it goes wrong

A 400 with `Invalid R-token` means the refresh token is wrong or expired: sign the person in again. A 404 with `ABDM-1016` means the `TIMESTAMP` was refused: send UTC in ISO 8601 with milliseconds.
