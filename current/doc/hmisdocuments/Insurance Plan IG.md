# Insurance Plan IG

*Source: `hmisdocuments/Insurance Plan IG.docx` — extracted full content*

ABDM-NHCX IMPLEMENTER HANDBOOK

For InsurancePlan Discovery and Coverage Eligibility Validation

- Introduction

The National Health Claims Exchange (NHCX) enables standardized digital communication between provider systems (hospitals), payer systems (insurance companies), and third‑party administrators (TPAs) using HL7 FHIR standards.

Insurance policies have traditionally been distributed as PDF documents which require manual interpretation by hospitals. This often leads to ambiguity in policy benefits, claim conditions, and documentation requirements.

NHCX addresses this challenge by enabling insurers to publish digital policies using the FHIR InsurancePlan resource. Provider systems can retrieve these policies programmatically and validate beneficiary eligibility before treatment.

- Core APIs in Policy Discovery and Eligibility Validation

NHCX uses an asynchronous communication model where requests are initiated by provider systems and responses are delivered through callback APIs.

Request APIs

- /insuranceplan/request – Retrieve digital policy definition

- /coverageeligibility/check – Validate beneficiary eligibility

Callback APIs

- /insuranceplan/on_request – Response containing InsurancePlan bundle

- /coverageeligibility/on_check – Response containing CoverageEligibilityResponse

These APIs together allow hospitals to first retrieve the digital policy and then validate beneficiary eligibility for specific benefits.

- InsurancePlan API

The InsurancePlan API enables provider systems to retrieve the digital representation of an insurance policy applicable to a hospital. This digital policy includes structured information about:

- Coverage categories

- Treatment benefits

- Financial limits

- Claim conditions

- Required documents

- Questionnaires

- Policy attachments

Provider systems use this information to understand policy coverage before performing eligibility validation or initiating treatment.

- InsurancePlan Request Structure

The InsurancePlan request must be sent using a FHIR Task resource. Below is the InsurancePlan Request presented in a clear table format with sample data, mapped exactly to your JSON example and aligned with NHCX.

- InsurancePlan Request – Task (Overview)

| Attribute | Sample Value |
|---|---|
| API | /v1/insuranceplan/request |
| FHIR Resource | Task |
| Operation | InsurancePlan Discovery |
| Task.code | poll |
| Communication | Asynchronous (callback based) |

- Task – Core Elements (Table)

| Field | Cardinality | Sample Value | Description |
|---|---|---|---|
| resourceType | 1..1 | Task | Wrapper resource for InsurancePlan request |
| status | 1..1 | requested | Indicates request initiated |
| intent | 1..1 | order | Action requested from payer |
| code.coding.system | 1..1 | https://nhcx.abdm.gov.in/api | NHCX API namespace |
| code.coding.code | 1..1 | poll | Retrieve InsurancePlan |

- Task.code (Detailed)

| Element | Sample Value | Meaning |
|---|---|---|
| code | poll | Fetch information (not create/update) |
| system | https://nhcx.abdm.gov.in/api | Identifies NHCX operation |

- Task.input – Request Parameters (Table)

Rule: At least one input is mandatory.

Input 1 – Policy Number

| Field | Sample Value | Description |
|---|---|---|
| input.type.coding.code | policyNumber | Search parameter |
| input.valueString | POL987654321 | Insurance policy number |

Input 2 – Provider ID

| Field | Sample Value | Description |
|---|---|---|
| input.type.coding.code | providerId | Provider identifier |
| input.valueString | HFR123456 | Hospital HFR ID |

- Combined View – Task.input (Flattened)

| Parameter Name | Code | Sample Value | Mandatory |
|---|---|---|---|
| Policy Number | policyNumber | POL987654321 | No (at least one input required) |
| Provider ID | providerId | HFR123456 | No |

- Complete Example – JSON to Table Mapping

| JSON Path | Sample Value |
|---|---|
| Task.resourceType | Task |
| Task.status | requested |
| Task.intent | order |
| Task.code.coding[0].code | poll |
| Task.input[0].type.coding[0].code | policyNumber |
| Task.input[0].valueString | POL987654321 |
| Task.input[1].type.coding[0].code | providerId |
| Task.input[1].valueString | HFR123456 |

- InsurancePlan Callback Response

