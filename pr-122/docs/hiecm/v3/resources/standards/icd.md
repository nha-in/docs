# ICD-10 and ICD-11

The International Classification of Diseases, ICD, groups diagnoses into classes for counting and reporting. SNOMED CT records what a clinician found. ICD classifies it for statistics, claims and public health. ICD is published by the World Health Organization, WHO. Read [ICD at NRCeS](https://www.nrces.in/standards/whofic/icd).

The [EHR Standards for India](https://www.nrces.in/standards/ehr-standards-for-india) notify four WHO classifications for aggregated, statistical and epidemiological use.

- ICD, diseases
- ICF, functioning and disability
- ICHI, health interventions
- ICD-O, oncology

## In short

- ICD classifies diagnoses for statistics and claims, with system `http://hl7.org/fhir/sid/icd-10`.
- The ABDM FHIR implementation guide binds ICD-10, alongside SNOMED CT on `Condition.code`.
- Use it without a licence. Reproducing it needs WHO's permission.

## Where a record uses it

The system URI is `http://hl7.org/fhir/sid/icd-10`. The [ABDM FHIR implementation guide](https://nrces.in/ndhm/fhir/r4/index.html) uses it on these fields.

| Field                                                    | What the code says                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `Condition.code`                                         | A diagnosis, in the ICD-10 slice                                          |
| `Claim.diagnosis.diagnosis[x]`                           | The diagnosis a claim is made for, bound at example strength              |
| `CoverageEligibilityRequest.item.diagnosis.diagnosis[x]` | The diagnosis an eligibility check is made for, bound at example strength |

`Condition.code` is sliced on its system into an ICD-10 slice and a SNOMED CT slice. Send a coding in either, or both.

## ICD-10 and ICD-11

The ABDM FHIR implementation guide binds ICD-10. WHO stopped maintaining ICD-10 in 2018, and new content goes into ICD-11 only.

## The licence

You need no licence to use ICD-10, whether or not you hold a SNOMED CT Affiliate Licence. Reproducing, reprinting or translating ICD-10 needs permission from WHO.

## Get it

| Resource                                | Link                                                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ICD-10 package                          | [icdcdn.who.int/icd10](https://icdcdn.who.int/icd10/index.html)                                          |
| ICD-10 Volume 2, the instruction manual | [ICD-10 Volume 2, 2019](https://icd.who.int/browse10/Content/statichtml/ICD10Volume2_en_2019.pdf)        |
| Online browser                          | [ICD-10, 2019 edition](https://icd.who.int/browse10/2019/en)                                             |
| SNOMED CT to ICD-10 maps                | [snomed.org/maps](https://www.snomed.org/maps), and inside the SNOMED CT International Edition from MLDS |

## How you know it worked

- Every ICD-10 coding you send carries `http://hl7.org/fhir/sid/icd-10` as its system.
- Your `Condition` validates against the ABDM FHIR implementation guide with its ICD-10 slice filled.

## When it goes wrong

- **You hold SNOMED CT codes and need ICD-10.** Use the SNOMED CT to ICD-10 map rather than mapping by hand.
- **Anything else.** Read the [ICD questions in the NRCeS FAQ](https://www.nrces.in/faqs#icd).

## Next steps

- [SNOMED CT](/docs/pr-122/docs/hiecm/v3/resources/standards/snomed-ct): the terminology ICD-10 is mapped from.
- [FHIR](/docs/pr-122/docs/hiecm/v3/resources/standards/fhir): the `Condition` profile that carries both.
- [Standards and terminologies](/docs/pr-122/docs/hiecm/v3/resources/standards): every code system in one table.
