---
id: hiecm.flow.m4-onboard-facility
type: flow
gateway: hiecm
milestone: M4
version: abdm-v3
title: Onboard a facility to the HFR
summary: Search for the facility first, then create it in three writes and
  submit it, so it leaves draft and becomes a facility ABDM can see.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m4.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m4.mdx#m4-onboard-facility.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m4-hfr-search-facility
  flows:
    - hiecm.flow.m4-create-hpid
    - hiecm.flow.m4-link-bridge
  concepts:
    - hiecm.concept.gateway-session
  glossary:
    - shared.glossary.hfr
    - shared.glossary.hpr
---

# Onboard a facility to the HFR

## In plain words

Onboarding consists of one search, three updates, and a final submission, with each update adding another layer of facility details. If you stop before submission, the facility remains in Draft status and is not visible on ABDM.

The first update captures the basic facility information and creates a Facility ID. The Facility ID is retained throughout the onboarding flow, but remains masked until the facility is fully submitted. Once submission is complete, the Facility ID becomes visible. The API returns it as `trackingId`, and that is the value every later update carries.

```mermaid
sequenceDiagram
    autonumber
    actor M as Facility manager (HP-ID)
    participant S as Your system
    participant H as HFR service
    M->>S: Logs in with HPR credentials
    Note over S: Holds the HPR token, sent as x-hprid-auth
    S->>H: POST /search/address/filter/deduplicate<br/>name, address, district, subDistrict, village,<br/>geolocation
    H-->>S: Matching facilities, if any
    Note over S,H: Stop here if the facility is already registered
    S->>H: POST /v1.5/facility/basic-information<br/>header x-hprid-auth,<br/>facilityInformation {facilityName,<br/>facilityAddressDetails (LGD codes),
    H-->>S: trackingId (the Facility ID,<br/>masked until submission), status
    S->>H: POST /v1.5/facility/additional-information<br/>trackingId, linkedProgramIds {nin, abpmjayId,<br/>rohiniId, echsId, cghsId},<br/>generalInformation {hasPharmacy, hasBloodBank,
    H-->>S: trackingId, status
    S->>H: POST /v1.5/facility/detailed-information<br/>trackingId, specialities [systemOfMedicineCode,<br/>specialities],<br/>medicalInfrastructure (bed and ventilator counts)
    H-->>S: trackingId, status
    S->>H: POST /v1.5/facility/submit-facility<br/>headers x-hprid-auth, x-hprid-auth-verifier,<br/>trackingId, sourceOfInformation, facilitySuperUser
    H-->>S: Facility submitted for verification,<br/>Facility ID visible once approved
```

### What each update carries

| Call | Information captured |
|---|---|
| Basic facility information | Facility name, ownership, system of medicine, facility type and subtype, address with LGD codes, contact details, board and building photographs, and operating hours |
| Additional information | Availability of services and units such as a pharmacy, blood bank, dialysis centre, cath lab, diagnostic laboratory, or imaging centre, along with scheme identifiers such as ABPMJAY, ROHINI, ECHS, and CGHS |
| Detailed information | Specialities by system of medicine, bed and ventilator counts, and applicable sections for pharmacy, blood bank, diagnostic laboratory, and imaging services, based on the facility type |
| Submit facility | Captures the tracking ID and optional source of information, and moves the facility application out of Draft status |

The mandatory fields under detailed information vary based on the facility type, service type, and system of medicine selected during registration. Diagnostic laboratories, imaging centres, blood banks and pharmacies do not require medical infrastructure counts, such as bed or ventilator counts.

### OTP based facility verification

A shorter verification flow is available for government programmes. An OTP is sent to the contact number registered against the Facility ID, which is then validated to complete verification.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HFR service
    S->>H: POST /v1.5/facility/sendOtpToContact<br/>facilityId
    H-->>S: transactionId,<br/>OTP sent to the facility contact number
    S->>H: POST /v1.5/facility/validateOtp<br/>facilityId, sourceId, otp, source, transactionId
    H-->>S: Validation result
```

## Before you start

Someone at the facility holds an HP-ID, so you hold the HPR token that goes in `x-hprid-auth`. You hold a gateway session token and the LGD codes for the facility's address.

## What happens

Search with `/search/address/filter/deduplicate` and stop if the facility exists. Send basic information and keep the `trackingId` it returns: every later call carries it. Send additional information, then detailed information, then submit with `x-hprid-auth` and `x-hprid-auth-verifier`.

## How you know it worked

Submit accepts the same `trackingId` and reports the facility submitted for verification, and a search afterwards returns it. A facility written but never submitted stays in Draft and is invisible to ABDM, whatever the three writes returned.

## When it goes wrong

A duplicate facility: the search step is what prevents it. A field refused on detailed information, because which sections are mandatory depends on the facility type, the service type and the system of medicine rather than on the field itself.
