---
title: Claim request
sidebar_label: Claim request
description: The same Claim as the preauthorisation with use switched, carrying the finalised dates, the bill and the full document set.
verification: unverified
source: "Sample FHIR bundles, `claim/claim_Request.txt` and `preauth/preauth_request.txt`; NHCX FAQs v1.2, cyclic treatment and newborn sections; NHCX Integration Handbook §9.4; NHCX-PMJAY-HMIS Integration Guide §8.4; NRCeS profiles at `https://nrces.in/ndhm/fhir/r4/`"
sidebar_position: 12
---

# Claim request

The claim is the provider's request for payment once treatment has happened. It is the same `Claim` resource as the preauthorisation with `use` switched from `preauthorization` to `claim`, carrying the finalised dates, the finalised bill and the full document set. It travels on `/v1/claim/submit` and is answered on `/v1/claim/on_submit`. This chapter describes the provider-to-payer direction only; the payer's answer is chapter 11.

## In short

- The same `Claim` as the preauthorisation with `use` switched to `claim`.
- It carries the finalised dates, the finalised bill and the full document set.
- `ADDD` is used as the code for three different dates. The category, not the code, distinguishes them.
- The one published sample is unrepresentative in four ways, including having no `preAuthRef` at all.

## The bundle

`claim_Request.txt` carries 44 entries in this order. The first six are the claim proper. Entries 7 to 18 are one embedded billing document. Entries 19 to 43 are one embedded observation document. The `Procedure` sits last, after both embedded documents, which is unexpected but valid in a `collection`.

| Entry | Resource | Profile | What it is for |
| :---- | :---- | :---- | :---- |
| 1 | `Claim` | `Claim` | The request itself |
| 2 | `Patient` | `Patient` | The beneficiary, by PMJAY ID |
| 3 | `Organization` | `Organization` | The hospital, type `prov` |
| 4 | `Organization` | `Organization` | The payer, type `pay` |
| 5 | `Coverage` | `Coverage` | The policy |
| 6 | `Practitioner` | `Practitioner` | The care team member |
| 7 | `Composition` | `InvoiceRecord` | Root of the embedded billing document |
| 8 to 12 | `Organization`, `Practitioner`, `Encounter`, `Appointment`, `Patient` | various | Context for that document, duplicated inside it |
| 13, 15, 16 | `ChargeItem` | `ChargeItem` | Billed lines |
| 14 | `Medication` | `Medication` | A billed drug |
| 17 | `Invoice` | `Invoice` | Price components per line |
| 18 | `DocumentReference` | `DocumentReference` | The scanned bill, PDF |
| 19 | `Composition` | `WellnessRecord` | Root of the embedded observation document |
| 20 to 24 | `Organization`, `Practitioner`, `Encounter`, `Appointment`, `Patient` | various | Context for that document |
| 25 to 42 | `Observation` × 18 | `Observation` | Body measurement, activity, assessment, lifestyle |
| 43 | `DocumentReference` | `DocumentReference` | Surgical pathology report, PDF |
| 44 | `Procedure` | `Procedure` | The procedure the item pays for |

The two embedded documents are self-contained. Each repeats its own `Patient`, `Organization` and `Practitioner` rather than referencing the ones at the top of the bundle, and each is reached from the `Claim` by a supporting-info entry pointing at its `Composition`.

## The claim

| Path | Sample value |
| :---- | :---- |
| `identifier[0].type.coding.code` | `CLN`, from `.../ndhm-identifier-type-code` |
| `identifier[0].system` | `https://hcx.pmjay.gov.in/v1/preauthorization`, unchanged at the claim stage |
| `identifier[0].value` | `EO26AA2700001`, the claim number, also the `Bundle.identifier` |
| `status` | `active` |
| `type.coding` | `737481003` "Inpatient care management (procedure)" |
| `use` | `claim` |
| `billablePeriod.start`, `.end` | `2026-02-27T08:40:02+05:30`, `2026-03-02T00:00:00+05:30` |
| `created` | `2026-02-27T08:40:02+05:30` |
| `priority.coding.code` | `normal`, from `http://terminology.hl7.org/CodeSystem/processpriority` |
| `insurance[0].focal` | `true` |
| `total.value` | `3300` |

