---
id: hiecm.flow.p1-login
type: flow
gateway: hiecm
milestone: P1
version: abdm-v3
title: Sign a user in to a PHR application
summary: Sign a person in to a personal health record app by any of the
  mandatory routes, and hold the session afterwards.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p1.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p1.mdx#p1-login. Edit the
      page, never this file.
related:
  endpoints:
    - hiecm.endpoint.p1-login-request-otp
    - hiecm.endpoint.p1-login-verify-otp
    - hiecm.endpoint.p1-login-verify-user
    - hiecm.endpoint.p1-login-using-password-search-user
    - hiecm.endpoint.p1-generate-refresh-token
    - hiecm.endpoint.p1-logout-user
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.abha-number-and-address
    - hiecm.concept.gateway-session
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.abha-number
    - hiecm.glossary.auth-modes
    - shared.glossary.otp
    - shared.glossary.phr
---

# Sign a user in to a PHR application

## In plain words

Sign a user in to a PHR application by any of these routes. Every route is
mandatory.

| Route | Validated by |
| --- | --- |
| Mobile number | Mobile OTP |
| An address such as `name@abdm` | Password or mobile OTP, by the auth methods the address supports |
| The 14 digit ABHA number | ABHA OTP or Aadhaar OTP |
| The Aadhaar number | Aadhaar OTP |

Every OTP route returns the ABHA addresses linked to that identifier. The user
picks the one to sign in as, and you confirm the choice with the verify user
call.

Resend OTP unlocks after 60 seconds in every flow. You also need a reset
password screen behind login, secure storage of the refresh token, and more
than one user profile per install with sign in and sign out.

## Before you start

The person holds an ABHA address, and you hold a gateway session token and the PHR certificate.

## What happens

For an address, read the auth methods it supports with `/abha/api/v3/phr/app/login/search` and offer only those. Request the OTP at `/abha/api/v3/phr/app/login/request/otp` and verify at `/abha/api/v3/phr/app/login/verify`; the scope and login hint say which route a call belongs to. When the verify response lists addresses, let the person choose and confirm with `/abha/api/v3/phr/app/login/verify/user`. Store the refresh token securely.

## How you know it worked

The app holds a session for one named ABHA address, and signing out and back in returns the person to that address without repeating the choice.

## When it goes wrong

A password is asked of an address that has none, because the auth methods were not read. A mobile carrying several addresses signs the person in as the wrong one, because no chooser was shown. Resend offered before 60 seconds, or with no word that the wait is deliberate.
