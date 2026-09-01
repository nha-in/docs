---
id: shared.fhir.map-diagnosticreport
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Mapping DiagnosticReport, the lab and radiology report record
summary: >
  How a lab or radiology report becomes a DiagnosticReportRecord
  bundle. NRCES does not slice this record type's sections; this atom
  maps the Composition's required elements and its single section's
  entry resources instead.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package. digests.json's DiagnosticReportRecord
      digest carries an empty Sections list (no section slices, only a
      required `Composition.section.entry`, max 2); the two entry
      resource types come from
      StructureDefinition-DiagnosticReportRecord.json's
      `Composition.section.entry:DiagnosticReport` and
      `Composition.section.entry:DocumentReference` slices; the example
      resource mix comes from the IG's own
      Bundle-DiagnosticReport-Imaging-DCM-example-01.json.
verified:
  status: unverified
related:
  fhir: [shared.fhir.document-bundles, shared.fhir.hl7-validator-recipe]
  glossary: [shared.glossary.nrces]
---

# Mapping DiagnosticReport, the lab and radiology report record

## In plain words

DiagnosticReport carries a diagnostic report, radiology or laboratory,
that can be shared across the health ecosystem.
[NRCES](../glossary/nrces.md) calls it `DiagnosticReportRecord`.

## Before you start

- **Patient identity.** A `Patient` resource (or a resolvable
  reference) for `Composition.subject`.
- **Practitioner identity.** A `Practitioner` resource for
  `Composition.author`. As with Prescription, `Composition.encounter`
  is not required here.
- **The clinical content: the report itself.** A structured
  `DiagnosticReport` resource (lab or imaging), a document copy of the
  report, or both.

## What happens

The Composition itself must carry `status`, `type` (with `.coding`),
`subject` (with `.reference`), `date`, `author` (with `.reference`),
`title`, `attester.mode`, and `relatesTo.code` and `.target[x]`.

**NRCES does not slice Composition.section for this record type.**
digests.json's DiagnosticReportRecord digest has an empty `sections`
list; there is one unnamed section (`Composition.section`, required,
exactly one), and what is actually constrained is
`Composition.section.entry`, required with at least one and at most two
entries:

| Composition element | What fills it | Where it comes from in your system |
|---|---|---|
| `Composition.section` (single, unnamed) | one `DiagnosticReport` entry, one `DocumentReference` entry, or both | the section carries the structured report and, optionally, the attached report file |
| `Composition.section.entry` → `DiagnosticReport` | the structured report, profiled as either `DiagnosticReportLab` or `DiagnosticReportImaging` | your lab or radiology system's report record |
| `Composition.section.entry` → `DocumentReference` | the report file, such as a PDF or an imaging study reference | the report document your system generated or received |

NRCES's own DiagnosticReport imaging example
(`Bundle-DiagnosticReport-Imaging-DCM-example-01.json`) carries exactly
this shape: one `DiagnosticReport` entry and one `DocumentReference`
entry in the section, alongside the `ImagingStudy` and `Media`
resources the `DiagnosticReport` itself references (not the
Composition's section entries directly).

## How you know it worked

Run `validate_fhir` with `record_type: "DiagnosticReport"` against your
bundle and confirm zero findings. That is necessary, not sufficient:
tier 1 checks that `Composition.section` is present, but which of
`DiagnosticReport` or `DocumentReference` (or both) fills it, and
whether the `DiagnosticReport` itself conforms to
`DiagnosticReportLab`/`DiagnosticReportImaging`, are tier 2 concerns.
Then run shared.fhir.hl7-validator-recipe's HL7 validator against the
same bundle with `-ig ndhm.in#6.5.0` and confirm exit code 0
with no errors.

## When it goes wrong

- **`Composition.meta.profile` missing or wrong.** `validate_fhir`
  reports a `Composition.meta.profile does not include ...` finding,
  whose fix names the exact DiagnosticReportRecord URL to add.
- **`Composition.author` missing.** The fix is the same as
  Prescription's: add a `Practitioner` reference to
  `Composition.author`; it is easy to drop when adapting a template
  from a record type that requires `encounter` instead.
- **A dangling reference from the section's `DiagnosticReport` entry
  to a resource the report itself points at.** NRCES's own imaging
  example has `DiagnosticReport.imagingStudy` and
  `DiagnosticReport.media` referencing separate `ImagingStudy` and
  `Media` bundle entries; the same shape applies to a lab report's
  result observations. Leave one of those referenced resources out of
  the bundle and `validate_fhir`'s reference check reports the exact
  reference string that does not resolve, with the fix: add the
  missing resource as a bundle entry, or remove the stale reference.
