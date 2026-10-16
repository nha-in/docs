---
id: hiecm.endpoint.p1-link-abha-number-via-aadhaar-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Link ABHA number via AADHAAR-Verify OTP
summary: Verifies the Aadhaar OTP sent to link an ABHA number to the signed in
  ABHA address.
generated: true
operation: p2_post_v3_phr_app_login_profile_verify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_verify.mdx#p1-link-abha-number-via-aadhaar-verify-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Link ABHA number via AADHAAR-Verify OTP

## In plain words

Verifies the Aadhaar one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) sent to link an [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) to the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in. Send `scope` `abha-login` and `aadhaar-verify`, with the `txnId` and the encrypted `otpValue` in `authData`. A wrong code still returns `200`: read `authResult`, not the status code.

## Before you start

The `txnId` from the request OTP call, and the user token in `X-token`.

## How you know it worked

`authResult` is `success`. Then send the link request with the same `txnId` as `transactionId`.

## When it goes wrong

`authResult` is `failed` with `Entered OTP is incorrect. Kindly re-enter valid OTP.` when the code is wrong. `ABDM-9999` with `Invalid Transaction Id` means the `txnId` is wrong or spent.