The response to the InsurancePlan request is delivered asynchronously through /insuranceplan/on_request. The response payload is encrypted. After decryption, the provider system receives a FHIR InsurancePlanBundle type “collection”. The InsurancePlan bundle returned by the payer may contain several FHIR resources as entry. These resources together provide the full digital representation of the insurance policy.

| Resource | Resource Description |
|---|---|
| InsurancePlan | Digital Policy structure |
| Organization | Insurance company/Provider Details |
| Questionnaire | This will provide the questionnaire for various document requirements such as STGs, Past History, Family History |

Follow tables provide element wise information, how each value will be coded by the payer. Provider systems should be able to understand the meaning of the values by following the information below.

There are two approaches where benefits under a given policy can be structured.

Approach 1:

plan → specificCost → category → benefit → cost → qualifiers

The specificCost element enables insurers to represent complex benefit definitions including package costs and additional cost elements. For example in PMJAY,

Speciality → specificCost.category
Package → benefit
Package Cost → benefit.cost
Implant → cost qualifier
Stratification → cost qualifier

- Plan → Specific Cost Structure

| Plan Name | Specific Cost Type | Cost Applicability | Cost Basis | Insight |
|---|---|---|---|---|
| PMJAY – Ayushman Bharat | Package-based Cost | Encounter / Episode of Care | Predefined Package Rate | Costs are not itemized billing, but package-driven, simplifying adjudication |

- Specific Cost → Category Mapping

| Specific Cost | Category | Category Scope | Insight |
|---|---|---|---|
| Package Cost | General Medicine | Hospitalization | Core cost driver of the plan |

- Category → Benefits Breakdown

| Category | Benefit Name | Benefit Type | Coverage Nature | Insight |
|---|---|---|---|---|
| General Medicine | Dengue fever | Financial Benefit | Fully Covered | No deductible or copay |

- Benefits → Cost Definition

| Benefit | Cost Type | Cost Value | Currency | Cost Rule |
|---|---|---|---|---|
| Dengue Fever | Package Rate | Fixed | INR | Predefined by authority |
| ICU Services | Included Cost | 0 (separate) | INR | Cannot be claimed independently |
| Implants | Conditional Cost | Variable | INR | Allowed only if package-approved |
| Medicines | Included Cost | 0 (separate) | INR | No separate reimbursement |
| Diagnostics | Included Cost | 0 (separate) | INR | During hospitalization only |

- Cost → Qualifiers (Critical for Eligibility & Adjudication)

| Cost Item | Qualifier Type | Qualifier Value | Operational Insight |
|---|---|---|---|
| ICU charges | Stratification | AS per policy code master |  |
| Stent | Implant | AS per policy code master |  |
| High end Medicines | Medicine | As per policy code master |  |
| High end diagnostic | Investigation | As per policy code master |  |

- InsurancePlan.plan — Fully Flattened Element Table

