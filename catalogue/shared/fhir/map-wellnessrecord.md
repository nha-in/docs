---
id: shared.fhir.map-wellnessrecord
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: WellnessRecord, the PHR wellness record
summary: >
  Stub. The Composition section list NRCES defines for this record
  type, from digests.json. Hand-written mapping guidance has not been
  authored yet.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package. The section list below is
      digests.json's WellnessRecord digest, verbatim.
verified:
  status: draft
related:
  fhir: [shared.fhir.document-bundles]
  glossary: [shared.glossary.nrces]
---

# WellnessRecord, the PHR wellness record

## In plain words

WellnessRecord carries regular wellness data, typically entered through
a Patient Health Record app: vitals, physical examination, general and
women's wellness. [NRCES](../glossary/nrces.md) calls it
`WellnessRecord`.

## Before you start

Not yet authored. Read shared.fhir.document-bundles for the shared
document-bundle envelope every record type rides in.

## What happens

digests.json's WellnessRecord digest lists these eight
`Composition.section` slices, every one optional (`min: 0`,
`max: "1"`):

- VitalSigns
- BodyMeasurement
- PhysicalActivity
- GeneralAssessment
- WomenHealth
- Lifestyle
- OtherObservations
- DocumentReference

Nothing further is authored here yet: which resource type fills each
slice, and what integrator-side data maps to it.

## How you know it worked

Tier 1 structural validation (`validate_fhir` with `record_type:
"WellnessRecord"`) covers the shared document-bundle envelope and the
Composition's top-level required fields for this type today. Full
mapping guidance for this record type has not been authored yet.

## When it goes wrong

Not yet authored beyond what tier 1 reports directly: run
`validate_fhir` and read its findings, each with a location and a fix.
