# https://hcxsbx.abdm.gov.in/#/introduction-NHCX

Introduction to NHCX
The National Health Claims Exchange operates in a manner similar to internet and email exchange networks. It facilitates the transfer of data packets in FHIR standard format from one point to another (destination). Just as routing switches or email gateways ensure that messages are sent and received with the appropriate levels of consistency, security, privacy, and durability, the National Health Claims Exchange serves as a protocol for exchanging claims related information among various parties, including payers, providers, beneficiaries, regulators, and observers.
Visualization of NHCX across multiple Provider or Payer Apps
NHCX Objectives
Expanded Insurance Coverage:
We have introduced new claim types, such as outpatient department (OPD) services and pharmacy expenses, to broaden the scope of insurance policies.
Enhanced Claims Processing:
We have minimized receivable cycles and promoted the acceptance of cashless claims, particularly in smaller healthcare facilities.
Drove Insurance Innovation:
We have enabled the development of new processes and rules for automated adjudication, while implementing measures to control fraud and prevent abuse.
Standardized Claims Procedures:
We have established a uniform claims process to lower operational costs and foster trust between payers and providers through a transparent, rule-based system.
Improved Patient Experience:
We are focused on enhancing the overall patient experience by ensuring timely and efficient claims management.
NHCX Use Cases  
Use Cases 
Provider
Payer
Get Provider/Payer details
Provider requests payer details; NHCX validates and returns details
Payer requests provider details; NHCX validates and returns details
Eligibility Check
Provider submits request; NHCX validates and forwards it to payer; Payer process and returns status
Payer receives request from provider and processes it
Pre- Authorization
Provider submits requests; NHCX validates and forwards it to payer; Payer reviews and provides decision
Payer receives request and provides approval or denial decision
Claim Submission 
Provider submits claims; NHCX validates and forwards to payer; Payer process and determines reimbursements
Payer receives claims, reviews them, and determines reimbursement
Payment Notification 
Payer process claim and notifies provider of status
Payer processes claim and notifies provider of status
Claim Reprocessing 
Provider submits request; NHCX validates and forwards to payer; payer reviews and provides revised decision
Payer receives requests and provides revised decision
NHCX Specifications   
The National Health Authority (NHA) publishes the specifications for NHCX. These specifications define a set of minimal requirements and definitions that serve as a standard for every aspect of the envisioned claims data exchange.
Here's what the specifications aim to achieve:
Interoperability:
Ensure different systems (Provider/Payer) can work together seamlessly.
Regulations and Policies:
Define the necessary regulations and policies for the system.
Technology Choice:
Allow participants to choose the technology and solutions that best fit their needs.
The design principles behind the specifications are: 
Open :
Promote vendor neutrality and facilitate technology use by being open and published under a permissive license (e.g., Creative Commons or MIT). This allows for wider participation and fosters innovation.
Evolvable and Extendable :
Adapt to changing needs over time and allow for customization within specific contexts (payer-specific rules/protocols) while maintaining overall interoperability.
Minimalistic and Inclusive :
Be easy to understand and avoid restricting innovation or hindering participation.
Data Privacy and Security :
Ensure strong data privacy and security measures are in place. This includes mechanisms like tamperproof audit trails and digital signatures for tracking data access and updates.
Unbundled :
Break down the complexity of the system into manageable pieces for easier implementation. This allows for modular use of specifications to address different needs.
Open Protocol for Claims Data Exchange (Health Claims Transfer Protocol) :
This open protocol, similar to HTTP or SMTP, defines key aspects of claims exchange
-
Authentication:
Verifies participants (Payer, Provider, Regulator, Observer, etc.).
-
Request/Response Message Syntax:
Defines the format of messages exchanged, including headers, body content (mandatory vs. optional fields), transport constraints, etc.
Supported Methods (APIs) :
Defines available functions within the system.
Response Codes :
Provides standardized response codes for different scenarios.
Data Security and Privacy :
Ensures secure, authentic, and non-repudiable message exchange. This includes encryption for data security beyond standard protocols and message signing for verification.
Domain Data Specifications
These specifications define the format and meaning of elements in request/response objects used for claim exchange. They leverage existing domain standards like FHIR, SNOMED CT, and ICD-11. Key focus areas include:
 Domain data model : 
Defines a schema for entities like Claims, Policies, Payments, Providers, and Payers using FHIRv4 standards as published by NRCES, GoI. This data model encodes information for each entity in a standardized format (e.g., ClaimBundle, ClaimResponseBundle, CoverageEligibilityBundle, CoverageEligibilityResponseBundle).
More details can be found here:
https://www.nrces.in/ndhm/fhir/r4/hcx-profile.html
 Metadata Specifications (Value Sets) :
 Defines additional information describing data elements, including coding systems and suggested values for important claim attributes such as disease codes, procedure codes, diagnostic codes, billing codes, etc. This information is used for data description, administration, functionality, and preservation. More details can be found here:
https://nrces.in/preview/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-category.html
Operational Guidelines 
Following are policies for participation in the health claims exchange ecosystem:
Onboarding guidelines:
 Entities (Provider/Payers) must follow specific procedures to join the National Health Claims Exchange. These procedures include requirements related to protocol adherence, compliance reviews, and review frequency.
Deboarding guidelines:
 Entities may be blocked or rejected from the National Health Claims Exchange due to violations related to technical service level agreements (SLAs), protocol versions, message security, or privacy.
Access Control guidelines:
 Access may be controlled based on the roles of individuals within an entity. Entities may need to obtain consent for accessing APIs and data attributes.
Exchange operation guidelines
Entity Responsibilities: The guidelines outline the responsibilities of each entity within the NHCX ecosystem.
Operational Reports and Dashboards: Regular reports and dashboards are required to monitor the exchange's operations. 
Audit Checklist and Frequency: A standardized audit checklist must be followed, and audits must be conducted at specified intervals. 
Governance Framework for National Health Exchange (NHCX)
Desc:
To ensure the success of the claims network, the NHA is establishing clear and well-defined specifications that foster a shared understanding among diverse stakeholders in the healthcare system. These specifications are being universally accepted by all insurance participants to form a common foundation for the NHCX network. The NHA envisions a governance approach for open specifications aligned with the key principles of the National Digital Health Blueprint, which will be further articulated as NHCX specifications.
Governance Approach and Process:
The NHA is developing and maintaining standards through a transparent, adaptable, and consultative process. This process involves:
Inclusive and Consultative Process: Engaging widely inclusive and committed groups to contribute to ideas, perspectives, and networks. 
Engagement with NRCES: The NHA is collaborating with the National Resource Centre for EHR standards (NRCES) to develop specifications. This includes representation from all sectors of the healthcare industry, such as:  
Insurance Providers
Third-Party Administrators (TPAs) 
Patient groups 
Provider Associations
Regulatory Bodies 
Public Accessibility: Specifications are made publicly available and maintained in GitHub repository by authorized person of NHA. 


## Links on this page

- https://www.nrces.in/ndhm/fhir/r4/hcx-profile.html
- https://nrces.in/preview/ndhm/fhir/r4/ValueSet-ndhm-supportinginfo-category.html
