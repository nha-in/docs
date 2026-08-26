---
title: M4 user journeys
sidebar_label: User journey
sidebar_position: 10
description: The professional registration and facility onboarding journeys that NHA's M4 document describes, as diagrams.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# M4 user journeys

Milestone 4 of [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) has three journeys:

- A professional gets an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) and an [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) profile.
- A facility manager onboards a facility to the [HFR](/docs/hiecm/v3/getting-started/glossary#hfr).
- A facility links its bridges, so its software can act as a [HIP](/docs/hiecm/v3/getting-started/glossary#hip) or an [HIU](/docs/hiecm/v3/getting-started/glossary#hiu).

This page shows the order of calls in each. Field lists are on the [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented) page.

:::caution[A map, not a runbook]
These diagrams follow the order of steps NHA's document sets out. They are a map, not a tested runbook.
:::

## Journey 1: a professional gets an HPID

The professional authenticates against Aadhaar on a page NHA hosts. Your system never handles the Aadhaar number or [OTP](/docs/hiecm/v3/getting-started/glossary#otp): it handles the transaction ID and redirects to a URL NHA returns, valid for five minutes. After that, call generate Aadhaar link again.

```mermaid
sequenceDiagram
    autonumber
    actor P as Professional
    participant S as Your system
    participant G as NHA gateway
    participant H as NHA HPR service

    S->>G: POST /gateway/v3/sessions with clientId and clientSecret
    G-->>S: accessToken
    S->>H: Generate Aadhaar link
    H-->>S: txnId and a temporary URL, valid 5 minutes
    S->>P: Redirect to the URL
    P->>H: Enter Aadhaar details and verify by OTP
    loop Optional polling
        S->>H: Check Aadhaar authentication status with txnId
        H-->>S: true or false, as a bare boolean
    end
    S->>H: Verify OTP and fetch user details with txnId
    H-->>S: Demographic and address details, mobile number masked
    S->>H: Check whether an HPID already exists for this Aadhaar
    H-->>S: The existing HPID, or none
```

### Then the mobile number

The mobile number is confirmed before the HPID is created, by a fast path or a slow one. Send it encrypted: fetch NHA's public certificate from `/v4/int/api/v1/auth/cert`, encrypt with `RSA/ECB/PKCS1Padding`, send the encrypted value.

```mermaid
flowchart TD
    A["Call the mobile match API<br/>with the encrypted mobile number"] --> B{"demographicAuthViaMobile"}
    B -- true --> C["Mobile number is already verified.<br/>Skip OTP entirely."]
    B -- false --> D["Generate mobile OTP<br/>with mobile and txnId"]
    D --> E["Verify mobile OTP<br/>with otp and txnId"]
    E --> C
    C --> F["Get username suggestions"]
    F --> G["Create HPID"]
```

Create HPID returns an `hprToken`. Keep it: the register professional call needs it.

### Then the profile

The HPID is an identity, not a profile. Registering the professional adds qualifications, council registration and current work.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as NHA HPR service

    Note over S: Holds accessToken and hprToken
    S->>H: Fetch master data: councils, courses, colleges, universities, languages
    H-->>S: Code lists
    S->>H: Register professional, with hprToken in the payload
    H-->>S: Registration result
    S->>H: Retrieve professional document list
    H-->>S: Document IDs to upload against
    S->>H: Upload documents, one call per document
    H-->>S: Upload result
```

Two documents are mandatory, the degree certificate and the registration certificate. A proof of work certificate is mandatory too when the professional works for government, or for both government and private.

Register professional takes codes, not names. Fetch council, course, college, university, state, district and language from the master APIs first.

## Journey 2: a facility onboards to the HFR

Onboarding is one search, three writes and a submit, each write adding a layer of detail. Stop before submit and the facility stays in draft, invisible to ABDM.

The first write, basic facility information, returns a tracking ID. That is the facility's identity for the rest of the sequence, and what you pass as the facility ID on every later update.

```mermaid
sequenceDiagram
    autonumber
    actor M as Facility manager
    participant S as Your system
    participant H as NHA HFR service

    M->>S: Logs in with their HPR credentials
    S->>H: Get HPR token
    H-->>S: HPR token for the header
    S->>H: Deduplicate search, by name, district and sub district
    H-->>S: Existing facilities that match, if any
    Note over S,H: Stop here if the facility already exists
    S->>H: Basic facility information
    H-->>S: trackingId
    S->>H: Additional information, with trackingId
    S->>H: Detailed information, with trackingId
    S->>H: Submit facility, with trackingId
    H-->>S: Facility submitted for verification
```

### What each write call carries

| Call | What it captures |
|---|---|
| Basic facility information | Name, ownership, system of medicine, facility type and subtype, address with LGD codes, contact details, board and building photographs, opening hours |
| Additional information | Whether it has a pharmacy, blood bank, dialysis centre, cath lab, diagnostic lab or imaging centre, plus scheme identifiers such as ABPMJAY, Rohini, ECHS and CGHS |
| Detailed information | Specialities per system of medicine, bed and ventilator counts, and the pharmacy, blood bank, diagnostic and imaging sections that apply to this facility type |
| Submit facility | The tracking ID and an optional source of information. Moves the facility out of draft |

Which fields are mandatory in detailed information depends on the facility type, the type of service and the system of medicine. A diagnostic laboratory, imaging centre, blood bank or pharmacy sends no medical infrastructure counts at all.

### A facility can also verify by OTP

NHA names a second, shorter path used by government programmes: send an OTP to the contact number registered against a facility ID, then validate it.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as NHA HFR service

    S->>H: Send OTP to contact, with facilityId
    H-->>S: transactionId, and an OTP to the facility's mobile
    S->>H: Validate OTP, with facilityId, sourceId, otp, source and transactionId
    H-->>S: Validation result
```

## Journey 3: linking bridges to a facility

A facility ID alone does not make records flow. The facility has to be linked to a bridge, each link marked HIP or HIU. One facility can have several.

```mermaid
flowchart LR
    A["Facility ID<br/>IN plus 10 characters"] --> B["Bridge linkage call"]
    C["Bridge ID"] --> B
    D["HIP name<br/>15 characters or fewer"] --> B
    B --> E["Type: HIP or HIU"]
    B --> F["Active: true or false"]
```

The HIP name is what a patient sees in their [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) or [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app when they search for this hospital. NHA sets three rules: 15 characters or fewer, no special characters, unique for every bridge on a facility. Its example builds the name from the hospital name plus the bridge name.

A facility with a facility ID and a linked HIP bridge can do the [M2](/docs/hiecm/v3/api/m2) work, linking care contexts and sharing records. With a linked HIU bridge it can do the [M3](/docs/hiecm/v3/api/m3) work, requesting consent and fetching records. M4 is the registration step in front of either flow outside sandbox.

Next: [what NHA documents without a path](/docs/hiecm/v3/api/m4/undocumented).
