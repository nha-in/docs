---
id: hiecm.endpoint.m1-profile-get-qr-code
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the ABHA QR code
summary: Returns a QR code for the signed in person's ABHA profile.
generated: true
operation: m1_get_v3_profile_account_qrcode
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_account_qrcode.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_account_qrcode.mdx#m1-profile-get-qr-code.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900900
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Get the ABHA QR code

## In plain words

Returns a QR code for the signed in person's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) profile. A facility can scan it to read the person's details without typing them. Send the person's `X-token`.

## When it goes wrong

A 400 with `Invalid X-token` means the token is missing, wrong or expired. A 401 with `900901` means the access token is missing or expired.
