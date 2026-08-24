---
title: M2 linking and sharing
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 2 gives you, what you need before your first call, and the order to read the M2 pages.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 linking and sharing

Milestone 2 (M2) is the records milestone of [ABDM](/docs/overview/glossary#abdm). [M1](/docs/api/hie-cm/m1) gives a person an identity. M2 attaches their health records to it. You group the records your facility creates into [care contexts](/docs/overview/glossary#care-context), link those care contexts to the person's [ABHA address](/docs/overview/glossary#abha-address), answer discovery requests from [PHR](/docs/overview/glossary#phr) apps, and send the records out encrypted when a consented request arrives. This page says what you need before you start and the order to read the rest.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 2. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What M2 gives you

| Capability | What your system can do |
|---|---|
| Care contexts | Group each visit or admission into a named unit that can be linked to an ABHA address |
| [HIP](/docs/overview/glossary#hip) initiated linking | Link a care context yourself, when the patient gave you their ABHA address at registration |
| Notification to mobile | Make a record findable when you only hold a mobile number, a name, an age and a gender |
| [Discovery](/docs/overview/glossary#discovery) | Answer a patient's search for their records at your facility, and let them link what you return |
| Data request and transfer | Receive a consented request for health information, package it, encrypt it, and push it to the requester |

M2 is the provider side of record exchange. Requesting records from other facilities under a consent you raised is [M3](/docs/api/hie-cm/m3).

## Prerequisites

[NHA](/docs/overview/glossary#nha)'s M2 document states one prerequisite directly. Your entity needs a valid Facility ID and registration in the HIP role, which is what authorises you to create health records and share them with PHR and [HIU](/docs/overview/glossary#hiu) systems.

Three more follow from the flows M2 covers.

1. **A working M1 integration.** Linking is keyed to an ABHA address. See [M1](/docs/api/hie-cm/m1).
2. **A [link token](/docs/overview/glossary#link-token) per patient.** You generate and store it at the time the patient registers with you. NHA's document gives its current validity as six months, and says to validate the token before use. If you do not hold a valid one, regenerate it using demographic authentication.
3. **[FHIR](/docs/overview/glossary#fhir) R4 output.** Every health record you share is a FHIR bundle that conforms to the ABDM profiles published by the National Resource Centre for EHR Standards at [nrces.in](https://nrces.in/ndhm/fhir/r4/index.html).

## Base URLs

| Environment | Base URL |
|---|---|
| Sandbox | `https://dev.abdm.gov.in` |
| Production | `https://apis.abdm.gov.in` |

## Record types you can link

NHA's document lists eight health record types, all of them FHIR shaped. Each one can be a simple bundle wrapping a PDF or image attachment, or a structured bundle with coded clinical data.

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

NHA's document adds one line about scope: implementing all [HI types](/docs/overview/glossary#hi-type) is mandatory for an [HMIS](/docs/overview/glossary#hmis).

## Read M2 in this order

1. [User journey](/docs/api/hie-cm/m2/user-journey). The four flows as diagrams, so you can see the round trips before the detail.
2. [Use cases](/docs/api/hie-cm/m2/use-cases). Care contexts, each linking route, packaging, validation and encryption.
3. [API sequence](/docs/api/hie-cm/m2/api-sequence). Which calls you make, which callbacks you must be able to receive, and what your endpoint returns.
4. [Errors](/docs/api/hie-cm/m2/errors). NHA's custom error codes, and what the list does and does not tell you.
5. [Test cases](/docs/api/hie-cm/m2/test-cases). What to run before you claim M2 is done.

The machine readable shapes we hold are in the [M2 API reference](/reference/hiecm-m2) and the [gateway reference](/reference/hiecm-gateway). Sandbox test data is in the [data dictionary](/docs/api/data-dictionary). If you get stuck, [support](/docs/support) lists the channels.
