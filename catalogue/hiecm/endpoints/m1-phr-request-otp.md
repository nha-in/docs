---
id: hiecm.endpoint.m1-phr-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send an OTP for ABHA address login
summary: Starts an ABHA address login by OTP, fingerprint or iris.
generated: true
operation: m1_post_v3_phr_web_login_abha_request_otp_mobile_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_request_otp_mobile_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_phr_web_login_abha_request_otp_mobile_otp.mdx#m1-phr-request-otp.
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

# Send an OTP for ABHA address login

## In plain words

Starts a login with an [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). `loginHint` is always `abha-address` and `loginId` is the encrypted address. The method is set by `scope` and `otpSystem`:

| Method | `scope` | `otpSystem` |
|---|---|---|
| Mobile [OTP](/docs/hiecm/v3/getting-started/glossary#otp) | `["abha-address-login","mobile-verify"]` | `abdm` |
| Aadhaar OTP | `["abha-address-login","aadhaar-verify"]` | `aadhaar` |
| Fingerprint | `["abha-login","aadhaar-bio-verify"]` | `aadhaar` |
| Iris | `["abha-login","aadhaar-iris-verify"]` | `aadhaar` |

Check that the address allows the method with the search call first. The response carries the `txnId` for the verify call.

## Before you start

The methods the address allows, from the search call. Encrypt the ABHA address with the key from the public certificate call.

## When it goes wrong

A 400 with `ABDM-1211` means no account holds that address. A 401 with `900902` means the access token was not sent.
