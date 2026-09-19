---
id: nhcx.glossary.tms
type: glossary
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: TMS, Transaction Management System
summary: >-
  The government scheme system in which preauthorisations and claims are decided.
sources:
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 9 section 3; page 11 section 5 TMS for Providers.
- url: https://hcxsbx.abdm.gov.in/images/be2e25fede3bf711f783.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx
  hash: sha256:cf5c9bf1c402b214f65bbb7bd0822f3a76d8ccda9b69c7bf77ba131befef3bc6
  fetched: '2026-09-14'
  note: PMJAY Hospital Migration to HMIS via NHCX, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. sections 2.1, 3.5 and 3.6.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 2, Current Challenges.
related:
  flows:
  - nhcx.flow.pmjay-hospital-migration
  glossary:
  - nhcx.glossary.pmjay
  - shared.glossary.hmis
---

# TMS, Transaction Management System

## In plain words

TMS stands for Transaction Management System, the [PMJAY](../glossary/pmjay.md) system in which preauthorisations and claims are decided. Hospitals without an integrated [HMIS](../../shared/glossary/hmis.md) enter cases by hand in the TMS 2.0 Provider portal. After a hospital is mapped to its [NHCX](../../shared/glossary/nhcx.md) participant code, new cases go from its HMIS through NHCX. TMS keeps only the cases already open there.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what happens to cases opened in TMS before your hospital is mapped.

## When it goes wrong

Sending new cases through NHCX before the mapping is done. Until the mapping, the hospital works in TMS.
