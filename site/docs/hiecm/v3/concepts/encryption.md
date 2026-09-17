---
title: Encryption
sidebar_label: Encryption
description: Which values must be encrypted before they go in a request body, why it is required, and why you encrypt inside your own system rather than through a helper.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
sidebar_position: 9
covers: [hiecm.concept.encrypted-identifiers, hiecm.concept.input-encryption, hiecm.decision.encrypt-locally]
sidebar_class_name: sidebar-icon sidebar-icon--lock
---

# Encryption

Several fields in [M1](/docs/hiecm/v3/api/m1) do not carry the value you started with. They carry that value encrypted against the ABDM public key. When an API page shows a placeholder such as `{{encrypted aadhaar number}}`, the field name tells you what the value is and the placeholder tells you it must already be encrypted.

## What must be encrypted

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

## What shape the plaintext must be

The service validates the plaintext after it decrypts, so the shape you
encrypt matters and a wrong shape is rejected as though the value were wrong.

| Value | Plaintext shape | Example |
| --- | --- | --- |
| ABHA number | 14 digits with dashes, `NN-NNNN-NNNN-NNNN` | `91-1234-5678-9015` |
| Mobile number | 10 digits, first digit 1 to 9, optionally prefixed with `+91` or `0` | `9876543210` |
| OTP value | Exactly 6 digits | `123456` |

The ABHA number is the one that catches people, because the number is printed
and stored both ways.
Strip the dashes for display if you like, but put them back before you encrypt.

## How the model works

We publish the public half of a key pair. You encrypt with it. Only our private half can decrypt. Your system never holds a secret to do this, only the current certificate.

```mermaid
graph LR
  A["Aadhaar or mobile number<br/>inside your system"] -->|RSA with the ABDM public key| B["Encrypted value"]
  B -->|sent as the field value| C["ABDM"]
  C -->|the ABDM private key| D["Plain value, inside ABDM"]
```

There is nothing ABDM specific in the mechanics. Your platform's standard RSA library does the work. The two things to confirm are which key you are using and which padding.

## Where to do it

**Encrypt inside your own system, against the published ABDM public key.** This is the production path.

## Fetching the public key

M1 has a `public/certificate` API for fetching the public key. Its URL, headers and response shape are on [the certificate call](/docs/hiecm/v3/api/m1/endpoints/m1-session/03-m1-get-v3-profile-public-certificate).

## Where to go next

- [Gateway](/docs/hiecm/v3/concepts/gateway) for the session token every call needs.
- [M1 user journeys](/docs/hiecm/v3/milestones/m1), where the encrypted identifier appears in the search and login steps.
