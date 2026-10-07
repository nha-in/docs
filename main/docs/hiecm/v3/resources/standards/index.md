# Standards and terminologies

An ABDM record has a shape and a meaning. FHIR gives it the shape. Code systems give each coded field its meaning, so a receiving system reads a diagnosis, a test or a medicine the same way you wrote it.

Each standard below is published or distributed in India through the National Resource Centre for EHR Standards, [NRCeS](https://www.nrces.in/).

| Standard                                                                          | What it codes                                                                        | System URI                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| [FHIR](/docs/main/docs/hiecm/v3/resources/standards/fhir)                         | The implementation guide every record and claim conforms to, and the record profiles | `ndhm.in#6.5.0`                            |
| [SNOMED CT](/docs/main/docs/hiecm/v3/resources/standards/snomed-ct)               | Clinical meaning: record types, conditions, procedures, medicines                    | `http://snomed.info/sct`                   |
| [LOINC](/docs/main/docs/hiecm/v3/resources/standards/loinc)                       | Laboratory tests and clinical observations                                           | `http://loinc.org`                         |
| [ICD-10 and ICD-11](/docs/main/docs/hiecm/v3/resources/standards/icd)             | Diagnoses, classified for statistics and claims                                      | `http://hl7.org/fhir/sid/icd-10`           |
| [Indian code sets](/docs/main/docs/hiecm/v3/resources/standards/indian-code-sets) | Medicines sold in India, AYUSH, geography and languages                              | `http://snomed.info/sct`                   |
| [DICOM](/docs/main/docs/hiecm/v3/resources/standards/dicom)                       | Medical images and their data                                                        | DICOM UIDs, as `urn:oid:`                  |
| [BHTS](/docs/main/docs/hiecm/v3/resources/standards/bhts)                         | A FHIR R4 terminology service to look up, validate and translate all of the above    | `https://www.nrces.in/bhts/api/v1/ts/fhir` |

## Next steps

- [FHIR](/docs/main/docs/hiecm/v3/resources/standards/fhir): the implementation guide and the record profiles. Start here if you build records.
- [SNOMED CT](/docs/main/docs/hiecm/v3/resources/standards/snomed-ct): get your licence early, because the release files take days to arrive.
