---
id: hiecm.concept.input-encryption
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypting sensitive inputs, Aadhaar, mobile, OTP and passwords
summary: >
  Sensitive values never travel raw in M1. They are RSA encrypted with
  NHA's public certificate before they go in a request body.
sources:
  - file: site/docs/api/hie-cm/m1/apis.md
    fetched: 2026-08-24
    hash: sha256:e8f74ea8c9847e741dadf49524a78eaabe5125c8d29ba231ec17964baf9e905c
  - file: site/docs/api/hie-cm/m1/implementation.md
    fetched: 2026-08-24
    hash: sha256:c01fb4baa0a049c6344d7003c96260c76fa04683c5bc0b7fd8ab87d00cba1cd4
verified:
  status: unverified
  against: docs-only
related:
  endpoints: [hiecm.endpoint.m1-encrypt-value]
  flows: [hiecm.flow.m1-create-abha-aadhaar-otp]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Encrypting sensitive inputs, Aadhaar, mobile, OTP and passwords

## In plain words

Five kinds of values never travel raw in an M1 request body: Aadhaar
numbers, mobile numbers, email addresses, OTP values and passwords. Each
one is RSA encrypted with NHA's public certificate first, then base64 of
the ciphertext goes in the field. That is why the API pages write
placeholders like `<RSA_ENCRYPTED_AADHAAR_NUMBER>`: the field name says
what goes in, the placeholder says it must already be encrypted.

The model is public key encryption: NHA publishes the public half, you
encrypt with it, only NHA's private half can decrypt. Your system never
needs a secret to do this, only the current certificate.

## Before you start

- A gateway access token, so you can call NHA's key and helper
  endpoints. See hiecm.concept.gateway-session.
- Your platform's standard RSA library. There is nothing ABDM specific
  in the mechanics; the specifics are which key and which padding, and
  those are the two things to confirm below.

## What happens

Two ways to produce an encrypted value:

1. **Locally, against NHA's published public key. This is the
   production path.** NHA's M1 document names a `public/certificate`
   API for fetching the public key, listed again under developer
   utilities. In the document as we received it, the curl example and
   the response are screenshots that did not convert to text, so the
   full URL, the headers and the response shape are not recorded here,
   and the Postman collection does not contain the call. The
   verification task below closes this gap.
2. **NHA's encrypt helper, for trying a flow by hand only.** The
   endpoint atom hiecm.endpoint.m1-encrypt-value documents it and why
   it must never be a production path: sending an Aadhaar or mobile
   number to a remote endpoint so it can be encrypted defeats the point
   of encrypting it.

For checking your local encryption by hand, NHA's document points at
the RSA tool at devbeaver.com. Do not paste live personal data into a
third party tool; use test values.

What is deliberately not written here, because no source in this
repository states it and guessing a wrong value costs an integrator
days: the exact RSA padding scheme and hash parameters, the
certificate's format and rotation policy, and the key itself. Common
integrations of this API family use OAEP style padding, but which
variant NHA's V3 expects must be read from the fetched certificate
call and proven against sandbox, not assumed.

```observation schema=precondition
requires: public certificate fetched from NHA and cached with its validity window
unknowns:
  - certificate endpoint full URL and headers
  - response shape and certificate format
  - RSA padding scheme and hash parameters
closed_by: sandbox verification run, recorded in this atom
```

## How you know it worked

An encrypted `loginId` produced by your local code is accepted by a
real M1 call: the Aadhaar OTP request from
hiecm.flow.m1-create-abha-aadhaar-otp returns its transaction id
instead of an encryption or validation error. Cross check: the same
plaintext encrypted through NHA's helper endpoint is also accepted, so
your local output and NHA's helper output are interchangeable.

## When it goes wrong

- A wrongly padded or wrongly keyed value does not fail loudly at
  encryption time; it fails at the API with a validation style
  rejection, which reads as "my Aadhaar number is wrong" and wastes
  hours. When an encrypted field is rejected, verify the padding and
  the certificate before doubting the plaintext.
- A stale cached certificate fails every encrypted call at once after a
  rotation. Cache the certificate with a validity window, not forever.
- Clock or header problems masquerade as encryption problems on these
  calls: see hiecm.error.abdm-2402 for clock skew and
  hiecm.error.abdm-2404 for REQUEST-ID rejections before blaming the
  ciphertext.