`billablePeriod` is the field the preauthorisation does not have. `preauth_request.txt` omits it entirely; the claim adds it, with `start` set to the moment of submission rather than to the admission date. Take the admission date from supporting information, not from `billablePeriod.start`.

`Claim.type` binds `737481003` to `https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-claim-type`, a ValueSet URL used where a CodeSystem URL belongs. Every sample does this. Send it as the samples send it.

The single item names its package as `MG004B` "Dengue hemorrhagic fever" under `http://snomed.info/sct`, while the `Procedure` resource in the same bundle names the same code under `https://payer.pmjay.nha.gov.in`. One code, two systems, one bundle. The eligibility request binds package codes to the payer system as well. The rule the samples actually follow is: `Claim.item.productOrService` uses SNOMED, everything else uses the payer system, and neither code is a real SNOMED concept.

`item[0].factor` is `0.5` while `unitPrice` and `net` are both `3300` and `total` is `3300`. The factor is carried but not applied. The payer's response reports `total[submitted]` as `2700`, which matches neither. Neither `unitPrice`, `net` nor `total` carries a `currency`.

## Supporting information

Nine entries. Four carry claim-stage documents, five carry dates and the discharge status.

**Read this table as a requirement, not as a description of one sample.** A claim is refused without the discharge status and the discharge date. They are what tells the payer the episode has ended, and when. The gateway checks for them before the payer ever sees the bundle. The minimum a claim carries, over and above what the preauthorisation already carried, is:

- **the discharge status**, category `DIS`, saying how the patient left,
- **the discharge date**, category `DSCHD`,
- **the admission date**, category `ADMD`,
- **the bill and the discharge summary**, as documents.

A preauthorisation carries none of these, which is the single biggest difference between the two bundles and the easiest thing to miss when the same builder code produces both.

| Sequence | Category | Code | Meaning | Value |
| :---- | :---- | :---- | :---- | :---- |
| 1 | `INV` | `MAND0062` | Detailed ICPs | Inline attachment, `application/pdf` |
| 2 | `INV` | `MAND0063` | Treatment details | Inline attachment, `image/jpeg` |
| 23 | `DIS` | `DTH` | Discharge to home | `valueString` "After surgery" |
| 24 | `ADMD` | `ADDD` | Admission date | `valueString` `2026-02-27T00:00:00+00:00` |
| 25 | `SURD` | `ADDD` | Surgery date | `valueString` `2026-03-02T00:00:00+00:00` |
| 26 | `OTH` | `EDT` | Encounter date and time | `valueString` `2026-02-27T08:38:48+00:00` |
| 27 | `DSCHD` | `ADDD` | Discharge date | `valueString` `2026-03-02T00:00:00+00:00` |
| 8 | `INV` | `MAND0064` | All investigations reports | Reference to the billing document's `Composition` |
| 9 | `INV` | `MAND0006` | Detailed discharge summary | Reference to the observation document's `Composition` |

Five things in that table will cost you time.

**The category system is wrong on the four document entries.** They carry `category.coding.system = https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code` with code `INV`. `INV` belongs to the category value set, so the code is right and the system names the wrong value set. The five date entries in the same array use `.../ndhm-supportinginfo-category` correctly. The preauthorisation request and the enhancement request contain only the wrong-system form. Send what the samples send and expect the payer to accept both.

**The sequences are non-monotonic and full of gaps.** The array runs `1, 2, 23, 24, 25, 26, 27, 8, 9`. Sequences 3 to 7 and 10 to 22 do not exist. This is not cosmetic. `Claim.item.informationSequence` links an item to its supporting information by sequence number, so a builder who indexes by array position rather than by the `sequence` field will resolve the wrong document. Build a map from `sequence` to entry and look up through it.

**`ADDD` is used as the code for three different dates and displayed two different ways.** At sequence 24 it is displayed "Admission Date - Discharge Date". At sequences 25 and 27, where it stands for the surgery date and the discharge date, it is displayed "Admission Date". The category, not the code, is what actually distinguishes the three. Read `category.coding.code` and treat `ADDD` as noise.

