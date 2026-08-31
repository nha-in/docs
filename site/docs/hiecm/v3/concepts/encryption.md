---
title: Encryption
sidebar_label: Encryption
description: Which values must be encrypted before they go in a request body, why NHA requires it, and why you encrypt inside your own system rather than through a helper.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, the M1 Postman collection
sidebar_position: 9
covers: [hiecm.concept.encrypted-identifiers, hiecm.concept.input-encryption, hiecm.decision.encrypt-locally]
---

# Encryption

Several fields in [M1](/docs/hiecm/v3/api/m1) do not carry the value you started with. They carry that value encrypted against [NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s public key. When an API page shows a placeholder such as `<RSA_ENCRYPTED_AADHAAR_NUMBER>`, the field name tells you what the value is and the placeholder tells you it must already be encrypted.

## What must be encrypted

Five kinds of value never travel raw in an M1 request body.

| Value | Where it appears |
| --- | --- |
| Aadhaar number | Enrolment and login by Aadhaar |
| Mobile number | Login, search and mobile update |
| Email address | Email verification |
| One time password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) value | Every call that verifies a challenge |
| Password | Password based login |

Each is encrypted with RSA using NHA's public certificate, and the base64 of the ciphertext goes in the field.

## How the model works

NHA publishes the public half of a key pair. You encrypt with it. Only NHA's private half can decrypt. Your system never holds a secret to do this, only the current certificate.

```mermaid
graph LR
  A["Aadhaar or mobile number<br/>inside your system"] -->|RSA with NHA's public key| B["Encrypted value"]
  B -->|sent as the field value| C["ABDM"]
  C -->|NHA's private key| D["Plain value, inside NHA"]
```

There is nothing ABDM specific in the mechanics. Your platform's standard RSA library does the work. The two things to confirm are which key you are using and which padding.

## Where to do it

**Encrypt inside your own system, against NHA's published public key.** This is the production path, and it is the only one that keeps the guarantee the encryption exists to provide.

NHA's collection also contains a hosted helper that encrypts a value for you, and two third party encryption websites. Those exist so someone can try a flow by hand. They are not a production path.

The reason is worth stating plainly. To use the helper you send the raw Aadhaar or mobile number to a remote endpoint. That hands the value to a party which has no reason to hold it, which is the thing the encryption exists to prevent. With the third party websites it is worse: a patient identifier leaves ABDM entirely.

The [encrypt value endpoint](/docs/hiecm/v3/api/m1) documents the helper for completeness. Do not build against it.

## What we have not confirmed

NHA's M1 document names a `public/certificate` API for fetching the public key, listed again under developer utilities. In the document as we received it, the cURL example and the response are screenshots that did not convert to text, so the full URL, the headers and the response shape are not recorded here. The Postman collection does not contain the call either.

So: the model above is confirmed, and the list of encrypted fields is confirmed. The exact call that fetches the certificate is not. Treat it as unconfirmed until you have called it, and tell us what you find.

## Where to go next

- [Gateway](/docs/hiecm/v3/concepts/gateway) for the session token every call needs, including the key and helper endpoints.
- [M1 user journeys](/docs/hiecm/v3/api/m1/user-journey), where the encrypted identifier appears in the search and login steps.
