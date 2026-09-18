---
id: hiecm.endpoint.m1-login-verify
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify a login OTP and get a user token
summary: >
  Returns the token that profile calls need in the `X-token` header.
  After an Aadhaar OTP it is the final token; after a mobile OTP it is a
  short lived transfer token to exchange for one.
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
      The two token outcomes by OTP system and the refreshToken rule.
      Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  endpoints: [hiecm.endpoint.m1-login-select-account]
  errors: [hiecm.error.900900, hiecm.error.abdm-2401, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-login-by-mobile, hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Verify a login OTP and get a user token

## In plain words

Verifies the OTP sent by the login request and returns a token. Which
token depends on which system sent the OTP:

| OTP system (`scope`) | `verify` returns | What you do next |
|---|---|---|
| Mobile OTP (`abha-login`, `mobile-verify`) | `token` with `expiresIn: 300` and `accounts[]` | Exchange it at [choose which ABHA to sign in to](hiecm.endpoint.m1-login-select-account). It is a transfer token, not a user token. |
| Aadhaar OTP (`abha-login`, `aadhaar-verify`) | `token` with `expiresIn: 1800`, `refreshToken` and `accounts[]` | Use it directly as `X-token: Bearer <token>`. Exchanging it returns `400 Invalid T-token`. |

The rule to code: **if the verify response carries `refreshToken`, the
token is final. If it does not, exchange it.**

Either token identifies one person, so it is not interchangeable with
the gateway session token, which identifies your application.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- A `txnId` from [send a login OTP](hiecm.endpoint.m1-login-request-otp) and the OTP the person read out, encrypted.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "<TXN_ID>",
      "otpValue": "<ENCRYPTED_OTP>"
    }
  }
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending. For an Aadhaar OTP send `"aadhaar-verify"` in place of `"mobile-verify"`.

Idempotency: an OTP verifies once. A second verify with the same `txnId` is refused.

## How you know it worked

The response is 200 with a `token`, an `expiresIn` and an `accounts` array.

- `refreshToken` present and `expiresIn: 1800`: you hold the user token. A profile read with `X-token: Bearer <token>` returns the account.
- No `refreshToken` and `expiresIn: 300`: you hold a transfer token. The exchange call returns the user token with `expiresIn: 1800`.

### The token this returns is not the X-token

Observed on the sandbox on 2026-09-14, on a mobile OTP login that succeeded:

```response
{
  "txnId": "<TXN_ID>",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<JWT>",
  "expiresIn": 300,
  "accounts": [ ... ]
}
```

Decode that JWT before you use it. Its payload carries `"typ": "Transfer"` and
a five minute life, and it is a transfer token rather than a session token.
Sending it to a profile call is refused two different ways, and neither refusal
says the wrong kind of token was sent:

| How it was sent | What came back |
|---|---|
| `X-token: Bearer <token>` | `401 {"code": "ABDM-1094", "message": "X-token expired"}` |
| `X-token: <token>` | `400 {"message": "Invalid X-token"}` |

Both were observed one second after this call returned the token, so neither is
about age. Exchange the transfer token at
[select the account](m1-login-select-account.md) for the session token, and do
that whatever the length of `accounts`.

Not yet observed, and worth confirming on your own first run: that the exchange
returns a token whose `typ` is not `Transfer`, and which a profile call accepts.
The recorded `expiresIn: 1800` and `refreshExpiresIn: 1296000` in the
specification belong to that exchanged token rather than to this one.

### The accounts array already holds a registration form

Each entry carries `ABHANumber`, `preferredAbhaAddress`, `name`, `gender`,
`dob`, `verifiedStatus`, `verificationType`, `status`, `profilePhoto`,
`kycVerified` and `mobileVerified`.

A front desk can fill its form from this the moment the OTP verifies, without
calling the profile endpoint at all. The profile call adds the address and its
LGD codes; the name, gender and date of birth are already here.

Note the shape difference, because it catches people moving between the two:
`dob` is one `DD-MM-YYYY` string here, and three integer fields
(`dayOfBirth`, `monthOfBirth`, `yearOfBirth`) on the profile endpoint.

Read the lifetimes from the response rather than assuming them. The user token lasts thirty minutes and the refresh token fifteen days (`refreshExpiresIn: 1296000`). This is a different clock from the gateway session token in `Authorization`.

The bodies for 400, 401, 404 and 422 name the problem, so read the body rather than only the status.

## When it goes wrong

- A profile call answers `400 {"message":"Invalid X-token"}`. The token was sent bare. Send `X-token: Bearer <token>`.
- The exchange call answers `400 Invalid T-token`. You exchanged a final token. Use it as `X-token` directly.
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The person scoped token is wrong or expired. See [ABDM-2401](hiecm.error.abdm-2401).
- Authentication fails without saying why. See [900900](hiecm.error.900900).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
