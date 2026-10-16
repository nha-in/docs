---
id: hiecm.endpoint.m1-get-phr-profile
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get PHR profile
summary: Returns the profile behind the ABHA address the person signed in with.
generated: true
operation: m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4.mdx#m1-get-phr-profile.
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

# Get PHR profile

## In plain words

Returns the profile behind the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) the person signed in with: name, date of birth, gender, contact details, address, ABHA number and [KYC](/docs/hiecm/v3/getting-started/glossary#kyc) status. It follows the verify step of ABHA address login and needs the `X-token` that step returned.

## Before you start

The `tokens.token` from the ABHA address verify call, sent in the `X-token` header as `Bearer <token>`.

## When it goes wrong

A 400 with `ABDM-1006` and `Invalid X-token` means the token is missing, wrong or from another login. A 401 with `900902` means the access token was not sent.