**Date offsets are mixed inside one resource.** `Claim.created` is `2026-02-27T08:40:02+05:30`. The `EDT` supporting-info string is `2026-02-27T08:38:48+00:00`, the same wall clock with a UTC offset. Interpreted literally the encounter is five and a half hours after the claim was created. The handbook says supporting-info dates are Indian local time. Emit `+05:30` and read incoming `+00:00` values as local.

**Both inline attachments are base64 twice.** Decoding `valueAttachment.data` once yields another base64 string; decoding that yields the PDF and the JPEG. The `DocumentReference` attachments in the same bundle are encoded once. If a payer viewer shows a blank document, this is why.

## Cyclic treatment

Cyclic packages, dialysis and chemotherapy among them, need one supporting-info entry per cycle. The guidance for this exists only in the FAQ document, whose JSON is malformed: a missing quote on the `supportingInfo` key, a trailing comma inside the item, two unclosed braces and two `//` comments. There is no sample bundle for a cyclic claim. The reconstruction below repairs that fragment into well-formed JSON. It is an illustration of the two elements, not a quotable sample.

```json
"item": [
  {
    "id": "item-1",
    "sequence": 1,
    "informationSequence": [1]
  }
],
"supportingInfo": [
  {
    "sequence": 1,
    "category": {
      "coding": [{
        "system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-code",
        "code": "CD",
        "display": "Clinical document"
      }]
    },
    "code": {
      "coding": [{
        "system": "https://payer.pmjay.nha.gov.in",
        "code": "TD",
        "display": "Treatment detail"
      }]
    },
    "timingPeriod": {
      "start": "2026-08-05T13:01:33+05:30",
      "end": "2026-08-05T13:02:41+05:30"
    },
    "valueReference": {
      "reference": "urn:uuid:3f40b4ef-5359-43d3-aa31-c1e54b2d813a"
    }
  }
]
```

The clinical data must be structured FHIR, not a scanned PDF. One supporting-info entry per cycle, its sequence listed in the item's `informationSequence`, its document referenced from `valueReference`. Note that the fragment repeats the same wrong category system as the real samples, `ndhm-supportinginfo-code` carrying the category code `CD`.

`timingPeriod` is the field that decides whether the cycle is paid. The payer validates its start and end against the biometric capture timestamp for that cycle, and a mismatch means the cycle is not treated as genuine. Biometric authentication is a live capture for every cycle with process type `Discharge`; a refresh token is accepted only at the final claim. So `timingPeriod` is not documentation, it is the evidence, and it must be written from the authentication log rather than from the ward's own clock.

## Newborn

A newborn has no policy of their own, so the parent stays the primary `Patient` and the child is a second `Patient` linked from the parent. The FAQ fragment for this is also malformed: the reference value is masked to `urn:uuid:cc81ceb5-2966-****-****`, and the parenthetical gloss sits inside the JSON. Reconstructed, with a complete UUID:

```json
"link": [
  {
    "other": {
      "reference": "urn:uuid:cc81ceb5-2966-4f0a-9f5e-2b7c1d84a310",
      "type": "Patient"
    },
    "type": "refer"
  }
]
```

The child's `Patient` needs gender and date of birth; the name is expected but is not treated as strictly mandatory. Twins are two independent child `Patient` resources and two independent submissions. A proof of date of birth supporting-info entry is mandatory, category `DOB`, code `BCF` for a birth certificate or `DCB` for the government hospital's discharge card where no certificate exists yet. Bill under the parent's name as "Baby of <parent name>" with an attachment justifying it; a bill carrying only the baby's name is likely to be rejected.

## What the sample shows

`claim_Request.txt`, 386,100 bytes, 44 entries, claim number `EO26AA2700001`. It is unrepresentative in four ways. The two embedded documents are a wellness record and an invoice record, neither of which is the discharge summary the supporting-info titles promise. Their `Encounter` resources are `AMB` outpatient visits dated 2026-02-09, three weeks before the admission this claim is for. The package and diagnosis differ from the preauthorisation for the same patient, which the preauthorisation-to-claim workflow does not allow. There is no `preAuthRef` anywhere in the bundle, so nothing links this claim to preauthorisation `VB26AA2600001` except the shared patient. And `Bundle.meta.lastUpdated` is frozen at the template value `2025-11-11T15:09:41.516+05:30` while `Bundle.timestamp` holds the real submission time.
