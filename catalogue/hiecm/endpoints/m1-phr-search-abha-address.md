---
id: hiecm.endpoint.m1-phr-search-abha-address
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Search an ABHA address and get its sign in methods
summary: Checks that an ABHA address exists and returns the sign in methods it allows.
generated: true
operation: m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f.mdx#m1-phr-search-abha-address.
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

# Search an ABHA address and get its sign in methods

## In plain words

The first step of [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) login. Send the `abhaAddress`, and the response confirms it exists and lists the sign in methods it allows in `authMethods`, with any blocked ones in `blockedAuthMethods`. Offer the person only the allowed methods.

## How you know it worked

A 200 with `status` `ACTIVE` and the method you intend to use in `authMethods`, for example `MOBILE_OTP` before a mobile OTP login.

## When it goes wrong

A 400 with `ABDM-1211` means no account holds that ABHA address. A 404 with `ABDM-1030` means the `REQUEST-ID` was refused: send a fresh one.
