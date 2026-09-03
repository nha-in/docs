---
id: hiecm.endpoint.m1-profile-get-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Read the signed in person's ABHA profile
summary: >
  Needs the `X-token` from login, because it reads one person's
  account rather than anything about your application.
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
  flows: [hiecm.flow.m1-create-abha-by-document, hiecm.flow.m1-update-mobile]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Read the signed in person's ABHA profile

## In plain words

Needs the `X-token` from login, because it reads one person's account
rather than anything about your application.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The person logged in, so you hold their `X-token`. See [log somebody in](../flows/m1-login-by-mobile.md).

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

The response body for this operation is not yet published.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The person scoped token is wrong or expired. See [ABDM-2401](../errors/abdm-2401.md).
- Authentication fails without saying why. See [900900](../errors/900900.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

