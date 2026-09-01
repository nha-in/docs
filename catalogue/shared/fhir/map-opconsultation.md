---
id: shared.fhir.map-opconsultation
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Mapping OPConsultation, the outpatient consultation note
summary: >
  How an outpatient visit becomes an OPConsultRecord bundle: which
  Composition sections NRCES defines, what resource type fills each
  one, and the findings integrators hit first.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package. The section list and its required
      elements come from digests.json's OPConsultation digest; the
      per-section resource types come from
      StructureDefinition-OPConsultRecord.json's slicing (each
      `Composition.section:<Slice>.entry`'s `targetProfile`); the
      example section-to-resource mapping comes from the IG's own
      Bundle-OPConsultNote-example-05.json.
verified:
  status: unverified
related:
  fhir: [shared.fhir.document-bundles, shared.fhir.hl7-validator-recipe]
  glossary: [shared.glossary.nrces]
---

# Mapping OPConsultation, the outpatient consultation note

## In plain words

OPConsultation captures one outpatient visit: the complaint the patient
came in with, what the practitioner found and did, and what they
prescribed or advised next. It is the record
[NRCES](../glossary/nrces.md) calls `OPConsultRecord`.

## Before you start

- **Patient identity.** A `Patient` resource (or a resolvable reference
  to one) for `Composition.subject`.
- **Practitioner identity.** A `Practitioner` resource for
  `Composition.author`, and an `Encounter` resource for
  `Composition.encounter`: OPConsultation is the one record type in
  this catalogue's deep atoms where `Composition.encounter` is
  required, not optional.
- **The clinical content of the visit.** Whatever your system captured
  during the encounter: the presenting complaint, exam findings,
  medications, procedures, and any follow-up. None of the individual
  section slices below are themselves required (each has `min: 0`), but
  `Composition.section` as a whole must be non-empty.

## What happens

The Composition itself must carry `status`, `type` (with `.coding`),
`subject` (with `.reference`), `encounter`, `date`, `author` (with
`.reference`), `title`, `attester.mode`, and `relatesTo.code` and
`.target[x]`.

Twelve section slices are defined, every one optional on its own
(`min: 0`); NRCES's own OPConsultNote example
(`Bundle-OPConsultNote-example-05.json`) uses eight of them:

| Section slice | Resource type NRCES expects | Where it comes from in your system |
|---|---|---|
| ChiefComplaints | `Condition` | The complaint the patient presented with |
| PhysicalExamination | `Observation` | Examination findings recorded during the visit |
| Allergies | `AllergyIntolerance` | The patient's known allergy list |
| MedicalHistory | `Condition` or `Procedure` | Past conditions or procedures relevant to this visit |
| FamilyHistory | `FamilyMemberHistory` | Family history captured at intake |
| InvestigationAdvice | `ServiceRequest` | Tests or investigations ordered at this visit |
| Medications | `MedicationStatement` or `MedicationRequest` | Current medications, and any new prescription issued |
| FollowUp | `Appointment` | The next appointment, if one was scheduled |
| Procedure | `Procedure` | Procedures performed during the visit |
| Referral | `ServiceRequest` | A referral to another provider or facility |
| OtherObservations | `Observation` | Any other clinical observation not covered by a more specific section |
| DocumentReference | `DocumentReference` | An attached document, such as a scanned note or image |

The resource type per slice above comes from the profile's own slicing
(each slice's `entry` element fixes a `targetProfile`); the example
bundle populates the first eight of these twelve and leaves
PhysicalExamination, FamilyHistory, Referral and OtherObservations out
entirely, which the profile allows since every slice is optional.

## How you know it worked

Run `validate_fhir` with `record_type: "OPConsultation"` against your
bundle and confirm zero findings. That is necessary, not sufficient:
tier 1 only checks the top-level Composition fields listed above (it
does not check nested paths like `subject.reference` or
`relatesTo.code`, and none of the twelve section slices are individually
enforced since all are `min: 0`). Then run
shared.fhir.hl7-validator-recipe's HL7 validator against the same
bundle with `-ig ndhm.in#6.5.0` and confirm exit code 0 with no
errors; that is the check that covers the nested fields and the slice
discriminators tier 1 does not.

## When it goes wrong

- **`Composition.meta.profile` missing or wrong.** `validate_fhir`
  reports a `Composition.meta.profile does not include ...` finding
  (from `checkEnvelope` when `record_type` is passed, from
  `checkCompositionProfile` regardless), whose fix names the exact
  OPConsultRecord URL to add to `meta.profile`. This is the single most
  common first finding, since it is easy to build a structurally
  correct bundle and forget to declare the profile.
- **`Composition.encounter` missing.** OPConsultation is the record
  type that requires it; a bundle copied from a Prescription or
  DiagnosticReport template (neither of which requires `encounter`)
  will fail this the first time it is run through `validate_fhir`. The
  fix is to add the `Encounter` reference to the Composition.
  `Composition.author` missing is the same class of mistake, for the
  same reason.
- **A dangling reference from a section entry.** A section (commonly
  Medications or DocumentReference) references a resource that is not
  present as its own bundle entry, for example a `MedicationRequest`
  built against a `Practitioner` id that was never added to the
  bundle. `validate_fhir`'s reference check reports the exact reference
  string and the fix: add the missing resource as an entry, or remove
  the stale reference.
