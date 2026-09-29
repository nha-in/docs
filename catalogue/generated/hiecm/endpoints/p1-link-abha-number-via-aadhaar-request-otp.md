---
id: hiecm.endpoint.p1-link-abha-number-via-aadhaar-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Link ABHA number via AADHAAR-Request OTP
summary: Starts linking an ABHA number to the signed in ABHA address with an
  Aadhaar OTP.
generated: true
operation: p2_post_v3_phr_app_login_profile_request_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_request_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_request_otp.mdx#p1-link-abha-number-via-aadhaar-request-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Link ABHA number via AADHAAR-Request OTP

## In plain words

Starts linking an [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number) to the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in, with a one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) sent through Aadhaar. Send `scope` `abha-login` and `aadhaar-verify`, `loginHint` `abha-number`, the ABHA number encrypted as `loginId`, and `otpSystem` `aadhaar`.

## Before you start

A signed in person, whose user token goes in `X-token`, and their ABHA number encrypted with the public certificate.

## How you know it worked

The response carries a `txnId` and a `message` naming the masked number the code went to. Verify the code with the same `scope`.

## When it goes wrong

`ABDM-1006` names the field that failed, such as `Invalid ABHA Number` or `Invalid Otp System`.
