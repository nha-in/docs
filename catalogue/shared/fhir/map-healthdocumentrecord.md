---
id: shared.fhir.map-healthdocumentrecord
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: HealthDocumentRecord, the unstructured health document record
summary: >
  Stub. NRCES defines no Composition section slices for this record
  type; only Composition.section.entry is constrained. Hand-written
  mapping guidance has not been authored yet.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM package. digests.json's HealthDocumentRecord
      digest carries an empty Sections list; stated here as-is, not
      invented.
verified:
  status: draft
related:
  fhir: [shared.fhir.document-bundles]
  glossary: [shared.glossary.nrces]
---

# HealthDocumentRecord, the unstructured health document record

## In plain words

HealthDocumentRecord carries unstructured historical health records,
typically one or more documents a patient uploads through the Health
Locker. [NRCES](../glossary/nrces.md) calls it `HealthDocumentRecord`.

## Before you start

Not yet authored. Read shared.fhir.document-bundles for the shared
document-bundle envelope every record type rides in.

## What happens

digests.json's HealthDocumentRecord digest has an empty `sections`
list: **NRCES does not slice `Composition.section` for this record
type.** What is constrained is `Composition.section` itself (required,
exactly one) and `Composition.section.entry` (required, at least one,
any number).

Nothing further is authored here yet: which resource type(s) the
section's entries hold, and what integrator-side data maps to them.

## How you know it worked

Tier 1 structural validation (`validate_fhir` with `record_type:
"HealthDocumentRecord"`) covers the shared document-bundle envelope and
the Composition's top-level required fields for this type today. Full
mapping guidance for this record type has not been authored yet.

## When it goes wrong

Not yet authored beyond what tier 1 reports directly: run
`validate_fhir` and read its findings, each with a location and a fix.
