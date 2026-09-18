# https://hcxsbx.abdm.gov.in/#/hmisdocuments

NHCX-PMJAY-HMIS Integration
Context: Current Challenges with TMS-Based PMJAY Workflow
PMJAY claims processing is currently dependent on the TMS 2.0 Provider System, irrespective of hospitals having their own Hospital Management Information Systems (HMIS). Challenges include:
Duplication of data entry:
Parallel data entry in hospital HMIS and TMS increases administrative workload and the risk of errors.
Lack of System Interoperability:
Poor interoperability prevents seamless exchange of beneficiary, clinical, and claims data across systems.
Single-System Dependency:
Exclusive reliance on a single provider system impacts scalability and operational flexibility.
Restricted Innovation and Customisation:
System constraints restrict innovation and flexibility for hospitals and technology partners.
Solution: Transition to ABDM-Enabled HMIS Integrated with NHCX
Benefits: What this means for PMJAY-empanelled Hospitals
PMJAY Workflow Embedded in Hospital Operations:
PMJAY cases can be handled as part of routine hospital workflows within HMIS, rather than as a separate, portal-driven activity. Hospital PMJAY operations are no longer impacted by portal downtime, access constraints, or concurrent user limitations.
Availability of Structured Data:
Availability of structured data enable automation of Pre-Auth/Claim resulting in low processing cost and time. This will reduce manual errors and improve the data quality (enabling basic requirement for use of any AI model) as well as aid in fraud control.
Improved Internal Audit and Financial Management:
All PMJAY-related clinical and financial records reside within hospital systems, simplifying audits, internal reviews, and compliance. PMJAY claims data flows natively into hospital billing and accounting systems, improving reconciliation and financial reporting.
Simplified Training and User Management:
Staff require training on a single system instead of managing separate user roles and workflows across HMIS and TMS.
NHCX-PMJAY-HMIS Key Differences
Item
Description
Utilising the Insurance Plan Response
The PMJAY scheme extensively uses the InsurancePlan FHIR bundle, which is configured at the hospital level and serves as a key reference for scheme operations. As this configuration drives several downstream workflows, it is critical for enabling subsequent steps in the pre-authorisation and claims lifecycle.
Biometric authentication of the Beneficiary
The PMJAY scheme mandates biometric authentication of a beneficiary during registration, treatment and discharge. This is an additional API that has to be implemented.
Structured data exchange
For a HMIS to process PMJAY claims, it is mandatory to send supporting health information in ABDM-defined structured Health Information Types.
Query flow
The PMJAY payer does not use the Communication API for queries. Instead, a query is raised by the payer with the relevant workflow ID for preauth/claim which has to be responded to by the provider with the relevant workflow ID (preauth/claim bundle structure remains the same).
API Flows
NHCX normal flow
NHCX-PMJAY-HMIS flow
Get Insurance Plan
Same
Get Policy
Same
Coverage eligibility check
Same
Pre-Auth
Same (but before pre-auth need to do mandatory biometric authentication of beneficiary).
Communication Request
Communication API is not used. Instead, a query is raised by the payer with the relevant workflow ID for preauth/claim which has to be responded to by the provider with the relevant workflow ID.
Claim Submission
Same
Payment Notice
Same
Status Check
Same
NHCX-PMJAY-HMIS Go-Live Process
Supporting documents
last updated on : 
