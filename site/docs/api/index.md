---
title: Choose your gateway
sidebar_label: Choose your gateway
sidebar_position: 0
description: Pick the ABDM gateway your product talks to before you read any API page.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md, NHCX__NHCX-Website_DocumentDetails.md
---

# Choose your gateway

[ABDM](/docs/overview/glossary#abdm) is not one API. It is a set of gateways, and each one serves a different kind of product. There are three: [HIE-CM](/docs/overview/glossary#hie-cm), [UHI](/docs/overview/glossary#uhi) and [NHCX](/docs/overview/glossary#nhcx). Pick the gateway first. Everything after that follows from the choice.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published documents for the simplified milestone
flows, the UHI onboarding services and the NHCX document index. Nothing here
has been run against the ABDM sandbox from this repository, so treat request
and response shapes as unconfirmed.
:::

## The three gateways

| Gateway | Who it is for | Status |
| --- | --- | --- |
| [HIE-CM](/docs/api/hie-cm) | Anyone handling patient identity or patient health records: [PHR](/docs/overview/glossary#phr) apps, hospital systems, labs, pharmacies, insurers fetching records with consent. | Phase 1, documented here |
| [UHI](/docs/api/uhi) | Anyone offering or discovering a health service: consultations, ambulances, blood banks, pharmacies. | Phase 2 |
| [NHCX](/docs/api/nhcx) | Health claims exchange between payers and providers. | Out of scope for V1 |

## Start here

**[HIE-CM](/docs/api/hie-cm)** is the Health Information Exchange and Consent Manager. It covers creating an [ABHA](/docs/overview/glossary#abha) identity, linking records to a patient, and moving records between systems with the patient's consent. If your product touches a patient record, this is your gateway. It is the gateway this release documents in most depth.

**[UHI](/docs/api/uhi)** is the Unified Health Interface. It is a discovery and booking network, not a records network. Your product joins it as an end user application or as a provider application. UHI is Phase 2 for this portal. The pages carry the message shapes from NHA's onboarding documents, but they are orientation rather than a certified integration path.

**[NHCX](/docs/api/nhcx)** is the National Health Claims Exchange. It carries insurance claims between providers and payers. NHCX is out of scope for V1 of this portal, and our only source for it is NHA's index of its own NHCX documents.

## If you are not sure yet

Read [what you can do](/docs/overview/what-you-can-do). It maps common product types to a gateway and a role. If you have not signed up for the sandbox, start at [get started](/docs/overview/get-started).
