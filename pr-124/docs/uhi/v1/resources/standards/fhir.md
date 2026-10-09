# FHIR records and profiles

Every ABDM health record and claim is a FHIR R4 bundle that conforms to the ABDM FHIR implementation guide. This page gives the guide, the code systems its profiles bind, and how to validate a bundle against it.

## In short

- Every ABDM record and claim conforms to the ABDM FHIR implementation guide, version 6.5.0 on FHIR 4.0.1.
- Coded fields take SNOMED CT, LOINC, ICD-10 or the guide's own code systems, each by a fixed URI.
- Validate every bundle against `ndhm.in#6.5.0` before you send it.

## The ABDM FHIR implementation guide

The ABDM FHIR implementation guide is the set of FHIR R4 profiles every ABDM health record and claim conforms to. Base FHIR says a resource exists. The guide says which fields an Indian record must fill, and which code systems those fields take.

The guide is published by the National Resource Centre for EHR Standards, NRCeS, at [nrces.in/ndhm/fhir/r4](https://nrces.in/ndhm/fhir/r4/index.html).

| Field           | Value                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Current version | 6.5.0, published 8 May 2025                                                                                                         |
| FHIR version    | 4.0.1                                                                                                                               |
| Package id      | `ndhm.in#6.5.0`                                                                                                                     |
| Canonical URL   | `https://nrces.in/ndhm/fhir/r4/ImplementationGuide/ndhm.in`                                                                         |
| Licence         | FHIR is free to use, redistribute and build on. See [HL7 FHIR at NRCeS](https://www.nrces.in/standards/hl7-international/hl7-fhir). |

### What the guide holds

| Section                                                         | What you find there                                                                                                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Profiles](https://nrces.in/ndhm/fhir/r4/profiles.html)         | The health record profiles: OP consultation, prescription, diagnostic report, discharge summary, immunisation, wellness, health document and invoice |
| [NHCX profiles](https://nrces.in/ndhm/fhir/r4/hcx-profile.html) | The claim, coverage eligibility, insurance plan, communication and payment profiles for health claims                                                |
| [Terminology](https://nrces.in/ndhm/fhir/r4/terminology.html)   | The guide's own code systems and value sets                                                                                                          |
| [Examples](https://nrces.in/ndhm/fhir/r4/all-examples.html)     | A worked example for every profile, in JSON and XML                                                                                                  |
| [Downloads](https://nrces.in/ndhm/fhir/r4/downloads.html)       | `package.tgz`, the definitions and the examples as zip files                                                                                         |
| [History](https://nrces.in/ndhm/fhir/r4/history.html)           | Every published version, from 1.0.0 in August 2020                                                                                                   |

Pin the version you build against. Read the history before you move to a newer one.

## The code systems it binds

A coded field names its code system by URI. The URI is an identifier, not a web address: send it exactly as the profile fixes it, in the coding's `system`.

| Code system                                                          | System URI                                     | Where the guide uses it                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [SNOMED CT](https://www.nrces.in/standards/snomed-ct)                | `http://snomed.info/sct`                       | Record types, conditions, procedures, allergies, medicines, specimens and most clinical codes |
| [LOINC](https://www.nrces.in/standards/loinc)                        | `http://loinc.org`                             | Laboratory and imaging report codes, and vital sign and body measurement observations         |
| [ICD-10](https://www.nrces.in/standards/whofic/icd)                  | `http://hl7.org/fhir/sid/icd-10`               | Diagnoses on `Condition`, and on claims                                                       |
| [Guide code systems](https://nrces.in/ndhm/fhir/r4/terminology.html) | `https://nrces.in/ndhm/fhir/r4/CodeSystem/...` | Administrative and claim codes, such as identifier types and billing codes                    |

Quantities in the guide's examples carry units from `http://unitsofmeasure.org`. See [an Observation example](https://nrces.in/ndhm/fhir/r4/Observation-example-03.html).

## Validate a bundle against it

The [Implementation Guide for Adoption of FHIR in ABDM and NHCX](https://www.nrces.in/download/files/pdf/Implementation_Guide_for_Adoption_of_FHIR_in_ABDM_and_NHCX.pdf) gives three ways to validate.

| Way          | How                                                                                  |
| ------------ | ------------------------------------------------------------------------------------ |
| Command line | `java -jar validator_cli.jar <file_name> -ig ndhm.in#6.5.0`                          |
| Browser      | Open [validator.fhir.org](https://validator.fhir.org) and select the `ndhm.in` guide |
| In your code | Load `package.tgz` into the HAPI FHIR validator from your classpath                  |

The validator checks structure, profile conformance and coding. Every coding must carry the correct system URL, code and display.

## Tools and samples

- [ABDM FHIR R4 usage samples in Java](https://www.nrces.in/download/files/zip/abdm-fhir-r4-usage-samples-java.zip) and [in .NET](https://www.nrces.in/download/files/zip/abdm-fhir-r4-usage-samples-dotnet.zip), which build bundles in code.
- The [NRCeS terminology server](https://www.nrces.in/bhts/termserv/), which supports `$lookup`, `$validate-code` and `$translate`.
- [Tools and technologies](https://www.nrces.in/services/tools-and-technologies), the full list of NRCeS tools.

## How you know it worked

The validator reports no errors for your bundle against `ndhm.in#6.5.0`.

## When it goes wrong

- **A coding fails validation.** The system URI differs from the one the profile fixes. Copy it from the profile, not from an older sample.
- **Anything else.** Read the [FHIR questions in the NRCeS FAQ](https://www.nrces.in/faqs#fhir).

## Next steps

- [SNOMED CT](/docs/pr-124/docs/uhi/v1/resources/standards/snomed-ct): the clinical terminology most coded fields take.
- [LOINC](/docs/pr-124/docs/uhi/v1/resources/standards/loinc): the codes for laboratory tests and observations.
- [Standards and terminologies](/docs/pr-124/docs/uhi/v1/resources/standards): every code system in one table.
