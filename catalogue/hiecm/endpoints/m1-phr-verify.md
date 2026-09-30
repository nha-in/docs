---
id: hiecm.endpoint.m1-phr-verify
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify OTP or biometric for ABHA address login
summary: Completes an ABHA address login and returns the X-token for the
  profile, card and QR calls.
generated: true
operation: m1_post_v3_phr_web_login_abha_verify_mobile_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_verify_mobile_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_verify_mobile_otp.mdx#m1-phr-verify.
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

# Verify OTP or biometric for ABHA address login

## In plain words

Completes the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) login. Send the same `scope` as the request call and the `txnId`, with the encrypted [OTP](/docs/hiecm/v3/getting-started/glossary#otp) or, for fingerprint, the capture in `fingerPrintAuthPid`. The response lists the person's ABHA addresses in `users` and carries `tokens.token`. Send that token as the `X-token` header to the profile, PHR card and QR code calls.

## How you know it worked

A 200 with `authResult` `success`. A 200 can also report an expired OTP, so read `authResult` and not the status alone.

## When it goes wrong

A 400 with `ABDM-9999` names the refused part in its message, such as an invalid scope or transaction id. Request a new OTP when the `txnId` is refused.
