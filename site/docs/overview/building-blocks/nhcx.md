---
title: NHCX
sidebar_label: NHCX
sidebar_position: 5
description: The claims exchange gateway, why it is out of scope for V1, and where NHA's own documents for it live.
verification: unverified
source: NHCX__NHCX-Website_DocumentDetails.md
---

# NHCX

[NHCX](/docs/overview/glossary#nhcx) is the National Health Claims Exchange. It is the third [ABDM](/docs/overview/glossary#abdm) gateway, and it carries insurance claims between providers and payers. It is a different network with its own onboarding, its own sandbox and its own document set.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published document index for NHCX. Nothing here has
been run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

:::note[Out of scope for V1]
This portal does not document NHCX in V1. This page exists so you know where
NHCX sits and where NHA's own material for it is. It is not an integration
guide, and it is not a substitute for one.
:::

## Where it sits

Claims are not health records, and NHCX is not [HIE-CM](/docs/overview/glossary#hie-cm). If your product shares or fetches a patient's clinical record, you are on HIE-CM. If your product submits or adjudicates an insurance claim, you are on NHCX. A hospital system can end up on both, for different reasons, and the two integrations do not share an API surface.

The parties on NHCX are providers, which are hospitals and clinics submitting claims, and payers, which are insurers and third party administrators.

## What NHA publishes

Our only source for this page is NHA's index of its own NHCX documents. It is a list of what exists and where, not the content itself. Everything below is that list, grouped so you can see the shape of the integration. All of it lives on NHA's NHCX sandbox site at [hcxsbx.abdm.gov.in](https://hcxsbx.abdm.gov.in/#/documents).

| Area | What NHA lists |
| --- | --- |
| Introduction | NHCX use cases. Standards for NHCX, including an introduction to [FHIR](/docs/overview/glossary#fhir). |
| Authentication | How to generate a token using the ABDM API for NHCX APIs. |
| Onboarding | Separate guides for onboarding providers and payers in sandbox and in production. The production guide carries the role and registry enums and the validations applied. Postman collections for both. |
| Policy | Policy linking and de-linking validations and API details, for payers and third party administrators. |
| Use cases | Two sandbox exit documents, one for the provider side and one for the payer side. Each names the API to implement, which side implements it, the bundle to use, the status to use and the callback logic expected. |
| Payload building | A workbook of value sets and mandatory fields per bundle and per use case. Reference code snippets for payload preparation. An implementation guide for adopting FHIR in ABDM and NHCX. |
| Status and errors | The workflow status codes carried in the protected header, which NHA updates continuously. A standard error code list covering each use case, the bridge and NHCX itself. A guide on response handling to avoid failures. |
| Encryption | Steps to generate the encryption certificate, the public and private key pair. |
| Tooling | Postman collections for the participant service APIs and for the use case APIs. A dummy payer implementation guide. |
| Support | FAQs. A list of common mistakes seen at integrator level, with resolutions. |
| PMJAY and [HMIS](/docs/overview/glossary#hmis) | An integration handbook, overview and guide for hospital management systems. An insurance plan bundle implementation guide. A roadmap of which NHCX APIs to call in which scenario. Sample FHIR. Test cases. A Postman collection for biometric authentication APIs. |

NHA notes two things in that index worth repeating. For the use case APIs, the payload building material matters more than the Swagger specification, while for the participant service APIs the Swagger is the relevant reference. The PMJAY and HMIS material sits under a separate supporting documents section of the same site, not with the main document list.

## What is missing here

Everything past the index. We have the titles and the purpose of each NHA document, not the endpoints, payloads, status codes or error codes inside them. No NHCX call has been run against a sandbox from this repository. When NHCX comes into scope, this page will be replaced by pages written from the documents themselves.

## Next

- [Choose your gateway](/docs/api)
- [HIE-CM gateway](/docs/overview/building-blocks/hie-cm)
- [NHCX in API references](/docs/api/nhcx)
