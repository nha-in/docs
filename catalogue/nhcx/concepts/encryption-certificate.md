---
id: nhcx.concept.encryption-certificate
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Your encryption certificate and the recipient's
summary: >-
  Each participant publishes a public certificate so others can seal messages for
  it, and keeps the matching private key to open what it receives.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Steps 1-3.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 2.4 and 3.3 Certificate Fetch.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Encryption steps and key rotation note.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Step 3 and Participant Certificate Updation, page 4.
related:
  flows:
  - nhcx.flow.generate-and-register-certificate
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.v2-participant-update
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1002
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  glossary:
  - nhcx.glossary.x509-certificate
  - nhcx.glossary.jwe
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  tests:
  - nhcx.test.provider-uc-03
  - nhcx.test.payer-uc-05
---

# Your encryption certificate and the recipient's

## In plain words

Every message on NHCX is sealed for one recipient. To seal it, the sender needs the recipient's public key. To open it, the recipient needs its own private key.

So every participant does two things. It publishes a public [X.509 certificate](../glossary/x509-certificate.md) in the participant registry. It keeps the matching private key secret on its own servers.

## Before you start

You need a participant record you can update. See [the participant registry](./participant-registry.md).

## What happens

### Two keys in every exchange

```mermaid
graph LR
  S["Sender"] -->|fetch recipient's certificate| RG[("Participant registry")]
  S -->|seal with recipient's public key| M["Sealed message"]
  M -->|via NHCX| R["Recipient"]
  R -->|open with its own private key| B["FHIR bundle"]
  R -->|seal response with the sender's public key| M2["Sealed response"]
```

Your certificate is how others reach you. The recipient's certificate is how you reach them. A response travels the same way in reverse: the payer seals it with your public key.

### Your certificate

- An RSA key pair of 2048 bits.
- A self-signed X.509 certificate made from it, valid for 365 days.
- The PEM certificate, Base64 encoded, sent as the encryption certificate when you update your participant record.

The steps are in [generate and register a certificate](../flows/generate-and-register-certificate.md). The private key never leaves your system.

### The recipient's certificate

You fetch it with `/fetch/certs`, passing the recipient's participant code as `participantid`. The response carries the certificate in `encryption_cert`. The value is either a PEM X.509 certificate or a bare public key, so try X.509 first and fall back to the public key form.

Cache each fetched certificate for 24 hours. Do not call `/fetch/certs` before every message.

### Rotation

Rotate your key pair once a year, and at once if the private key may be compromised. Upload the new certificate to your record. In production the certificate update needs no passcode. Senders that cached your old certificate keep using it until their cache expires, so keep the old private key able to open messages for a day after rotating.

## How you know it worked

You have understood this when you can answer both of these.

1. You are about to send a claim to a payer. Whose certificate seals it, and where does your system get that certificate?
2. You rotated your key pair this morning and a payer's response fails to open. What is the likely cause, and how do you avoid it next time?

## When it goes wrong

**The recipient cannot open your message.** It reports [PAYR-1001](../errors/payr-1001.md). Fetch the recipient's certificate again from `/fetch/certs` and seal with that. See [the recipient cannot decrypt](../troubleshooting/recipient-cannot-decrypt.md).

**The payer cannot seal its response to you.** It reports [PAYR-1002](../errors/payr-1002.md). Your certificate in the registry is missing, invalid or out of date. Update it.

**Certificate not Base64 encoded.** The update is refused. Encode the whole PEM file, header and footer lines included.

**Expired certificate.** A self-signed certificate made with `-days 365` expires after a year. Rotate before it does.
