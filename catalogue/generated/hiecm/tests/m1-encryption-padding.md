---
id: hiecm.test.m1-encryption-padding
type: test
gateway: hiecm
milestone: M1
version: abdm-v3
title: Prove your encryption padding before you build anything else
summary: One login OTP request that proves your encryption padding and
  certificate before you build anything else.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/encryption.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/encryption.mdx#m1-encryption-padding. Edit the
      page, never this file.
related:
  concepts:
    - hiecm.concept.encrypted-identifiers
    - hiecm.concept.input-encryption
  endpoints:
    - hiecm.endpoint.m1-login-request-otp
    - hiecm.endpoint.m1-get-public-certificate
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
---

# Prove your encryption padding before you build anything else

## In plain words

Every M1 journey begins with a call that carries an encrypted value, so a wrong padding stops you on your first request. Prove it once, before you build a flow, so that every later failure is about the flow rather than the padding.

Encrypt a 10 digit mobile number that you hold and that is registered against an ABHA, then send it to the login OTP request:

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <UTC_ISO_8601_WITH_MILLISECONDS_AND_Z>' \
  -H 'Content-Type: application/json' \
  -d '{
  "scope": ["abha-login", "mobile-verify"],
  "loginHint": "mobile",
  "loginId": "<MOBILE_ENCRYPTED_WITH_THE_CERTIFICATE>",
  "otpSystem": "abdm"
}'
```

You receive 200 with a `txnId` and a message naming the last four digits of the mobile, and an OTP arrives on that phone. The padding and the certificate are right. Build the rest of M1 on that code path.

## Before you start

A gateway access token, the M1 certificate with PEM armour added, and a mobile number that is both in your hands and registered against an ABHA. A number nobody has registered cannot tell a right padding from a wrong one.

## What happens

Encrypt the mobile number with OAEP and SHA-1 for both the digest and the mask generation function, base64 the ciphertext, and send it as `loginId` with `loginHint` set to `mobile`. The test needs the 200, not the OTP.

## How you know it worked

200 with a `txnId`, and a message naming the masked mobile.

## When it goes wrong

A refusal for a number you know is registered points at the padding first: PKCS#1 v1.5 and OAEP with SHA-256 are both wrong for M1. The same refusal with OAEP and SHA-1 means the wrong key: use the M1 certificate, not the PHR one. A library that will not load the key needs the PEM armour.
