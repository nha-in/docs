---
id: hiecm.endpoint.m1-login-select-account
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Choose which ABHA to sign in to
summary: >
  Exchanges the transfer token from a mobile OTP login for the user token
  of one chosen ABHA. Not needed after an Aadhaar OTP login.
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
      T-token carries Bearer, the 1800 second user token in the response,
      and the Invalid T-token refusal of a final token. Observed by an
      integrator on 2026-09-16, not yet run from this repository.
related:
  endpoints: [hiecm.endpoint.m1-login-verify]
  errors: [hiecm.error.abdm-1013, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-login-by-mobile]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Choose which ABHA to sign in to

## In plain words

A mobile OTP login returns a transfer token that lasts 300 seconds and
a list of the ABHA accounts on that number, which is often more than one
in a family. This call turns the transfer token into the user token for
the one account the person picked.

Call it after every mobile OTP login, even when the list has one entry.
Do not call it after an Aadhaar OTP login: that verify already returned
the final token, and exchanging it answers `400 Invalid T-token`. The
tell is `refreshToken` in the verify response. See
[verify a login OTP](hiecm.endpoint.m1-login-verify).

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The `txnId` and the transfer `token` from the verify call. Neither is reusable across attempts.
- The ABHA number the person chose from `accounts[]`.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'T-token: Bearer <TRANSFER_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'Content-Type: application/json' \
  -d '{
  "ABHANumber": "<ABHA_NUMBER>",
  "txnId": "<TXN_ID>"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending. `T-token` carries the word `Bearer`, a space, then the transfer token.

Idempotency: the transfer token is single use and expires in 300 seconds. Repeat the login rather than this call.

## How you know it worked

The response is 200 with a `token` and `expiresIn: 1800`. A profile read
with `X-token: Bearer <token>` returns the account whose ABHA number you
sent, not the first account on the number.

## When it goes wrong

- `400 Invalid T-token`. Either the transfer token expired, or you sent a final token from an Aadhaar OTP login. Check for `refreshToken` on the verify response.
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The ABHA number is wrong or wrongly formatted. See [ABDM-1013](hiecm.error.abdm-1013).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
