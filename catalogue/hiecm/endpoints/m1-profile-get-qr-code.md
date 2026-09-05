---
id: hiecm.endpoint.m1-profile-get-qr-code
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the ABHA QR code
summary: >
  The QR a person shows at a facility so their ABHA address can be
  read without typing.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-create-abha-by-document]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Get the ABHA QR code

## In plain words

The QR a person shows at a facility so their ABHA address can be read
without typing. Returns the image payload for the signed in account.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The person logged in, so you hold their `X-token`. See [log somebody in](hiecm.flow.m1-login-by-mobile).

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/qrCode' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

The response body for this operation is not yet published.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The person scoped token is wrong or expired. See [ABDM-2401](hiecm.error.abdm-2401).
- Authentication fails without saying why. See [900900](hiecm.error.900900).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

