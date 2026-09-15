---
id: nhcx.concept.audit-and-non-repudiation
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Audit logging and non-repudiation
summary: >-
  The exchange logs the readable envelope of every call and never the sealed claim,
  while the sealing itself proves a message was not altered, and each participant
  keeps its own records of what it sent and received.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/audit-and-reporting
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__audit-and-reporting.md
  hash: sha256:3805b33513ec0863294014053849d921b6fc4093d1cd0356a5e10b9eb54ef6c6
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/audit-and-reporting, text as shown on the site. Audit and Reporting.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/guidelines-event-audits
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__guidelines-event-audits.md
  hash: sha256:2ad75de1a412e4f39b1a922a0d90fa8f7c76770ea55a42cb4b308d3ba534a9c7
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/guidelines-event-audits, text as shown on the site. Guidelines for Event Audits.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Encryption and Decryption steps.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/healthclaims-exchange-protocol
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__healthclaims-exchange-protocol.md
  hash: sha256:ff4b3aa02f2aa61e2b29e50699fe16bee82c3684908bc2be0815c07b97a83371
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/healthclaims-exchange-protocol, text as shown on the site. Message Structure, Signatures.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section on Payment Notice, UTR note.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Page 16, Insurance Plan technical guidelines.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 26 Cyclic Procedure, Q10.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.access-control
  - nhcx.concept.beneficiary-consent
  - nhcx.concept.what-nhcx-is
  - nhcx.concept.insurance-plan
  - nhcx.concept.protocol-headers
  glossary:
  - nhcx.glossary.protected-header
  - nhcx.glossary.jwe
---

# Audit logging and non-repudiation

## In plain words

Claims involve money and health data, so every party must be able to show later what happened. NHCX keeps a record of every call it receives. It records only what it can read: the envelope, never the sealed claim.

The sealing does the rest. A message cannot be changed without breaking it, so a received message is provably the one that was sent.

## Before you start

Read [the JWE envelope](./jwe-envelope.md).

## What happens

### What NHCX records

For every call it receives, NHCX logs:

- the protocol and domain headers,
- the signature and encryption algorithm details,
- the sender and the recipient,
- the result of signature verification.

It cannot log the payload, because it cannot open it.

Each NHCX instance publishes the audit reports it offers for payers, providers, beneficiaries, regulators and observers. It publishes an archival policy for how long logs are kept, and it can limit how much each log holds. Participants can query the audit records about their own transactions through an API. Method and path for that API are not yet published.

### Why a message cannot be denied

```mermaid
graph LR
  H["Protected header"] --> AE["AES-GCM<br/>authenticated encryption"]
  P["FHIR bundle"] --> AE
  AE --> TAG["Authentication tag"]
  TAG -->|any change breaks it| R["Recipient rejects"]
```

The authentication tag covers the protected header and the payload together. A changed header or payload fails the tag, and the recipient must reject it. So NHCX adds no separate signature to a message.

### The event audit rules

Every event in a claim, such as a claim created, forwarded, queried, authorised or paid, is to be logged and signed by the systems involved. Logs are append only and never edited. They are kept for the period the law sets, and the audit trail is open to the beneficiary it concerns.

### What your system should keep

| Record | Why |
|---|---|
| Every envelope you sent and received, with its identifiers and your 202 | To prove delivery and answer a dispute |
| The insurance plan version each preauthorisation and claim used | A rate dispute turns on it |
| The UTR from each payment notice | Reconciliation and payment disputes |
| Biometric capture times for each cycle of a cyclic treatment | The payer checks them against the claim |

## How you know it worked

You have understood this when you can answer both of these.

1. A regulator asks NHCX for the diagnosis on a disputed claim. What can NHCX's audit log show, and who holds the diagnosis?
2. A payer says your preauthorisation arrived with a different amount. How does the envelope itself settle whether it was changed on the way?

## When it goes wrong

**Logs that can be edited.** Audit logs must be append only. A log you can rewrite proves nothing.

**No record of the plan version.** Without it, a claim priced from an older tariff cannot be defended.

**Discarded payment references.** Keep the UTR from every payment notice. It is the only link to the bank transfer.

**Relying on NHCX to hold the payload.** NHCX never sees it. Keep your own copies of what you sent and received.
