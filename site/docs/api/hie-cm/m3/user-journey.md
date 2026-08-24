---
title: M3 user journeys
sidebar_label: User journey
sidebar_position: 2
description: The consent request, the patient's decision and the data fetch, drawn as three sequence diagrams.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 user journeys

Milestone 3 (M3) of [ABDM](/docs/overview/glossary#abdm) has one story told in three parts. A doctor asks for a patient's past records. The patient says yes or no. If yes, the records travel. This page draws each part so you can see the round trips before you read the [API sequence](/docs/api/hie-cm/m3/api-sequence).

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

[NHA](/docs/overview/glossary#nha)'s document carries its own diagrams and screen sequences as images. Those images did not survive the conversion to text. The diagrams below are drawn from the ordered prose of the same document. The step order is NHA's. The drawing is ours.

Five parties appear across the three diagrams.

| In the diagram | What it is |
|---|---|
| Patient | The person whose records these are. They act in their [PHR](/docs/overview/glossary#phr) app. |
| Your system | The [HIU](/docs/overview/glossary#hiu). The hospital or app that wants to read the records. |
| NHA gateway | NHA's [gateway](/docs/overview/glossary#gateway), which routes every call and every callback. |
| HIE-CM | The [HIE-CM](/docs/overview/glossary#hie-cm), which holds consent and asks the patient. |
| HIP | The [HIP](/docs/overview/glossary#hip) that holds the records. It appears in journeys 2 and 3. |

## Journey 1: raising a consent request

A doctor wants the patient's earlier records for a date range. Your system sends the request with the patient's [ABHA](/docs/overview/glossary#abha) address. Nothing is returned inline. You get a request id on a callback, and then you wait for the patient.

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

The request id is the handle for everything that follows. Store it against the doctor and the patient before you move on.

## Journey 2: the patient grants or denies

The patient sees who is asking, what they want, why they want it and for how long. They choose. The HIE-CM then tells both sides what was chosen.

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

Three points worth holding on to.

- A grant carries an expiry. The patient sets when the permission runs out.
- A grant can produce more than one consent artefact, because the patient's records sit in more than one hospital.
- The patient can revoke a granted consent at any time afterwards. Your access ends when they do.

## Journey 3: fetching the records

You have an artefact id. Now you fetch the artefact itself, then ask for the data it covers, then wait for the data to arrive on your callback URL.

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

The records arrive at the same callback URL you supplied as the data push URL in the health information request. They arrive encrypted. Decryption is your side of the work, and NHA's document states it plainly: convert the data back to its original form, then present it in a readable format.

The encryption scheme itself is not described in the M3 document. It is [ECDH](/docs/overview/glossary#ecdh) key exchange, specified on the [HIP](/docs/overview/glossary#hip) side in NHA's M2 document. See [M2](/docs/api/hie-cm/m2).

## What the patient sees

NHA's document includes a screen sequence and a set of expiry screens for the patient's side of this. Both are screenshots. Nothing readable converted, so the screens are not reproduced here. What the prose does state is on the [use cases](/docs/api/hie-cm/m3/use-cases) page under patient rights.
