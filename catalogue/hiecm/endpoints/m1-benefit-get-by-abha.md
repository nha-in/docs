---
id: hiecm.endpoint.m1-benefit-get-by-abha
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the benefit record for an ABHA number
summary: >
  Reads the benefit record attached to one ABHA number.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-m1.yaml, which
      comes from this source.
related:
  errors: [hiecm.error.abdm-1013, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Get the benefit record for an ABHA number

## In plain words

Reads the benefit record attached to one ABHA number.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The ABHA number to act on, in NHA's hyphenated form.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/<ABHA_NUMBER>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

The response body for this operation is not yet published.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The ABHA number is wrong or wrongly formatted. See [ABDM-1013](hiecm.error.abdm-1013).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

