---
id: hiecm.concept.encrypted-identifiers
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Why identifiers are encrypted, and where to do it
summary: Identifiers are encrypted with the published certificate, using the
  algorithm its response names, after being put in the shape the service
  validates.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/encryption.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/encryption.mdx#encrypted-identifiers. Edit the
      page, never this file.
related:
  decisions:
    - hiecm.decision.encrypt-locally
  concepts:
    - hiecm.concept.input-encryption
  endpoints:
    - hiecm.endpoint.m1-login-request-otp
    - hiecm.endpoint.m1-get-public-certificate
  tests:
    - hiecm.test.m1-encryption-padding
---

# Why identifiers are encrypted, and where to do it

## In plain words

We publish the public half of a key pair. You encrypt with it. Only our private half can decrypt. Your system never holds a secret to do this, only the current certificate.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant A as ABHA service
    S->>A: GET /abha/api/v3/profile/public/certificate
    A-->>S: publicKey, encryptionAlgorithm
    S->>S: RSA encrypt the Aadhaar number, mobile number,<br/>OTP or password with that public key
    S->>A: The Base64 result as the field value,<br/>for example loginId or otp.otpValue
    A->>A: Decrypts with its private key
```

There is nothing ABDM specific in the mechanics. Your platform's standard RSA library does the work. Both keys use `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. The one thing to confirm is which key you are using.

Read `encryptionAlgorithm` from the certificate response and encrypt with what it names. Code that reads the field survives a change of algorithm. Code that cannot recognise what the field names should refuse to encrypt rather than fall back to a default.

## Before you start

The certificate from `GET /abha/api/v3/profile/public/certificate`, which carries `publicKey` and `encryptionAlgorithm`.

## What happens

Put the plaintext in the shape the service validates after it decrypts, from the table above: an ABHA number keeps its dashes. Encrypt with the algorithm the response names and send the base64 result as the field value, for example `loginId`.

## How you know it worked

The raw Aadhaar or mobile number exists only inside your own process, for the length of the call, and never reaches a log. A call carrying your ciphertext passes validation.

## When it goes wrong

`400 {"loginId": "LoginId is invalid"}` means the value decrypted and the plaintext failed a format rule, usually an ABHA number sent without its dashes. Logging the plain value before encryption is the same leak, moved into your log store.
