---
id: shared.glossary.hi-type
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HI type, the kind of health information
summary: >
  The category of record being asked for or sent, such as a
  prescription or a diagnostic report. A SNOMED CT code decides which,
  and NHA requires all of them to be implemented.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_hiecm.mdx
    status: reference
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's M2 Health Record Formats and Packaging Health Data pages,
      which carry the SNOMED codes and the statement that implementing
      all types is mandatory.
  - url: https://nrces.in/ndhm/fhir/r4/index.html
    status: docs-only
    note: The NRCeS guide, which defines one composition profile per type.
  - file: site/docs/hiecm/v3/concepts/fhir.md
    status: reference
    note: >
      The published FHIR page: eight record types, Invoice included, and
      that implementing all of them is mandatory for an HMIS.
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    status: read-from-spec-2026-09-23
    note: The hiType enum on M2 and M3 requests carries eight values, Invoice included.
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    status: reference
    note: >
      StructureDefinition-InvoiceRecord fixes Composition.type.text to
      "Invoice Record" and carries no code.
related:
  glossary: [shared.glossary.snomed-ct]
---

# HI type, the kind of health information

## In plain words

Health Information type: the kind of record being asked for or shared,
used in consent requests and in data requests. There are eight values:
`Prescription`, `DiagnosticReport`, `OPConsultation`, `DischargeSummary`,
`ImmunizationRecord`, `HealthDocumentRecord`, `WellnessRecord` and
`Invoice`. The first seven are clinical. `Invoice` is billing, and its
record profile is `InvoiceRecord`.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Each type carries a SNOMED CT code, and the code is what decides the
type inside a bundle:

| Type | SNOMED CT |
|---|---|
| Prescription | 440545006 |
| DiagnosticReport | 721981007 |
| OPConsultation | 371530004 |
| DischargeSummary | 373942005 |
| ImmunizationRecord | 41000179103 |
| HealthDocumentRecord | 419891008 |
| WellnessRecord | no code, matched on the exact text |
| Invoice | no code, matched on the exact text `Invoice Record` |

Implementing all eight types is mandatory for an HMIS. Integrators
regularly build the two or three their product happens to generate and
meet that rule at certification rather than at design time.

## How you know it worked

You have understood this when you can name the HI type your system produces and the one a consent asks for.

## When it goes wrong

Sending a record whose HI type the consent did not cover. The consent
names the types it permits, and anything outside them is not yours to
send.

Matching on the display string rather than the code. Three entries are
traps: `HealthDocumentRecord` displays as "Record artifact", which is not
its name, and `WellnessRecord` and `Invoice` have no code at all and have
to match on exact text.
