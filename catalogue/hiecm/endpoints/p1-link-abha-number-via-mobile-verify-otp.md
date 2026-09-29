---
id: hiecm.endpoint.p1-link-abha-number-via-mobile-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Link ABHA number via Mobile-Verify OTP
summary: Verifies the mobile OTP sent to link an ABHA number to the signed in
  ABHA address.
generated: true
operation: p2_post_v3_phr_app_login_profile_verify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx#p1-link-abha-number-via-mobile-verify-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Link ABHA number via Mobile-Verify OTP

## In plain words

Verifies the one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) sent to the mobile number of an [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number), to link it to the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in. Send `scope` `abha-login` and `mobile-verify`, with the `txnId` and the encrypted `otpValue` in `authData`. A wrong code still returns `200`: read `authResult`.

## Before you start

The `txnId` from the request OTP call, and the user token in `X-token`.

## How you know it worked

`authResult` is `success`. Then send the link request with the same `txnId` as `transactionId`.

## When it goes wrong

`authResult` is `failed` when the code is wrong. `ABDM-9999` with `Invalid Transaction Id` or `Invalid OTP Value` names the field that failed.
