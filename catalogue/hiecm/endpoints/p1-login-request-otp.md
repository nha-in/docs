---
id: hiecm.endpoint.p1-login-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Send the OTP that starts a login
summary: Starts a sign in by sending a one time code, whichever of the five OTP
  routes the person is using.
generated: true
operation: p1_post_v3_phr_app_login_request_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_login_request_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_login_request_otp.mdx#p1-login-request-otp.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-login
  concepts:
    - hiecm.concept.gateway-session
---

# Send the OTP that starts a login

## In plain words

One endpoint serves every one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) login route in a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. `scope`, `loginHint` and `otpSystem` together say which route this is, and `loginId` carries the identifier, encrypted.

| Route | `scope` | `loginHint` | `otpSystem` |
| --- | --- | --- | --- |
| Mobile number | `abha-address-login`, `mobile-verify` | `mobile-number` | `abdm` |
| ABHA address, mobile OTP | `abha-address-login`, `mobile-verify` | `abha-address` | `abdm` |
| ABHA number, OTP to its mobile | `abha-login`, `mobile-verify` | `abha-number` | `abdm` |
| ABHA number, Aadhaar OTP | `abha-login`, `aadhaar-verify` | `abha-number` | `aadhaar` |
| Aadhaar number | `abha-login`, `aadhaar-verify`, `aadhaar-otp-verify` | `aadhaar` | `aadhaar` |

## Before you start

The identifier the person presented, encrypted with the public certificate, and the route it belongs to.

## How you know it worked

The response carries a `txnId` and a `message` naming the masked number the code went to. Send the same `scope` to the login verify call.

## When it goes wrong

`ABDM-1006` or `ABDM-9999` with a message that names the field: `Invalid Scope`, `Invalid Login Hint`, `Invalid Otp System`, `Invalid mobile number`, `Invalid Abha Address` or `Invalid ABHA Number`. A `401` with `900902` means the access token is missing.
