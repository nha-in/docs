---
id: hiecm.endpoint.p1-encrypt-data-aadhaar-mobile-otp-password
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Encrypt data (Aadhaar/Mobile/OTP/Password)
summary: Says which values a PHR app encrypts with the public certificate and
  which field carries each one.
generated: true
operation: p1_get_v3_phr_app_login_public_certificate
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_get_v3_phr_app_login_public_certificate.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_get_v3_phr_app_login_public_certificate.mdx#p1-encrypt-data-aadhaar-mobile-otp-password.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Encrypt data (Aadhaar/Mobile/OTP/Password)

## In plain words

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app never sends an Aadhaar number, mobile number, [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number), one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) or password in clear text. Encrypt each one with the public certificate from this call, then send the result in its field:

| Call | Field that carries the encrypted value |
| --- | --- |
| Request an OTP | `loginId` |
| Verify an OTP | `otpValue` |
| Log in with a password | `password` |
| Enrol an ABHA address | `mobile` and `password` in `phrDetails` |

## Before you start

The public certificate from this call.

## When it goes wrong

A call refuses an identifier it cannot read with a `400` naming the field, for example `Invalid LoginId`. Check that the value was encrypted with this certificate before you look elsewhere.
