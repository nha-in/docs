---
title: NHCX
sidebar_label: NHCX
description: What NHCX is, who is on it, and the index of NHA's own NHCX documents.
verification: unverified
source: NHCX__NHCX-Website_DocumentDetails.md
sidebar_position: 1
---

# NHCX

The Ayushman Bharat Digital Mission ([ABDM](/docs/nhcx/v1/getting-started/glossary#abdm)) is India's national
health data network, run by the National Health Authority ([NHA](/docs/nhcx/v1/getting-started/glossary#nha)).
It is three gateways, not one, and this section documents the third of them.

[NHCX](/docs/nhcx/v1/getting-started/glossary#nhcx) is the National Health Claims Exchange, the third [ABDM](/docs/nhcx/v1/getting-started/glossary#abdm) gateway, carrying insurance claims and their responses between providers and payers. After this page you will know who is on NHCX and which of [NHA](/docs/nhcx/v1/getting-started/glossary#nha)'s own documents to open next.

## What is not here

No endpoint on this gateway has been documented here yet. No endpoint reference, no sequence diagrams, no error tables, no test cases.

The [HIE-CM](/docs/nhcx/v1/getting-started/glossary#hie-cm) and [UHI](/docs/nhcx/v1/getting-started/glossary#uhi) gateways are documented at [milestones](/docs/hiecm/v3/milestones) and [UHI](/docs/uhi/v1). NHCX sits outside both, on its own sandbox, with its own onboarding, participant registry and document set.

NHCX does appear in the sandbox database. An NHCX application is recorded against your organisation, and the column list for it is the [`nhcx_exit` table](/docs/hiecm/v3/reference/data-dictionary#nhcx_exit).

## HIE-CM or NHCX

Claims are not health records. If your product shares or fetches a patient's clinical record, you are on HIE-CM. If it submits or adjudicates an insurance claim, you are on NHCX. A hospital system can end up on both. The two integrations share no API surface.

NHA's index shows the shape of a claim without describing it. A claim is a [FHIR](/docs/nhcx/v1/getting-started/glossary#fhir) bundle. It travels with a protected header that carries a workflow status code. A request cycle is closed by sending a protocol response back. Those are rows 11, 12 and 15 below.

## Who is on it

| Participant | What it does |
| --- | --- |
| Provider | A hospital or clinic. Row 9 below is NHA's list of the use cases a provider has to cover. The index does not name them. |
| Payer | An insurer, or a third party administrator acting for one. Row 10 below is the matching list for a payer. |
| NHCX | NHA's exchange in the middle. Routes between registered participants. |

Both providers and payers onboard as participants, in sandbox first and then in production. NHA's production onboarding document carries the role and registry enums and the validations applied to them.

## What NHA publishes

The only source for this page is NHA's index of its own NHCX documents. It has 32 numbered rows, each giving a purpose, a document name and a location. It is an index, not a specification. No row carries a request shape, a response shape or an endpoint. Two rows have no document name in the source, and one row is blank apart from its location. Those gaps are marked below.

NHA gives one location per group of documents, not a URL per file.

| Location | What is there |
| --- | --- |
| [hcxsbx.abdm.gov.in/#/documents](https://hcxsbx.abdm.gov.in/#/documents) | Onboarding, use cases, payload references, error handling, Postman collections and FAQs. Rows 1 to 22. |
| [hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications](https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications) | Swagger for the use case APIs and the participant service. Row 23. |
| [hcxsbx.abdm.gov.in/#/hmisdocuments](https://hcxsbx.abdm.gov.in/#/hmisdocuments) | The Supporting Documents section of that page holds the PMJAY and [HMIS](/docs/hiecm/v3/getting-started/glossary#hmis) material. Rows 24 to 32. |

## The document index

Row numbers are NHA's, so you can match a line here to a line in NHA's sheet.

### Onboarding, use cases and specifications

| # | Document | What it covers |
| --- | --- | --- |
| 1 | NHCX Usecases | High level introduction to the NHCX use cases. |
| 2 | Standards for NHCX | Standards followed in NHCX, and an introduction to FHIR. |
| 3 | Name not given in the source | How to generate a token using the ABDM API for the NHCX APIs. |
| 4 | Onboarding providers and payers in Sandbox | How to onboard participants in sandbox. |
| 5 | Onboarding providers and payers in Production | How to onboard participants in production. Includes the role and registry enums, and the validations imposed. |
| 6 | AWS(Sandbox)NHCX-OnBoarding APIs Postman Collection | Postman collection for participant onboarding in sandbox. A zip file. |
| 7 | AWS(PROD)_NHCX-OnBoarding APIs Postman Collection | Postman collection for participant onboarding in production. A zip file. |
| 8 | Policy Linking and De-Linking Process | Policy linking and de-linking validations, and API implementation detail, for payer and TPA. |
| 9 | NHCX Provider Side Use Cases, Sandbox Exit Process | Which use cases a provider must cover: which API, at whose end, which bundle, which status, and the callback logic. |
| 10 | NHCX Payer Side Use Cases, Sandbox Exit Process | The same list for a payer. |
| 11 | NHCX Requests and Responses for UseCases | Which value sets to use when building FHIR bundles, which bundle to use, and which values are mandatory. One tab per use case. A spreadsheet. |
| 12 | Workflow Status Sheets (with Codes) | The workflow codes to send in the protected header. A spreadsheet, updated when codes change. |
| 13 | NHCX Code Snippets references for payload preparation | Reference code snippets for preparing use case payloads. |
| 14 | Implementation Guide for Adoption of FHIR in ABDM and NHCX | The FHIR implementation guide for both. |
| 15 | API Response Handling to avoid Failures | How to handle error scenarios, and how to send the protocol response that closes the request cycle. |
| 16 | AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection | Postman collection for the participant service APIs in sandbox. A zip file. |
| 17 | AWS(Sandbox)-NHCX USECASE Postman Collection | Postman collection for the use case APIs in sandbox. A zip file. |
| 18 | Standard Error Codes | Every error code and scenario, by use case, for the bridge and for NHCX. A spreadsheet. |
| 19 | NHCX Dummy Payer Implementation | Implementation guide for the dummy payer. |
| 20 | Steps to generate encryption Certificate | How to generate the encryption certificate, a public and private key pair. |
| 21 | FAQs | Frequently asked questions. |
| 22 | Common Mistakes while implementing through NHCX | Mistakes NHA sees at the integrator end, and how they are resolved. |
| 23 | Technical Specification, API Specifications | Swagger for the use cases and for the participant service. The source adds a warning: for use case payloads, work from rows 11 and 13 rather than the swagger. The swagger is the relevant source for the participant service APIs. |

### PMJAY and HMIS supporting documents

PMJAY is the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana scheme. These rows sit under Supporting Documents on NHA's HMIS documents page.

| # | Document | What it covers |
| --- | --- | --- |
| 24 | NHCX PMJAY Integration Handbook | The integration handbook for an HMIS. |
| 25 | Insurance Plan IG | Implementation guide for the insurance plan bundle. |
| 26 | NHCX_APIs to be called based on scenario | A roadmap for an HMIS: which NHCX APIs to call in which scenario. |
| 27 | NHCX-PMJAY-HMIS Integration Overview | Overview of the integration. |
| 28 | NHCX-PMJAY-HMIS Integration Guide | The integration guide. |
| 29 | Name not given in the source | Sample FHIR. |
| 30 | Biometric Authentication APIs Postman Collection | Postman collection for the biometric authentication APIs. |
| 31 | NHCX-PMJAY-HMIS Test Cases | Test cases for the integration. |
| 32 | Row blank in the source | The source row carries a location and nothing else. |

## What is missing here

Everything past the index. We have the title and the purpose of each NHA document, not the endpoints, payloads, status codes or error codes inside them. No NHCX call has been run against a sandbox.

## Next

- New to NHCX? Start at row 4 above, NHA's sandbox onboarding document.
- [Choose your gateway](/docs/hiecm/v3)
- [HIE-CM](/docs/hiecm/v3/)
- [UHI services](/docs/uhi/v1)
- [Support](/docs/support), for anything about these pages rather than about NHCX itself
