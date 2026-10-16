---
id: hiecm.endpoint.p1-login-using-password-search-user
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Login using Password Search user
summary: Looks up an ABHA address and returns the sign in methods it accepts,
  before a password login.
generated: true
operation: p1_post_v3_phr_app_login_search
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_login_search.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_login_search.mdx#p1-login-using-password-search-user.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Login using Password Search user

## In plain words

The first step of a password login. Send the `abhaAddress` and the response says how that [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) can sign in: `authMethods` lists the methods it accepts and `blockedAuthMethods` those it refuses. Offer a password only when `PASSWORD` is in `authMethods`.

## What happens

Next, send the password to the login verify call with `scope` `abha-address-login` and `password-verify`, and the password encrypted with the public certificate.

## How you know it worked

The response carries the `abhaAddress`, its `authMethods` and its `status`.

## When it goes wrong

`ABDM-1211` with `User not found.` means no such address. `ABDM-9999` with `Invalid ABHA Address` means the address is malformed.
