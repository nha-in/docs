---
id: hiecm.endpoint.m1-encrypt-value
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypt a value with NHA's public key
summary: >
  Every `loginId` in M1 is encrypted rather than sent raw, and this is
  NHA's own helper for doing it.
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
  flows: [hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Encrypt a value with NHA's public key

## In plain words

Every `loginId` in M1 is encrypted rather than sent raw, and this is NHA's
own helper for doing it. It is convenient for trying a flow by hand.

Do not put it in a production path. Sending an Aadhaar or mobile number to
a remote endpoint so that it can be encrypted defeats the point of
encrypting it. Encrypt locally against NHA's published public key
instead.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'KEY_TYPE: <KEY_TYPE>' \
  -H 'Content-Type: application/json' \
  -d '{
  "data": "1"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

Not yet observed. NHA's collection saves no response body for this operation, so this catalogue does not state a shape, because guessing one is worse than admitting the gap.

When you run this against the sandbox, record the exact response here and set `verified.status` to verified with the date and who ran it. Until then treat any assumption about the response as unproven.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

