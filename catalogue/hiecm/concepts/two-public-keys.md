---
id: hiecm.concept.two-public-keys
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Two RSA public keys, chosen by the path you call
summary: >
  Profile and enrolment calls encrypt with a 4096-bit key and PHR calls
  with a 2048-bit key. The wrong key is refused as an invalid mobile
  number, which looks like bad input and is not.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 1.3. Observed by an integrator on 2026-09-16, not yet run
      from this repository.
related:
  endpoints:
    - hiecm.endpoint.m1-get-public-certificate
    - hiecm.endpoint.p1-get-certificate-public-key
    - hiecm.endpoint.m1-encrypt-value
    - hiecm.endpoint.p1-login-request-otp
  concepts:
    - hiecm.concept.input-encryption
    - hiecm.concept.encrypted-identifiers
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.m1-login-phr-by-mobile
  errors:
    - hiecm.error.abdm-1006
skills:
  - hiecm-m1-build
  - hiecm-m1-debug
  - hiecm-p1-build
---

# Two RSA public keys, chosen by the path you call

## In plain words

Every Aadhaar number, mobile number, OTP or password you send in M1 is
encrypted first with a public key ABDM publishes. There are two such
keys, and the path you are about to call decides which one:

| You are calling | Fetch the key from | Key size |
|---|---|---|
| `/v3/enrollment/*` and `/v3/profile/*` | `GET /v3/profile/public/certificate` | RSA 4096 |
| `/v3/phr/*` | `GET /v3/phr/app/login/public/certificate` | RSA 2048 |

Encrypting a value with the other key does not fail at encryption time.
It fails at the ABDM end with `ABDM-1006` and the message
`Invalid mobile number`, which reads as a typo and is a key mix up.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The padding rules in [encrypting sensitive inputs](hiecm.concept.input-encryption).

## What happens

Both certificate calls return the same shape:

```json
{
  "publicKey": "<BASE64_DER_WITHOUT_PEM_ARMOUR>",
  "encryptionAlgorithm": "RSA/ECB/OAEPWithSHA-1AndMGF1Padding"
}
```

`publicKey` is base64 DER with no `-----BEGIN PUBLIC KEY-----` lines.
Wrap it in PEM yourself, 64 characters per line, before handing it to a
library that expects PEM. Encrypt with OAEP, SHA-1 for both the digest
and the MGF1 mask, then standard base64 the ciphertext. A 4096-bit key
produces 512 bytes of ciphertext and a 2048-bit key 256, so the length
of what you are about to send tells you which key you used.

Pick the key from the path prefix and cache both. The hosted encrypt
helper at [encrypt a value](hiecm.endpoint.m1-encrypt-value) takes
`{"data": "<PLAINTEXT>"}`; a body keyed `value` is refused with
`ABDM-9999 Invalid Data`. That helper is for trying a flow by hand,
never a production path.

## How you know it worked

You have understood this when you can answer both of these.

1. A PHR login request answers `ABDM-1006 Invalid mobile number` for a
   number you know is right. Which key did you use, and how does the
   ciphertext length prove it?
2. You hold one cached certificate. Which calls will fail?

## When it goes wrong

One key for every path. Whichever half of M1 you built first works, and
the other half fails on every encrypted field with `ABDM-1006`. See
[ABDM-1006](hiecm.error.abdm-1006).

Passing the raw `publicKey` string to a PEM parser. It is DER. Wrap it.

OAEP with SHA-256, the library default. The digest must be SHA-1 for
both keys.
