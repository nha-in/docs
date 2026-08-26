---
id: hiecm.concept.input-encryption
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypting sensitive inputs, Aadhaar, mobile, OTP and passwords
summary: >
  Sensitive identifiers never travel raw in M1. You encrypt an Aadhaar
  number, mobile number, OTP or password with NHA's public key before it
  goes in a request body: RSA OAEP with SHA-1 for the V3 flows, a
  padding NHA's own documents do not state.
sources:
  - file: site/docs/api/hie-cm/m1/apis.md
    fetched: 2026-08-24
    hash: sha256:e8f74ea8c9847e741dadf49524a78eaabe5125c8d29ba231ec17964baf9e905c
  - file: site/docs/api/hie-cm/m1/implementation.md
    fetched: 2026-08-24
    hash: sha256:c01fb4baa0a049c6344d7003c96260c76fa04683c5bc0b7fd8ab87d00cba1cd4
  - url: https://github.com/NHA-ABDM/ABDM-ABHA-APP/blob/main/lib/utils/validate/validator.dart
    fetched: 2026-08-24
    hash: git-blob:2b606616718a0973742e9c7e2d58c101ac64ce12
    role: upstream
    note: >
      NHA's own ABHA application, the reference M1 client. Encrypts with
      the Dart encrypt package version 5, whose RSA encoding defaults to
      PKCS1 v1.5, against a bundled PEM public key.
  - url: https://github.com/NHA-ABDM/UHI/blob/main/src/apps/backend/eua-backend/euaService/EUAclient/src/main/java/in/gov/abdm/eua/service/utils/RsaUtils.java
    fetched: 2026-08-24
    hash: git-blob:eb6abfd1c589d33860308e5432acb873d4412d2e
    role: upstream
    note: >
      NHA's UHI reference implementation, stating PKCS1 v1.5 outright. A
      different gateway, cited as corroboration of the older families'
      convention, not as a V3 source.
  - file: (private) production V3 integration, not publicly citable
    fetched: 2026-08-24
    status: not-publicly-citable
    role: corroboration
    note: >
      A working integration running the V3 registration and login flows
      against ABDM. Source of the OAEP with SHA-1 finding for V3 and of
      the one-key-per-family split. Not a public URL, so a sandbox run
      is what will make this atom verifiable by a reader.
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

### The padding depends on which API family you are calling

This is the part that costs people days, and it is not stated in NHA's
prose documents. There is no single ABDM padding scheme. The scheme
that works is a property of the API family, and the same integrator
often needs both:

| Calling | Padding | Key |
|---|---|---|
| V3 ABHA and PHR registration and login, the flows this catalogue documents | RSA OAEP with SHA-1 | the V3 PHR public key, 2048 bit |
| Older healthid API family, V1 and V2 | RSA PKCS1 v1.5 | a separate healthid public key, 4096 bit |
| NHPR, the M4 professional registry | RSA PKCS1 v1.5 | a separate NHPR public key, 2048 bit |

**For everything in this catalogue's M1 scope, use OAEP with SHA-1.**
Note the hash: OAEP defaults to SHA-256 in most libraries, and SHA-256
here is rejected. The digest must be SHA-1 for both the OAEP hash and
the MGF1 mask generation, which is the library default when SHA-1 is
passed as the hash. Output is the raw ciphertext, standard base64
encoded, into the field.

```
Go      rsa.EncryptOAEP(sha1.New(), rand.Reader, pub, []byte(value), nil)
Python  public_key.encrypt(value, padding.OAEP(
            mgf=padding.MGF1(hashes.SHA1()), algorithm=hashes.SHA1(), label=None))
Java    Cipher.getInstance("RSA/ECB/OAEPWithSHA-1AndMGF1Padding")
Node    crypto.publicEncrypt({key, padding: RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha1"}, buf)
```

Each key is an RSA public key in X.509 SubjectPublicKeyInfo form, the
`-----BEGIN PUBLIC KEY-----` PEM. Working integrations pin the key
rather than fetching it per request, and refresh it when NHA rotates.

The evidence: a production V3 integration running against ABDM uses
OAEP with SHA-1 for the V3 registration and login flows, and PKCS1 v1.5
for the healthid and NHPR families, with a distinct key per family.
NHA's own published code corroborates the PKCS1 v1.5 half: the UHI
backend states `Cipher.getInstance("RSA/ECB/PKCS1Padding")` outright,
and NHA's ABHA application encrypts through a library whose RSA default
is PKCS1 v1.5. No NHA published source in reach states the V3 OAEP
parameters, which is exactly why integrators reading only the documents
get this wrong.

What is still not settled, and is not guessed here: the public
certificate endpoint's full URL, headers and response shape, since
NHA's document carries them only as screenshots and the Postman
collection does not include the call, and the rotation policy for each
key. Nothing on this page has been run against the sandbox from this
repository, so the atom stays unverified until the verification below
is done.

```observation schema=precondition
requires: the public key for the API family you are calling
settled:
  - v3 padding: RSA OAEP, SHA-1 for both digest and MGF1
  - healthid and nhpr padding: RSA PKCS1 v1.5
  - key format: X.509 SubjectPublicKeyInfo PEM, one key per API family
  - ciphertext encoding: standard base64
unknowns:
  - certificate endpoint full URL, headers and response shape
  - rotation policy per key
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

- Wrong padding or wrong hash is the most likely mistake, and the two
  most common shapes of it are using PKCS1 v1.5 on a V3 call, or using
  OAEP with SHA-256 because that is the library default. Neither fails
  at encryption time. Both fail at the API with a validation style
  rejection, which reads as "my Aadhaar number is wrong" and wastes
  hours. When an encrypted field is rejected, check the padding and the
  digest first, and doubt the plaintext last.
- Using the right scheme with the wrong family's key fails the same
  way. There is one key per API family, so an integrator who calls both
  V3 and NHPR holds more than one and must not cross them.
- A stale cached certificate fails every encrypted call at once after a
  rotation. Cache the certificate with a validity window, not forever.
- Clock or header problems masquerade as encryption problems on these
  calls: see hiecm.error.abdm-2402 for clock skew and
  hiecm.error.abdm-2404 for REQUEST-ID rejections before blaming the
  ciphertext.
