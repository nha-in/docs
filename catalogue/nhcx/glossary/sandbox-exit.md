---
id: nhcx.glossary.sandbox-exit
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Sandbox exit
summary: >-
  The set of checks that moves you from the sandbox towards production access.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 1 to 13.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 1 to 15.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. Functional Testing, steps 2 and 3.
related:
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.provider-uc-01
  - nhcx.test.payer-uc-01
---

# Sandbox exit

## In plain words

Sandbox exit is the set of checks that moves you from the [NHCX](../../shared/glossary/nhcx.md) sandbox towards production access. Providers demonstrate 13 use cases and payers 15, from fetching the participant list to checking status, each with its own pass condition. After [FHIR](../../shared/glossary/fhir.md) bundle validation and two demos, you receive confirmation of successful sandbox integration, and production access follows. See [sandbox exit](../sandbox/sandbox-exit.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what must be done before production access is granted.

## When it goes wrong

Treating one working sandbox call as sandbox exit. Exit needs every use case demonstrated and the bundles validated.
