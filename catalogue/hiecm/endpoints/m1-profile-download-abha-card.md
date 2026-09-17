---
id: hiecm.endpoint.m1-profile-download-abha-card
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Download the ABHA card as a file
summary: >
  The same card, delivered as a downloadable file rather than for
  inline display.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-m1.yaml, which
      comes from this source.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      X-token is sent as Bearer plus the token. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Download the ABHA card as a file

## In plain words

The same card, delivered as a downloadable file rather than for inline
display.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The person logged in, so you hold their `X-token`. See [log somebody in](hiecm.flow.m1-login-by-mobile).

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/download-abha-card' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
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

