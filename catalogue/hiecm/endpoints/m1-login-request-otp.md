---
id: hiecm.endpoint.m1-login-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send a login OTP
summary: Starts a login by mobile number, ABHA number or Aadhaar number.
generated: true
operation: m1_post_v3_profile_login_request_otp_mobile
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_login_request_otp_mobile.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_login_request_otp_mobile.mdx#m1-login-request-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.encrypted-identifiers
    - hiecm.concept.input-encryption
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.m1-find-abha
  tests:
    - hiecm.test.m1-encryption-padding
---

# Send a login OTP

## In plain words

Starts a login. `loginHint` names what the person identifies themselves with, such as `mobile`, `abha-number` or `aadhaar`, and `loginId` carries that value encrypted. `otpSystem` picks who sends the [OTP](/docs/hiecm/v3/getting-started/glossary#otp): `abdm` sends it to the mobile on the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha), and `aadhaar` to the mobile linked with Aadhaar. The response carries the `txnId` for the verify call.

## Before you start

Encrypt `loginId` with the key and `encryptionAlgorithm` from the public certificate call.

## How you know it worked

A 200 with a `txnId` and a message naming where the OTP went.

## When it goes wrong

A 400 with `Invalid LoginId` means the value was refused: check the key and the padding before the value. A 400 with `Invalid Login Hint` means `loginHint` does not match this use.
