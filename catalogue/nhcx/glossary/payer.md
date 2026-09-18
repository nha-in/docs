---
id: nhcx.glossary.payer
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Payer
summary: >-
  The insurance company or scheme that pays for a patient's treatment.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 7, role codes.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Policy Linking Process.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 7.
related:
  concepts:
  - nhcx.concept.participant-roles
  glossary:
  - nhcx.glossary.provider
  - nhcx.glossary.tpa
  - nhcx.glossary.participant-code
---

# Payer

## In plain words

A payer is the insurance company or scheme that pays for a patient's treatment. On [NHCX](../../shared/glossary/nhcx.md) it registers with the role `PAYER` (`10002`) and holds its own participant code, whether or not a [TPA](../glossary/tpa.md) processes its claims. You meet payers as the recipients of eligibility checks, preauthorisations and claims, and as the senders of payment notices. See [participant roles](../concepts/participant-roles.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which participant code a payer's requests go to when a TPA processes them.

## When it goes wrong

Addressing requests to the insurer's code when a TPA processes its policies. Send them to the processing ID.
