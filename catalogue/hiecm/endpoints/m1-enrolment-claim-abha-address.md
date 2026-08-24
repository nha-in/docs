---
id: hiecm.endpoint.m1-enrolment-claim-abha-address
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Claim a chosen ABHA address
summary: >
  Attaches the address the person picked to the ABHA number created
  earlier.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-1170, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp, hiecm.flow.m1-create-abha-face-auth]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Claim a chosen ABHA address

## In plain words

Attaches the address the person picked to the ABHA number created
earlier. `preferred: 1` marks it as the one to show.

Until this succeeds the account has only the default address that NHA
issues automatically, which is the fourteen digit number followed by
`@sbx` or `@abdm` and which nobody can remember.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- A `txnId` from the previous call in the flow. It is not reusable across attempts.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "txnId": "<TXN_ID>",
  "abhaAddress": "<ABHA_ADDRESS>",
  "preferred": 1
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
- The ABHA address is malformed or belongs to another environment. See [ABDM-1170](../errors/abdm-1170.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