| Element Path | Cardinality | Data Type | Description / Usage | Binding / URL |
|---|---|---|---|---|
| InsurancePlan.plan | 0..* | BackboneElement | Cost sharing details for the plan offered to a consumer | — |
| InsurancePlan.plan.id | 0..1 | string | Unique id for inter-element referencing | — |
| InsurancePlan.plan.extension:claim-exclusion | 0..* | Extension (Complex) | Coverage exclusions such as pre-existing diseases, waiting periods, non-covered procedures | Claim-Exclusion |
| InsurancePlan.plan.extension:claimCondition | 0..* | Extension (Complex) | Conditions that must be satisfied to claim benefits | Claim-Condition |
| InsurancePlan.plan.extension:claimSupportingInfoRequirement | 0..* | Extension (Complex) | Mandatory documents required during claim processing | Claim-SupportingInfoRequirement |
| InsurancePlan.plan.identifier | 0..* | Identifier | Business identifier for the insurance product | — |
| InsurancePlan.plan.type | 1..1 | CodeableConcept | Type of insurance plan | Plan Type (example) |
| InsurancePlan.plan.type.coding.system | 1..1 | uri | Terminology system identifier | — |
| InsurancePlan.plan.type.coding.version | 0..1 | string | Terminology version | — |
| InsurancePlan.plan.type.coding.code | 1..1 | code | Code representing plan type | — |
| InsurancePlan.plan.type.coding.display | 1..1 | string | Human-readable plan type | — |
| InsurancePlan.plan.network | 0..* | Reference(Organization) | Provider network offering coverage | — |
| InsurancePlan.plan.generalCost | 0..* | BackboneElement | Overall sum insured / general cost details | This should be PMJAY overall sum insured |
| InsurancePlan.plan.specificCost | 0..* | BackboneElement | Specific cost definitions per benefit | — |
| InsurancePlan.plan.specificCost.id | 0..1 | string | Unique id for inter-element referencing | — |
| InsurancePlan.plan.specificCost.category | 1..1 | CodeableConcept | High-level benefit category | Benefit Category (GM) |
| InsurancePlan.plan.specificCost.category.coding.system | 1..1 | uri | Terminology system | — |
| InsurancePlan.plan.specificCost.category.coding.version | 0..1 | string | Terminology version | — |
| InsurancePlan.plan.specificCost.category.coding.code | 1..1 | code | Benefit category code | GM |
| InsurancePlan.plan.specificCost.category.coding.display | 1..1 | string | Benefit category name | General Medicine |
| InsurancePlan.plan.specificCost.benefit | 0..* | BackboneElement | List of benefits under the category | Benefits covered in a given category |
| InsurancePlan.plan.specificCost.benefit.id | 0..1 | string | Unique id for inter-element referencing | — |
| InsurancePlan.plan.specificCost.benefit.type | 1..1 | CodeableConcept | Specific product / service (package) | ProductOrService (BM001) |
| InsurancePlan.plan.specificCost.benefit.type.coding.code | 1..1 | code | Package / service code | BM001 |
| InsurancePlan.plan.specificCost.benefit.type.coding.display | 1..1 | string | Package / service name | Package Names |
| InsurancePlan.plan.specificCost.benefit.cost | 0..* | BackboneElement | Cost definitions for the benefit | — |
| InsurancePlan.plan.specificCost.benefit.cost.id | 0..1 | string | Unique id for inter-element referencing | — |
| InsurancePlan.plan.specificCost.benefit.cost.type | 1..1 | CodeableConcept | Type of cost (package, implant, copay, etc.) | — |
| InsurancePlan.plan.specificCost.benefit.cost.qualifiers | 0..* | CodeableConcept | Additional qualifiers or constraints | Stratification/Implant/investigation |
| InsurancePlan.plan.specificCost.benefit.cost.value | 0..1 | Quantity | Actual monetary or unit value | This amount will be paid extra over and above the procedure cost |

Approach 2:

coverage → benefit → limit

Below is a clear table format with realistic sample data, mapped directly to the structure you shared (FHIR R4 – Coverage → Benefit → Limit), using ABDM / NDHM-style examples.

- Coverage Level – Sample Data (Table)

| Field | Cardinality | Sample Value | Notes |
|---|---|---|---|
| coverage.id | 0..1 | cov-ip-01 | Internal reference ID |
| coverage.type.coding.system | 1..1 | https://nrces.in/ndhm/fhir/CodeSystem/coverage-type | Terminology system |
| coverage.type.coding.code | 1..1 | IP | In-Patient |
| coverage.type.coding.display | 1..1 | In-Patient Hospitalization | Human readable |
| coverage.type.text | 0..1 | In-Patient Hospitalization | Plain text |
| coverage.network | 0..* | Apollo Hospitals Network | Empanelled provider |
| coverage.extension (claim-condition) | 0..* | Waiting period: 30 days | Claim eligibility rule |
| coverage.extension (claim-supportingInfoRequirement) | 0..* | Discharge summary, Final bill | Mandatory documents |

- Benefit Level – Sample Data (Table)

| Field | Cardinality | Sample Value | Notes |
|---|---|---|---|
| benefit.id | 0..1 | ben-icu-01 | Benefit identifier |
| benefit.type.coding.system | 1..1 | https://nrces.in/ndhm/fhir/CodeSystem/benefit-type | Benefit terminology |
| benefit.type.coding.code | 1..1 | ICU | ICU Charges |
| benefit.type.coding.display | 1..1 | Intensive Care Unit Charges | Display name |
| benefit.type.text | 0..1 | ICU Charges | Plain text |
| benefit.requirement | 0..1 | Pre-authorization required | Referral rule |
| benefit.extension (claim-condition) | 0..* | Max 10 days per hospitalization | Condition |
| benefit.extension (claimSupportingInfoRequirement) | 0..* | ICU daily chart | Supporting document |

