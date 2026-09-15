---
id: hiecm.endpoint.m1-login-verify
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Verify a login OTP and get a user token
summary: >
  Returns the user scoped token that profile calls need, sent
  afterwards as the `X-token` header.
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
  flows: [hiecm.flow.m1-login-by-mobile, hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Verify a login OTP and get a user token

## In plain words

Returns the user scoped token that profile calls need, sent afterwards as
the `X-token` header. That token identifies one person, so it is not
interchangeable with the gateway session token, which identifies your
application.

If the identifier the person used maps to more than one ABHA, this
responds with the list instead of a token, and you continue with the
user selection call.

The saved responses in NHA's collection cover 400, 401, 404 and 422 as
well as 200, so read the body rather than only the status.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The person logged in, so you hold their `X-token`. See [log somebody in](hiecm.flow.m1-login-by-mobile).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'T-token: <T_TOKEN_FROM_LOGIN_VERIFY>' \
  -H 'X-token: <X_TOKEN_FROM_LOGIN_VERIFY>' \
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
      "otpValue": "<OTPVALUE>"
    }
  }
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

NHA's own collection records responses for this operation at status 200, 400, 401, 404, 422, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

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

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The person scoped token is wrong or expired. See [ABDM-2401](hiecm.error.abdm-2401).
- Authentication fails without saying why. See [900900](hiecm.error.900900).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

