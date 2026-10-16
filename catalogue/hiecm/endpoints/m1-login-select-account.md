---
id: hiecm.endpoint.m1-login-select-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Choose which ABHA to sign in to
summary: Signs the person in to the ABHA they picked and returns their X-token.
generated: true
operation: m1_post_v3_profile_login_verify_user
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_login_verify_user.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_login_verify_user.mdx#m1-login-select-account.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-1013
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-login-by-mobile
---

# Choose which ABHA to sign in to

## In plain words

One mobile number can hold several [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) accounts, which is common in a family. This call signs the person in to the one they pick. Send the chosen `ABHANumber` and the `txnId`, with the short lived token from the verify call in the `T-token` header. The response carries the person's `X-token` in `token`, with a refresh token.

## Before you start

The `token` from the login verify call, sent in the `T-token` header as `Bearer <token>`.

## How you know it worked

A 200 with `token`, `expiresIn` and `refreshToken`. Send `token` as the `X-token` on profile calls.

## When it goes wrong

A 400 with `Invalid T-token` means the verify token is wrong or expired: verify the OTP again. A 400 with `Invalid ABHA Number` means the number is not one of the listed accounts.
