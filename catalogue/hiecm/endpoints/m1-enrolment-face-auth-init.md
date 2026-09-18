---
id: hiecm.endpoint.m1-enrolment-face-auth-init
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Start face or biometric authentication and get a transaction id
summary: >
  Start face or biometric authentication and get a transaction id.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-m1.yaml, which
      comes from this source.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The 415 without Content-Type is in catalogue/verification/hiecm.endpoint.m1-enrolment-face-auth-init.json, run 2026-09-17. The scope value is the one the M1 specification records.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-create-abha-face-auth]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Start face or biometric authentication and get a transaction id

## In plain words

Returns the `txnId` that a QR code is built from. The person scans that QR
with the ABHA app, completes face authentication through the Aadhaar RD
service, and you then continue with the captured result.

The same call starts the face authentication login flow, not only
enrolment.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": ["abha-enrol", "face-auth"]
}'
```

`Content-Type: application/json` is required. Without it the call returns
401 with `ABDM-1006` and a message beginning `415 UNSUPPORTED_MEDIA_TYPE`.

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

The response carries a `txnId` and a message. Carry the `txnId` into the capture step.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

