---
title: M2 user journeys
sidebar_label: User journey
sidebar_position: 2
description: The four M2 flows as sequence diagrams, from linking a care context to pushing encrypted records.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 user journeys

Milestone 2 (M2) of [ABDM](/docs/abdm/v3/glossary#abdm) has four flows. This page draws each one, so you can see the round trips before you read the detail.

[NHA](/docs/abdm/v3/glossary#nha)'s document carries its own API sequence diagrams as images, which did not survive the conversion to text. The diagrams below come from its numbered process steps. The step order is NHA's, the drawing is ours. Steps given only in prose are drawn in words, not guessed at.

"Your system" is your [HMIS](/docs/abdm/v3/glossary#hmis) or [LMIS](/docs/abdm/v3/glossary#lmis) acting as a [HIP](/docs/abdm/v3/glossary#hip). "HIE-CM" is NHA's [Health Information Exchange and Consent Manager](/docs/abdm/v3/glossary#hie-cm) gateway.

## Journey 1: HIP initiated linking

The patient gave you their [ABHA address](/docs/abdm/v3/glossary#abha-address) at registration. Link the [care context](/docs/abdm/v3/glossary#care-context) as soon as the record is ready: linking is what makes it reachable from [PHR](/docs/abdm/v3/glossary#phr) apps.

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    participant S as Your system
    participant CM as HIE-CM
    participant A as Patient's PHR apps
    P->>S: Registers, gives ABHA address
    S->>CM: Request link token
    CM-->>S: Link token, valid six months
    Note over S: Store the token against the patient
    S->>S: New health record created
    S->>S: Assign the record to a care context
    S->>CM: Link the care context, carrying the link token
    CM-->>S: Link acknowledged
    CM->>A: Notify every PHR app subscribed to that ABHA address
```

- **No valid [link token](/docs/abdm/v3/glossary#link-token).** Validate the stored token before use, with a tool such as jwt.io. If it is expired or missing, regenerate it through demographic authentication.
- **An existing care context gains new records.** The step 8 notification fires for that too, not only for a new context.

## Journey 2: Notification to mobile

You hold a mobile number, a name, an age and a gender, but no ABHA address. You cannot link, so you ask NHA to tell the patient a record is waiting.

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    participant S as Your system
    participant CM as HIE-CM
    participant A as PHR app
    P->>S: Registers with mobile, name, age, gender
    S->>S: New health record created
    S->>CM: Notify that a record is ready to share
    CM->>P: SMS with a secure deep link
    P->>A: Opens the link, installs a PHR app if needed
    P->>A: Creates an ABHA address if they do not have one
    Note over A,S: The patient now runs journey 3 to find and link the record
```

## Journey 3: Discovery and link

The patient starts [discovery](/docs/abdm/v3/glossary#discovery) from a PHR app and picks the facility they visited. Your system matches them on the identifiers NHA passes you and answers with care contexts.

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    participant A as Patient's PHR app
    participant CM as HIE-CM
    participant S as Your system
    P->>A: Selects the facility they visited
    A->>CM: Discovery request
    CM->>S: Discovery request with verified and unverified identifiers
    S->>S: Match against your patient records
    S-->>CM: List of care contexts, metadata only
    CM-->>A: Care contexts to review
    P->>A: Selects the care contexts to link
    A->>CM: Link the selected care contexts
    CM->>S: Link request for those care contexts
    S-->>CM: Link confirmed
    CM-->>A: Records now linked to the ABHA address
```

Step 3 hands you two groups of identifiers.

- **Verified.** ABHA address, mobile number, name, gender, year of birth. NHA says to weight these higher.
- **Unverified, user declared.** Facility issued identifiers such as a medical registration number or patient ID.

Step 5 has a hard rule: care context metadata only. No diagnosis, no test result, no report content.

Steps 8 to 11 are drawn in words: NHA describes them in prose and shows the payloads as images. Its error code list names them init, confirm, on-init and on-confirm, so the shape is a gateway request and a callback from you. The fields are not given.

## Journey 4: Health record request and data transfer

An [HIU](/docs/abdm/v3/glossary#hiu), a PHR app or another facility, asks for records under a [consent artefact](/docs/abdm/v3/glossary#consent-artefact) the patient granted.

```mermaid
sequenceDiagram
    autonumber
    participant U as HIU
    participant CM as HIE-CM
    participant S as Your system
    U->>CM: Health information request
    Note over U,CM: Consent ID, data push URL, date range, public key and nonce
    CM->>CM: Generate a transaction ID
    CM-->>U: Transaction ID
    CM->>S: Forward the request with the transaction ID
    S->>S: Check the consent is valid and active
    S->>S: Check the date range sits inside the consent
    S->>S: Check the encryption parameters
    S->>S: Build the FHIR bundle, encrypt it, sign it
    S->>U: Push encrypted data to the data push URL
    S->>CM: Call health-information/notify, transfer complete
    U->>CM: Notify the outcome, success or failure
```

Four NHA constraints on step 9, the push.

- The HIU supplies the data push URL. It can differ from its registered gateway URL, which keeps the requester harder to identify.
- The push has a 20 minute window from the start of the request. Past that, expect failure or timeout.
- Large datasets such as CT or MRI images may be split across multiple parts.
- For very large files NHA recommends streaming over one whole payload.

Encryption uses [ECDH](/docs/abdm/v3/glossary#ecdh), Elliptic Curve Diffie Hellman, over Curve25519. Mechanics: [use cases](/docs/abdm/v3/api/m2/sequence). Call order: [API sequence](/docs/abdm/v3/api/m2/sequence).
