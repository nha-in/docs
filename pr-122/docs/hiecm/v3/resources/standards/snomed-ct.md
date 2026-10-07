# SNOMED CT

SNOMED CT is the clinical terminology an ABDM health record codes its content with. FHIR gives a record its shape; SNOMED CT says what each part means. It is owned, maintained and distributed by SNOMED International.

India became a SNOMED International member country in April 2014. The Ministry of Health and Family Welfare designated C-DAC Pune, through NRCeS, to distribute and manage SNOMED CT in India. Read [SNOMED CT at NRCeS](https://www.nrces.in/standards/snomed-ct).

## In short

- SNOMED CT codes what a record means, with system `http://snomed.info/sct`.
- It is free in India and still needs an Affiliate Licence, from MLDS.
- India's drug, AYUSH and other extensions come through the same licence.

## Where a record uses it

The system URI is `http://snomed.info/sct`. The [ABDM FHIR implementation guide](https://nrces.in/ndhm/fhir/r4/index.html) fixes it on these fields, among others.

| Field                                                             | What the code says                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| `Composition.type` and `Composition.section.code`                 | Which record type this is, and what each section holds |
| `Condition.code`                                                  | A diagnosis or problem, in the SNOMED CT slice         |
| `Procedure.code`                                                  | The procedure performed                                |
| `AllergyIntolerance.code`                                         | The allergen or intolerance                            |
| `MedicationRequest.medication[x]`                                 | The medicine prescribed                                |
| `DiagnosticReport.category` and `DiagnosticReport.conclusionCode` | The kind of report and its coded conclusion            |
| `Specimen.type` and `ServiceRequest.code`                         | The specimen collected, and the service ordered        |

The [EHR Standards for India](https://www.nrces.in/standards/ehr-standards-for-india) require a health record system to use SNOMED CT as its primary internal encoding.

## The licence

SNOMED CT is free to use in India, and it still needs a licence. The [NRCeS FAQ](https://www.nrces.in/faqs#snomedct) sets out the terms.

| Case                                  | What you need                                                                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A system used in India                | An Affiliate Licence, free of charge                                                                                                                       |
| Each deployment of your system        | A sub-licence under your Affiliate Licence                                                                                                                 |
| An app deployed or used outside India | An International Affiliate Licence from SNOMED International                                                                                               |
| Every licence period                  | A [usage report](https://www.nrces.in/download/files/pdf/SNOMED_CT_Usage_Report_Submission.pdf), filed before the period you declared at registration ends |

## Get it

1. Register on the [Member Licensing and Distribution Service for India](https://mlds.ihtsdotools.org/#/landing/IN?lang=en), MLDS.
2. Accept the [SNOMED CT Affiliate Licence Agreement](https://www.nrces.in/download/files/pdf/SNOMED%20CT%20Affiliate%20License%20Agreement%202023.pdf).
3. Download the International Edition release files. The link arrives in four to five business days.

India's own extensions, such as drugs and AYUSH, are released through the same MLDS account. They are listed on the [NRCeS national releases page](https://www.nrces.in/services/national-releases).

## Browse and look up codes

| Tool                                                                | Use it for                                                             |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [SNOMED CT Browser](http://browser.ihtsdotools.org/)                | Browsing the International Edition                                     |
| [CSNOFinder](https://www.nrces.in/bhts/browser/)                    | Browsing with the India extensions, including ECL queries              |
| [CSNOServ](https://www.nrces.in/bhts/api/v1/csnoserv/)              | Looking codes up from your system over a public REST API, rate limited |
| [CSNOtk](https://cdac.in/index.aspx?id=hi_hs_medinfo_csno_overview) | Building SNOMED CT into your application with the C-DAC toolkit        |

The SNOMED CT to ICD-10 map ships inside the International Edition you download from MLDS.

## How you know it worked

- You hold an Affiliate Licence and can download release files from MLDS.
- Every SNOMED CT coding you send carries `http://snomed.info/sct` as its system.
- Your bundle validates against the ABDM FHIR implementation guide.

## When it goes wrong

- **You skipped the licence because the terminology is free.** Free in India still means licensed. Register on MLDS before you ship.
- **A code is not found.** It may sit in an India extension rather than the International Edition. Search CSNOFinder, which carries both.
- **Anything else.** Read the [SNOMED CT questions in the NRCeS FAQ](https://www.nrces.in/faqs#snomedct).

## Next steps

- [Indian code sets](/docs/pr-122/docs/hiecm/v3/resources/standards/indian-code-sets): the India extensions to SNOMED CT.
- [ICD-10 and ICD-11](/docs/pr-122/docs/hiecm/v3/resources/standards/icd): classifying what SNOMED CT records.
- [BHTS](/docs/pr-122/docs/hiecm/v3/resources/standards/bhts): look SNOMED CT codes up and validate them from your system.
- [Standards and terminologies](/docs/pr-122/docs/hiecm/v3/resources/standards): every code system in one table.
