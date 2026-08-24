---
title: Building blocks
sidebar_label: Building blocks
sidebar_position: 0
description: The gateways you call and the registries you write to, and which one your product needs.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md, NHCX__NHCX-Website_DocumentDetails.md, UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md
---

# Building blocks

[ABDM](/docs/overview/glossary#abdm) has two kinds of moving part. There are gateways, which are APIs you call to move data between systems: [HIE-CM](/docs/overview/glossary#hie-cm), [UHI](/docs/overview/glossary#uhi) and [NHCX](/docs/overview/glossary#nhcx). There are registries, which are national directories that hold identity: [ABHA](/docs/overview/glossary#abha) for patients, [HPR](/docs/overview/glossary#hpr) for professionals, [HFR](/docs/overview/glossary#hfr) for facilities. Your product will use one gateway and write to one or two registries. This page says which is which.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published documents for the milestone flows, the UHI
physical consultation service and the NHCX document index. Nothing here has
been run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## Gateways

A gateway routes calls between your system and someone else's. You never call the other party directly, with one exception noted on the [UHI](/docs/overview/building-blocks/uhi) page.

| Gateway | What moves through it | Status here |
| --- | --- | --- |
| [HIE-CM](/docs/overview/building-blocks/hie-cm) | Patient identity, care context links, consent, health records | Phase 1, documented |
| [UHI](/docs/overview/building-blocks/uhi) | Health service discovery and booking: consultations, ambulances, blood banks, pharmacies | Phase 2 |
| [NHCX](/docs/overview/building-blocks/nhcx) | Insurance claims between providers and payers | Out of scope for V1 |

HIE-CM is the Health Information Exchange and Consent Manager. It is the gateway most products need first. If your product creates, stores, shows or requests a patient's health record, you are on HIE-CM.

## Registries

A registry issues an identifier and holds the record behind it. You read from a registry to find something, and you write to it to enrol something new.

| Registry | What it identifies | Identifier | Written by |
| --- | --- | --- | --- |
| [ABHA](/docs/overview/building-blocks/registries#abha-patient-identity) | A patient | 14 digit ABHA number, plus an ABHA address | [M1](/docs/api/hie-cm/m1) |
| [HPR](/docs/overview/building-blocks/registries#hpr-healthcare-professionals) | A doctor, nurse, pharmacist or facility manager | HPR ID | [M4](/docs/api/hie-cm/m4) |
| [HFR](/docs/overview/building-blocks/registries#hfr-health-facilities) | A hospital, clinic, lab or pharmacy | Facility ID | [M4](/docs/api/hie-cm/m4) |

All three are covered on one page: [ABHA, HPR and HFR](/docs/overview/building-blocks/registries).

## How they fit together

A patient has an ABHA identity. A facility is listed in the HFR and gets a Facility ID. The facility connects its software to ABDM as a bridge, which is the registered link between your software and that Facility ID. Records created at the facility are grouped into care contexts and linked to the patient's ABHA address through HIE-CM. The patient sees them in a [PHR](/docs/overview/glossary#phr) app. Another system can then ask for those records, and the patient decides whether to allow it.

The doctor's HPR ID sits alongside this. It identifies the professional inside a record and authorises facility registration.

## Where to go next

- Building for patients: [PHR applications](/docs/overview/roles/phr)
- Building for a hospital, lab or pharmacy: [Hospital, lab and pharmacy systems](/docs/overview/roles/his)
- Ready to call something: [Choose your gateway](/docs/api)
- Unfamiliar term: [Glossary](/docs/overview/glossary)
