---
id: hiecm.endpoint.p1-enrollment-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Send the OTP that starts a registration
summary: >
  Starts registration by sending a one time code to the mobile number or against the health account number the person gave.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.2. The path, the method, the
      request body and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.p1-create-abha-address]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Send the OTP that starts a registration

## In plain words

The first call in creating an address. The `scope` array decides what the code is for, so read it before assuming this endpoint does one thing.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The mobile number or health account number, encrypted with the public certificate.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": [ "abha-address-enroll", "mobile-verify" ], "loginHint": "mobile-number", "loginId": "{{encrypted-mobile-number}}", "otpSystem": "abdm" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.2. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries a `txnId` and a message naming the masked number the code went to. Every later call in this registration carries that `txnId`.

NHA's document gives this response:

```json
{ "txnId": "1bda5\*\*\*-\*\*\*\*-\*\*\*\*-\*\*\*\*-\*\*\*fca52a82", "message": "OTP is sent to Mobile number ending with \*\*\*\*\*\*2425" }
```

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1006, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
