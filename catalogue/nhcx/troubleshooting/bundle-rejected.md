---
id: nhcx.troubleshooting.bundle-rejected
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The payer rejects your FHIR bundle
summary: >-
  The payer opened your message and refused its content as malformed or incomplete.
  The checks that find the fault in the bundle, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets Bridge Error (PAYR-1004, 1008, 1009, 1012, 1013, HFR, attachment rows) and Payer Error Codes (PAYR-1004).
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 1.3 Key Principles.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 6, best practices.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, FHIR Bundle Validation.
related:
  concepts:
  - nhcx.concept.fhir-in-nhcx
  - nhcx.concept.error-code-spaces
  fhir:
  - nhcx.fhir.validation
  - nhcx.fhir.collection-bundle
  errors:
  - nhcx.error.payr-1004
  - nhcx.error.payr-1008
  - nhcx.error.payr-1009
  - nhcx.error.payr-1013
  sandbox:
  - nhcx.sandbox.support-contacts
  glossary:
  - shared.glossary.fhir
  - shared.glossary.nrces
  - shared.glossary.hfr
---

# The payer rejects your FHIR bundle

## In plain words

The payer decrypted your message and could not accept the [FHIR](../../shared/glossary/fhir.md) bundle inside it. The answer names the fault with a code:

- `PAYR-1004`: the bundle is malformed, followed by error details.
- `PAYR-1008`: the bundle is invalid or cannot be parsed.
- A structural code such as `PAYR-1009`: no identifier for the patient.

## Before you start

- You have the full answer, including the error message and any details after the code.
- You have read [FHIR collection bundles and the NHCX claim profiles](../concepts/fhir-in-nhcx.md).
- You can run the [NRCeS](../../shared/glossary/nrces.md) validator. See [validating a bundle](../fhir/validation.md).

## What happens

Read the message with the code. `PAYR-1004` also means "Provider is not registered with the payer for requested policy" in the standard payer codes. The message text tells you which one you have. See [error code spaces](../concepts/error-code-spaces.md).

Then work through these in order.

1. **Does the bundle pass the NRCeS validator?** Run it on the exact bundle you sealed and fix what it reports first.
2. **Is the bundle shaped right?** It is a `Bundle` of type `collection`. Every resource declares its NRCeS profile in `meta.profile`. Resources reference each other as `urn:uuid:<UUID>`, not by relative paths. See [the collection bundle](../fhir/collection-bundle.md).
3. **Does every resource carry its identifier and type?** The patient, the provider organisation, the payer organisation and the claim each need an identifier with a type.
4. **Is your hospital identified correctly?** Send the [HFR](../../shared/glossary/hfr.md) ID as an identifier with type code `NPI` in the provider `Organization`. It must match the registry ID recorded for you as sender.
5. **Are the attachments valid?** Each has Base64 data, a name that is not empty, and one of these content types: `application/pdf`, `application/jpg`, `application/jpeg`, `application/png`, `application/fhir+json`.
6. **Are the values clean?** Trim leading and trailing spaces. Codes are case sensitive and must match the expected values exactly.

## How you know it worked

The validator passes the bundle, and the payer's answer is an adjudication: a ClaimResponse or eligibility response with an outcome, not a bundle error.

## When it goes wrong

If the validator passes and the payer still refuses the bundle, send the bundle to `hcx.integration@nha.gov.in` for validation by the NRCeS team. Include the payer's full error message. See [support contacts](../sandbox/support-contacts.md).

The errors this symptom can surface:

- [PAYR-1004](../errors/payr-1004.md): the bundle is malformed.
- [PAYR-1008](../errors/payr-1008.md): the bundle is invalid or cannot be parsed.
- [PAYR-1009](../errors/payr-1009.md): no identifier for the patient.
- [PAYR-1013](../errors/payr-1013.md): no identifier for the provider organisation.
