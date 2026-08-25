---
title: HIE-CM gateway
sidebar_label: HIE-CM gateway
sidebar_position: 2
description: The gateway for patient identity, record linking and consent, and what its four modules do.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# HIE-CM gateway

[HIE-CM](/docs/abdm/v3/glossary#hie-cm) is the Health Information Exchange and Consent Manager, the part of [ABDM](/docs/abdm/v3/glossary#abdm) that gives a patient an identity, tracks which systems hold their records, and asks them before any record moves. This page says what its four modules cover and which ones your product builds.

## HIE-CM is data blind

It never holds a patient's health record, only identifiers, metadata about where records live, and consent artefacts. Once consent exists the record goes straight from the system that holds it to the system that asked, encrypted. Your system keeps the data. HIE-CM keeps the permission.

## The four modules

| Module | What it covers |
| --- | --- |
| [M1](/docs/abdm/v3/api/m1) | [ABHA](/docs/abdm/v3/glossary#abha) creation, ABHA login, profile management, sessions |
| [M2](/docs/abdm/v3/api/m2) | Care contexts, linking records to a patient, sending records when asked |
| [M3](/docs/abdm/v3/api/m3) | Requesting consent, fetching records from other systems |
| [M4](/docs/abdm/v3/api/m4) | Registering professionals and facilities in [HPR](/docs/abdm/v3/glossary#hpr) and [HFR](/docs/abdm/v3/glossary#hfr) |

### M1, patient identity

M1 creates and authenticates the patient's ABHA identity: ABHA creation, ABHA login, profile management, benefit programme APIs and session APIs. Creation is Aadhaar based, by OTP, face, biometrics or demographics. Login is by mobile number, ABHA number, ABHA address or Aadhaar number. Which routes are mandatory depends on whether you are a private or a government integrator, and the base URLs are both on [ABHA](/docs/abdm/v3/building-blocks/registries/abha).

Every call needs an access token from the gateway session API, your first request against ABDM. See [M1](/docs/abdm/v3/api/m1) and the [M1 API reference](/reference/hiecm-m1).

### M2, sharing records you hold

M2 is the provider side. Build it when your system creates health records. NHA's document sets a prerequisite: a valid Facility ID, and registration in the [HIP](/docs/abdm/v3/glossary#hip) role. The Facility ID comes from the HFR, which is M4.

1. Format records as [FHIR](/docs/abdm/v3/glossary#fhir) R4 bundles against the ABDM profiles published by NRCES at [nrces.in](https://nrces.in/ndhm/fhir/r4/index.html). Eight record types, all mandatory for a hospital management system. See [FHIR](/docs/abdm/v3/concepts/fhir).
2. Group records into care contexts. See [Care contexts and linking](/docs/abdm/v3/concepts/linking).
3. Link a care context to the patient's ABHA address so their [PHR](/docs/abdm/v3/glossary#phr) app can see it exists.
4. Answer a health information request: validate the consent, encrypt the bundle, push it to the requester's data push URL. See [How a record travels](/docs/abdm/v3/concepts/data-flow).

See [M2](/docs/abdm/v3/api/m2) and the [M2 API reference](/reference/hiecm-m2).

### M3, fetching records you do not hold

M3 is the requester side, where you act as an [HIU](/docs/abdm/v3/glossary#hiu). Build it when your system needs a record that lives somewhere else.

The flow: a consent request against the patient's ABHA address, an acknowledgement carrying a request ID, a wait while the patient decides in their PHR app, then a fetch of the consent artefacts and a health information request against them. The record arrives encrypted at your callback URL. You decrypt it and notify the gateway.

The patient can grant with an expiry, deny, or revoke after granting, and your system has to handle all three. The purpose of use and health information type code sets are on [Consent](/docs/abdm/v3/concepts/consent).

See [M3](/docs/abdm/v3/api/m3) and the [M3 API reference](/reference/hiecm-m3).

### M4, professionals and facilities

M4 registers the people and places, not the patients: HPR for professionals, HFR for facilities. It also links bridges, which is how your software gets connected to a facility so that HIP and HIU calls resolve to it. See [ABHA, HPR and HFR](/docs/abdm/v3/building-blocks/registries) and [M4](/docs/abdm/v3/api/m4).

## Which role builds which module

| Your product | Role in ABDM | Modules |
| --- | --- | --- |
| [PHR](/docs/abdm/v3/glossary#phr) app for patients | Patient facing application | M1, plus the patient side of linking and consent from M2 and M3 |
| Hospital or clinic system, [HMIS](/docs/abdm/v3/glossary#hmis) or [EMR](/docs/abdm/v3/glossary#emr) | HIP, and HIU if it also reads outside records | M1, M2, M4. Add M3 to pull history |
| Lab system, [LIMS](/docs/abdm/v3/glossary#lims) | HIP | M1, M2, M4 |
| Pharmacy system | HIP | M1, M2, M4 |
| Insurer, referral or analytics system | HIU | M1, M3 |

HIP and HIU are roles, not products. A hospital that shares its own discharge summaries and pulls a patient's earlier prescriptions is both, and builds M2 and M3. For a walk through by product type, see [PHR applications](/docs/abdm/v3/phr) and [Hospital, lab and pharmacy systems](/docs/abdm/v3/concepts/hip-hiu).

## Next

- [Choose your role and module](/docs/abdm/v3/milestones)
- [Registries: ABHA, HPR, HFR](/docs/abdm/v3/building-blocks/registries)
- [Sandbox signup and first call](/docs/abdm/v3/sandbox)
