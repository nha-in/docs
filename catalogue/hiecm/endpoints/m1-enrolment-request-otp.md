---
id: hiecm.endpoint.m1-enrolment-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send an OTP to begin or continue an enrolment
summary: >
  The first call of most enrolment flows, and the one people reuse
  without noticing.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp, hiecm.flow.m1-create-abha-by-document]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Send an OTP to begin or continue an enrolment

## In plain words

The first call of most enrolment flows, and the one people reuse without
noticing. What it does depends on `scope` and `loginHint`.

Starting an enrolment: `scope` is `["abha-enrol"]`, `loginHint` is
`aadhaar`, `loginId` is the encrypted Aadhaar number and `otpSystem` is
`aadhaar`. The OTP goes to the mobile registered with Aadhaar.

Verifying a mobile or email afterwards: `scope` gains `mobile-verify` or
`email-verify`, `otpSystem` becomes `abdm`, and you pass the `txnId` from
the enrolment you are continuing.

`loginId` is encrypted, never the raw value. Encrypt it against NHA's
public key first.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- A `txnId` from the previous call in the flow. It is not reusable across attempts.
- The identifier encrypted against NHA's public key. See [why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": "_encrypted_12_digit_aadhaar_no_",
  "otpSystem": "aadhaar"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

Not yet observed. NHA's collection saves no response body for this operation, so this catalogue does not state a shape, because guessing one is worse than admitting the gap.

When you run this against the sandbox, record the exact response here and set `verified.status` to verified with the date and who ran it. Until then treat any assumption about the response as unproven.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

