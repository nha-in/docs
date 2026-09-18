---
id: hiecm.endpoint.m1-phr-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send OTP for ABHA Address Login
summary: >
  Send OTP to login via ABHA Address.  | scope | loginHint | Method |
  |-------|-----------|--------| | `["abha-address-login","mobile-
  verify"]` | `abha-address` | Mobile OTP | | `["abha-address-
  login","aadhaar-verify"]` | `abha-address` | Aadhaar OTP | |
  `["abha-login","aadhaar-bio-verify"]` | `abha-address` | Fingerprint
  | | `["abha-login","aadhaar-face-verify"]` | `abha-address` | Face |
  | `["abha-login","aadhaar-iris-verify"]` | `abha-address` | Iris |.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:6e2f0691a60ef948cae58f69df4e1730742c38f47f10da7b8c63596288120e4c
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Send OTP for ABHA Address Login

## In plain words

Send OTP to login via ABHA Address.

| scope | loginHint | Method |
|-------|-----------|--------|
| `["abha-address-login","mobile-verify"]` | `abha-address` | Mobile OTP |
| `["abha-address-login","aadhaar-verify"]` | `abha-address` | Aadhaar OTP |
| `["abha-login","aadhaar-bio-verify"]` | `abha-address` | Fingerprint |
| `["abha-login","aadhaar-face-verify"]` | `abha-address` | Face |
| `["abha-login","aadhaar-iris-verify"]` | `abha-address` | IRIS |

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{RSA_encrypted_abha_address}}",
  "otpSystem": "abdm, aadhaar"
}'
```

The request and response schemas for this operation are in the M1 specification, published at /specs/hiecm-m1.yaml and rendered field by field at /docs/hiecm/v3/api/m1. It is NHA's file as ingested.

NHA calls this operation `phrRequestOtp`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m1.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

