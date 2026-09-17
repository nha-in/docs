---
id: hiecm.endpoint.p1-login-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Verify the login OTP
summary: >
  Checks the sign in code and returns the token the application holds afterwards.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.12. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p1-login]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Verify the login OTP

## In plain words

Verifies the code and ends the sign in. Where one number carries several addresses, the response is where the person is asked which they are.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The `txnId` from the login request, and the code, encrypted.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": [ "abha-address-login", "mobile-verify" ], "authData": { "authMethods": [ "otp" ], "otp": { "txnId": "*{{ transactionId}}*", "otpValue": "*{{encrypted OTP}}*" } } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.12. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries the tokens for the session. Store the refresh token securely, because that is what survives the application restarting.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1006, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
