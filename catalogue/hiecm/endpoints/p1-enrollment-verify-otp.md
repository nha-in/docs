---
id: hiecm.endpoint.p1-enrollment-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Verify the registration OTP
summary: Checks the code against its transaction and returns the ABHA addresses
  already held against that number.
generated: true
operation: p1_post_v3_phr_app_enrollment_verify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_verify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_verify.mdx#p1-enrollment-verify-otp.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.gateway-session
---

# Verify the registration OTP

## In plain words

Verifies the one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) with the same `scope` the request used. The response is where you learn whether this person already holds [ABHA addresses](/docs/hiecm/v3/getting-started/glossary#abha-address): `users` lists them. Show that list before you offer to create another.

## Before you start

The `txnId` from the request OTP call, and the code the person typed, encrypted as `otpValue`. `authMethods` is `otp`.

## How you know it worked

`authResult` is `success` and `message` is `OTP Verified Successfully`. `users` lists the addresses already linked, and `tokens` carries the session.

## When it goes wrong

`ABDM-9999` with `Invalid Transaction Id` means the `txnId` is wrong or spent. `ABDM-1006` names the field that failed: `Invalid OTP Request`, `Invalid Scope` or `Invalid Auth Methods`.
