---
id: hiecm.endpoint.m1-login-verify
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify a login OTP
summary: Checks the login OTP and returns the token for the next step and the
  accounts on the mobile number.
generated: true
operation: m1_post_v3_profile_login_verify_mobile_otp
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_login_verify_mobile_otp.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_login_verify_mobile_otp.mdx#m1-login-verify.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900900
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.m1-find-abha
---

# Verify a login OTP

## In plain words

Checks the [OTP](/docs/hiecm/v3/getting-started/glossary#otp) the person received. On a mobile number login it returns a short lived `token` and, in `accounts`, every [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) held against that mobile number. That token is not the `X-token`. Send it as the `T-token` header to the select account call, which returns the `X-token` for the account the person picks.

Each entry in `accounts` carries the ABHA number, the preferred ABHA address and the name, enough to show the choice.

## Before you start

The `txnId` from the login OTP call, and the OTP encrypted with the public certificate key.

## What happens

Call the select account call next even when `accounts` holds one entry.

## When it goes wrong

A 400 names the refused part, such as `Invalid OTP Value` or `Invalid Transaction Id`. A 404 with `ABDM-1114` means no account matched.