Same claim-related extensions apply at benefit level too:

- claim-condition

- claimSupportingInfoRequirement

- Benefit Limit – Sample Data (Table)

| Field | Cardinality | Sample Value | Notes |
|---|---|---|---|
| limit.id | 0..1 | lim-icu-amt-01 | Limit identifier |
| limit.value.value | 0..1 | 500000 | Numeric value |
| limit.value.unit | 0..1 | INR | Currency |
| limit.value.system | 0..1 | http://unitsofmeasure.org | UCUM |
| limit.value.code | 0..1 | StratificationCode | Unit code |
| limit.code.text | 0..1 | Stratification Description | Description |

- Combined View (Coverage → Benefit → Limit)

| Coverage Type | Benefit Type | Requirement | Limit | Claim Conditions | Supporting Documents |
|---|---|---|---|---|---|
| In-Patient Hospitalization | ICU Charges | Pre-auth required | ₹5,00,000 / year | Max 10 ICU days | Discharge summary, ICU chart |
| In-Patient Hospitalization | Room Rent | NA | ₹10,000 / day | As per room category | Final bill |
| In-Patient Hospitalization | Surgeon Fees | NA | Covered up to SI |  |  |

- CoverageEligibility API

The CoverageEligibility API validates whether a beneficiary is eligible for a specific benefit defined in the policy. This API is used after retrieving the policy using the InsurancePlan API and the beneficiary is having a valid policy linked to his/her ABHA.

The API verifies:
• Policy validity
• Beneficiary enrollment
• Coverage availability
• Benefit limits
• Authorization requirements

- Supported Purposes

The CoverageEligibilityRequest resource uses the purpose field to specify the type of validation.

Supported purposes include:

• discovery – Check if a policy exists for the beneficiary
• validation – Verify eligibility before treatment
• benefits – Retrieve coverage limits and benefits
• auth-requirements – Check if preauthorization is required

Below are tabular, fully-flattened (one-table) Request and Response tables for CoverageEligibility with purpose as Validation and Auth-requirements

- CoverageEligibilityRequest — Flattened Table (Request Bundle)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| Bundle.resourceType | 1..1 | string | Bundle |
| Bundle.id | 0..1 | id | a2bb0c37-1f63-47e8-a096-be2b550c913a / 12345 |
| Bundle.meta.lastUpdated | 0..1 | instant | 2025-11-28T17:52:16+05:30 / 2025-07-16T12:04:10.721+05:30 |
| Bundle.type | 1..1 | code | collection |
| Bundle.timestamp | 0..1 | instant | 2025-11-28T17:52:16+05:30 / 2025-07-16T12:04:10.721+05:30 |
| Bundle.identifier.value | 0..1 | string | b9d5e467-1c1d-476e-802e-13237bc0cf80 |
| Bundle.entry[*].fullUrl | 0..1 | uri | e.g., CoverageEligibilityRequest/ea334899-85dd-4f24-ad24-b59cd96fc394 |
| Bundle.entry[*].resource.resourceType | 1..1 | string | CoverageEligibilityRequest, Patient, Organization, Coverage, PractitionerRole |

- Request Resource: CoverageEligibilityRequest (Flattened)

Core request identifiers + intent

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.resourceType | 1..1 | string | CoverageEligibilityRequest |
| CoverageEligibilityRequest.id | 0..1 | id | b8b5eba8-a2f7-493f-96fd-5893c4d6c177/100149-25747 |
| CoverageEligibilityRequest.meta.profile | 0..* | canonical |  |
| CoverageEligibilityRequest.status | 1..1 | code | active |
| CoverageEligibilityRequest.priority.coding.system | 0..1 | uri | http://terminology.hl7.org/CodeSystem/processpriority |
| CoverageEligibilityRequest.priority.coding.code | 0..1 | code | normal |
| CoverageEligibilityRequest.priority.coding.display | 0..1 | string | Normal |
| CoverageEligibilityRequest.purpose[*] | 1..* | code | validation OR auth-requirements |

