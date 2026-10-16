---
id: hiecm.endpoint.m1-download-phr-qr-code
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Download PHR QR code
summary: Returns a QR code for the ABHA address profile the person signed in with.
generated: true
operation: m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_a48785
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_a48785.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_qr_code_abha_address_a48785.mdx#m1-download-phr-qr-code.
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

# Download PHR QR code

## In plain words

Returns a QR code for the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) profile the person signed in with. A facility can scan it to read the profile without typing. It is the last call of ABHA address login and needs the `X-token` from the verify step.

## How you know it worked

A 200 that carries the QR code.

## When it goes wrong

A 400 with `Invalid X-token` means the token is missing or wrong. A 401 with `900901` means the access token is missing or expired.
