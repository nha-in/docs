---
id: nhcx.concept.fhir-in-nhcx
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: FHIR collection bundles and the NHCX claim profiles
summary: >-
  Every claim message carries a collection bundle of health data records built to
  the national claim profiles, with clinical records attached inside it, and it
  must validate before it is sealed.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Data Structure and Bundle types sections.
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Bundle structure section and validation steps.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 1.3 Key Principles; identifier types table.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.5.0 Structured Data Exchange; page 31 file limits.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, attachment and HFR rows.
verified:
  status: unverified
related:
  fhir:
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.preauth-request
  - nhcx.fhir.preauth-response
  - nhcx.fhir.preauth-enhancement
  - nhcx.fhir.preauth-cancel
  - nhcx.fhir.query-update
  - nhcx.fhir.claim-request
  - nhcx.fhir.claim-response
  - nhcx.fhir.payment-notice
  - nhcx.fhir.task
  - nhcx.fhir.terminologies
  - nhcx.fhir.validation
  - shared.fhir.hl7-validator-recipe
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.claim-cycle
  - nhcx.concept.insurance-plan
  - nhcx.concept.pmjay-on-nhcx
  glossary:
  - shared.glossary.fhir
  - shared.glossary.nrces
  - shared.glossary.hi-type
  - shared.glossary.snomed-ct
  errors:
  - nhcx.error.payr-1004
  - nhcx.error.payr-1008
  - nhcx.error.payr-1043
  - nhcx.error.payr-1044
  troubleshooting:
  - nhcx.troubleshooting.bundle-rejected
---

# FHIR collection bundles and the NHCX claim profiles

## In plain words

The payload inside every sealed NHCX message is a [FHIR](../../shared/glossary/fhir.md) bundle: a set of related records packed together. A claim bundle holds the claim itself, the patient, the hospital, the payer, the policy, the diagnoses and procedures, and the supporting documents.

The [NRCeS](../../shared/glossary/nrces.md) publishes the profiles these bundles must follow. A bundle that does not follow them is refused by the payer.

## Before you start

Read [the claim cycle](./claim-cycle.md), so you know which bundle each stage needs.

## What happens

### Collection, not document

ABDM health records are FHIR bundles of type `document`, headed by a `Composition`. NHCX claim messages are bundles of type `collection`. A collection groups the records one workflow needs, with the main resource first and no bundle-level `Composition`.

```mermaid
graph TD
  B["Bundle, type collection"] --> C["Claim<br/>use preauthorization or claim"]
  B --> P["Patient"]
  B --> O1["Organization: hospital, HFR ID as NPI"]
  B --> O2["Organization: payer"]
  B --> CV["Coverage: the policy"]
  B --> PR["Practitioner, Procedure, Condition"]
  C -->|supportingInfo| DR["DocumentReference<br/>an ABDM health record inside"]
```

### The six claim bundles

| Bundle | Main resource | Used for |
|---|---|---|
| Coverage eligibility request | `CoverageEligibilityRequest` | Eligibility checks |
| Coverage eligibility response | `CoverageEligibilityResponse` | Eligibility answers |
| Claim | `Claim`, with `use` of `predetermination`, `preauthorization` or `claim` | Predetermination, preauthorisation, claim |
| Claim response | `ClaimResponse` | Every decision on a claim bundle |
| Task | `Task` | Communication, payment notice, search, reprocess, insurance plan request |
| Insurance plan | `InsurancePlan` | The payer's plan |

### Rules every bundle follows

- Reference resources inside the bundle with `urn:uuid:` references.
- Declare the NRCeS profile of each resource in `meta.profile`.
- Send the hospital's HFR ID in the hospital `Organization` identifier, with type code `NPI`.
- Attach files as Base64. Allowed content types are `application/pdf`, `application/jpg`, `application/jpeg`, `application/png` and `application/fhir+json`.

### Clinical records inside a claim

Under PMJAY, clinical records travel as structured ABDM [health information types](../../shared/glossary/hi-type.md). Each record is a FHIR bundle, Base64 encoded into a `DocumentReference`, and referenced from `Claim.supportingInfo` with category `DIA`, `HDS`, `CD` or `INF`. Each document may be up to 2 MB and the whole bundle up to 20 MB.

### Validate before you seal

Validate every bundle against the NRCeS profile package, `https://nrces.in/ndhm/fhir/r4/package.tgz`, before encryption. A payer can only report a bad bundle after decrypting it, which costs you a full round trip. The validator command is in [the validator recipe](../../shared/fhir/hl7-validator-recipe.md).

## How you know it worked

You have understood this when you can answer both of these.

1. You copied an ABDM discharge summary bundle and set its type to `collection` to use as a claim. What is still wrong with it?
2. Where in a preauthorisation bundle does a lab report go, and in what form?

## When it goes wrong

**Malformed bundle.** The PMJAY payer answers "Received FHIR bundle is malformed" with the validator's details. On the standard payer list the same code, [PAYR-1004](../errors/payr-1004.md), means something else, so read the message. Validate and fix.

**Unparseable bundle.** The PMJAY payer answers [PAYR-1008](../errors/payr-1008.md) from its structure checks: invalid FHIR bundle received.

**Dates in the wrong format.** The PMJAY payer refuses dates that do not follow the NRCeS date and date-time formats with [PAYR-1043](../errors/payr-1043.md) and [PAYR-1044](../errors/payr-1044.md).

**Attachment rejected.** A missing name, a non Base64 value or a content type outside the list above is refused. See [the bundle is rejected](../troubleshooting/bundle-rejected.md).
