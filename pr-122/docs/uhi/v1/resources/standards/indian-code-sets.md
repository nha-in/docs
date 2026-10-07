# Indian code sets

India publishes its own code sets on top of the international ones. They cover medicines sold in India, AYUSH systems of medicine, Indian geography and Indian languages. Each is listed on the [NRCeS national releases page](https://www.nrces.in/services/national-releases).

## In short

- Common Drug Codes for India codes medicines, as a SNOMED CT extension or as flat files.
- The AYUSH, geography, language and COVID-19 extensions also extend SNOMED CT.
- All of them come through MLDS with a SNOMED CT Affiliate Licence, or from the NRCeS national releases page.

## Common Drug Codes for India

Common Drug Codes for India, CDCI, codes the medicines prescribed and dispensed in India. It covers generic clinical drugs, suppliers and branded medicines. Devices, surgical implants and combination packs are out of scope.

Its content is drawn from these lists:

- The National List of Essential Medicines 2015
- Pradhan Mantri Bhartiya Janaushadhi Pariyojana, Jan Aushadhi
- AMRIT pharmacies
- The Telemedicine Practice Guidelines
- The NACO HIV drug list
- The COVID-19 clinical management protocol and COVID-19 vaccine products

| Package                        | What it is                                                                                               | Get it                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Terminology Integrated Package | The India Drug Extension for SNOMED CT                                                                   | [MLDS](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/395763), with a SNOMED CT Affiliate Licence                             |
| Flat Files Package             | Tab separated text files: substances, trade names, suppliers, drug forms, generics and branded medicines | The [NRCeS national releases page](https://www.nrces.in/services/national-releases#drug_codes), under the licence in its `License.txt` |

In a record, CDCI codes travel as SNOMED CT, with system `http://snomed.info/sct`. The ABDM Medicine Codes value set binds `MedicationRequest.medication[x]` and `MedicationStatement.medication[x]` at example strength. It draws on clinical drugs from the International Edition and on clinical drugs and branded medicines from CDCI.

## India AYUSH Extension

The India AYUSH Extension adds Ayurveda, Siddha and Unani concepts to SNOMED CT, with terms in Sanskrit, Tamil and Urdu. It is distributed through [MLDS](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/600189) with a SNOMED CT Affiliate Licence.

## The other India extensions

Each is a SNOMED CT extension, released through MLDS to Affiliate Licensees.

| Release                                                                                                         | What it adds                                                                    | Release date   |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------- |
| [India Reference Sets](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/194856)                          | 30 simple reference sets: 12 for national health programmes, 18 for specialties | 6 August 2021  |
| [India Geographical Location Extension](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/480480)         | 7,628 location concepts, mapped to Local Government Directory codes             | 6 August 2021  |
| [India Patient Instructions Language Extension](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/480580) | Patient instructions in Hindi, Marathi, Tamil and Urdu                          | 31 August 2026 |
| [India COVID-19 Extension](https://mlds.ihtsdotools.org/#/viewReleases/viewRelease/442922)                      | 50 COVID-19 terms                                                               | 6 August 2021  |

Common Lab Codes for India, CLCI, is the Indian subset of LOINC rather than a SNOMED CT extension. It is described with LOINC.

## How you know it worked

- Medicines your system dispenses resolve to a CDCI concept, generic or branded.
- Your SNOMED CT release on MLDS includes the India extensions your system uses.
- Every extension code you send carries `http://snomed.info/sct` as its system.

## When it goes wrong

- **A medicine is not in CDCI.** Code it to the generic clinical drug in the SNOMED CT International Edition.
- **An India concept is not found in the International Edition browser.** Search [CSNOFinder](https://www.nrces.in/bhts/browser/), which carries the India extensions.
- **Anything else.** Read the [NRCeS FAQ](https://www.nrces.in/faqs).

## Next steps

- [SNOMED CT](/docs/pr-122/docs/uhi/v1/resources/standards/snomed-ct): the licence these extensions come under.
- [LOINC](/docs/pr-122/docs/uhi/v1/resources/standards/loinc): Common Lab Codes for India.
- [Standards and terminologies](/docs/pr-122/docs/uhi/v1/resources/standards): every code system in one table.
