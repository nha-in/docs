---
title: Consent
sidebar_label: Consent
description: What a consent request is, what a consent artefact is, who holds it, and the states it moves through.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md, ABDM__NewDocumant_PHR_app.md, ABDM__Proposed_Simplified_Milestone_2.md
---

# Consent

Consent is the permission layer of [ABDM](/docs/abdm/v3/glossary#abdm): a record moves because a patient said yes to a named system, for a named reason, over a date range, for a fixed length of time. The calls that create and read it are in the [M3 guide](/docs/abdm/v3/api/m3).

## Two objects, not one

| Object | What it is | Who creates it | Identifier |
| --- | --- | --- | --- |
| Consent request | The ask. It names the patient by [ABHA](/docs/abdm/v3/glossary#abha) address, the reason, the record types wanted, and the date range wanted. | The [HIU](/docs/abdm/v3/glossary#hiu), through the gateway | Consent request id |
| [Consent artefact](/docs/abdm/v3/glossary#consent-artefact) | The permission itself, created only if the patient grants the request. It is what a record holder checks before sending anything. | The [HIE-CM](/docs/abdm/v3/glossary#hie-cm), on the patient's decision | Consent artefact id |

One request can produce more than one artefact. [NHA](/docs/abdm/v3/glossary#nha)'s M3 document says a granted request returns the ids of the consent artefacts created against it, plural. Store the request id and every artefact id.

## Who holds what

- **The patient holds the decision**, in their [PHR](/docs/abdm/v3/glossary#phr) app.
- **The HIE-CM holds the artefact.** As [consent manager](/docs/abdm/v3/glossary#consent-manager) it asks the patient, records the answer, and tells requester and record holder.
- **The HIU holds an id, not a right.** It can stop working at any time.
- **The [HIP](/docs/abdm/v3/glossary#hip) holds the check.** Before sending a record it validates that the artefact is active and that the dates asked for sit inside the dates it allows.

## The states a consent moves through

NHA's PHR document names five states, in the two sections a PHR app shows: Requests holds Requested, Denied and Expired; Approved holds Granted and Revoked.

```mermaid
stateDiagram-v2
    [*] --> Requested: HIU raises a consent request
    Requested --> Granted: Patient approves
    Requested --> Denied: Patient refuses
    Requested --> Expired: Patient does not act in time
    Granted --> Revoked: Patient withdraws access
    Granted --> [*]: Validity period ends
```

| State | What it means | What your system does |
| --- | --- | --- |
| Requested | The patient has not acted yet. | Wait. Poll the request status if you need to show progress. |
| Granted | The patient approved, and set how long the access lasts. | Fetch the artefact ids, then request the data. |
| Denied | The patient refused. | Stop. There is no partial result and no retry that changes the answer. |
| Expired | The patient did not act inside the window the HIU set on the request. | Raise a new request if the clinical need is still there. |
| Revoked | The patient withdrew a consent they had already granted. | Stop fetching under that artefact from that moment. |

Two clocks run here. The **request window** is how long the patient has to answer, set by the HIU, and running out produces Expired. The **consent validity period** is how long access lasts once granted, set by the patient as they grant, "with a defined expiry date and time" in NHA's M3 document. Neither is the **date range**, which says which records are in scope by when the care happened: a consent granted today can cover records from 2019.

## What the patient sees, and can change

NHA's PHR document lists what a consent request must display: the requesting HIU, the purpose of data access, the data types requested, the date range, the consent validity period and the request status. Where permitted, the patient may modify four of those before approving: access duration, record date range, data categories and validity period. The consent you get back can be narrower than the one you asked for, so read the artefact.

## Purpose of use codes

Why you want the records. See [purpose of use](/docs/abdm/v3/glossary#purpose-of-use). NHA takes a subset of the HL7 v3 PurposeOfUse value set at [terminology.hl7.org](http://terminology.hl7.org/ValueSet/v3-PurposeOfUse).

| Code | Display |
| --- | --- |
| `CAREMGT` | Care Management |
| `BTG` | Break the Glass |
| `PUBHLTH` | Public Health |
| `HPAYMT` | Healthcare Payment |
| `DSRCH` | Disease Specific Healthcare Research |
| `PATRQT` | Self-Requested |

NHA's table prints the header row and the `CAREMGT` row twice, an artefact of the source document. There are six codes. The patient reads this code.

## Health information types

What kind of record you are asking for. See [HI type](/docs/abdm/v3/glossary#hi-type). NHA's M3 document lists the types supported as of writing:

| Code | Display |
| --- | --- |
| `Prescription` | Prescription |
| `DiagnosticReport` | Diagnostic Report |
| `OPConsultation` | OP Consultation |
| `DischargeSummary` | Discharge Summary |
| `ImmunizationRecord` | Immunization Record |
| `HealthDocumentRecord` | Record artifact |
| `WellnessRecord` | Wellness Record |

NHA's M2 error message for an invalid HI type lists these seven and adds `Invoice`. The two documents disagree by one value, so check the swagger before you send `Invoice`. What each type carries as a [FHIR](/docs/abdm/v3/glossary#fhir) bundle is on [FHIR and health record formats](/docs/abdm/v3/concepts/fhir).

## Expiry and revocation

**Expiry is predictable.** The artefact carries an end, so you can fetch before it arrives. Past it, the record holder rejects the request: `ABDM-1061` for an expired consent artefact, `ABDM-1112` for an artefact id that is invalid or already expired.

**Revocation is not.** The patient can withdraw at any time, including after you have read the data, and NHA's PHR document states that future data sharing under that consent must stop immediately.

So treat every fetch as a fresh permission check, and handle a mid flow revocation: a consent that was live when you sent the health information request can be dead when the record holder validates it, which returns `ABDM-1062`, consent not granted. Decide your retention policy for data you already hold. NHA's documents say sharing stops; they do not say what to do with what you received.

Read every code with the message the gateway returns. NHA's error table lists `ABDM-1061` and `ABDM-1062` against two different messages each, so the code alone does not identify the failure.

## Consent without a person tapping approve

NHA's PHR document describes an auto approval policy: the patient authorises the app once, the app registers the policy with the HIE-CM, and later requests under that policy are granted immediately. The patient can disable it, after which each record needs its own request again. This changes who taps the button, not the model. An artefact is still created, still carries an expiry, and can still be revoked. Detail is on [PHR applications](/docs/abdm/v3/phr).

## Where this is implemented

- [Hospital, lab and pharmacy systems](/docs/abdm/v3/concepts/hip-hiu), the HIP and HIU roles.
- [HIE-CM gateway](/docs/abdm/v3/building-blocks/hie-cm), which holds every artefact here.
- [M3, consent and fetching](/docs/abdm/v3/api/m3), the requesting side.
- [M2, linking and sharing](/docs/abdm/v3/api/m2), what a record holder validates.
- [How a record travels](/docs/abdm/v3/concepts/data-flow), what happens next.
