---
title: HIE-CM gateway
sidebar_label: HIE-CM gateway
sidebar_position: 2
description: The gateway for patient identity, record linking and consent, and what its four modules do.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# HIE-CM gateway

[HIE-CM](/docs/overview/glossary#hie-cm) is the Health Information Exchange and Consent Manager. It is the part of [ABDM](/docs/overview/glossary#abdm) that gives a patient an identity, keeps track of which systems hold their records, and asks them before any record moves. Your integration with HIE-CM is split into four modules, M1 to M4. Which ones you build depends on what your product does.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published documents for the simplified milestone
flows, M1 to M4. Nothing here has been run against the ABDM sandbox from this
repository, so treat request and response shapes as unconfirmed.
:::

## The one thing HIE-CM does not do

HIE-CM is data blind. It never holds a patient's health record. It holds identifiers, metadata about where records live, and consent artefacts. The record itself goes straight from the system that holds it to the system that asked for it, encrypted, once consent exists.

That single fact explains most of the API design. Your system keeps the data. HIE-CM keeps the permission.

## The four modules

| Module | What it covers | Phase |
| --- | --- | --- |
| [M1](/docs/api/hie-cm/m1) | [ABHA](/docs/overview/glossary#abha) creation, ABHA login, profile management, sessions | Phase 1 |
| [M2](/docs/api/hie-cm/m2) | Care contexts, linking records to a patient, sending records when asked | Phase 1 |
| [M3](/docs/api/hie-cm/m3) | Requesting consent, fetching records from other systems | Phase 1 |
| [M4](/docs/api/hie-cm/m4) | Registering professionals and facilities in [HPR](/docs/overview/glossary#hpr) and [HFR](/docs/overview/glossary#hfr) | Phase 2 |

### M1, patient identity

M1 creates and authenticates the patient's ABHA identity. NHA's document groups it into ABHA creation, ABHA login, profile management, benefit programme APIs and session APIs.

ABHA creation is Aadhaar based. Aadhaar OTP creation is mandatory for both private and government integrators. Face authentication and biometric creation, by fingerprint or iris, are optional for both. Demographic authentication is mandatory for government integrators and not required for private ones. Child ABHA creation is restricted to specific government integrators with NHA leadership approval.

ABHA login is supported by mobile number, by ABHA number, by ABHA address and by Aadhaar number, with OTP, biometric or face authentication behind each. All four login routes are mandatory for both private and government integrators.

Base URLs from NHA's document:

```text
Sandbox     https://abhasbx.abdm.gov.in/abha/api/v3/
Production  https://abha.abdm.gov.in/api/abha/v3/
```

Every call needs an access token from the gateway session API. That is the first request you will make against ABDM. See [M1](/docs/api/hie-cm/m1) and the [M1 API reference](/reference/hiecm-m1).

### M2, sharing records you hold

M2 is the provider side. You build it when your system creates health records: a hospital system, a lab system, a pharmacy system.

NHA's document sets a prerequisite. You need a valid Facility ID, and you must be registered in the [HIP](/docs/overview/glossary#hip) role. HIP means Health Information Provider, the party that holds the record. The Facility ID comes from the HFR, which is M4 below.

M2 covers four things:

1. Formatting records as [FHIR](/docs/overview/glossary#fhir) R4 bundles, using the ABDM profiles published by NRCES at [nrces.in](https://nrces.in/ndhm/fhir/r4/index.html). NHA's document lists eight record types: diagnostic report, discharge summary, health document, immunization, OP consult, prescription, wellness and invoice. Implementing all health information types is mandatory for a hospital management system.
2. Grouping records into care contexts. A care context holds only a reference number and a display name. The display name must not contain a diagnosis or a result. NHA recommends one care context per outpatient visit and one per inpatient admission.
3. Linking a care context to the patient's ABHA address, so their [PHR](/docs/overview/glossary#phr) app can see it exists. There are three routes: HIP initiated linking when the patient gave their ABHA address at registration, an SMS deep link when they gave only a mobile number and demographics, and discovery and link when the patient starts the search from their PHR app.
4. Responding to a health information request. You validate the consent, encrypt the bundle and push it to the requester's data push URL. NHA's document gives a 20 minute timeout from request initiation. Encryption uses an Elliptic Curve Diffie Hellman key exchange on Curve25519, with AES-GCM for the payload.

See [M2](/docs/api/hie-cm/m2) and the [M2 API reference](/reference/hiecm-m2).

### M3, fetching records you do not hold

M3 is the requester side. You build it when your system needs a record that lives somewhere else: a doctor's console pulling a patient's history, an insurer, a referral system.

In M3 you act as an [HIU](/docs/overview/glossary#hiu), a Health Information User. The flow is a consent request against the patient's ABHA address, an acknowledgement carrying a request ID, a wait while the patient grants or denies it in their PHR app, then a fetch of the consent artefacts and a health information request against them. The record arrives encrypted at the callback URL you supplied, and you decrypt it and notify the gateway.

Two sets of codes matter here. Purpose of use says why you want the data, drawn from an HL7 value set: care management, break the glass, public health, healthcare payment, disease specific research, self requested. Health information types say what you want: prescription, diagnostic report, OP consultation, discharge summary, immunization record, health document record, wellness record.

The patient can grant with an expiry, deny, or revoke after granting. Your system has to handle all three.

See [M3](/docs/api/hie-cm/m3) and the [M3 API reference](/reference/hiecm-m3).

### M4, professionals and facilities

M4 registers the people and places, not the patients. It writes to two registries: HPR for healthcare professionals, HFR for health facilities. It also links bridges, which is how your software gets connected to a facility so that HIP and HIU calls resolve to it.

M4 is Phase 2 for this portal. Read [ABHA, HPR and HFR](/docs/overview/building-blocks/registries) for what the registries hold, and [M4](/docs/api/hie-cm/m4) for the flow.

## Which role builds which module

| Your product | Role in ABDM | Modules |
| --- | --- | --- |
| [PHR](/docs/overview/glossary#phr) app for patients | Patient facing application | M1, plus the patient side of linking and consent from M2 and M3 |
| Hospital or clinic system, [HMIS](/docs/overview/glossary#hmis) or [EMR](/docs/overview/glossary#emr) | HIP, and HIU if it also reads outside records | M1, M2, M4. Add M3 to pull history |
| Lab system, [LIMS](/docs/overview/glossary#lims) | HIP | M1, M2, M4 |
| Pharmacy system | HIP | M1, M2, M4 |
| Insurer, referral or analytics system | HIU | M1, M3 |

HIP and HIU are roles, not products. One system is often both. A hospital that shares its own discharge summaries and also pulls a patient's earlier prescriptions is a HIP for the first and an HIU for the second, and it builds M2 and M3.

For a fuller walk through by product type, see [PHR applications](/docs/overview/roles/phr) and [Hospital, lab and pharmacy systems](/docs/overview/roles/his).

## Next

- [Choose your role and module](/docs/api/hie-cm)
- [Registries: ABHA, HPR, HFR](/docs/overview/building-blocks/registries)
- [Sandbox signup and first call](/docs/overview/get-started)
