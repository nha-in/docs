# FHIR

Fast Healthcare Interoperability Resources, FHIR, is a standard from Health Level Seven International, HL7, for exchanging health information electronically. It defines resources such as `Patient`, `Observation` and `MedicationRequest`, and a `Bundle` that carries them together.

ABDM uses FHIR release 4, R4. Base FHIR says a resource exists but not which fields an Indian record must fill. The profiles that say so are published by the National Resource Centre for EHR Standards, [NRCeS](https://nrces.in/ndhm/fhir/r4/index.html). An ABDM health record is an R4 document bundle that conforms to those profiles.

FHIR gives a record its shape. Code systems such as SNOMED CT and LOINC give its content meaning.

## Next steps

- [FHIR](/docs/main/docs/hiecm/v3/resources/standards/fhir): the implementation guide, the record types and their profiles, the bundle shape and how to validate one.
- [Standards and terminologies](/docs/main/docs/hiecm/v3/resources/standards): the code systems a record is coded with.
- [How a record travels](/docs/main/docs/hiecm/v3/concepts/data-flow): what happens to the bundle after you build it.
