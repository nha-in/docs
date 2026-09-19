# https://hcxsbx.abdm.gov.in/#/domain-specifications

Domain Specifications
The primary focus of domain specifications is to establish standardized formats for data exchange terminologies (taxonomies) These specifications include the following: 
Domain Data Specifications
Agreement on data exchange formats and terminologies (taxonomies) is essential for domain specifications. These specifications would mainly include:
Domain data models:
 are schema definitions of domain resources such as claims, providers, payers, policies, etc., and metadata specifications. The domain models are encoded using FHIR version 4 and published by National Resource Center for EHR Standards, CDAC. Please refer to the link.
https://nrces.in/ndhm/fhir/r4/hcx-profile.html
Metadata Specifications:
 Metadata is data about data, which is associated with an object, document, or dataset for the purpose of describing, administering, ensuring technical functionality, and preserving the data. In the context of health claims, metadata specifications mainly involve coding systems and suggested values for key claim attributes such as disease codes, procedure codes, diagnostic codes, and billing-related codes (e.g. room rent, ICU charges, etc.)
To achieve this objective, in compliance with the main design principles outlined in the National Health Claims Exchange - Open Specifications, the following key design guidelines are recommended.
Key design considerations for FHIR profiles of NHCX
Base resource profiling
Profiling of the base resources is done to set minimum expectations for the Providers, Insurers and TPAs, to exchange financial and clinical information. 
Re-use and Refer to existing ABDM FHIR Resources.
Published as part of the existing
FHIR Implementation Guide for ABDM.
Data Structure
FHIR Bundle resource has been adopted for encapsulation of the data shared across NHCX APIs. A Bundle can carry a collection of resources meeting certain criteria as part of any service operation.
The Bundle type ‘collection’ is identified to be suitable for NHCX. Bundle type collection allows all the FHIR requisite resources and provides claim cycle specific information flow like Eligibility check, pre-auth request, Claims request, etc.
The resources can be included directly as entries and no further/meta information is needed.
Focused NHCX Resources:
Preauth 
Preauth Response
Claim 
Claim Response 
Coverage Eligibility Request 
Coverage Eligibility Response 
InsurancePlan 
Payment Notice 
Payment Reconciliation 
Task
Stakeholder Consultation
Inputs from Domain Experts, Healthcare Providers, and Technical Experts for the design and development of the profiles.
Feedback from the vibrant community of implementors from India including the FHIR India Community and NHCX Community.
Involvement of expert bodies/organizations such as IRDAI.
Domain Data Models
Domain Data refers to structured information that is specific to a particular field or industry, in this case, healthcare and health claims processing. It encompasses all relevant data required to manage and exchange information within a domain. In the context of health claims, domain data includes essential information for processing claims, such as patient records, diagnosis, procedures, and payment details.
Components of Domain Data in Health Claims: 
Patient Information: 
Includes personal details like name, age, gender, and identification numbers (e.g., insurance ID).
Claims Information: 
Data regarding the claim, such as claim number, date of submission, and status. - Diagnosis Codes: Medical coding systems (like ICD) used to identify and classify patient illnesses or conditions.
Procedure Codes: 
Codes representing medical procedures or treatments provided to the patient, often following standards like CPT (Current Procedural Terminology).
Billing Information: 
Data related to costs incurred, such as hospital charges, procedure costs, room rent, and other expenses.
Provider Details: 
Information about the healthcare provider or facility submitting the claim, including credentials and authorization.
Payer Details:
Information regarding the insurance company or payer responsible for processing and reimbursing the claim.
Policy Information:
Details about the patient’s health insurance policy, including coverage limits, terms, and exclusions.
Metadata: 
Additional details like timestamps, status codes, and audit logs related to claim processing.
Bundle Structure
In healthcare data exchange, a Bundle is a structured collection of resources grouped for transmission as a single unit. In the context of FHIR (Fast Healthcare Interoperability Resources), a Bundle is a container that holds multiple FHIR resources, allowing them to be transmitted or stored together. Each entry in the bundle represents a different FHIR resource, and the entire bundle is treated as a single message or dataset.
Types of Bundles:
Document Bundle: Contains a collection of resources that form a clinical document.
Message Bundle: Represents a set of resources used to form a message.
Transaction Bundle: Used for creating or updating multiple resources in a single transaction. 
Collection Bundle: Holds an unordered set of resources, where the order doesn't matter. 
Structure of a Bundle:
Bundletype: Specifies the type of bundle, e.g., "document," "message," "transaction," or "collection."  
Entry: Contains an unordered list of FHIR resources.  
Request/Response: Information about the HTTP action (for transactions). In the example you mentioned, an e-claim Bundle follows the "collection" type, where each entry in the bundle contains resources necessary for processing health claims.  
For example, in a CoverageEligibilityRequest, the bundle would contain the corresponding FHIR resource for that specific action, which would be processed by the recipient system accordingly. 
Reference: 
The FHIR standard defines the Bundle resource and its usage. You can read more about it here in the FHIR R4 documentation. This structure ensures that different systems can interpret and process the bundled resources efficiently, whether they are handling health claims, eligibility checks, or other healthcare-related transactions.
Domain Headers
All data objects must be encrypted and transmitted securely within the API request body, ensuring that the actual payload is inaccessible to the NHCX gateways. However, providers and payers may share specific information with the NHCX gateways through fields available in the API request body. This information is sent as key-value pairs in the “domain_header” section of the request body and is stored by NHCX gateways for auditing and reporting purposes.
Each data object must define the specific values to be included in the “domain_header“of the API request body, adhering to the protocols outlined in the domain specifications. The domain headers serve as metadata and are essential for protocol-level operations such as auditing, but they do not carry sensitive health or claim-related data, which is protected within the encrypted payload. These fields must follow the naming convention x-NHCX- - for consistency across different implementations. For further reference, you can consult the domain specifications provided in the FHIR HCX profile: HCX Domain Specification
Implementation Guide
An Implementation Guide (IG) is published to assist ecosystem implementers in developing flow-specific payloads based on the FHIR specification for use within the NHCX ecosystem. This guide provides a set of rules and guidelines on how FHIR resources should be used, supported by detailed documentation to clarify and facilitate their proper implementation. The IG is designed to ensure that all stakeholders, including payers, providers, and other participants, can build and validate their content against the entire implementation guide. The guide also provides resources to validate payloads, ensuring they adhere to the established standards and protocols. The expanded profiles and structures of FHIR bundles and resources, as required for NHCX, can be accessed via the following link:
NHCX FHIR Profile.
This guide serves as a key resource for understanding how to implement and utilize FHIR resources in compliance with the NHCX protocols, supporting interoperability and seamless communication across the healthcare ecosystem. 
Terminologies (Code sets or Metadata standards)
To achieve semantic interoperability, it is essential to incorporate established and widely accepted terminology and coding systems in NHCX data standards. These terminologies ensure that healthcare information is uniformly understood across different systems and stakeholders. In many HL7 standards, including FHIR, these terminologies are represented through concepts and codes, providing a necessary vocabulary and ontological framework for resources. They are used to define document types, element codes, and clinical coding systems such as procedure and diagnosis codes. In the context of FHIR, data standards often rely on Code Systems and ValueSets for consistent reference and usage. Code Systems define sets of concepts, and ValueSets define which codes from those systems can be used in a particular context. Adopting these will require agreement on their references and usages. NHCX follows domain-specific guidelines that align with the broader ABDM interoperability framework, ensuring uniformity across implementations. The table below lists key code systems and value sets proposed by the National Health Authority (NHA), and these terminologies are suggested to have "preferred" or "example" binding strengths, following FHIR Terminology binding strength definitions.
Terminology Name Term
FHIR Value Set link
Insurance Company Owners
coverageeligibilityrequest.insurer
Procedure Type
claim.procedure.type
Procedure Code
claim.procedure.procedure 
Denial Codes
claimresponse.item.adjudication.reason
Procedure Modifiers
claim.item.modifier
Service Categories
claim.item.category
Service Codes
claim.item.productOrService 
Medical Speciality Type
practitionerRole.speciality
Health Service Provider role
claim.careTeam.role
These terminologies ensure that the data is encoded in a standard manner, enabling smooth communication and processing between the various systems participating in the health claims exchange ecosystem. For more details on the code sets and their usage, you can explore the
FHIR Value Sets and Code Systems
 used in NHCX.
