---
id: hiecm.endpoint.p1-enrollment-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Send the OTP that starts a registration
summary: Starts registration by sending a one time code to the mobile number, or
  for the ABHA number, the person gave.
generated: true
operation: p1_post_v3_phr_app_enrollment_request_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_request_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_request_otp.mdx#p1-enrollment-request-otp.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.gateway-session
---

# Send the OTP that starts a registration

## In plain words

The first call in creating an [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). One endpoint serves three routes, and `scope`, `loginHint` and `otpSystem` together say which. `loginId` carries the mobile number or [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number), encrypted.

| Route | `scope` | `loginHint` | `otpSystem` |
| --- | --- | --- | --- |
| Mobile number | `abha-address-enroll`, `mobile-verify` | `mobile-number` | `abdm` |
| ABHA number, OTP to its mobile | `abha-login`, `mobile-verify` | `abha-number` | `abdm` |
| ABHA number, Aadhaar OTP | `abha-login`, `aadhaar-verify` | `abha-number` | `aadhaar` |

## Before you start

The mobile number or ABHA number, encrypted with the public certificate.

## How you know it worked

The response carries a `txnId` and a `message` naming the masked number the code went to. Every later call in this registration carries that `txnId`. Send the same `scope` to the verify call.

## When it goes wrong

`ABDM-1006` names the field that failed: `Invalid Scope`, `Invalid Login Hint`, `Invalid Otp System`, `Invalid Mobile Number` or `Invalid ABHA Number`. `ABDM-9999` with `Invalid LoginId` means `loginId` could not be read.
