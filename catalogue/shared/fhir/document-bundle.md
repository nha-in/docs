---
id: shared.fhir.document-bundle
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
title: DocumentBundle, the envelope every health record travels in
summary: >
  The FHIR R4 bundle ABDM wraps records in, profiled by NRCeS, with a
  Composition naming the record type and a SNOMED CT code deciding what
  it is.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/index.html
    status: docs-only
    note: >
      The NDHM FHIR Implementation Guide, which defines DocumentBundle
      and one Composition profile per health information type.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/faq
    status: docs-only
    note: >
      NHA's sandbox FAQ, which points integrators at NRCeS for formats
      and samples rather than publishing its own.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.fhir, shared.glossary.hi-type, shared.glossary.nrces]
---

# DocumentBundle, the envelope every health record travels in

## In plain words

Every record ABDM moves is a FHIR R4 Bundle, profiled for India by
NRCeS. The profile is DocumentBundle, and NRCeS describes it as setting
the minimum expectations for a bundle that carries all its resources in
a single instance. NHA's own packaging page calls it the main envelope.

Inside it, a Composition says what the document is. Everything else, the
Patient, the Practitioner, the Observations, hangs off that.

## Before you start

Decide which health information type you are sending, because the type
picks the Composition profile and the SNOMED CT code that goes with it.

## What happens

NRCeS defines one Composition profile per type: PrescriptionRecord,
DiagnosticReportRecord, OPConsultRecord, DischargeSummaryRecord,
ImmunizationRecord, WellnessRecord, HealthDocumentRecord, and
InvoiceRecord for billing.

Two levels of conformance are allowed. A simple bundle wraps a PDF or an
image as an attachment, which is where most integrators start. A
structured bundle carries coded clinical resources, and NHA's stated
expectation is that integrators move to it within a couple of years of
becoming compliant.

The core resource profiles NRCeS publishes cover the material a real
record needs: Patient, Practitioner, PractitionerRole, Organization,
Encounter, Condition, Procedure, Medication, MedicationRequest,
MedicationStatement, AllergyIntolerance, Immunization, CarePlan,
ServiceRequest, Specimen, ImagingStudy, the two DiagnosticReport variants
for lab and imaging, and Observation in six flavours including vital
signs and body measurement.

NHA does not publish bundle samples of its own. When integrators ask, it
points at the NRCeS guide, at the HL7 pages for Bundle and Attachment,
and at a recorded workshop.

Validate before you send. The NRCeS profile is the specification a
rejection was measured against, and the FHIR validator run locally is far
cheaper than reading an error afterwards.

## How you know it worked

A bundle validates against the NRCeS profile rather than base FHIR, and
the receiving system identifies its type from the Composition code
without being told separately.

## When it goes wrong

Validating against base FHIR R4. A bundle can pass that and still be
rejected, because the Indian profiles constrain more than the base
standard does.

Sending several bundles that share an identifier. Only one then shows in
the patient's app, and the others appear to have vanished.

Serialising the bundle carelessly before encrypting it. The bundle is
stringified and then encrypted, and a serialisation that reorders or
reformats produces something the receiver cannot parse.
