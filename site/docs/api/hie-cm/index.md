---
title: Choose your role and module
sidebar_label: HIE-CM overview
sidebar_position: 0
description: Work out which HIE-CM role you play, then which modules that role has to build.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md
---

# Choose your role and module

[HIE-CM](/docs/overview/glossary#hie-cm) is the Health Information Exchange and Consent Manager. It is the gateway that carries patient identity and patient health records across [ABDM](/docs/overview/glossary#abdm). Two questions decide what you build: which role you play, and which modules that role needs.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published documents for the simplified M1, M2 and M3
flows. Nothing here has been run against the ABDM sandbox from this
repository, so treat request and response shapes as unconfirmed.
:::

## Question one: which role are you

**A [PHR](/docs/overview/glossary#phr) application.** Your user is the patient. You create or log in an [ABHA](/docs/overview/glossary#abha) identity, show the patient their linked records, and carry their consent decisions. You do not hold clinical records of your own.

**An information management system.** A hospital, lab or pharmacy system. It plays one or both of two roles:

- [HIP](/docs/overview/glossary#hip), a Health Information Provider. You generate health records and make them findable and shareable. NHA's M2 document states the prerequisite plainly: you need a valid Facility ID and registration in the HIP role before you can share records.
- [HIU](/docs/overview/glossary#hiu), a Health Information User. You request a patient's records from other facilities, and you can only fetch them against a consent the patient granted.

Most hospital systems end up as both. They write records for their own patients and read records written elsewhere.

## Question two: which module

| Module | What it does | Phase |
| --- | --- | --- |
| [M1](/docs/api/hie-cm/m1) | Identity. Create an ABHA, log a user in, read and manage the profile, hold the session token every other call needs. | Phase 1 |
| [M2](/docs/api/hie-cm/m2) | Linking and sharing. Group records into care contexts, link them to an ABHA address, answer discovery, package the data as [FHIR](/docs/overview/glossary#fhir) and send it encrypted. | Phase 1 |
| [M3](/docs/api/hie-cm/m3) | Consent and fetching. Raise a consent request, follow it to granted or denied, then fetch and decrypt the health information. | Phase 1 |
| [M4](/docs/api/hie-cm/m4) | Professional and facility registries: [HPR](/docs/overview/glossary#hpr) and [HFR](/docs/overview/glossary#hfr). | Phase 2 |

## Role to module

| Your role | M1 | M2 | M3 | M4 |
| --- | --- | --- | --- | --- |
| PHR application | Required. Identity is the whole product. | Patient side only. Your user starts discovery and links care contexts to their ABHA. | Required. Your user grants, denies and revokes consent, and reads the records that arrive. | Not needed. |
| HIP | Required. You need the session token and the patient's ABHA. | Required. This is the bulk of your build. | Partial. You receive a consent notification and serve the data request that follows. | Phase 2. Facility and professional registration. |
| HIU | Required. Same reason. | Not needed unless you also act as a HIP. | Required. This is the bulk of your build. | Phase 2. Facility and professional registration. |

Every role starts at M1. Nothing else works without a session token, and NHA marks the session and authentication APIs mandatory for both private and government integrators.

## Where to go next

- [M1: identity](/docs/api/hie-cm/m1). The most complete module in this release. Its API pages carry request URLs, headers and bodies, taken from NHA's Postman collection.
- [M2: linking and sharing](/docs/api/hie-cm/m2). Care contexts, discovery, FHIR packaging, encryption.
- [M3: consent and fetching](/docs/api/hie-cm/m3). The consent lifecycle and the data flow that follows a grant.
- [M4: registries](/docs/api/hie-cm/m4). Phase 2.

Expect less detail on M2 and M3 than on M1. NHA's M2 and M3 documents present most of their request and response tables as screenshots. Those pages give you the steps and the obligations, not the payload shapes.

The interactive OpenAPI references sit on their own routes: [M1](/reference/hiecm-m1), [M2](/reference/hiecm-m2), [M3](/reference/hiecm-m3), [M4](/reference/hiecm-m4) and the [gateway](/reference/hiecm-gateway).

If your product is not a records product, go back to [choose your gateway](/docs/api).
