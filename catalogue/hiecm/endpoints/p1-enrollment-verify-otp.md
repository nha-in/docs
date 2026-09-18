---
id: hiecm.endpoint.p1-enrollment-verify-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Verify the registration OTP
summary: >
  Checks the code against the transaction it belongs to and returns the addresses already held against that number.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.3. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p1-create-abha-address]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Verify the registration OTP

## In plain words

Verifies the code. The response is where you learn whether this person already holds addresses, which is what stops a duplicate being created.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The `txnId` from the request OTP call, and the code the person typed, encrypted.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": [ "abha-address-enroll", "mobile-verify" ], "authData": { "authMethods": [ "otp" ], "otp": { "txnId": "*{{transactionId}}*", "otpValue": "*{{encrypted OTP}}*" } } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.3. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response reports the code verified and lists the health addresses linked to that number. Show that list before offering to create another.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1006, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
