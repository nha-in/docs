---
id: hiecm.endpoint.m1-encrypt-value
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypt a value with NHA's public key
summary: >
  NHA's hosted helper that encrypts an Aadhaar number, mobile number or
  OTP for you when you do not have the public key. Observed working on
  the sandbox on 2026-08-25. It sends the plaintext to NHA, so treat it
  as a sandbox convenience and never a production path.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      Derived from the operation in catalogue/openapi/hiecm-m1.yaml, which
      comes from this source.
verified:
  status: verified
  against: https://abhasbx.abdm.gov.in (ABHA sandbox)
  on: "2026-08-26"
  by: scripts/verify-pending.sh run with sandbox credentials; responses captured
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m1-find-abha]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.input-encryption]
skills:
  - hiecm-m1-build
---

# Encrypt a value with NHA's public key

## In plain words

Every `loginId` in M1 is encrypted rather than sent raw, and this is NHA's
own helper for doing it. It is convenient for trying a flow by hand.

Do not put it in a production path. Sending an Aadhaar or mobile number to
a remote endpoint so that it can be encrypted defeats the point of
encrypting it. This helper sends the plaintext to NHA, so treat it as a
sandbox convenience. The production path is local RSA OAEP SHA-1
encryption against NHA's published public key. See
[encrypting sensitive inputs](../concepts/input-encryption.md).

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).

## What happens

This exact call was observed working against the sandbox at
`https://abhasbx.abdm.gov.in` on 2026-08-25, during a real integration
session:

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/encrypt' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <UTC_ISO_8601_WITH_MILLISECONDS_AND_Z>' \
  -H 'Content-Type: application/json' \
  -d '{
  "data": "<PLAINTEXT_TO_ENCRYPT>"
}'
```

Every placeholder in angle brackets is something you supply. `REQUEST-ID` is a UUID you generate for this call and log before sending. `TIMESTAMP` must be UTC with milliseconds and a trailing `Z`, for example `2026-08-25T15:51:15.339Z`. `data` is the plaintext you want encrypted.

NHA's Postman collection also shows a `KEY_TYPE` header on this operation. The observed call succeeded without it.

Idempotency: not established. NHA does not document whether repeating this call with the same body is safe, and it has not been tested here. Treat a retry after a timeout as potentially creating a second effect until that is proven.

## How you know it worked

Observed on the sandbox on 2026-08-26: HTTP 200 and a JSON body with
one field, the ciphertext as base64.

```response
{"encryptedData": "hQbZChxG64qT4LhYnH5nPRGrjbJ2NVs5wr7nQF+X0fwBf/OGkesS8ho6..."}
```

The field is `encryptedData`, not `data`, and there is no wrapper
around it. Client code that guessed a raw string or another field name
should read this shape instead.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

