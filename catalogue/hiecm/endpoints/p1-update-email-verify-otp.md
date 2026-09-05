---
id: hiecm.endpoint.p1-update-email-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Update Email Verify-OTP
summary: >
  Verify EMAIL OTP and update the EMAIL in the system.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.29. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Update Email Verify-OTP

## In plain words

This API is used to verify EMAIL OTP and update the EMAIL in the system.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": [ "abha-address-profile", "email-verify" ], "authData": { "authMethods": [ "otp" ], "otp": { "txnId": "*{{ transactionId}}*", "otpValue":"*{{encrypted OTP}}*" } } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.29.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1006, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
