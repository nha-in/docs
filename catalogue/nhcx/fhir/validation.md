---
id: nhcx.fhir.validation
type: fhir
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Validating an NHCX bundle before you send it
summary: >-
  How to check a claims bundle against the national profiles on your own machine,
  what the check covers, and the bundle review that precedes sandbox sign-off.
sources:
- url: https://hcxsbx.abdm.gov.in/images/2c3fbb4e6b09f0834f69.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Implementation Guide for Adoption of FHIR in ABDM and NHCX.pdf
  hash: sha256:549377c9c26b1bd23decac3a1b9e5ebedfdc8e0fe99e53ef733859b188f51366
  fetched: '2026-09-14'
  note: Implementation Guide for Adoption of FHIR in ABDM and NHCX, row 14 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 16-19 Validating FHIR Resources.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. section 7 reference documents.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8.
- url: https://hcxsbx.abdm.gov.in/images/2b7fde4358fd0a4b2086.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Code Snippets references for payload preparation.pdf
  hash: sha256:cea0cfbf5897e9642eaf9a515a941b0a1de39474ea39444c9e05abe21cd9ec73
  fetched: '2026-09-14'
  note: NHCX Code Snippets references for payload preparation, row 13 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 5-7 Validations.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
verified:
  status: unverified
related:
  fhir:
  - shared.fhir.hl7-validator-recipe
  - nhcx.fhir.collection-bundle
  - nhcx.fhir.terminologies
  - nhcx.fhir.preauth-request
  - nhcx.fhir.claim-request
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.task
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.support-contacts
  errors:
  - nhcx.error.payr-1008
  - nhcx.error.payr-1004
  troubleshooting:
  - nhcx.troubleshooting.bundle-rejected
  glossary:
  - shared.glossary.fhir
  - shared.glossary.nrces
---

# Validating an NHCX bundle before you send it

## In plain words

Every bundle on the exchange must conform to the [NRCeS](../../shared/glossary/nrces.md) profiles, and both sides check it. The receiver validates what it gets. You validate what you send, before you seal it.

Validation runs on your machine with the HL7 [FHIR](../../shared/glossary/fhir.md) validator against the ABDM and NHCX profile package. During sandbox exit, NRCeS also reviews sample bundles you send by email.

## Before you start

- Java is installed, and the validator jar is downloaded as the recipe shows ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)).
- Your bundle is saved as a `.json` file, before encryption.
- You know which bundle profile your use case takes. See [the collection bundle](collection-bundle.md).

## What happens

### Tools

| Tool | Use it for |
|---|---|
| HL7 validator jar (`validator_cli.jar`) | Command-line checks on your machine and in CI |
| HAPI FHIR validator (Java library) | Checks inside your application before sealing |
| https://validator.fhir.org | One-off checks in a browser |

### What the validator checks

Structure, cardinality, value domains, coding and CodeableConcept bindings, invariants, profile rules and business rules such as reference resolution.

### The command

The profile package id is `ndhm.in`, published at https://nrces.in/ndhm/fhir/r4/package.tgz. It carries the ABDM and NHCX profiles. Name the bundle profile with `-profile`:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClaimBundle
```

Swap the profile for `ClaimResponseBundle`, `CoverageEligibilityRequestBundle`, `CoverageEligibilityResponseBundle`, `TaskBundle` or `InsurancePlanBundle` as your use case needs.

### Inside a Java application

1. Put `package.tgz` on the classpath.
2. Load it with `NpmPackageValidationSupport`.
3. Chain it with `DefaultProfileValidationSupport`, `InMemoryTerminologyServerValidationSupport`, `CommonCodeSystemsTerminologyService` and `SnapshotGeneratingValidationSupport`, wrapped in `CachingValidationSupport`.
4. Register a `FhirInstanceValidator` on the `FhirValidator` and call `validateWithResult` on the bundle.

The HAPI FHIR artifacts are `hapi-fhir-structures-r4`, `hapi-fhir-validation` and `hapi-fhir-validation-resources-r4`, version 6.4.3.

### In the browser

On https://validator.fhir.org open **Options**, choose the implementation guide `ndhm.in`, choose the version, and select **Add**. Paste the bundle under **Enter Resource** and select **Validate**.

### Bundle review during sandbox exit

Email sample bundles to `hcx.integration@nha.gov.in`. The NRCeS team validates them as part of functional testing. See [the sandbox exit process](../sandbox/sandbox-exit.md). For questions on building a bundle, write to `nrc-help@cdac.in`.

## How you know it worked

You ran:

```bash
java -jar validator_cli.jar bundle.json -version 4.0.1 -ig ndhm.in#6.5.0 -profile <BUNDLE_PROFILE_CANONICAL_URL>
```

The command exits with code 0 and the report lists no errors. Read every warning and decide on each one.

After you send the bundle, the receiver's callback carries a FHIR bundle, not a `ProtocolResponse` with a bundle error.

## When it goes wrong

- **The validator cannot find the profile.** The `-ig` value or the profile URL is wrong. Check `ndhm.in#6.5.0` and the canonical URL. See the recipe ([shared.fhir.hl7-validator-recipe](../../shared/fhir/hl7-validator-recipe.md)).
- **The validator cannot reach a terminology server.** Add `-tx n/a` for an offline run. Codes are then not checked, so run once more online before you rely on the result.
- **The validator passes, and the receiver still rejects the bundle.** The receiver also applies business rules. It checks typed identifiers, resolvable references, supporting-info category and code pairs, and base64 attachments. It also checks that your HFR ID matches your registration. See [the payer rejects your FHIR bundle](../troubleshooting/bundle-rejected.md).
- **[PAYR-1008](../errors/payr-1008.md) or [PAYR-1004](../errors/payr-1004.md) from the receiver.** The bundle did not parse, or failed structure checks. Validate the exact JSON you encrypted, not an earlier copy.
- **You copied a payer response as a template for a request.** Payer-built bundles declare no NRCeS profiles. Start requests from the minimal bundles in the atom for each use case.