Operational Guidlines
For a successful data exchange, it is important to have clear guidelines regarding various activities involved in onboarding entities on the NHCX ecosystem. These guidelines are essential to establish trust among all participants. The following are the areas are addressed:
Onboarding
Defaulting/Deboarding policies
Access control policies - These policies will determine the roles of each participant and their access to different parts of the data. This will also impact the visibility and access to domain-specific attributes that are included in the data structures defined by the data exchange.
Business SLAs
Service rating policies - The parameters and mechanisms for rating each participant's (actor) performance in the data exchange.
For the claims data exchange to be successful, it is important to have the trust and cooperation of all players in the ecosystem. Therefore, the policies that govern the exchange should aim to enable and gain the trust of the ecosystem. To achieve this, the following guidelines are recommended:
Participation and disqualification rules should be clearly defined and transparent.
Data exchange protocols/specifications should follow the principle of minimalism and be continuously improved over time.
Access Controls
The National Health Claims Exchange ecosystem involves participating systems with different roles. These roles are based on the base set of organization roles defined in HL7 specifications, and they are further qualified using namespaced coding to fit the claims exchange process.The following are the roles that participating systems may possess:
provider: Health Service Provider
payer: Insurance service provider
agency.tpa: Third party administrator acting on behalf of the payer. This role is expected to behave like a payer from the data exchange perspective.
agency.regulator: Regulatory bodies like IRDAI and IIB
research: Research groups, etc.
member.isnp: eCommerce platforms facilitating insurance adoption
agency.sponsor: Scheme owners of specific programs, e.g., NHA for Ayushman Bharat
HIE/HIO.NHCX: Other NHCXs
The corresponding access rights and scenarios for each role are described in the following table.
Role
Allowed actions
Comments
provider
Eligibility check
Send request
Receive response
Pre Auth
Send request
Receive response
Claims Request
Send request
Receive response
Payment
Receive Notice
Send Acknowledgement
Search/Status
Pre Auth
Claims Status
Providers can make search/status requests for multiple requests that originated from them.
payer/ agency.tpa
Eligibility check
Receive request
Send response
Pre Auth
Receive request
Send response
Claims Request
Receive request
Send response
Payment
Send Notice
Receive Acknowledgement
Search/Status
Payment confirmation
Payers can make search/status requests for multiple payment notices that originated from them.
agency.regulator
Search
Claims
Data exchange switch will forward the search request to all payers who are expected to return the claims data in the proposed FHIR structure as per regulator’s policies.
research
Eligibility check
Receive request
Send response
Search
Pre Auths - aggregate and/or anonymised
Claims - aggregate and/or anonymised
All data exhausts for these roles would only have aggregate and anonymised data. Key aggregations for eligibility requests, preauthentication, claims and payments information will need to be further defined.
member.isnp
Eligibility check
Receive request
Send response
Search
Pre Auths - aggregate and/or anonymised
Claims - aggregate and/or anonymised
Claims - Individual claims data as per beneficiary consent
As facilitators of insurance eCommerce, it is proposed to provide ISNPs access to the data available to research role as well as individual beneficiary queries (preauth, claims) based on beneficiary consent. This consent flow is expected to work with existing consent management infrastructure and ISNPs are expected to submit the acquired consent as part of the domain header.
agency.sponsor
As planners of the insurance schemes, sponsors are proposed to be given access equivalent to payer role.
HIE/HIO.NHCX
As an NHCX this participant is expected to play different roles as per the need of the use case. However, due to the data privacy and security measures prescribed in the Open Protocol, it will not be able to view the actual payload.
Guidelines for Participant Onboarding
Pre-requisites 
Step 1:
Registration with Health Facility Registry (HFR)
Please visit 
https://facility.abdm.gov.in/
 to complete the facility registration process. Please write to facility@nha.gov.in in case of any question on this step.
