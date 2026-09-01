---
id: shared.glossary.fhir
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: FHIR, Fast Healthcare Interoperability Resources
summary: >
  The standard ABDM uses for the health records themselves, in the R4
  version with India specific profiles.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
verified:
  status: unverified
related:
  concepts: []
  glossary: [shared.glossary.hi-type, shared.glossary.nrces]
---

# FHIR, Fast Healthcare Interoperability Resources

## In plain words

FHIR is the format health records travel in. ABDM uses FHIR R4, with
profiles published and maintained by NRCeS for the Indian context.

Records go one of two ways: a simple bundle wrapping a PDF or image, or
a structured bundle with coded clinical information.

Every bundle is a DocumentBundle, which is the envelope, and the kind of
record it carries is named by a health information type. NHA's list is
Prescription, DiagnosticReport, OPConsultation, DischargeSummary,
ImmunizationRecord, WellnessRecord and HealthDocumentRecord, with
InvoiceRecord for billing. Each carries a SNOMED CT code in the bundle,
so the code decides the type, not the display string.

NHA states that implementing all of the health information types is
mandatory. Integrators regularly build two or three and meet this at
certification rather than at design time.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what FHIR is without using the acronym itself.

## When it goes wrong

Using generic FHIR R4 rather than the NRCeS profiles. A bundle that validates against base FHIR can still be rejected by ABDM.

