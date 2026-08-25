---
title: M2 linking and sharing
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 2 gives you, what you need before your first call, and the order to read the M2 pages.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 linking and sharing

Milestone 2 (M2) attaches health records to a person's [ABHA address](/docs/abdm/v3/glossary#abha-address). After it you can group records into [care contexts](/docs/abdm/v3/glossary#care-context), link them, answer [discovery](/docs/abdm/v3/glossary#discovery) requests from [PHR](/docs/abdm/v3/glossary#phr) apps, and push encrypted records when a consented request arrives.

## What M2 gives you

| Capability | What your system can do |
|---|---|
| Care contexts | Group each visit or admission into a named unit that can be linked to an ABHA address |
| [HIP](/docs/abdm/v3/glossary#hip) initiated linking | Link a care context yourself, when the patient gave you their ABHA address at registration |
| Notification to mobile | Make a record findable when you only hold a mobile number, a name, an age and a gender |
| Discovery | Answer a patient's search for their records at your facility, and let them link what you return |
| Data request and transfer | Receive a consented request for health information, package it, encrypt it, and push it to the requester |

Requesting records from other facilities is [M3](/docs/abdm/v3/api/m3).

## Prerequisites

[NHA](/docs/abdm/v3/glossary#nha) states the first. The rest follow from the flows.

1. A valid Facility ID and registration in the HIP role. That authorises you to create health records and share them with PHR and [HIU](/docs/abdm/v3/glossary#hiu) systems.
2. A working [M1](/docs/abdm/v3/api/m1) integration. Linking is keyed to an ABHA address.
3. A [link token](/docs/abdm/v3/glossary#link-token) per patient, stored when the patient registers. NHA gives its validity as six months and says to validate it before use. If you hold no valid one, regenerate it using demographic authentication.
4. [FHIR](/docs/abdm/v3/glossary#fhir) R4 output conforming to the [ABDM](/docs/abdm/v3/glossary#abdm) profiles at [nrces.in](https://nrces.in/ndhm/fhir/r4/index.html).

## Base URLs

| Environment | Base URL |
|---|---|
| Sandbox | `https://dev.abdm.gov.in` |
| Production | `https://apis.abdm.gov.in` |

## Record types you can link

Each type can be a simple bundle wrapping a PDF or image attachment, or a structured bundle with coded clinical data.

| Record type | What it holds |
|---|---|
| Diagnostic Report Record | Radiology and laboratory reports |
| Discharge Summary Record | The discharge summary for the ABDM health data set |
| Health Document Record | Unstructured historical records, usually uploaded by patients through a health locker |
| Immunization Record | Immunisations, vaccine certificates and next dose recommendations |
| OP Consult Record | Outpatient notes: examinations, procedures, medications and advice |
| Prescription Record | Medication advice, following Pharmacy Council of India guidelines |
| Wellness Record | Vitals, physical examination and general health data captured in PHR apps |
| Invoice Record | Pharmacy invoices, consultation invoices and other billing records |

NHA marks implementing all [HI types](/docs/abdm/v3/glossary#hi-type) as mandatory for an [HMIS](/docs/abdm/v3/glossary#hmis).

## Read M2 in this order

1. [User journey](/docs/abdm/v3/api/m2/user-journey). The four flows as diagrams.
2. [Use cases](/docs/abdm/v3/api/m2/sequence). Care contexts, linking, packaging, validation, encryption.
3. [API sequence](/docs/abdm/v3/api/m2/sequence). Calls and callbacks in order.
4. [Errors](/docs/abdm/v3/api/m2/errors). NHA's custom error codes.
5. [Steps and calls](/docs/abdm/v3/api/m2/sequence). Every step of every use case, with the call it makes and what to see when it works.

Shapes: [M2 API reference](/reference/hiecm-m2), [gateway reference](/reference/hiecm-gateway). Test data: [data dictionary](/docs/abdm/v3/reference/data-dictionary). Channels: [support](/docs/support).
