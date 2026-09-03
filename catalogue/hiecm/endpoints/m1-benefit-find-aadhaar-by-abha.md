---
id: hiecm.endpoint.m1-benefit-find-aadhaar-by-abha
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Find the Aadhaar number behind an ABHA number
summary: >
  Find the Aadhaar number behind an ABHA number.
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

# Find the Aadhaar number behind an ABHA number

## In plain words

The reverse lookup. It returns a national identity number, so treat both
the request and the response as sensitive and log neither.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search/aadhaarByAbha' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

The response body for this operation is not yet published.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