Patient / Servicing / Creation

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.patient.reference | 1..1 | Reference(Patient) | Patient/PMJAY/HP/S/G OR absolute URL patient ref |
| CoverageEligibilityRequest.servicedDate | 0..1 | date | 2025-11-28 / 2025-07-16 |
| CoverageEligibilityRequest.servicedPeriod.start | 0..1 | dateTime | 2025-11-28 |
| CoverageEligibilityRequest.servicedPeriod.end | 0..1 | dateTime | 2025-11-28 |
| CoverageEligibilityRequest.created | 0..1 | dateTime | 2025-11-28T17:52:16+05:30 / 2025-07-16T12:04:10+05:30 |

Actors: Provider / Insurer / Enterer

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.provider.reference | 0..1 | Reference(Organization) | Organization/ApolloHospitalTest OR absolute provider org URL .../organization/provider/25747 |
| CoverageEligibilityRequest.insurer.reference | 0..1 | Reference(Organization) | Organization/SHAHP OR absolute payer URL .../organization/payer/1518 |
| CoverageEligibilityRequest.enterer.reference | 0..1 | Reference(Practitioner) | .../practitioner/USER1000088 |
| CoverageEligibilityRequest.facility.identifier.system | 0..1 | uri | https://nhcx.pmjay.gov.in |
| CoverageEligibilityRequest.facility.identifier.value | 0..1 | string | 1000003599@hcx OR USER1000088 |

Insurance block

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.insurance[*].focal | 0..1 | boolean | true |
| CoverageEligibilityRequest.insurance[*].coverage.reference | 1..1 | Reference(Coverage) | Coverage/PMJAY/HP/S/G OR absolute coverage URL .../coverage/PMJAY/HP/S/G |

Item (present in Benefits Request sample)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityRequest.item[*].category.coding.system | 0..1 | uri | pmjay |
| CoverageEligibilityRequest.item[*].category.coding.code | 0..1 | code | MG |
| CoverageEligibilityRequest.item[*].category.coding.display | 0..1 | string | General Medicine |
| CoverageEligibilityRequest.item[*].productOrService.coding.system | 0..1 | uri | pmajy |
| CoverageEligibilityRequest.item[*].productOrService.coding.code | 0..1 | code | MG003B, MG004A, IN047A, IN051A |
| CoverageEligibilityRequest.item[*].productOrService.coding.display | 0..1 | string | proc1, proc2, inv1 |

- CoverageEligibilityResponse — Flattened Table (Response Bundle)

Bundle-level (both response samples)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| Bundle.resourceType | 1..1 | string | Bundle |
| Bundle.id | 0..1 | id | ea334899-85dd-4f24-ad24-b59cd96fc394 |
| Bundle.meta.lastUpdated | 0..1 | instant | 2025-11-28T17:52:28.591+05:30 / 2025-07-17T19:01:50.449+05:30 |
| Bundle.type | 1..1 | code | collection |
| Bundle.timestamp | 0..1 | instant | 2025-11-28T17:52:28.591+05:30 / 2025-07-17T19:01:50.449+05:30 |
| Bundle.identifier.system | 0..1 | uri | https://payer.pmajy.nha.gov.in (response benefit sample) |
| Bundle.entry[*].resource.resourceType | 1..1 | string | CoverageEligibilityResponse, plus referenced Patient, Coverage, Organization |

Response Resource: CoverageEligibilityResponse (Flattened)

Core response fields

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.resourceType | 1..1 | string | CoverageEligibilityResponse |
| CoverageEligibilityResponse.id | 0..1 | id | PZ2Q9UZHM-1000003599 OR PZ2Q9UZHX-25747 |
| CoverageEligibilityResponse.status | 1..1 | code | active |
| CoverageEligibilityResponse.purpose[*] | 1..* | code | validation OR benefits |
| CoverageEligibilityResponse.patient.reference | 1..1 | Reference(Patient) | payer patient URL (e.g., .../patient/PZ2Q9UZHM) |
| CoverageEligibilityResponse.created | 0..1 | dateTime | 2025-11-28T17:52:28+05:30 / 2025-07-17T19:01:50+05:30 |
| CoverageEligibilityResponse.requestor.reference | 0..1 | Reference(Organization) | provider org URL (.../organization/provider/1000003599 / .../provider/25747) |
| CoverageEligibilityResponse.request.reference | 0..1 | Reference(CoverageEligibilityRequest) | CoverageEligibilityRequest/ea334... OR display URL to request /check/.../null |
| CoverageEligibilityResponse.outcome | 1..1 | code | complete |
| CoverageEligibilityResponse.disposition | 0..1 | string | Policy is currently in-force |
| CoverageEligibilityResponse.insurer.reference | 0..1 | Reference(Organization) | payer org URL (.../payer/1518 / .../payer/7078) |

