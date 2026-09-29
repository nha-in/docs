---
id: hiecm.endpoint.p1-login-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Verify the login OTP
summary: Checks the sign in code or password and returns the tokens the app
  holds afterwards.
generated: true
operation: p1_post_v3_phr_app_login_verify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_login_verify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_login_verify.mdx#p1-login-verify-otp.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-login
  concepts:
    - hiecm.concept.gateway-session
---

# Verify the login OTP

## In plain words

Verifies the one time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)), or the password, and ends the sign in. Send the same `scope` the request used. When one number carries several [ABHA addresses](/docs/hiecm/v3/getting-started/glossary#abha-address), `users` lists them, the person picks one, and the verify user call signs them in as that address.

## Before you start

The `txnId` from the login request and the code, encrypted as `otpValue`. For a password login, `authMethods` is `password` and the `password` object in `authData` carries the `abhaAddress` and the encrypted `password`.

## How you know it worked

`authResult` is `success`. `tokens` carries a `token` and a `refreshToken`. Store the refresh token securely, because it is what survives the app restarting.

## When it goes wrong

`ABDM-1107` with `Invalid combinations of scopes` means the `scope` does not match the request. `ABDM-1006` with `Invalid Password` means a wrong password. `ABDM-9999` with `Invalid Transaction Id` means the `txnId` is wrong or spent.
