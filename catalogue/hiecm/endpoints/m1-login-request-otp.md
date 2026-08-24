---
id: hiecm.endpoint.m1-login-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send a login OTP
summary: >
  Send a login OTP.
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
  flows: [hiecm.flow.m1-login-by-mobile, hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Send a login OTP

## In plain words

Starts a login. `loginHint` selects what the person is identifying
themselves with: `mobile`, `aadhaar` or `abha-number`. As everywhere in
M1, `loginId` is encrypted rather than raw.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- A `txnId` from the previous call in the flow. It is not reusable across attempts.
- The identifier encrypted against NHA's public key. See [why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "<ENCRYPTED_MOBILE_NUMBER>",
  "otpSystem": "abdm"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

NHA's own collection records responses for this operation at status 200, 401, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This has not been run against the sandbox from this repository. When you run it, record the response here and set `verified.status` accordingly.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