Insurance (coverage + inforce)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.insurance[*].coverage.reference | 1..1 | Reference(Coverage) | .../coverage/100155PZ2Q9UZHM OR .../coverage/100149 |
| CoverageEligibilityResponse.insurance[*].inforce | 0..1 | boolean | true |

Response Item (Validation vs Benefits)

Validation-style items

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.insurance[*].item[*].productOrService.coding.system | 0..1 | uri | http://snomed.info/sct |
| CoverageEligibilityResponse.insurance[*].item[*].productOrService.coding.code | 0..1 | code | 305056002 |
| CoverageEligibilityResponse.insurance[*].item[*].productOrService.coding.display | 0..1 | string | Admission procedure |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].type.coding.system | 0..1 | uri | http://terminology.hl7.org/CodeSystem/ex-benefitcategory |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].type.coding.code | 0..1 | code | 30 |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].type.coding.display | 0..1 | string | Health Benefit Plan Coverage |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].allowedMoney.value | 0..1 | decimal | 0 |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].allowedMoney.currency | 0..1 | code | INR |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].usedMoney.value | 0..1 | decimal | 500000 |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].usedMoney.currency | 0..1 | code | IN |
| CoverageEligibilityResponse.insurance[*].item[*].authorizationRequired | 0..1 | boolean | true |

Benefits-style items (Coverage-Resp-Benefit-new sample)

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.insurance[*].item[*].category.coding.code | 0..1 | code | 100005 |
| CoverageEligibilityResponse.insurance[*].item[*].category.coding.display | 0..1 | string | General Medicine |
| CoverageEligibilityResponse.insurance[*].item[*].productOrService.coding.code | 0..1 | code | 100478 / 100063 / 100012 |
| CoverageEligibilityResponse.insurance[*].item[*].productOrService.coding.display | 0..1 | string | Juvenile myasthenia... / Treatment details / HDU |
| CoverageEligibilityResponse.insurance[*].item[*].excluded | 0..1 | boolean | false (some items), true (one sample line shows excluded true) |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].type.coding.system | 0..1 | uri | https://hl7.org/fhir/R4/codesystem-benefit-type.html |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].type.coding.code | 0..1 | code | Procedure / Investigation / Stratification |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].allowedMoney.value | 0..1 | decimal | 0 OR 3300 (HDU stratification) |
| CoverageEligibilityResponse.insurance[*].item[*].benefit[*].allowedMoney.currency | 0..1 | code | INR |
| CoverageEligibilityResponse.insurance[*].item[*].authorizationRequired | 0..1 | boolean | true |

Authorization Supporting (mandatory docs returned in response – Benefits sample)

PMJAY response includes authorizationSupporting entries showing required supporting info codes like MAND0409, MAND0006, etc.

| Element Path | Cardinality | Type | Example Value / Notes |
|---|---|---|---|
| CoverageEligibilityResponse.insurance[*].item[*].authorizationSupporting[*].coding.code | 0..1 | code | MAND0409,MAND0104, MAND0062 |
| CoverageEligibilityResponse.insurance[*].item[*].authorizationSupporting[*].coding.display | 0..1 | string | any investigations done,Detailed ICPs, etc. |
| CoverageEligibilityResponse.insurance[*].item[*].authorizationSupporting[*].text | 0..1 | string | Contains “Type: Pre/Post” and “Procedure Code: …” text |

- Provider Responsibilities

Provider systems must:

- Retrieve digital policies using InsurancePlan APIs

- Interpret benefits and cost structures

- Validate beneficiary eligibility using CoverageEligibility APIs

- Ensure required documents and conditions are satisfied before claim submission

- Payer Responsibilities

Payer systems must:

- Publish InsurancePlan bundles

- Maintain accurate policy definitions

- Validate beneficiary eligibility requests

- Return responses through asynchronous callback APIs

- Implementation Workflow

Typical integration workflow:

- Patient arrives at hospital

- Provider retrieves policy using /insuranceplan/request

- Payer returns InsurancePlan bundle through callback

- Provider selects relevant benefit

- Provider calls /coverageeligibility/check

- Payer validates eligibility

- Eligibility response returned through callback

- Hospital proceeds with treatment or preauthorization
