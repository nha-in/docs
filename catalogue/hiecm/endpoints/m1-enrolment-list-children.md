---
id: hiecm.endpoint.m1-enrolment-list-children
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: List the child ABHA accounts linked to this account
summary: >
  A parent or guardian can hold ABHA accounts for children under their
  own account.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# List the child ABHA accounts linked to this account

## In plain words

A parent or guardian can hold ABHA accounts for children under their own
account. This returns them.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The person logged in, so you hold their `X-token`. See [log somebody in](../flows/m1-login-by-mobile.md).

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/profile/children' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

Not yet observed. NHA's collection saves no response body for this operation, so this catalogue does not state a shape, because guessing one is worse than admitting the gap.

When you run this against the sandbox, record the exact response here and set `verified.status` to verified with the date and who ran it. Until then treat any assumption about the response as unproven.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The person scoped token is wrong or expired. See [ABDM-2401](../errors/abdm-2401.md).
- Authentication fails without saying why. See [900900](../errors/900900.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

