---
id: hiecm.endpoint.p1-login-verify-user
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Say which address is signing in
summary: Resolves a sign in to one ABHA address when the mobile or ABHA number
  carries several.
generated: true
operation: p1_post_v3_phr_app_login_verify_user
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_login_verify_user.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_login_verify_user.mdx#p1-login-verify-user.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-login
  concepts:
    - hiecm.concept.gateway-session
---

# Say which address is signing in

## In plain words

One mobile or [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) can hold several [ABHA addresses](/docs/hiecm/v3/getting-started/glossary#abha-address). After the one time password is verified, send the address the person chose with the `txnId`. The response carries the session for that address, not for the number.

## Before you start

A verified login transaction, its `txnId`, and the `abhaAddress` the person chose from `users`. The `T-token` header carries the `token` from the verify response.

## How you know it worked

The response carries a `token`, a `refreshToken` and their lifetimes in `expiresIn` and `refreshExpiresIn`.

## When it goes wrong

`ABDM-9999` with `User not found.`, `Invalid ABHA Address` or `Invalid Transaction Id`.
