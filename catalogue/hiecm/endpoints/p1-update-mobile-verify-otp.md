---
id: hiecm.endpoint.p1-update-mobile-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Update Mobile Verify-OTP
summary: Verifies the OTP sent to the new mobile number and updates the number
  on the ABHA address.
generated: true
operation: p2_post_v3_phr_app_login_profile_verify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx#p1-update-mobile-verify-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Update Mobile Verify-OTP

## In plain words

Verifies the one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) sent to the new mobile number and updates the number on the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in. Send `scope` `abha-address-profile` and `mobile-verify`, with the `txnId` and the encrypted `otpValue` in `authData`. A wrong code still returns `200`: read `authResult`.

## Before you start

The `txnId` from the update mobile request OTP call, and the user token in `X-token`.

## How you know it worked

`authResult` is `success`, and the profile call returns the new masked `mobile`.

## When it goes wrong

`authResult` is `failed` when the code is wrong. `ABDM-9999` with `Invalid Transaction Id` means the `txnId` is wrong or spent.
