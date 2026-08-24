---
title: NHCX
sidebar_label: NHCX
sidebar_position: 0
description: Why the claims exchange is out of scope for this release, and where NHA's own NHCX material lives.
verification: unverified
source: NHCX__NHCX-Website_DocumentDetails.md
---

# NHCX

[NHCX](/docs/overview/glossary#nhcx) is the National Health Claims Exchange. It
carries insurance claims and their responses between providers and payers. This
portal does not document the NHCX APIs in V1. This page tells you what is out of
scope, and lists the material NHA publishes so you know where to go instead.

:::note[Documented, not verified]
This page follows NHA's published document for the NHCX document index. Nothing
here has been run against the ABDM sandbox from this repository, so treat
request and response shapes as unconfirmed.
:::

## Out of scope for V1

This portal has no NHCX endpoint reference, no NHCX sequence diagrams, no NHCX
error tables and no NHCX test cases. There is no plan to add them in V1.

[ABDM](/docs/overview/glossary#abdm) V1 here covers
[HIE-CM](/docs/overview/glossary#hie-cm) milestones M1 to M3 as Phase 1. M4 and
[UHI](/docs/overview/glossary#uhi) are Phase 2. Those two gateways are
documented at [HIE-CM](/docs/api/hie-cm) and [UHI](/docs/api/uhi). NHCX sits
outside both. It runs on its own sandbox, with its own onboarding, its own
participant registry and its own document set.

If your product needs claims, work from NHA's own NHCX material. The index below
is NHA's list of what that material is. For the concept and where NHCX fits
against the other gateways, read
[NHCX as a building block](/docs/overview/building-blocks/nhcx) and
[choose your gateway](/docs/api).

## What the source is

The source is one sheet from NHA's sandbox document pack. It has 32 numbered
rows. Each row gives a purpose, a document name and a location on NHA's NHCX
sandbox site.

It is an index, not a specification. No row carries a request shape, a response
shape or an endpoint. Two rows have no document name in the source, and one row
is blank apart from its location. Those gaps are marked below.

## Where the documents live

NHA gives one location per group of documents, not a URL per file. The row
numbers below are NHA's own, and the index in the next section uses them.

| Location | What is there |
| --- | --- |
| [hcxsbx.abdm.gov.in/#/documents](https://hcxsbx.abdm.gov.in/#/documents) | Onboarding, use cases, payload references, error handling, Postman collections and FAQs. Rows 1 to 22. |
| [hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications](https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications) | Swagger for the use case APIs and the participant service. Row 23. |
| [hcxsbx.abdm.gov.in/#/hmisdocuments](https://hcxsbx.abdm.gov.in/#/hmisdocuments) | The Supporting Documents section of that page holds the PMJAY and [HMIS](/docs/overview/glossary#hmis) material. Rows 24 to 32. |

## The document index

Row numbers are NHA's, so you can match a line here to a line in NHA's sheet.

### Onboarding, use cases and specifications

| # | Document | What it covers |
| --- | --- | --- |
| 1 | NHCX Usecases | High level introduction to the NHCX use cases. |
| 2 | Standards for NHCX | Standards followed in NHCX, and an introduction to [FHIR](/docs/overview/glossary#fhir). |
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

PMJAY is the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana scheme. These rows
sit under Supporting Documents on NHA's HMIS documents page.

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

## Where NHCX shows up in this portal

Three places.

[NHCX as a building block](/docs/overview/building-blocks/nhcx) explains the
concept and where it sits against the other gateways.

[Choose your gateway](/docs/api) names NHCX as one of the three ABDM gateways,
so that a reader deciding between them sees it.

The sandbox portal records an NHCX application against your organisation. The
column list for it is on the
[data dictionary](/docs/api/data-dictionary#nhcx_exit) page, as the
`nhcx_exit` table.

## If you get stuck

Start at row 4 of the index above if you are new to NHCX. It is NHA's sandbox
onboarding document.

For anything about this portal rather than about NHCX itself, see
[support](/docs/support).
