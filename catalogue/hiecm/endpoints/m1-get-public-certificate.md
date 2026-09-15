---
id: hiecm.endpoint.m1-get-public-certificate
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get RSA Public Certificate
summary: >
  Where you get the public key to encrypt an Aadhaar number, mobile
  number, OTP or password, and the algorithm to use it with. The
  response carries both. The key arrives as base64 DER, not PEM, and it
  is 4096-bit.
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
  endpoints: [hiecm.endpoint.m1-encrypt-value, hiecm.endpoint.p1-get-certificate-public-key]
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

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx'
```

The request and response schemas for this operation are in the M1 specification, published at /specs/hiecm-m1.yaml and rendered field by field at /docs/hiecm/v3/api/m1. It is NHA's file as ingested.

NHA calls this operation `getPublicCertificate`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m1.yaml` rather than assuming a shape.

HTTP 200 and a JSON body with two fields. The second one is the
important one: it tells you how to use the first.

```response
{
  "publicKey": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO...",
  "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"
}
```

`encryptionAlgorithm` is the transformation to encrypt with, named the
way a Java `Cipher.getInstance` call names it. Read it rather than
hard coding a padding: the field is what stays correct when the key or
the scheme is rotated.

`publicKey` is a 4096-bit RSA key as base64 DER, in
SubjectPublicKeyInfo form, with no PEM armour. Add the armour before
your crypto library will load it: a `-----BEGIN PUBLIC KEY-----` line,
the base64 wrapped at 64 characters per line, then
`-----END PUBLIC KEY-----`.

Ciphertext under this key is 512 bytes before base64. A different
length means you loaded a different key. See
[why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## When it goes wrong

**Resolved, 2026-08-26.** The unproven state recorded on 2026-08-25 is settled: with a correct UTC `TIMESTAMP` the endpoint works. Every failure ever observed against it was the timestamp format, dressed up as a 404.

- Your crypto library rejects the key. You passed the value straight
  through without adding PEM armour. `publicKey` carries DER, whatever
  the field name suggests.
- You hard coded a padding and ignored `encryptionAlgorithm`. It works
  until the day it does not, and the failure then looks like a bad
  value rather than a stale constant. Read the field.
- The value encrypts without error and the receiving call refuses it.
  Check the padding before the plaintext. PKCS#1 v1.5 and OAEP with
  SHA-256 both encrypt cleanly here and are both refused there. See
  [prove your encryption padding](../tests/m1-encryption-padding.md).
- A `TIMESTAMP` in IST returned the `ABDM-1016` invalid timestamp rejection wrapped in an HTTP 404. The 404 is misleading: the path is not the problem, the clock format is. Send the `TIMESTAMP` in UTC with milliseconds and a trailing `Z`. See [ABDM-1016](hiecm.error.abdm-1016).
- An earlier guessed path, `/v1/phr/public/certificate`, returned a genuine 404: `{"code":"404","type":"Status report","message":"Not Found"}`. That path does not exist. Do not confuse its honest 404 with the misleading one above.
- If you need an encrypted value on the sandbox today and this endpoint will not give you the key, [the encrypt helper](m1-encrypt-value.md) was observed working on the sandbox on 2026-08-25. It is a sandbox convenience only; it sends the plaintext to NHA.
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

