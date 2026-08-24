---
id: hiecm.endpoint.m1-login-select-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Choose which ABHA to sign in to
summary: >
  Used when one mobile number carries several ABHA accounts, which is
  common in a family.
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
  flows: [hiecm.flow.m1-login-by-mobile]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Choose which ABHA to sign in to

## In plain words

Used when one mobile number carries several ABHA accounts, which is
common in a family. Send the `txnId` from the verify call and the ABHA
number the person picked.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- A `txnId` from the previous call in the flow. It is not reusable across attempts.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'T-token: <T_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -d '{
  "ABHANumber": "<ABHA_NUMBER>",
  "txnId": "<TXN_ID>"
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
- The ABHA number is wrong or wrongly formatted. See [ABDM-1013](../errors/abdm-1013.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

