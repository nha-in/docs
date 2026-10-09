# LOINC

LOINC is the code system for laboratory tests and clinical observations. A lab report, a blood pressure reading and a body weight each carry a LOINC code that says what was measured. LOINC is owned, maintained and distributed by the Regenstrief Institute. Read [LOINC at NRCeS](https://www.nrces.in/standards/loinc).

## In short

- LOINC codes laboratory tests and observations, with system `http://loinc.org`.
- It is free, from loinc.org.
- Common Lab Codes for India is the subset to start from.

## Where a record uses it

The system URI is `http://loinc.org`. The [ABDM FHIR implementation guide](https://nrces.in/ndhm/fhir/r4/index.html) uses it on these fields.

| Field                   | What the code says                                                       |
| ----------------------- | ------------------------------------------------------------------------ |
| `DiagnosticReport.code` | The laboratory or imaging report, in the lab and imaging report profiles |
| `Observation.code`      | What was observed, in the LOINC slice                                    |

Observations bind to these value sets, at extensible strength, each in the profile of the same name.

- Vital Signs
- Body Measurement
- Physical Activity
- Women Health
- General Assessment, which adds one SNOMED CT code

The [EHR Standards for India](https://www.nrces.in/standards/ehr-standards-for-india) require LOINC for results and reports in laboratory and imaging systems.

## The licence

LOINC is free of charge. Download it from [loinc.org](https://loinc.org/) under the [LOINC licence](https://loinc.org/license). New versions of LOINC and RELMA are released twice a year, in February and August.

## Common Lab Codes for India

Common Lab Codes for India, CLCI, is a curated subset of LOINC. It covers 1,473 commonly referred laboratory tests. Start here before you search all of LOINC.

| Field          | Value                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Format         | One CSV file, `common_lab_codes_for_india.csv`                                                                          |
| Columns        | General Name, LOINC Code, FSN and LCN                                                                                   |
| Latest release | [Release notes, 29 June 2026](https://www.nrces.in/download/files/pdf/CommonLabCodesForIndia_ReleaseNotes_20260629.pdf) |
| Download       | The [NRCeS national releases page](https://www.nrces.in/services/national-releases#lab_codes)                           |

## Tools and guidance

| Resource                                                                                                                                               | Use it for                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [Guide for using LOINC in ABDM FHIR Resources](https://www.nrces.in/download/files/pdf/Guide%20for%20using%20LOINC%20in%20ABDM%20FHIR%20Resources.pdf) | Which LOINC codes go in which ABDM resource                 |
| RELMA, from [loinc.org](https://loinc.org/)                                                                                                            | Mapping your local test names to LOINC codes, free          |
| [LOINCServ](https://www.nrces.in/bhts/api/v1/loincserv/)                                                                                               | Looking codes up from your system over a public REST API    |
| [CLNtk](https://cdac.in/index.aspx?id=hi_hs_medinfo_loinc_home)                                                                                        | Building LOINC into your application with the C-DAC toolkit |

## How you know it worked

- Each test your laboratory reports maps to one LOINC code, held against your local test name.
- Every LOINC coding you send carries `http://loinc.org` as its system.
- Your bundle validates against the ABDM FHIR implementation guide.

## When it goes wrong

- **A local test has no obvious code.** Look in CLCI first, then map it with RELMA.
- **An observation fails validation.** Check that the coding carries `http://loinc.org` as its system, and a code and display.
- **Anything else.** Read the [LOINC questions in the NRCeS FAQ](https://www.nrces.in/faqs#loinc).

## Next steps

- [SNOMED CT](/docs/pr-124/docs/hiecm/v3/resources/standards/snomed-ct): the clinical terminology for everything that is not a test.
- [NRCeS FHIR documentation](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/nrces): the profiles LOINC codes sit in.
- [BHTS](/docs/pr-124/docs/hiecm/v3/resources/standards/bhts): look LOINC codes up from your system.
- [Standards and terminologies](/docs/pr-124/docs/hiecm/v3/resources/standards): every code system in one table.
