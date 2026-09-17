---
title: HFR, the facility registry
sidebar_label: HFR
description: The Health Facility Registry, what a facility record holds, the five call onboarding sequence, and how a bridge is linked to it.
verification: unverified
source: catalogue/openapi/hiecm/v3/hiecm-m4.yaml, catalogue/openapi/hiecm/v3/hiecm-m2.yaml
sidebar_position: 2
sidebar_class_name: sidebar-icon sidebar-icon--building
---

# HFR, the facility registry

[HFR](/docs/hiecm/v3/getting-started/glossary#hfr) is the Health Facility Registry, the places half of [NHPR](/docs/hiecm/v3/registries/nhpr) alongside the [HPR](/docs/hiecm/v3/registries/nhpr/hpr). It is a national directory of hospitals, clinics, diagnostic laboratories, imaging centres and pharmacies, and a facility has to enrol here before it can do anything else on [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm).

## Why it blocks everything else

A facility needs a valid facility ID and registration in the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) role before it can create health records and share them. A product that has finished [M2](/docs/hiecm/v3/api/m2) or [M3](/docs/hiecm/v3/api/m3) against the sandbox cannot go live without this registry.

## What a facility record holds

Three layers, one call each.

| Layer | What goes in it |
| --- | --- |
| Basic information | Name, ownership and its subtypes, system of medicine, facility type and subtype, speciality type, operational status, type of service, the full address as codes, latitude and longitude, contact details, opening days and hours, and photographs of the board and the building |
| Additional information | Yes or no flags for a dialysis centre, pharmacy, blood bank, cath lab, diagnostic lab and imaging centre, plus scheme identifiers the facility already holds: NHRR, NIN, AB-PMJAY, Rohini, ECHS, CGHS, CEA registration and a state insurance scheme ID |
| Detailed information | Specialities per system of medicine, and the sections that apply to this facility type: medical infrastructure and bed counts, pharmacy details, blood bank details, diagnostic services, imaging services |

### Codes, not names

Ownership, facility type, facility subtype, speciality, system of medicine, operational status and days of operation come from HFR's own master data calls. Demographic fields come from the Local Government Directory at [lgdirectory.gov.in](https://lgdirectory.gov.in/), through the LGD state, district and sub district calls.

## The onboarding journey

Five calls, in a fixed order.

1. **Deduplicate search.** Check the facility is not already listed.
2. **Basic facility information.** Creates the record and returns a tracking ID. Pass it as the facility ID on every later call in the sequence.
3. **Additional information.** Takes the tracking ID.
4. **Detailed information.** Takes the tracking ID.
5. **Submit facility details.** Sends the facility for verification.

:::warning[Without call five the facility stays a draft]
A facility that has not been submitted carries a status of `Draft`. Running the first four calls and getting a tracking ID back does not mean you are registered.
:::

## The link to the HPR token

Your client credentials are not enough. Basic facility information takes an **`x-hprid-auth` token in the header**. Submit facility takes **`x-hprid-auth` and `x-hprid-auth-verifier` headers**. Set each header by the name the call asks for.

Both come from a person, not from your application. That is why [HPR](/docs/hiecm/v3/registries/nhpr/hpr) comes first in a rollout, and why somebody in your organisation needs an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) before you write a line of HFR code.

## The facility ID

A submitted and verified facility carries a facility ID, and that ID identifies it in every record you share. Two formats are documented for it:

| Where | Format |
| --- | --- |
| Bridge linkage, facility search, send OTP to contact | Starts with `IN` and is 12 characters in total |
| Deduplicate search | A numeric value, such as `69765` |

One parameter name carries two different formats. Take the format from the reference page for the call you are making.

## Bridge linkage

A bridge is your software's connection to ABDM. Registering a facility gives it an identity; linking a bridge makes your system resolvable as that facility, in the HIP or [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) direction, so records flow to it. The call takes a facility ID, the facility name, a bridge ID, a HIP name, a type of `HIP` or `HIU`, and an active flag.

## Finding a facility

| Call | What it is for |
| --- | --- |
| Deduplicate search | Name, district and sub district, before creating a record |
| Search facility | By facility ID, or by ownership code, state LGD code and facility name. Paginated |
| Nearby search | Latitude, longitude and a radius in kilometres, with optional filters for ownership, speciality and ABDM software |
| Send and validate OTP to contact | Sends an [OTP](/docs/hiecm/v3/getting-started/glossary#otp) to a facility's contact, then validates it |

Base URLs for every call on this page are on [NHPR](/docs/hiecm/v3/registries/nhpr).

## Request and response formats

This page gives what a facility record holds and the order the calls go in.
Take the request and response shapes from the health facility registry sandbox
documentation alongside it.

Two paths are fixed here:

| Call | Path |
| --- | --- |
| Fetch facility type | `/v1.5/facility/fetch-facility-type` |
| Get specialities | `/v1.5/facility/get-specialities` |

## Next

- [HPR](/docs/hiecm/v3/registries/nhpr/hpr), which issues the token these calls need.
- [NHPR](/docs/hiecm/v3/registries/nhpr), the parent page.
- [the M4 API reference](/docs/hiecm/v3/api/m4), its operations and their fields.
- [M2 Attach, Health Information Provider Services](/docs/hiecm/v3/api/m2), which needs this facility ID.
