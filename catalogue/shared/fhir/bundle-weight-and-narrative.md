---
id: shared.fhir.bundle-weight-and-narrative
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: Bundles are mostly somebody's health record, and they carry a narrative
summary: >
  Almost every byte of a document bundle is the patient's attachment, which
  decides how you store and log it, and every resource carries a human readable
  narrative that nothing fails without.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/Bundle-HealthDocumentRecord-example-01.html
    status: read-from-package-2026-09-20
    note: >
      Measured from the pinned NRCeS package, ABDM Implementation Guide 6.5.0.
      The example is 424,972 bytes, of which 417,032 are one base64
      attachment, so 98.1 per cent of the bundle is the document itself. All
      four entries carry text.div, the bundle carries a confidentiality
      security tag of V, and Bundle.identifier.system names the facility as
      http://hip.in.
related:
  fhir:
    - shared.fhir.document-bundle
    - shared.fhir.profile-and-example-together
    - shared.fhir.conditional-cardinality
---

# Bundles are mostly somebody's health record, and they carry a narrative

## In plain words

A document bundle is not a small JSON object with a file attached. It is a file
with a small JSON object wrapped around it. NRCeS's own HealthDocumentRecord
example runs to 424,972 bytes and 417,032 of those are a single base64
attachment, so 98 per cent of what you are handling is the patient's document.

Everything awkward about storing, listing and logging these bundles follows
from that one number.

The second half of this atom is the part that is easy to skip, because nothing
fails without it: every resource carries a human readable narrative.

## Before you start

- A bundle you can generate, from [DocumentBundle](document-bundle.md).
- Somewhere to store bundles that is not the same document as the list of them.

## What happens

**Do not put bundles in an index or a list document.** Store each one
separately and read it only when it is needed. An index rewritten on every
upload becomes unusable at a few dozen records.

**Never log the attachment.** It is a patient's record. It belongs in the
bundle and in the encrypted payload built from it, and nowhere else. A log line
that truncates it is still a log line containing part of it.

**Show a hash and a size instead**, so a file is identifiable in a list without
keeping a second copy of it.

Then the narrative. Every NRCeS example carries `text.div` on the Composition
and on each resource inside it. Skip it and the bundle still validates, and it
renders as machine output in a viewer built for people. Generate a plain
sentence naming what the document is and who it belongs to, and escape it,
because the inputs are a patient's name and a document title.

Two smaller conventions from the same examples, worth copying rather than
inventing:

| Convention | Value in the examples |
|---|---|
| `Bundle.meta.security` | confidentiality code `V`, very restricted |
| `Bundle.identifier.system` | the facility that minted the identifier |

Write the title for the patient. They read it in their own application months
later, not the receptionist filing it today.

## How you know it worked

Measure a generated bundle and the attachment inside it. The attachment is the
overwhelming majority of the bytes, which tells you the storage decision above
is the one that matters.

Open a generated bundle in a FHIR viewer built for people. Each resource shows
a readable sentence rather than a field dump.

Search your logs for a long base64 run. There is none.

## When it goes wrong

- **A list of records takes seconds to open.** Bundles are being held inside
  the list rather than stored separately.
- **A patient's document appears in a log or an error report.** The attachment
  was logged, which is a disclosure rather than a performance problem.
- **A viewer shows the record as raw fields.** No `text.div` was generated.
  Nothing failed, which is why it was missed.
- **A narrative renders as markup.** The patient's name or the document title
  was interpolated without escaping.
