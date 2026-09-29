---
id: hiecm.endpoint.p1-update-mobile-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Update the mobile number, request the OTP
summary: Sends an OTP to the new mobile number before it replaces the old one on
  the ABHA address.
generated: true
operation: p2_post_v3_phr_app_login_profile_request_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_request_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_phr_app_login_profile_request_otp.mdx#p1-update-mobile-request-otp.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
---

# Update the mobile number, request the OTP

## In plain words

Starts changing the mobile number on the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) signed in. A one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) goes to the new number. Once it is verified, the new number replaces the old one. Send `scope` `abha-address-profile` and `mobile-verify`, `loginHint` `mobile-number`, the new number encrypted as `loginId`, and `otpSystem` `abdm`.

## Before you start

A signed in person, whose user token goes in `X-token`, and the new mobile number encrypted with the public certificate.

## How you know it worked

The response carries a `txnId` and a `message` naming the masked number the code went to.

## When it goes wrong

`ABDM-1006` with `Invalid mobile number` means the number could not be read.
