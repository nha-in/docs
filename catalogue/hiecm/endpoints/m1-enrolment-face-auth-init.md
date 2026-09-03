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
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
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

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

The response body for this operation is not yet published.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

