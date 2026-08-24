---
id: hiecm.endpoint.m1-login-request-otp-v31
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send a login OTP, v3.1
summary: >
  The v3.1 variant of the login OTP request.
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
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Send a login OTP, v3.1

## In plain words

The v3.1 variant of the login OTP request. It sits on a different base
path from the rest of M1, `/abha/api/v3.1` rather than `/abha/api/v3`,
which is why the version appears in the path here.

NHA's collection uses it for Aadhaar OTP and biometric login. Treat v3
as the default and reach for v3.1 only where NHA's material does.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The identifier encrypted against NHA's public key. See [why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-login",
    "aadhaar-verify",
    "aadhaar-otp-verify"
  ],
  "loginHint": "aadhaar",
  "loginId": "<ENCRYPTED_AADHAAR_NUMBER>",
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

