---
id: shared.fhir.map-prescription
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Mapping Prescription, the medication advice record
summary: >
  How a prescription becomes a PrescriptionRecord bundle. NRCES does
  not slice this record type's sections; this atom maps the
  Composition's required elements and its single section's entry
  resources instead.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package. digests.json's PrescriptionRecord
      digest carries an empty Sections list (no section slices, only a
      required `Composition.section.entry`); the two entry resource
      types come from StructureDefinition-PrescriptionRecord.json's
      `Composition.section.entry:MedicationRequest` and
      `Composition.section.entry:Binary` slices; the example resource
      mix comes from the IG's own Bundle-Prescription-example-06.json.
verified:
  status: unverified
related:
  fhir: [shared.fhir.document-bundles, shared.fhir.hl7-validator-recipe]
  glossary: [shared.glossary.nrces]
---

# Mapping Prescription, the medication advice record

## In plain words

Prescription carries the medication advice given to a patient, in the
Pharmacy Council of India's format. [NRCES](../glossary/nrces.md) calls
it `PrescriptionRecord`.

## Before you start

- **Patient identity.** A `Patient` resource (or a resolvable
  reference) for `Composition.subject`.
- **Practitioner identity.** A `Practitioner` resource for
  `Composition.author`. Unlike OPConsultation, `Composition.encounter`
  is not required here.
- **The clinical content: the medication order(s) themselves.** At
  least one prescribed medication, and optionally a signed or scanned
  copy of the prescription document.

## What happens

The Composition itself must carry `status`, `type` (with `.coding`),
`subject` (with `.reference`), `date`, `author` (with `.reference`),
`title`, `attester.mode`, and `relatesTo.code` and `.target[x]`.

**NRCES does not slice Composition.section for this record type.**
digests.json's PrescriptionRecord digest has an empty `sections` list;
there is one unnamed section (`Composition.section`, required, exactly
one), and what is actually constrained is `Composition.section.entry`,
which is required and must include at least one entry:

| Composition element | What fills it | Where it comes from in your system |
|---|---|---|
| `Composition.section` (single, unnamed) | at least one `MedicationRequest` entry, optionally one `Binary` entry | your prescribing system's order for this visit |
| `Composition.section.entry` → `MedicationRequest` | one entry per prescribed medication (the profile allows any number) | your prescribing system's medication order |
| `Composition.section.entry` → `Binary` | the signed or scanned prescription document, if you attach one | an optional signed copy of the prescription, base64 in `Attachment.data`, on the `Binary` resource |

NRCES's own Prescription example
(`Bundle-Prescription-example-06.json`) carries exactly this shape: two
`MedicationRequest` entries and one `Binary` entry in the section.

## How you know it worked

Run `validate_fhir` with `record_type: "Prescription"` against your
bundle and confirm zero findings. That is necessary, not sufficient:
tier 1 checks that `Composition.section` is present, but the
`MedicationRequest`/`Binary` slicing inside it is a tier 2 concern.
Then run shared.fhir.hl7-validator-recipe's HL7 validator against the
same bundle with `-ig ndhm.in#6.5.0` and confirm exit code 0
with no errors.

## When it goes wrong

- **`Composition.meta.profile` missing or wrong.** `validate_fhir`
  reports a `Composition.meta.profile does not include ...` finding,
  whose fix names the exact PrescriptionRecord URL to add.
- **`Composition.author` missing.** The Composition needs a
  `Practitioner` reference even though `encounter` is not required for
  this record type; a bundle built by copying an OPConsultation
  template sometimes drops author while adjusting for the missing
  encounter. The fix is to add `Composition.author`.
- **The `Binary` attachment's `Attachment.data` or `Attachment.contentType`
  is missing or malformed**, when a signed prescription is attached.
  `validate_fhir`'s attachment check reports `Attachment.data is not
  valid base64` (or not a base64 string at all) and
  `Attachment.contentType is missing` independently, since a bad
  `data` value must not hide a missing `contentType`. The fix is to
  re-encode the file as standard base64 and set `contentType` to its
  MIME type.
