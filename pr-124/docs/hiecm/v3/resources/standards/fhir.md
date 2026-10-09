# FHIR

Every health record that moves inside [ABDM](/docs/pr-124/docs/hiecm/v3/getting-started/glossary#abdm) travels as a [FHIR](/docs/pr-124/docs/hiecm/v3/getting-started/glossary#fhir) R4 document bundle that conforms to the NRCeS profiles. What FHIR is, and why ABDM uses it, is in [FHIR](/docs/pr-124/docs/hiecm/v3/concepts/fhir).

[NRCeS documentation](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/nrces)

[The ABDM FHIR implementation guide NRCeS publishes: its version, sections, code systems, tools and samples.](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/nrces)

[Bundles and validation](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/bundles)

[How to build a record bundle: its shape, the rules that fail validation, and how to validate before you ship.](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/bundles)

[Build a FHIR record](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/build)

[Pick a record type, fill in test values step by step, and copy a bundle in the right shape.](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/build)

## The record types

There are eight record types. Implementing all of them is mandatory for an [HMIS](/docs/pr-124/docs/hiecm/v3/getting-started/glossary#hmis).

| Record type                                                                                               | What it holds                                                                                                                                | [HI type](/docs/pr-124/docs/hiecm/v3/getting-started/glossary#hi-type) code |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Diagnostic Report Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-DiagnosticReportRecord.html) | Radiology and laboratory reports                                                                                                             | `DiagnosticReport`                                                          |
| [Discharge Summary Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-DischargeSummaryRecord.html) | The discharge summary for the ABDM health data set                                                                                           | `DischargeSummary`                                                          |
| [Health Document Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-HealthDocumentRecord.html)     | Unstructured historical records, usually uploaded by patients through a health locker                                                        | `HealthDocumentRecord`                                                      |
| [Immunization Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-ImmunizationRecord.html)          | Immunisations, vaccine certificates and next dose recommendations                                                                            | `ImmunizationRecord`                                                        |
| [OP Consult Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-OPConsultRecord.html)               | Outpatient notes: examinations, procedures, medications and clinical advice                                                                  | `OPConsultation`                                                            |
| [Prescription Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-PrescriptionRecord.html)          | Medication advice, following Pharmacy Council of India guidelines                                                                            | `Prescription`                                                              |
| [Wellness Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-WellnessRecord.html)                  | Vitals, physical examination and general health data, often captured in a [PHR](/docs/pr-124/docs/hiecm/v3/getting-started/glossary#phr) app | `WellnessRecord`                                                            |
| [Invoice Record](https://nrces.in/ndhm/fhir/r4/StructureDefinition-InvoiceRecord.html)                    | Pharmacy invoices, consultation invoices and other billing                                                                                   | `Invoice`                                                                   |

The codes are the eight `hiTypes` values the linking and consent requests accept, `Invoice` included.

## Next steps

- [Bundles and validation](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/bundles): build and validate your first bundle.
- [Build a FHIR record](/docs/pr-124/docs/hiecm/v3/resources/standards/fhir/build): start from an NRCeS example instead of an empty file.
