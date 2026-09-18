---
id: nhcx.glossary.tpa
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: TPA, third party administrator
summary: >-
  A company that processes and decides claims on behalf of an insurer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. FAQ 7, role codes.
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, registration validation.
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
  - nhcx.concept.policy-linking
  - nhcx.concept.participant-roles
  endpoints:
  - nhcx.endpoint.participant-get-policies
  glossary:
  - nhcx.glossary.payer
---

# TPA, third party administrator

## In plain words

A third party administrator processes and adjudicates claims on behalf of an insurance company. On [NHCX](../../shared/glossary/nhcx.md) it registers with the role `AGENCY_TPA` (`10003`) and is validated against a trusted TPA registry. When an insurer works through a TPA, a policy names the insurer's code as `payerid` and the TPA's code as `processingid`. You meet it in the `processingid` returned by `/participant/get/policies`, which is where your requests go.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say whose participant code goes in `x-hcx-recipient_code` for a policy under a TPA.

## When it goes wrong

Using the payer ID from `/participant/get/policies` as the receiver code. Use the processing ID.
