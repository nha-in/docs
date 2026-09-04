---
id: hiecm.flow.m4-onboard-facility
type: flow
gateway: hiecm
milestone: M4
version: abdm-v3
title: Onboard a facility to the HFR
summary: >
  Search for the facility first, then create it in three writes and
  submit it, so it leaves draft and becomes a facility ABDM can see.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m4.yaml
    fetched: 2026-09-04
    hash: sha256:626bfe09e359114b32b6cc5552223527a6e997a30687a5370a717ef49dd6cde4
    note: >
      NHA's M4 file as ingested on this branch. Of the five calls in this
      flow, none has a published method or path; the specialities master
      call it uses does.
  - file: site/docs/hiecm/v3/api/m4/undocumented.md
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The M4 operations and fields page. The five call order, the
      mandatory field tables and the conditional rules on detailed
      information come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/HFR-M4-Mar-16-2024.xlsx
    fetched: 2026-09-04
    hash: sha256:08073c49d97b0550078995d8ab3b4f5f1ce7f28f6deb6ce6109a34fc0efd474e
    note: >
      NHA's HFR test case sheet, 123 cases across search, registration,
      update and bridge linkage. It names the sandbox host and the
      operation ids behind the onboarding calls.
verified:
  status: unverified
  against: docs-only
related:
  endpoints:
    - hiecm.endpoint.m4-hfr-search-facility
  flows:
    - hiecm.flow.m4-create-hpid
    - hiecm.flow.m4-link-bridge
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.his-1132
    - hiecm.error.his-4003
  glossary:
    - shared.glossary.hfr
    - shared.glossary.hpr
    - shared.glossary.nhpr
skills:
  - hiecm-m4-build
---

## In plain words

The [HFR](../../shared/glossary/hfr.md) is the registry of health
facilities. Onboarding puts a hospital, clinic, laboratory, imaging
centre, pharmacy or blood bank in it and issues a facility ID in the form
`IN` followed by 10 characters, 12 in total.

The sequence is one search, three writes and a submit. Each write adds a
layer of detail to the same record. Until the submit call, the facility
sits in draft and ABDM cannot see it.

## Before you start

Four things must already be true, each checkable:

- Someone at the facility holds an HPR account. Onboarding needs an HPR
  token in the header of the create calls, generated from an HPR id and
  password, so it usually starts with a person getting an
  [HPID](m4-create-hpid.md).
- You hold a gateway session token. See
  [the gateway session](../concepts/gateway-session.md).
- You hold the LGD codes for the facility's state, district, sub district
  and village. They come from the Local Government Directory and from the
  LGD lookup calls.
- You hold the facility's board photograph and building photograph, each
  under 5 MB, base64 encoded, with the file extension in the name
  matching the file.

## What happens

```mermaid
sequenceDiagram
    actor M as Facility manager
    participant S as Your system
    participant H as HFR service
    M->>S: Signs in with HPR credentials
    S->>H: Get an HPR token
    H-->>S: Token for the header
    S->>H: Deduplicate search, by name, district and sub district
    H-->>S: Facilities that already match, if any
    Note over S,H: Stop here if the facility already exists
    S->>H: Basic facility information
    H-->>S: trackingId
    S->>H: Additional information, with trackingId
    S->>H: Detailed information, with trackingId
    S->>H: Submit facility, with trackingId
    H-->>S: Submitted for verification
```

1. **Search before you create.** Name, district and sub district are
   mandatory on the deduplicate search. A facility that already exists
   must not be created twice.
2. **Send the basic information.** This is the call that creates the
   record, and it returns a `trackingId`. That id is the facility's
   identity for every later call in this flow. Ownership drives which
   other fields apply: `ownershipSubTypeCode` is `C` or `S` when
   ownership is government, and `P` or `NP` when it is private or public
   private.
3. **Send the additional information.** The yes or no flags for a
   pharmacy, blood bank, dialysis centre, cath laboratory, diagnostic
   laboratory and imaging centre, plus any scheme identifiers the
   facility already holds.
4. **Send the detailed information.** Which sections are mandatory
   depends on the facility type, the type of service and the system of
   medicine. Specialities are not required for a blood bank, cath
   laboratory, diagnostic laboratory, dialysis centre, imaging centre or
   pharmacy. Medical infrastructure is mandatory for inpatient and day
   care, and `totalNumberOfBeds` must be at least the sum of the
   individual bed counts.
5. **Submit.** The submit call takes the `trackingId` and needs an
   `x-hpird-auth` token in the header. Leave `sourceOfInformation` empty
   and the facility is treated as a submitted entity.

NHA's HFR test case sheet names the sandbox host,
`https://facilitysbx.abdm.gov.in`, one full path, and the operation id
behind each of the writes:

| Call | What NHA's sheet gives |
|---|---|
| Deduplicate search | `/FacilityManagement/v1.5/facility/search`, and the operation `v15SearchFacilitiesFuzzyPostUsingPOST` |
| Basic facility information | the operation `v15FacilityBasicInformationUsingPOST` |
| Additional information | the operation `v15FacilityAdditionalInformationUsingPOST` |
| Detailed information | the operation `v15FacilityDetailedInformationUsingPOST` |
| Submit facility | the operation `v15SubmitFacilityDetailsUsingPOST` |

An operation id is not a path. The four writes are addressable through
that host's own API browser under Onboarding APIs; the parameter tables
are on the operations page. Nothing here has been called from this
repository.

## How you know it worked

The basic information call returns a `trackingId`, and the submit call
accepts that same `trackingId` and reports the facility submitted for
verification. Searching for the facility afterwards returns it rather
than nothing.

A facility that was written but never submitted stays in draft. A draft
is invisible to ABDM, so an integration that stopped after step 4 has not
onboarded anything, whatever the three write calls returned.

## When it goes wrong

The failures the M4 sources document, each with its fix in the linked
error atom:

- [HIS-1132](../errors/his-1132.md) when the registry detects a duplicate
  facility. Step 1 is what stops you reaching this.
- [HIS-4003](../errors/his-4003.md) when the facility already exists
  under the identifiers you sent.
- A conditional field rejected on detailed information, because the rule
  that makes it mandatory depends on the facility type and the system of
  medicine rather than on the field itself.
