---
id: shared.fhir.document-bundles
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: FHIR document bundles, the seven ABDM record types
summary: >
  Every ABDM health record travels as one FHIR document Bundle: a
  Composition first, seven possible NRCES profiles, and a two tier
  validation story. This atom is the map of the whole thing.
sources:
  - file: catalogue/openapi/.raw/nrces-ndhm.in-6.5.0.tgz
    hash: sha256:41fa99955adbd1983a235d7c7136b30f423ce34ff541d86b354d95b7704527d4
    fetched: 2026-08-31
    note: >
      The pinned NRCES/NDHM FHIR R4 implementation guide package,
      ndhm.in 6.5.0 against FHIR 4.0.1. catalogue/openapi/nrces/PINNED
      records the pin, and the seven record profiles plus the
      DocumentBundle envelope profile come from its StructureDefinitions
      and digests.json.
  - url: https://nrces.in/ndhm/fhir/r4/package.tgz
    fetched: 2026-08-31
    status: reference
    note: >
      NRCeS's own download for the package above. The pinned tgz under
      .raw/ is what the catalogue and the validator actually read; this
      URL is recorded so the pin can be renewed deliberately.
verified:
  status: unverified
related:
  fhir: [shared.fhir.hl7-validator-recipe, shared.fhir.map-opconsultation, shared.fhir.map-prescription, shared.fhir.map-diagnosticreport]
  glossary: [shared.glossary.fhir, shared.glossary.nrces, shared.glossary.abdm, shared.glossary.hiu, shared.glossary.hip]
---

# FHIR document bundles, the seven ABDM record types

## In plain words

A [FHIR](../glossary/fhir.md) document bundle is how a health record
actually travels through [ABDM](../glossary/abdm.md). It is one JSON
payload: `resourceType: Bundle`, `type: document`, and a `Composition`
resource as the very first entry. The Composition is the index: it
says what the document is, who it is about, who wrote it, and which of
the bundle's other resources belong to which section. Everything ABDM
calls a "record", a consultation note, a lab report, a prescription, is
one of these bundles, shaped by one of seven [NRCES](../glossary/nrces.md)
profiles.

## Before you start

Nothing beyond two terms: what FHIR is ([shared.glossary.fhir](../glossary/fhir.md))
and who publishes the Indian profiles a bundle must satisfy
([shared.glossary.nrces](../glossary/nrces.md)).

## What happens

The seven record types, and the NRCES profile each one's Composition
must declare in `Composition.meta.profile`:

| ABDM record type (hiType) | NRCES profile | What it captures |
|---|---|---|
| OPConsultation | OPConsultRecord | An outpatient consultation note: exam, procedures, medication and advice from a single visit. |
| Prescription | PrescriptionRecord | Medication advice to the patient, in the Pharmacy Council of India's format. |
| DiagnosticReport | DiagnosticReportRecord | Radiology and laboratory diagnostic reports. |
| DischargeSummary | DischargeSummaryRecord | The discharge summary record for the ABDM HDE data set. |
| ImmunizationRecord | ImmunizationRecord | Immunization records, plus supporting documents such as a vaccine certificate. |
| HealthDocumentRecord | HealthDocumentRecord | Unstructured historical records, typically uploaded by a patient through the Health Locker. |
| WellnessRecord | WellnessRecord | Regular wellness data from a PHR app: vitals, physical exam, general and women's wellness. |

`hiType` is the wire name used across the M2 and M3 APIs (`hiTypes` in
the M3 request, `hiType` on M2's care context entries). It is also the
name `validate_fhir`'s `record_type` parameter and this catalogue's
`fhir.RecordTypes` table use, so the same seven strings appear
everywhere: in the request bodies, in the validator, and in the table
above.

All seven ride on top of one shared envelope profile, `DocumentBundle`,
which is not itself a record type. It fixes `Bundle.type` to
`"document"` and requires `Bundle.meta`, `Bundle.meta.versionId`,
`Bundle.identifier` (with `.system` and `.value`), and
`Bundle.timestamp`. A bundle that gets the envelope right but declares
the wrong (or no) record profile on its Composition is still rejected;
the envelope and the record profile are two separate checks.

Getting the bundle from your system to the [HIU](../glossary/hiu.md) is
the M2/M3 data push: the [HIP](../glossary/hip.md) builds the bundle,
encrypts it (ECDH, Curve25519, using a shared secret derived from the
HIU's public key), and pushes the encrypted, base64 content to the
HIU's `dataPushUrl`. `hiType` travels alongside so the receiving side
knows which of the seven profiles to expect on each Composition it
decrypts.

Validation is two tier:

1. **Tier 1, structural, run via `validate_fhir`.** Fast, no external
   dependency, checks the document-bundle envelope, references,
   attachments, and a subset of each record profile's required
   elements. Not a certification.
2. **Tier 2, full conformance, the official HL7 validator.** Checks
   everything tier 1 does not: nested cardinalities, terminology
   bindings, and slice discriminators. shared.fhir.hl7-validator-recipe
   is the runnable recipe.

## How you know it worked

You can name the seven record types and their profiles without looking
them up, and you can say why the Composition has to be the bundle's
first entry (it is the document's index; nothing downstream knows what
a bare bag of resources means without it).

## When it goes wrong

Building a bundle against generic FHIR R4 and never setting
`Composition.meta.profile` to one of the seven NRCES record profile
URLs. It parses, and `validate_fhir` and the tier 2 validator both
reject it: tier 1's `checkEnvelope` and `checkCompositionProfile`
report exactly this, naming the profile the Composition should have
declared, and the fix is one line, setting `meta.profile`.

Picking the wrong `hiType` for the content you built is the second
common mistake: the envelope and structure can be perfect for, say,
PrescriptionRecord, while `hiType` on the push says `OPConsultation`.
`validate_fhir` catches this too, when `record_type` is passed, because
`hiType` is checked against the Composition's actual profile.
