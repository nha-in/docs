# https://hcxsbx.abdm.gov.in/#/domain-specifications/domain-data-specifications/terminologies

Terminologies (Code sets or Metadata standards)
To achieve semantic interoperability, it is recommended that NHCX data standards incorporate well established and suitable terminology and coding systems.
In various HL7 standards (including FHIR), these are expressed as Concepts and codes and forms essential vocabulary, ontological binding for resources used to describe document types/categories, element codes and clinical coding like procedure codes, diagnosis codes etc. The data standards defined using FHIR resources and types usually will require agreement on references and usages, through agreed Code Systems and codes, typically manifested through ValueSets.
Guidlines
For Clinical resources (e.g. Condition, Procedure, Observations) - please refer to the guidance issued by NRCeS.
In India, SNOMED-CT is free for use by all as Clinical Terminology, while ICD codes are used for classifications.
Labs typically use LOINC codes
For other code/concepts in the FHIR based data standards, we would recommend guidelines
If any attributes are marked as “required” - then, use of the codes defined in the value sets
If it is marked as “preferred” or “extensible” - then, users are encouraged to draw from the specified codes for interoperability purposes, unless deemed appropriate within the affinity domain.
If marked as “example” - then the domain must agree and define a value set for usage.
ValueSet may be created derived from existing sets, either composed/included from the base or expanded.
For insurance claim domain specific element attributes (e.g. Claim.type) - the domain may define and establish value sets, as suitable in India’s context.
For the broader ABDM interoperability and conformance, NHCX would align/inherit domain specific guidelines.
The table below lists the code systems/value sets proposed by current domain working groups. Based on the above guidelines, we are proposing them to be “preferred” or “example” binding strengths as per
FHIR Terminology binding strength definitions (Section 4.1.5).
Terminology Name
FHIR Value Set link
Proposed Binding Strength
Insurance Company Owners (coverageeligibilityrequest.insurer)
link
Preferred
Procedure Type (claim.procedure.type)
link
Example
Procedure Code (claim.procedure.procedureCode)
link
Example
Denial Codes (claimresponse.item.adjudication.reason)
link
Preferred
Procedure Modifiers (claim.item.modifier)
link
Example
Service Categories (claim.item.category)
link
Example
Service Codes (claim.item.productOrService)
link
Preferred
Medical Speciality Type (practitionerRole.speciality)
link
Preferred
Health Service Provider role (claim.careTeam.role)
link
Example


## Links on this page

- https://www.hl7.org/fhir/terminologies.html
