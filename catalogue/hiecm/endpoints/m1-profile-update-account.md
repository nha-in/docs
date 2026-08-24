---
id: hiecm.endpoint.m1-profile-update-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Update fields on an ABHA profile
summary: >
  Update fields on an ABHA profile.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: unverified
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-1013, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Update fields on an ABHA profile

## In plain words

Changes self declared profile details. Changing a mobile number or an
email address is not done here: those need the OTP pair below, because
NHA verifies the new value before accepting it.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The person logged in, so you hold their `X-token`. See [log somebody in](../flows/m1-login-by-mobile.md).
- The identifier encrypted against NHA's public key. See [why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## What happens

```bash
curl -X PATCH 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -d '{
  "abhaNumber": "<ABHA_NUMBER>",
  "name": "<NAME>",
  "dob": "<DATE_OF_BIRTH>",
  "gender": "M"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

NHA's own collection records responses for this operation at status 200, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This has not been run against the sandbox from this repository. When you run it, record the response here and set `verified.status` accordingly.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- The person scoped token is wrong or expired. See [ABDM-2401](../errors/abdm-2401.md).
- Authentication fails without saying why. See [900900](../errors/900900.md).
- The ABHA number is wrong or wrongly formatted. See [ABDM-1013](../errors/abdm-1013.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

