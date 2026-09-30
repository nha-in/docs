---
id: hiecm.concept.input-encryption
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypting sensitive inputs, Aadhaar, mobile, OTP and passwords
summary: Aadhaar numbers, mobile numbers, OTPs and passwords are encrypted with
  the published certificate before they go in a request body.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/encryption.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/encryption.mdx#input-encryption. Edit the
      page, never this file.
related:
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
  concepts:
    - hiecm.concept.gateway-session
---

# Encrypting sensitive inputs, Aadhaar, mobile, OTP and passwords

## In plain words

Six kinds of value never travel raw in an M1 request body.

| Value | Where it appears |
| --- | --- |
| Aadhaar number | Enrolment and login by Aadhaar |
| ABHA number | Login and search by ABHA number |
| Mobile number | Login, search and mobile update |
| Email address | Email verification |
| One time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) value | Every call that verifies a challenge |
| Password | Password based login |

Each is encrypted with RSA using the ABDM public certificate, and the base64 of the ciphertext goes in the field.

The padding belongs to the certificate. M1 and PHR calls use RSA OAEP with SHA-1 for both the digest and the mask generation function, which the certificate names as `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. The [M4](/docs/hiecm/v3/milestones/m4) registries use `RSA/ECB/PKCS1Padding` under a certificate of their own. An integration that calls both holds both keys and never crosses them.

## Before you start

A gateway access token, and the current certificate for the family you are calling: `GET /abha/api/v3/profile/public/certificate` for M1.

## What happens

Encrypt each value in the table in your own process and send the standard base64 of the ciphertext. In most libraries OAEP defaults to SHA-256, so pass SHA-1 explicitly: in Node, the OAEP padding constant with the OAEP hash set to sha1; in Java, the transformation the certificate names. The certificate arrives as base64 DER with no PEM armour, so add the armour before your library loads it. Cache the certificate with a validity window, not forever.

## How you know it worked

A value your code encrypted is accepted by a real M1 call: the OTP request returns a `txnId` instead of a validation refusal.

## When it goes wrong

A wrong padding or digest does not fail when you encrypt. It fails at the API as a validation refusal that names the business field, which reads as a wrong Aadhaar or mobile number. Check the padding, the digest and the key before you doubt the plaintext. A stale cached certificate fails every encrypted call at once.
