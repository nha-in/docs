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
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
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
verified:
  status: unverified
  against: docs-only
related:
  concepts: []
  glossary: [shared.glossary.fhir, shared.glossary.snomed-ct,
             shared.glossary.consent-artefact]
---

# HI type, the kind of health information

## In plain words

Health Information type: the kind of record being asked for or shared,
used in consent requests and in data requests. NHA's M3 document lists
seven values: `Prescription`, `DiagnosticReport`, `OPConsultation`,
`DischargeSummary`, `ImmunizationRecord`, `HealthDocumentRecord` and
`WellnessRecord`. The M2 error message for an invalid HI type also lists
`Invoice`.

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

NHA states that implementing all of the types is mandatory. Integrators
regularly build the two or three their product happens to generate and
meet that rule at certification rather than at design time.

## How you know it worked

You have understood this when you can name the HI type your system produces and the one a consent asks for.

## When it goes wrong

Sending a record whose HI type the consent did not cover. The consent
names the types it permits, and anything outside them is not yours to
send.

Matching on the display string rather than the code. Two entries are
traps: `HealthDocumentRecord` displays as "Record artifact", which is not
its name, and `WellnessRecord` has no code at all and has to match on
exact text.
