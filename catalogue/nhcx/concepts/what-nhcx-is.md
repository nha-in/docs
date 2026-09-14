---
id: nhcx.concept.what-nhcx-is
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: What the National Health Claims Exchange is and what it does not do
summary: >-
  The claims exchange is a switch that carries sealed claim messages between hospitals
  and insurers; it routes and checks envelopes but never reads or decides a claim.
sources:
- url: https://hcxsbx.abdm.gov.in/#/introduction-NHCX
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/introduction-NHCX.md
  hash: sha256:39f92cfaa00639c278575132b12064ff6bfd557f16f324f13d8c2ccccf6153bb
  fetched: '2026-09-14'
  note: Site page /introduction-NHCX, text as shown on the site. Introduction to NHCX.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. NHCX Protocols and Message Flow.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message Security and Integrity.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/audit-and-reporting
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__audit-and-reporting.md
  hash: sha256:3805b33513ec0863294014053849d921b6fc4093d1cd0356a5e10b9eb54ef6c6
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/audit-and-reporting, text as shown on the site. Audit and Reporting.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q12.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.2, page 18.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. ABDM sandbox onboarding section.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.four-message-legs
  - nhcx.concept.claim-cycle
  - nhcx.concept.jwe-envelope
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.audit-and-non-repudiation
  glossary:
  - shared.glossary.nhcx
  - shared.glossary.abdm
  - shared.glossary.fhir
  - shared.glossary.uhi
  - shared.glossary.hie-cm
  - shared.glossary.hmis
  - nhcx.glossary.payer
  - nhcx.glossary.provider
  - nhcx.glossary.tpa
  - nhcx.glossary.adjudication
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  errors:
  - nhcx.error.nhcx-1002
  - nhcx.error.nhcx-1003
---

# What the National Health Claims Exchange is and what it does not do

## In plain words

The [National Health Claims Exchange (NHCX)](../../shared/glossary/nhcx.md) is the claims switch of [ABDM](../../shared/glossary/abdm.md). A hospital sends a claim message to NHCX. NHCX routes it to the insurer or [third party administrator](../glossary/tpa.md) that must answer, and carries the answer back.

It works like an email exchange. NHCX reads the address on the envelope and delivers the message. It cannot read the letter inside, because the sender seals it for the recipient.

NHCX is one of three ABDM gateways. The other two are the [Unified Health Interface](../../shared/glossary/uhi.md) and the [Health Information Exchange and Consent Manager](../../shared/glossary/hie-cm.md).

## Before you start

Nothing. Read this first. Then read [participant roles](./participant-roles.md) and [the four message legs](./four-message-legs.md).

## What happens

Every exchange has the same shape. A sender builds a [FHIR](../../shared/glossary/fhir.md) bundle, seals it for the recipient, and posts it to NHCX. NHCX checks the envelope and forwards the sealed message.

```mermaid
graph LR
  H["Provider system<br/>(hospital HMIS)"] -->|sealed request| X["NHCX"]
  X -->|same sealed request| P["Payer or TPA system"]
  P -->|sealed response| X
  X -->|same sealed response| H
  X -.->|looks up sender, recipient, endpoint| R[("Participant registry")]
```

### What NHCX does

- Checks that the sender and the recipient are registered and allowed to exchange.
- Validates the protocol headers on the envelope.
- Accepts the call, then forwards the message to the recipient's registered endpoint.
- Retries delivery when the recipient does not acknowledge.
- Records each call it receives, using only the unencrypted envelope details.

### What NHCX does not do

| NHCX does not | Because | Who does it instead |
|---|---|---|
| Read the claim | The payload is sealed with the recipient's public key | The recipient, with its private key |
| Decide a claim | The gateway never returns an adjudication on your call | The payer, in a later callback |
| Authenticate the patient | Biometric authentication is a separate API, used for PMJAY | Your system, before preauthorisation |
| Create an ABHA | ABHA creation is ABDM Milestone 1 work | Your system, through the ABDM APIs |
| Hold your private key | You generate your own key pair | You |

### The use cases it carries

Coverage eligibility, insurance plan, preauthorisation, predetermination, claim, communication requests, payment notices, reprocess and cancel tasks, status checks and claim search. [The claim cycle](./claim-cycle.md) shows how they fit together.

## How you know it worked

You have understood this when you can answer both of these.

1. Your system submits a preauthorisation and receives HTTP 202 from NHCX. Has the payer approved anything yet? Where will the decision arrive?
2. Someone proposes that NHCX log the decrypted claim to help debugging. Why is that impossible, and where can the claim be read?

## When it goes wrong

**Treating the 202 as the answer.** The 202 means NHCX accepted the envelope. The payer's decision arrives later on your callback endpoint. See [the 202 acknowledgement](./synchronous-acknowledgement.md).

**Sending before you are registered.** NHCX refuses a sender it does not know with [NHCX-1002](../errors/nhcx-1002.md), and an unknown recipient with [NHCX-1003](../errors/nhcx-1003.md).

**Expecting NHCX to fix the payload.** NHCX cannot see the payload, so it cannot correct a bad bundle. The payer reports bundle problems back to you. See [error code spaces](./error-code-spaces.md).
