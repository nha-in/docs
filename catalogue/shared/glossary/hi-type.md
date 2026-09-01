---
id: shared.glossary.hi-type
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HI type, the kind of health information
summary: >
  The category of record being asked for or sent, such as a
  prescription or a diagnostic report.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
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

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can name the HI type your system produces and the one a consent asks for.

## When it goes wrong

Sending a record whose HI type the consent did not cover. The consent
names the types it permits, and anything outside them is not yours to
send.
