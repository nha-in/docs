---
id: hiecm.endpoint.p1-get-certificate-public-key
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: GET Certificate (Public key)
summary: >
  Returns the public certificate and the algorithm to encrypt with, which
  sensitive fields need before they are sent.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.44. The path, the method
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# GET Certificate (Public key)

## In plain words

Returns the certificate used for PHR login encryption, and the
algorithm to encrypt with. The response carries both, so you do not
have to know the padding in advance.

This is not the same certificate as
[the profile one](m1-get-public-certificate.md). That key is 4096-bit
and this one is 2048-bit. They are not interchangeable.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/public/certificate' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <UTC_ISO_8601_WITH_MILLISECONDS_AND_Z>' \
  -H 'X-CM-ID: sbx'
```

It takes no request body.

## How you know it worked

HTTP 200 and a JSON body with two fields:

```response
{
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Zq7YKcjmccSBnR9CDHd...",
  "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"
}
```

`publicKey` is a 2048-bit RSA key as base64 DER, with no PEM armour.
Ciphertext under it is 256 bytes before base64, which is how you tell
it apart from the 4096-bit profile key at a glance.

Encrypt with whatever `encryptionAlgorithm` names rather than a
constant of your own.

## When it goes wrong

- You encrypted with this key and a profile or enrolment call refused
  the value. Those calls want the 4096-bit profile certificate. Check
  your ciphertext length: 256 bytes means this key, 512 means that one.
- Your library will not load the key. It arrives as bare base64 DER.
  Add PEM armour, wrapping at 64 characters per line.
- The PHR codes are the AS series, recorded once against P1 for the
  whole patient side. The gateway codes are the ABDM series, listed in
  the error reference.
