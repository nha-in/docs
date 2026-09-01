---
title: M3 user journeys
sidebar_label: User journey
sidebar_position: 10
description: The consent request, the patient's decision and the data fetch, drawn as three sequence diagrams.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
covers: [hiecm.flow.m3-request-consent, hiecm.flow.m3-fetch-records]
---

# M3 user journeys

Milestone 3 (M3) of [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) is one story in three parts: a doctor asks for a patient's past records, the patient says yes or no, and if yes the records travel. Each part is drawn below, so you can see the round trips before you read the [API reference](/reference/hiecm-m3).

[NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s document carries its own diagrams and screen sequences as images, which did not survive the conversion to text. The diagrams below come from the ordered prose of the same document. The step order is NHA's, the drawing is ours.

| In the diagram | What it is |
|---|---|
| Patient | The person whose records these are, acting in their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app |
| Your system | The [HIU](/docs/hiecm/v3/getting-started/glossary#hiu): the hospital or app that wants to read the records |
| NHA gateway | NHA's [gateway](/docs/hiecm/v3/getting-started/glossary#gateway), which routes every call and callback |
| HIE-CM | The [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm), which holds consent and asks the patient |
| HIP | The [HIP](/docs/hiecm/v3/getting-started/glossary#hip) that holds the records, in journeys 2 and 3 |

## Journey 1: raising a consent request

A doctor wants the patient's earlier records for a date range. Your system sends the request with the patient's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) address. Nothing comes back inline: you get a request id on a callback, then wait for the patient.

```mermaid
sequenceDiagram
    autonumber
    actor D as Doctor
    participant S as Your system
    participant G as NHA gateway
    participant C as HIE-CM
    actor P as Patient
    D->>S: Picks the patient and a date range
    S->>G: Consent request init with ABHA address
    G->>C: Forwards the request
    C-->>G: Acknowledges, creates a request id
    G-->>S: on-init callback with the consent request id
    C->>P: Notifies the patient of the request
    Note over S,C: Your system now waits. You may poll request status.
```

The request id is the handle for everything that follows. Store it against the doctor and the patient.

## Journey 2: the patient grants or denies

The patient sees who is asking, what they want, why, and for how long. The HIE-CM tells both sides what they chose.

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    participant C as HIE-CM
    participant G as NHA gateway
    participant S as Your system
    participant H as HIP
    P->>C: Views the request details
    alt Patient grants
        P->>C: Grants, with an expiry date and time
        C->>C: Creates one consent artefact per HIP
        C->>G: Notify granted, with artefact ids and request id
        G->>S: Consent request notify to your system
        S-->>G: on-notify acknowledgement
        C->>G: Notify the HIP with care context references
        G->>H: Consent request HIP notify
    else Patient denies
        P->>C: Denies the request
        C->>G: Notify denied
        G->>S: Consent request notify, status denied
    end
```

- A grant carries an expiry. The patient sets when the permission runs out.
- A grant can produce more than one consent artefact, because the patient's records sit in more than one hospital.
- The patient can revoke a granted consent at any time. Your access ends when they do.

## Journey 3: fetching the records

With an artefact id you fetch the artefact, ask for the data it covers, and wait for that data on your callback URL.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant G as NHA gateway
    participant C as HIE-CM
    participant H as HIP
    S->>G: Consent fetch with the consent artefact id
    G->>C: Forwards
    C-->>G: Artefact detail
    G-->>S: on-fetch callback with the artefact
    S->>G: Health information request with consent id and request id
    G-->>S: on-request callback with transaction id and status
    G->>H: Health information request to the HIP
    H->>S: Pushes encrypted records to your data push callback URL
    S->>S: Decrypts and renders the records
    S->>G: Health information notify, receipt of the data
```

The records arrive encrypted, at the same callback URL you supplied as the data push URL. NHA states your side plainly: convert the data back to its original form, then present it in a readable format.

The M3 document does not describe the encryption scheme. It is [ECDH](/docs/hiecm/v3/getting-started/glossary#ecdh) key exchange, specified on the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) side in NHA's M2 document. See [M2](/docs/hiecm/v3/api/m2).

## What the patient sees

NHA's document includes a screen sequence and a set of expiry screens for the patient's side. Both are screenshots, and nothing readable converted, so they are not reproduced here. What the prose does state is on the [use cases](/reference/hiecm-m3) page under patient rights.
