---
id: hiecm.endpoint.m1-login-request-otp
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send a login OTP
summary: >
  Send a login OTP.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm/v3/hiecm-m1.yaml, which
      comes from this source.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-login-by-mobile, hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.encrypted-identifiers, hiecm.concept.input-encryption]
  tests: [hiecm.test.m1-encryption-padding]
skills:
  - hiecm-m1-build
---

# Send a login OTP

## In plain words

Starts a login. `loginHint` selects what the person is identifying
themselves with: `mobile`, `aadhaar` or `abha-number`. As everywhere in
M1, `loginId` is encrypted rather than raw.

The shape you encrypt matters. On `abha-number` the plaintext is the 14
digits with their dashes, `NN-NNNN-NNNN-NNNN`, for example
`91-1234-5678-9015`. The bare digits are refused. On `mobile` it is 10
digits with no country code, and on `aadhaar` 12 digits with no spaces.
See [why identifiers are encrypted](hiecm.concept.encrypted-identifiers).

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- A `txnId` from the previous call in the flow. It is not reusable across attempts.
- The identifier in the plaintext shape for its `loginHint`, then encrypted against NHA's public key. See [why identifiers are encrypted](hiecm.concept.encrypted-identifiers).

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "<ENCRYPTED_MOBILE_NUMBER>",
  "otpSystem": "abdm"
}'
```

Logging in by ABHA number with a mobile OTP is the same call with a
different hint, and the plaintext behind `<ENCRYPTED_ABHA_NUMBER>` is
`91-1234-5678-9015`, dashes and all:

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'BENEFIT_NAME: <BENEFIT_SCHEME_NAME>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "<ENCRYPTED_ABHA_NUMBER>",
  "otpSystem": "abdm"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending.

## How you know it worked

NHA's own collection records responses for this operation at status 200, 401, and those bodies are in the specification as examples with the personal data scrubbed.

Read the body rather than only the status. Several of NHA's saved failures return a body that names the problem while the status alone does not.

This call is also how you prove your encryption. Send a mobile number
you control, encrypted with RSA-OAEP and SHA-1 under the published
certificate. A right padding returns 200 with a `txnId` and a message
naming the last four digits. A wrong padding returns
`400 {"loginId": "Invalid Mobile Number"}` for a number you know is
correct. See [prove your encryption padding](../tests/m1-encryption-padding.md).

## When it goes wrong

- The ABHA number was encrypted without its dashes. The response is
  `400 {"loginId": "LoginId is invalid"}`, observed on the sandbox on
  2026-09-11. Put the dashes back and send it again.
- `400 {"loginId": "Invalid LoginId"}` is a different failure with a
  similar message. On this endpoint it means the value was refused
  without a format reason: check the padding and the key. On
  `/v3/enrollment/request/otp` the same body is returned for every
  input, so it carries no cause there.
- `404 {"error": {"code": "ABDM-1114", "message": "User not found."}}`
  means the value decrypted and passed its format check, and no account
  holds that number.
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