Step 2:
Apply on ABDM sandbox by filling in the registration form. The pre-requisite for NHCX is ABHA creation and verification. This implies that you must also complete the milestone M1 integration process. Firstly, apply for sandbox registration:
https://sandbox.abdm.gov.in/sandbox/v3/
Step 3:
M1 Integration process under ABDM It is mandatory for your software to be enabled with M1 functionalities.
Documentation on ABDM Milestone:
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=getting-started
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=Milestone_one
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=postman_collections
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=ABDM_M3_V1
Please follow our test cases for M1 and postman collection:
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=TestCases
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=postman_collections
Please visit Webinars 17 and 18 for detailed M1 integration at:
https://sandbox.abdm.gov.in/sandbox/v3/webinars
Link: 
https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration
Further information: 
https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=ABDMSandboxSignup
Integration support team will guide you if you encounter any roadblocks in the process. Please reach out to:
integration.support@nha.gov.in
After this step, the integrator can start with NHCX integration.
NHCX Onboarding
This section provides guidelines and an approach for participant onboarding in an NHCX ecosystem. As mentioned in the Access Control section above, there are different types of participants that need onboarding into an NHCX registry.
The onboarding process for NHCX is a two-step process, which is outlined below:
Sandbox - for compliance testing and certification
Go Live on live instance
Sections below provide a high-level process for each of these steps
1.  NHCX Sandbox Process
The main objective of the sandbox is to assist the ecosystem in testing their individual components against communication standards and obtaining certification to become part of the system. Participants who complete the sandbox process successfully can use their certification to access the NHCX production environment.
Below are the steps for integrating, testing, and launching with the assistance of the sandbox:
Step 1:
Registration to access the NHCX sandbox, participants must submit an online application expressing their interest through the online portal
 https://sandbox.abdm.gov.in.
