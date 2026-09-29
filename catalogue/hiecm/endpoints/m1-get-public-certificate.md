---
id: hiecm.endpoint.m1-get-public-certificate
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the public certificate
summary: Returns the public key and the encryption algorithm for every encrypted
  ABHA field.
generated: true
operation: m1_get_v3_profile_public_certificate
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_public_certificate.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_public_certificate.mdx#m1-get-public-certificate.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.error-codes
  endpoints:
    - hiecm.endpoint.p1-get-certificate-public-key
  errors:
    - hiecm.error.abdm-1016
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Get the public certificate

## In plain words

Every Aadhaar number, mobile number, [OTP](/docs/hiecm/v3/getting-started/glossary#otp) and other sensitive value you send to the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) service is encrypted first. This call returns the key to encrypt with in `publicKey`, and the transformation to use in `encryptionAlgorithm`, currently `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. Read the algorithm from the response rather than hard coding a padding, so a change of key or scheme does not break you.

## What happens

`publicKey` is base64 DER with no PEM armour. Wrap it in BEGIN PUBLIC KEY and END PUBLIC KEY lines, 64 characters to a line, before your crypto library loads it.

## When it goes wrong

A 400 with `ABDM-1016` and `Invalid Timestamp` means the `TIMESTAMP` was refused. Send it in UTC, ISO 8601 with milliseconds, for example `2022-10-06T15:10:00.587Z`. A value that encrypts cleanly but is refused later usually means a different padding: use exactly the one `encryptionAlgorithm` names.
