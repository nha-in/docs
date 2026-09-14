---
id: nhcx.sandbox.support-contacts
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Where to get help with NHCX
summary: >-
  Which address to write to for each kind of question, what to put in the message,
  and what to do while you wait for an answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Guidelines for Participant Onboarding.
- url: https://hcxsbx.abdm.gov.in/images/2b7fde4358fd0a4b2086.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Code Snippets references for payload preparation.pdf
  hash: sha256:cea0cfbf5897e9642eaf9a515a941b0a1de39474ea39444c9e05abe21cd9ec73
  fetched: '2026-09-14'
  note: NHCX Code Snippets references for payload preparation, row 13 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q17 and Q19.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item 8.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error, resolution steps.
verified:
  status: unverified
related:
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.prerequisites
  - nhcx.sandbox.environments-and-base-urls
  fhir:
  - nhcx.fhir.validation
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.error-code-spaces
  glossary:
  - shared.glossary.nha
  - shared.glossary.nrces
  - shared.glossary.hfr
---

# Where to get help with NHCX

## In plain words

Different teams handle different parts of NHCX integration. Writing to the right one, with the ids needed to trace your request, gets you an answer faster.

## Before you start

- Check the error atom for your code first. Most error codes name their fix. See [error code spaces](../concepts/error-code-spaces.md).
- Collect your participant code, the environment, the use case, and the correlation id and API call id of the failing request.

## What happens

### Who to write to

| Topic | Address |
|---|---|
| FHIR bundle validation during sandbox exit, and requests for the internal and HTC demos | `hcx.integration@nha.gov.in` |
| How to build a FHIR bundle for a use case, and the [NRCeS](../../shared/glossary/nrces.md) specifications | `nrc-help@cdac.in` |
| ABDM Milestone 1 integration | `integration.support@nha.gov.in` |
| Facility registration in [HFR](../../shared/glossary/hfr.md) | `facility@nha.gov.in` |

### Documents

- Integration documents: https://hcxsbx.abdm.gov.in/#/documents
- PMJAY hospital system documents: https://hcxsbx.abdm.gov.in/#/hmisdocuments

### What to put in the message

- Your participant code and the environment, sandbox or production.
- The use case and the path you called.
- The `x-hcx-correlation_id`, `x-hcx-api_call_id` and `x-hcx-timestamp` of the request.
- The error code and message you received, exactly as returned.
- For a bundle question, the unencrypted bundle, with personal data replaced by test values.

## How you know it worked

You sent the question to the address for its topic, with the ids above, and the reply refers to your request by those ids.

## When it goes wrong

- **You are waiting on a reply.** Replies have no fixed turnaround time. Keep testing other use cases. Do not resend the failing request in a loop: after a failure the correlation id is inactive, so each retry needs a new one.
- **The reply asks for details you did not send.** Answer on the same thread with the ids and the exact error text.
- **An error's debugging steps end with "connect with NHCX support team".** Write to the address for the use case's topic, quoting the error code.