Their applications are verified by conducting basic checks against the information provided. Some requests may not meet the requirements for sandbox access, such as multiple requests from the same participant, unregistered participants, Technology service providers without a valid website, and spam applications, among others, and will have to be filtered out. This process will be partially manual. Participants who pass the verification process will be added to the NHCX sandbox and provided with the necessary credentials (sandbox Client ID and secret key) to access the sandbox environment. 
The client ID and client secret obtained from the sandbox ABDM portal during Milestone 1 integration must be used to generate an access token. Headers for reference- Api -
https://dev.abdm.gov.in/gateway/v0.5/sessions
This access token will be passed in headers of the:
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice
/participant/create
After this you need to hit
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice
/participant/create
 api to generate the participant code for your respective registryid (client_id).
The same process will be followed if you are onboarding as a Payer / Provider. 
Step 2:
Technology development: API integration and testing This step involves integrating the participants' claim processing applications with the NHCX sandbox to ensure compliance with NHCX standards and building any missing pieces on their side to use the NHCX APIs required for their planned workflows.
The sandbox website provides documentation and suggestions regarding software libraries, tools, and example implementations for encryption, FHIR resource generation, code generation, and other complex parts of the NHCX protocol. The sandbox portal provides participants with all necessary help to get started and complete API integration.
Please visit 
https://hcxsbx.abdm.gov.in/#/documents
 the use case documents for provider & payer are present in the website and can be downloaded.
