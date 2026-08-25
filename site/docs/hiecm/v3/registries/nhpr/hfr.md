---
title: HFR, the facility registry
sidebar_label: HFR
description: The Health Facility Registry, what a facility record holds, the five call onboarding sequence, and how a bridge is linked to it.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md, ABDM__Proposed_Simplified_Milestone_2.md
sidebar_position: 2
---

# HFR, the facility registry

[HFR](/docs/hiecm/v3/getting-started/glossary#hfr) is the Health Facility Registry, the places half of [NHPR](/docs/hiecm/v3/registries/nhpr) alongside the [HPR](/docs/hiecm/v3/registries/nhpr/hpr). It is a national directory of hospitals, clinics, diagnostic laboratories, imaging centres and pharmacies, and a facility has to enrol here before it can do anything else on [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm).

## Why it blocks everything else

NHA's M2 document states the prerequisite plainly: a valid facility ID and registration in the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) role, before the entity can create health records and share them. A product that has finished [M2](/docs/hiecm/v3/api/m2) or [M3](/docs/hiecm/v3/api/m3) against the sandbox cannot go live without this registry.

What the facility gets, per NHA: a trusted identity, a listing in national search results, less paperwork on licence renewals and insurance empanelment, and access to ABDM's digital services.

## What a facility record holds

Three layers, one call each.

| Layer | What goes in it |
| --- | --- |
| Basic information | Name, ownership and its subtypes, system of medicine, facility type and subtype, speciality type, operational status, type of service, the full address as codes, latitude and longitude, contact details, opening days and hours, and two mandatory photographs of the board and the building |
| Additional information | Yes or no flags for a dialysis centre, pharmacy, blood bank, cath lab, diagnostic lab and imaging centre, plus scheme identifiers the facility already holds: NHRR, NIN, AB-PMJAY, Rohini, ECHS, CGHS, CEA registration and a state insurance scheme ID |
| Detailed information | Specialities per system of medicine, and the sections that apply to this facility type: medical infrastructure and bed counts, pharmacy details, blood bank details, diagnostic services, imaging services |

Which parts of the detailed layer are mandatory depends on the facility type, the type of service and the system of medicine, and NHA's rules are on [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented). Two shape your form: an inpatient or day care facility must submit at least one bed count greater than zero, and an imaging centre, diagnostic laboratory, blood bank or pharmacy need not submit medical infrastructure at all.

### Codes, not names

Ownership, facility type, facility subtype, speciality, system of medicine, operational status and days of operation come from HFR's own master data calls. Demographic fields come from the Local Government Directory at [lgdirectory.gov.in](https://lgdirectory.gov.in/), through the LGD state, district and sub district calls. HFR APIs accept only the code for any field where master data is defined, never the display value, so build the master data fetch first or every write call fails validation.

## The onboarding journey

Five calls, and NHA is explicit that the order is fixed.

1. **Deduplicate search.** Check the facility is not already listed.
2. **Basic facility information.** Creates the record and returns a tracking ID, which NHA says is the unique identification number for your facility until you submit, and which you pass as the facility ID on every later call in the sequence.
3. **Additional information.** Takes the tracking ID.
4. **Detailed information.** Takes the tracking ID.
5. **Submit facility details.** Sends the facility for verification.

:::warning[Without call five the facility does not exist]
NHA's document states that if the submit call is not made, the facility remains in draft. It goes nowhere and nothing else in ABDM can use it. A common way to lose a day is to run the first four calls, see a tracking ID come back, and assume you are registered.
:::

To update a facility later, send the same calls with the facility ID or tracking ID in the payload rather than creating a new record.

## The link to the HPR token

Your client credentials are not enough. Basic facility information takes an **HPR token in the header**, generated from an HPR ID and password; NHA points at the get HPR token flow in its update professional document. Submit facility takes an **`x-hpird-auth` token in the header**. NHA does not say whether the two are the same value under two names, and we have not run the calls.

Both come from a person, not from your application. That is why [HPR](/docs/hiecm/v3/registries/nhpr/hpr) comes first in a rollout, and why somebody in your organisation needs an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) with facility manager rights, role 2 or role 3, before you write a line of HFR code.

## The facility ID

A submitted and verified facility carries a facility ID, and that ID identifies it in every record you share. NHA's M4 document is not consistent about the format:

| Where | What NHA's document says |
| --- | --- |
| Bridge linkage, facility search, nearby search, send OTP to contact | Starts with `IN` and is 12 characters in total |
| Deduplicate search | A 6 digit numeric value, labelled there as the facility unique ID |

Two different things under one parameter name. We have not run either call to establish which applies where.

## Bridge linkage

A bridge is your software's connection to ABDM. Registering a facility gives it an identity; linking a bridge makes your system resolvable as that facility's HIP or [HIU](/docs/hiecm/v3/getting-started/glossary#hiu), so records flow to it. The call takes a facility ID, the facility name, a bridge ID, a HIP name, a type of `HIP` or `HIU`, and an active flag.

The HIP name is the one field a patient sees. NHA describes it as the name shown in the [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) or [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app when the patient searches for the hospital, and constrains it to 15 characters or fewer, no special characters, unique for every bridge within a facility. NHA's suggested pattern is the hospital name plus the bridge name: hospital XYZ on bridge BRIDGE TEST becomes `XYZ BRIDGE`. Fifteen characters is short, so pick what a patient will recognise.

## Finding a facility

| Call | What it is for |
| --- | --- |
| Deduplicate search | Name, district and sub district, before creating a record |
| Search facility | By facility ID, or by ownership code, state LGD code and facility name. Fuzzy on the name, exact on everything else, paginated |
| Nearby search | Latitude, longitude and a radius in kilometres, with optional filters for ownership, speciality and ABDM enabled. NHA states results are ordered nearest first |
| Send and validate OTP to contact | Sends an [OTP](/docs/hiecm/v3/getting-started/glossary#otp) to the mobile number registered against a facility, then validates it. This proves control of a facility record you did not create |

Base URLs for every call on this page are on [NHPR](/docs/hiecm/v3/registries/nhpr).

## What did not survive the conversion

NHA's M4 document carries its request and response samples as screenshots, which do not convert to text. Missing from our source:

- The method and path of all five onboarding calls, and of bridge linkage.
- The method and path of every utility and search call: master types, master data, LGD states, LGD districts, LGD sub districts, facility type, facility subtype, ownership subtype, specialities, PSU details by ministry, search facility, nearby search, send OTP to contact and validate OTP.
- Every request body and every response body for all of the above.

Two paths appear in text, quoted inside other parameter descriptions: `v1.5/facility/fetchfacilitytype` and `/v1.5/facility/get-specialities`.

The parameter tables survived in full, which is why this page can say what a facility record holds and in what order the calls go, but not the shape of a request. We will not guess a payload we have not seen, so open NHA's sandbox documentation for the health facility registry alongside this page.

## Next

- [HPR](/docs/hiecm/v3/registries/nhpr/hpr), which issues the token these calls need.
- [NHPR](/docs/hiecm/v3/registries/nhpr), the parent page.
- [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented), parameter tables and `HIS-` error codes.
- [M2, linking and sharing](/docs/hiecm/v3/api/m2), which needs this facility ID.
