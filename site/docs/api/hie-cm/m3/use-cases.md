---
title: M3 use cases and meta codes
sidebar_label: Use cases
sidebar_position: 3
description: Why you may ask for records, which record types you can ask for, and what the patient controls.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_3.md
---

# M3 use cases and meta codes

Every consent request you send carries two sets of codes. One says why you want the records. The other says which records you want. The patient reads both before deciding, so these codes are not bookkeeping. They are the argument you are making to a person. This page lists them, then covers what the patient can do in reply.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 3. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## Who this milestone is for

You need Milestone 3 (M3) of [ABDM](/docs/overview/glossary#abdm) if your system reads health records that another system created. [NHA](/docs/overview/glossary#nha)'s document frames it around one case: a doctor at a hospital wants the patient's history before a consultation. The same mechanics apply to any [HIU](/docs/overview/glossary#hiu).

| Use case | What you ask for | Typical purpose code |
|---|---|---|
| Doctor reviews history before a consultation | Past consultations, prescriptions, reports over a date range | `CAREMGT` |
| Patient asks your app to pull their own records | Whatever the patient selects | `PATRQT` |
| Emergency access when the patient cannot respond | Narrow set, short expiry | `BTG` |
| Claims or payment work | Records supporting the claim | `HPAYMT` |
| Research on a named disease | Records for the study | `DSRCH` |
| Public health reporting | Records for the programme | `PUBHLTH` |

The first row is the one NHA's document describes. The rest pair the remaining codes in the value set with the situation each code names, listed so you can see the range. NHA's document does not describe those cases.

## Purpose of use codes

The purpose of use says why you want the health information. See [purpose of use](/docs/overview/glossary#purpose-of-use) in the glossary. NHA takes a subset of the HL7 v3 PurposeOfUse value set at [terminology.hl7.org](http://terminology.hl7.org/ValueSet/v3-PurposeOfUse).

| Code | Display |
|---|---|
| `CAREMGT` | Care Management |
| `BTG` | Break the Glass |
| `PUBHLTH` | Public Health |
| `HPAYMT` | Healthcare Payment |
| `DSRCH` | Disease Specific Healthcare Research |
| `PATRQT` | Self-Requested |

NHA's table repeats the header row and the `CAREMGT` row a second time. That is a formatting artefact in the source document. There are six codes, not seven.

## Health information type codes

The [HI type](/docs/overview/glossary#hi-type) says what kind of information you are asking for. NHA's document lists the types supported as of writing.

| Code | Display |
|---|---|
| `Prescription` | Prescription |
| `DiagnosticReport` | Diagnostic Report |
| `OPConsultation` | OP Consultation |
| `DischargeSummary` | Discharge Summary |
| `ImmunizationRecord` | Immunization Record |
| `HealthDocumentRecord` | Record artifact |
| `WellnessRecord` | Wellness Record |

Ask for the types you will actually show. A request for everything is easier to write and easier for a patient to refuse.

## What the patient controls

The patient holds the decision, and holds it after the fact as well. NHA's document is explicit about three rights.

| Right | What it means for your system |
|---|---|
| Grant | The patient approves, and sets an expiry date and time. You get one [consent artefact](/docs/overview/glossary#consent-artefact) id per record holder. |
| Deny | The patient refuses. You get a denial status and nothing else. There is no partial result to fall back on. |
| Revoke | The patient withdraws a consent they already granted, at any time. Access ends from that point. |

Two things follow for your build.

- Expiry is a real deadline. Fetch inside it, or ask again.
- Revocation can arrive after you have already read the data. Treat a revoked consent as a stop signal for further fetches, and follow your own retention policy for what you already hold.

## What the doctor gets

Once consent is granted, the doctor's console can read the patient's records and documents. NHA's document names the reason for the access in two lines: it helps the doctor understand the patient's medical history, and it helps them make better decisions on diagnosis and treatment.

Before consent, the console shows nothing. There is no preview state in M3.

## Where the payloads are

NHA's document shows every request and response as a screenshot, so no field lists converted to text. The endpoint paths did convert, and they are on the [API sequence](/docs/api/hie-cm/m3/api-sequence) page. For fields, use the [M3 API reference](/reference/hiecm-m3).