Step 3:
Sandbox Certification: All participants must fulfill a set of functional (FHIR bundle validation, functional testing of key use cases) and security tests/flows applicable to them. The functional testing will be done on two levels- first with the internal NHCX team and final will be the HTC demo. After testing the system against the applicable test cases, participants must submit their test results, including the application's usage of and interaction with NHCX APIs, to the Sandbox Operator for review and approval. Upon successful review, the sandbox will issue a successful completion certificate. Participants can use this certificate to onboard the production environments of NHCX operators.
2.  Go Live Process
Once the participant obtains the sandbox certification from the affiliated NHCX, they can apply for onboarding to the NHCX production environment. The following are the key steps in the onboarding process:
Step 1: Role Assignment in Production: 
The appropriate role (payer/provider) will be assigned after the successful completion of the sandbox exit process.
Provider onboarding
Hospital nodal officer enroll the entity details in HFR
Details includes Entity Name, Entity HFR Id, Entity Address, Role as PROVIDER, Bridge Id(Provided by Software Vendor), public certificate for encryption or any other information required by the authority and upon successful registration, ABDM Gateway team will issue client credentials to access NHCX APIs with role as “PROVIDER”.
HMIs will register the Hospital into the NHCX registry.
Once the data is received by NHCX, NHCX system also verify the HFR Id by calling HFR registry APIs to validate the details provided during registration.
Once the data is verified by NHCX, the Hospital will be issued the participant code from the NHCX system.
Payer Onboarding
Insurance or TPA nodal officer enroll the entity details in NHA/IRDAI portal as PAYER/TPA
Details includes Entity Name, Entity Registry Id, Entity Address, Role as payer/TPA, Bridge Id(Provided by Software provider), public certificate for encryption or any other information required by the authority
IRDAI/NHA officer scrutiny the information provided by the payer and take an action.
Upon approval of the enrolment form, NHA portal/IRDAI portal register the participant by calling the register APIs.
Once the data is received by NHCX, NHCX system also verify the registry information by calling appropriate registry APIs.
Once the data is verified by NHCX, a communication will be sent to ABDM Gateway team to issue client credentials to access NHCX APIs with role as “PAYER” or” TPA” as per the request.
Step 2: Provisioning of production credentials:
Upon meeting the requirements, participants will be accessing Client ID and secret credentials (which will be the same as what you received in Production ABDM M1). It is the responsibility of participants to safeguard the secret credentials and immediately report any breaches to the NHCX Operators.
Step 3: NHCX Registration:
If a participant is already registered in the ABDM Health Facility registry/ IRDAI registry, they should have the option to use HFR/ IRDAI authentication to register in the NHCX registry. Follow the link for the detailed process of onboarding providers and payers in the system.
Step 4: Go-Live
Participants must prepare their application for go-live in their respective environments after obtaining the production credentials. NHCX recommends conducting the necessary training for staff and planning for change management before going live in production, preferably after a pilot with a small set of clients.
Deboarding scenarios
Deboarding of any participant will be done as and when the competent authority inactivates / blacklist the entity, this can be both voluntary deboarding (business is shut) as well as involuntary deboarding (malpractice or non-compliance) by the competent authority.


## Links on this page

- https://nrces.in/ndhm/fhir/r4/hcx-profile.html
- https://nrces.in/ndhm/fhir/r4/index.html
- https://nrces.in/preview/ndhm/fhir/r4/hcx-profile.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-CoverageEligibilityRequestBundle.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-ClaimBundle.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Claim.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-ClaimResponse.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Claim-definitions.html#Claim
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-PractitionerRole-definitions.html
- https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Claim-definitions.html
- https://nrces.in/preview/ndhm/fhir/r4/ValueSet-ndhm-benefitcategory.html
- https://facility.abdm.gov.in/
- https://sandbox.abdm.gov.in/sandbox/v3/
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=getting-started
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=Milestone_one
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=postman_collections
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=ABDM_M3_V1
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=TestCases
- https://sandbox.abdm.gov.in/sandbox/v3/webinars
- https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration
- https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=ABDMSandboxSignup
- https://sandbox.abdm.gov.in
- https://dev.abdm.gov.in/gateway/v0.5/sessions
- https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create
- https://hcxsbx.abdm.gov.in/#/documents
