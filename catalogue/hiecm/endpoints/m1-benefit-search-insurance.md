---
id: hiecm.endpoint.m1-benefit-search-insurance
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Find insurance cover recorded against an ABHA number
summary: >
  NHA's collection saves 400, 401 and 500 responses for this call as
  well as 200, which is a fair sign of how often it is called with
  something missing.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-1013, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Find insurance cover recorded against an ABHA number

## In plain words

NHA's collection saves 400, 401 and 500 responses for this call as well
as 200, which is a fair sign of how often it is called with something
missing. Handle all four.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The ABHA number to act on, in NHA's hyphenated form.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/abha/search/insurance/<ABHA_NUMBER>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

NHA's own collection records responses for this operation at status 200, 400, 401, 500, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This has not been run against the sandbox from this repository. When you run it, record the response here and set `verified.status` accordingly.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The ABHA number is wrong or wrongly formatted. See [ABDM-1013](../errors/abdm-1013.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

