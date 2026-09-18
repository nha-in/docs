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
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The users array with PENDING entries and null abhaNumber, and the 300 second transfer token. Observed by an integrator on 2026-09-16; the Invalid Transaction Id body is in catalogue/verification/hiecm.endpoint.p1-login-verify-otp.json, run 2026-09-17.
related:
  flows: [hiecm.flow.p1-login, hiecm.flow.m1-login-phr-by-mobile]
  endpoints: [hiecm.endpoint.p1-login-verify-user]
  concepts: [hiecm.concept.gateway-session]
  errors: [hiecm.error.abdm-1006, hiecm.error.abdm-9999]
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

The sandbox host for the PHR calls is `https://abhasbx.abdm.gov.in`;
production is `https://apis.abdm.gov.in/phr/api/phr/app/v3`.

## How you know it worked

The response carries a `users` array and a `tokens` object:

```json
{
  "users": [
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "abhaNumber": null,
      "fullName": "<NAME>",
      "kycStatus": "PENDING",
      "status": "<STATUS>"
    }
  ],
  "tokens": {
    "token": "<TRANSFER_TOKEN_300_SECONDS>"
  }
}
```

Every address on the mobile is listed, including `PENDING` ones with no ABHA number. `tokens.token` is a 300 second transfer token: exchange it at [say which address is signing in](hiecm.endpoint.p1-login-verify-user) for the address the person picks.

## When it goes wrong

The error scenarios recorded against this call: [ABDM-1006](hiecm.error.abdm-1006), [ABDM-9999](hiecm.error.abdm-9999). `ABDM-9999 Invalid Transaction Id` means the `txnId` is not from a live login request. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
