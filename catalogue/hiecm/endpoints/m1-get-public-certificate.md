---
id: hiecm.endpoint.m1-get-public-certificate
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get RSA Public Certificate
summary: >
  Where you get the public key to encrypt an Aadhaar number, mobile
  number, OTP or password: this call fetches NHA's RSA certificate, the
  PEM public key used for M1 input encryption. Unproven on the sandbox:
  it was never observed succeeding as of 2026-08-25.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:14bbfcbe0fc38e13a485d2a8fcfd6dc6d84e89d4f2e6b743cb85a238a3c18873
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file.
verified:
  status: verified
  against: https://abhasbx.abdm.gov.in (ABHA sandbox)
  on: "2026-08-26"
  by: scripts/verify-pending.sh run with sandbox credentials; responses captured
related:
  errors: [hiecm.error.abdm-1016, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  endpoints: [hiecm.endpoint.m1-encrypt-value]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.error-codes]
skills:
  - hiecm-m1-build
---

# Get RSA Public Certificate

## In plain words

Fetch the RSA public key used to encrypt all sensitive fields before transmission.
Fields requiring encryption: Aadhaar, Mobile, OTP, Password, ABHA Number, Email, Photo.

**Server:** `https://abhasbx.abdm.gov.in/abha/api/v3`

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-m1.yaml`, ingested from NHA's file.

NHA calls this operation `getPublicCertificate`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m1.yaml` rather than assuming a shape.

Observed succeeding on 2026-08-26, with a correctly formatted UTC
`TIMESTAMP`: HTTP 200 and a JSON body with one field carrying the RSA
public key as base64 DER (SubjectPublicKeyInfo, no PEM armour).

```response
{"publicKey": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO..."}
```

## When it goes wrong

**Resolved, 2026-08-26.** The unproven state recorded on 2026-08-25 is settled: with a correct UTC `TIMESTAMP` the endpoint works. Every failure ever observed against it was the timestamp format, dressed up as a 404.

- A `TIMESTAMP` in IST returned the `ABDM-1016` invalid timestamp rejection wrapped in an HTTP 404. The 404 is misleading: the path is not the problem, the clock format is. Send the `TIMESTAMP` in UTC with milliseconds and a trailing `Z`. See [ABDM-1016](../errors/abdm-1016.md).
- An earlier guessed path, `/v1/phr/public/certificate`, returned a genuine 404: `{"code":"404","type":"Status report","message":"Not Found"}`. That path does not exist. Do not confuse its honest 404 with the misleading one above.
- If you need an encrypted value on the sandbox today and this endpoint will not give you the key, [the encrypt helper](m1-encrypt-value.md) was observed working on the sandbox on 2026-08-25. It is a sandbox convenience only; it sends the plaintext to NHA.
- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

