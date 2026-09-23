# NHCX-PMJAY-HMIS Integration Guide

*Source: `hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf` — extracted full text*

**Pages: 38**


---

## Page 1

Disclaimer: This is a work-in-progress document, subject to changes
and revisions. Please use it only for reference.
Functional Requirement Document (FRD)
NHCX-PMJAY-HMIS Integration
Prepared for: NHA, ABDM-enabled HMIS
Prepared by: NHCX Team, National Health Authority (NHA)
Version: 1.0
Date: March 2026

**Table 1.1**

| Disclaimer: This is a work-in-progress document, subject to changes |
|---|
| and revisions. Please use it only for reference. |


---

## Page 2

Table of Contents
1. INTRODUCTION.............................................................................................................................4
1.1 Context.....................................................................................................................................................4
1.2 Difference between NHCX Integration and NHCX-PMJAY Integration................................5
1.4 Scope......................................................................................................................................................6
1.5 Target Audience...................................................................................................................................7
1.6 References.............................................................................................................................................7
1.7 Sandbox Journey for NHCX-PMJAY Integration...........................................................................7
1.8 Test Cases for Exit Process...............................................................................................................8
2. ABDM & NHCX OVERVIEW.........................................................................................................8
2.1 ABDM Ecosystem.................................................................................................................................8
2.2 About the National Health Claims Exchange (NHCX)...............................................................8
3. PMJAY OVERVIEW........................................................................................................................9
4. EXISTING PMJAY WORKFLOW...................................................................................................9
4.1 Claims Adjudication Process.............................................................................................................9
4.2 Claims Payment Process.................................................................................................................10
5. Transaction Management System (TMS) for Providers..........................................................11
5.1 About TMS Provider Application.....................................................................................................11
5.2 Detailed End-to-end Process Flow in TMS Provider Application..........................................11
6. FUNCTIONAL REQUIREMENTS.................................................................................................13
6.1 High-Level NHCX Process Flow....................................................................................................13
7. INTEGRATION REQUIREMENTS................................................................................................14
7.1 API Requirements................................................................................................................................14
7.2 Authentication.....................................................................................................................................14
7.3 Error Handling.....................................................................................................................................14
7.4 Data Structure.....................................................................................................................................15
8. API Specifications........................................................................................................................15
8.1. Insurance Plan....................................................................................................................................15
8.2 Biometric Authentication.................................................................................................................18
8.2.1 API Details.................................................................................................................................20
8.3 Coverage Eligibility..........................................................................................................................24
8.3.1 Validation...................................................................................................................................26
8.3.2 Discovery..................................................................................................................................27
8.3.3 Auth requirements.................................................................................................................27
8.3.4 Benefits.....................................................................................................................................27
8.4. Pre-authorisation.............................................................................................................................29
8.4.0 Structured Data Exchange..................................................................................................29
8.4.1 Auto-approval / manual adjudication..................................................................................31
8.4.2 Resubmission/Reprocess.....................................................................................................32
8.4.3 Enhancement..........................................................................................................................32

---

## Page 3

8.4.4 Query updation.......................................................................................................................32
8.4.5 Cancellation.............................................................................................................................33
8.5. Claim...................................................................................................................................................33
8.5.0 Structured Data Exchange...................................................................................................33
8.5.1 Manual adjudication (approval and rejection).................................................................36
8.5.2 Query updation......................................................................................................................36
8.5.3 Erroneous flow........................................................................................................................37
8.5.4 Reprocess/Resubmit..............................................................................................................37
8.5.5 Payment Notice......................................................................................................................37
9. APPENDIX....................................................................................................................................38

---

## Page 4

1. INTRODUCTION
This Functional Requirement Document outlines the end-to-end integration process to enable
PMJAY claim submissions through any ABDM-enabled HMIS system via NHCX.
1.1 Context

---

## Page 5

1.2 Difference between NHCX Integration and NHCX-PMJAY Integration
Once NHCX integration is completed successfully, an integrator can send claims to any
private insurer. However, as PMJAY is a national-level assurance program, there are
scheme-specific modifications that need to be implemented (the APIs remain the same). This
includes:
Item Description
Utilising the ● The PMJAY scheme extensively uses the InsurancePlan FHIR
Insurance Plan bundle, which is configured at the hospital level and serves as
Response a key reference for scheme operations. It includes details such
as available specialties, package costs for services, standard
treatment guidelines, questionnaires, and mandatory
documents required during pre-authorisation and claim
submission.
● As this configuration drives several downstream workflows, it
is critical for enabling subsequent steps in the
pre-authorisation and claims lifecycle. Please refer to Section
8.1 for more details.
Biometric ● The PMJAY scheme mandates biometric authentication of a
authentication of beneficiary during registration, treatment and discharge. This is
the Beneficiary an additional API that has to be implemented. Please refer to
section 8.2 for more details.

**Table 5.1**

| Item | Description |
|---|---|
| Utilising the<br>Insurance Plan<br>Response | ● The PMJAY scheme extensively uses the InsurancePlan FHIR<br>bundle, which is configured at the hospital level and serves as<br>a key reference for scheme operations. It includes details such<br>as available specialties, package costs for services, standard<br>treatment guidelines, questionnaires, and mandatory<br>documents required during pre-authorisation and claim<br>submission.<br>● As this configuration drives several downstream workflows, it<br>is critical for enabling subsequent steps in the<br>pre-authorisation and claims lifecycle. Please refer to Section<br>8.1 for more details. |
| Biometric<br>authentication of<br>the Beneficiary | ● The PMJAY scheme mandates biometric authentication of a<br>beneficiary during registration, treatment and discharge. This is<br>an additional API that has to be implemented. Please refer to<br>section 8.2 for more details. |


---

## Page 6

Structured data ● For a HMIS to process PMJAY claims, it is mandatory to send
exchange supporting health information in ABDM-defined structured
Health Information Types. Please refer to sections 8.5.0 or
8.6.0 for more information on the same.
Query flow ● The PMJAY payer does not use the Communication API for
queries. Instead, a query is raised by the payer with the
relevant workflow ID for preauth/claim which has to be
responded to by the provider with the relevant workflow ID
(preauth/claim bundle structure remains the same). Please
refer to sections 8.4.4 or 8.5.2 for more information.
API Flows
NHCX normal flow NHCX-PMJAY-HMIS flow
Get Insurance Plan Same
Get Policy Same
Coverage eligibility check Same
Same (but before pre-auth need to do mandatory
Pre-Auth
biometric authentication of beneficiary)
Communication API is not used. Instead, a query
is raised by the payer with the relevant workflow
Communication Request
ID for preauth/claim which has to be responded to
by the provider with the relevant workflow ID.
Claim Submission Same
Payment Notice Same
Status Check Same
1.4 Scope
This FRD covers:
● NHCX workflow adoption
● Standardised FHIR-based claim requests
● Digital documentation exchange
● Integration with existing PMJAY modules (TMS)

**Table 6.1**

| Structured data<br>exchange | ● For a HMIS to process PMJAY claims, it is mandatory to send<br>supporting health information in ABDM-defined structured<br>Health Information Types. Please refer to sections 8.5.0 or<br>8.6.0 for more information on the same. |
|---|---|
| Query flow | ● The PMJAY payer does not use the Communication API for<br>queries. Instead, a query is raised by the payer with the<br>relevant workflow ID for preauth/claim which has to be<br>responded to by the provider with the relevant workflow ID<br>(preauth/claim bundle structure remains the same). Please<br>refer to sections 8.4.4 or 8.5.2 for more information. |


**Table 6.2**

| NHCX normal flow | NHCX-PMJAY-HMIS flow |
|---|---|
| Get Insurance Plan | Same |
| Get Policy | Same |
| Coverage eligibility check | Same |
| Pre-Auth | Same (but before pre-auth need to do mandatory<br>biometric authentication of beneficiary) |
| Communication Request | Communication API is not used. Instead, a query<br>is raised by the payer with the relevant workflow<br>ID for preauth/claim which has to be responded to<br>by the provider with the relevant workflow ID. |
| Claim Submission | Same |
| Payment Notice | Same |
| Status Check | Same |


---

## Page 7

● Security, audit trail, and compliance
1.5 Target Audience
● National Health Authority
● State Health Agencies
● Insurance Companies / TPAs
● Hospital Providers
● IT Vendors
1.6 References
● ABDM – NDHM Standards
● NHCX API Specifications
● PMJAY Scheme Guidelines
1.7 Sandbox Journey for NHCX-PMJAY Integration
This document describes processes specific to processing PMJAY claims via NHCX. It is
recommended for an ABDM-enabled HMIS to build a strong understanding of NHCX and
NHCX API Flows before initiating PMJAY-integration.
Please note:
(1) To commence the NHCX-PMJAY-HMIS integration, the integrator has to share the
Participant ID, Client ID and Registry ID with the NHCX team so the participant can be
onboarded on the staging environment for PMJAY.

---

## Page 8

○ The Registry ID used during participant creation has to be used as the
‘Provider ID’ on sandbox.
○ A sample member ID will also be for testing purposes.
(2) Upon successful completion of NHCX-PMJAY-HMIS Integration, the integrator will
receive production keys for NHCX that can then be used to process claims for private
insurers as well.
The following technical documents can be referred to:
● ABDM Documentation
● NHCX Documentation
● Onboarding providers and payers in Sandbox
● Steps to generate key
● NHCX Provider Side Use Cases- Sandbox Exit Process
1.8 Test Cases for Exit Process
Please refer to the document titled NHCX-PMJAY-HMIS Test Cases.
2. ABDM & NHCX OVERVIEW
2.1 ABDM Ecosystem
The Ayushman Bharat Digital Mission (ABDM) aims to develop the backbone necessary to
support the integrated digital health infrastructure of the country. It will bridge the existing gap
amongst different stakeholders of the Healthcare ecosystem through digital highways.
For more details please visit the ABDM website: https://abdm.gov.in/
2.2 About the National Health Claims Exchange (NHCX)
The National Health Claims Exchange (NHCX) is developed by NHA, in consultation with
Insurance Regulatory and Development Authority of India (IRDAI). With the primary purpose to

---

## Page 9

streamline and standardise the processing of health insurance claims across the country,
leveraging the Fast Healthcare Interoperability Resources (FHIR) standards to ensure
interoperability across diverse systems. NHCX Specification is a standardized communication
protocol designed to facilitate the seamless exchange of health claim information among
payers, providers, beneficiaries, and other relevant entities.
NHCX Specifications provide a comprehensive blueprint for every aspect of the envisioned
claims network. They are designed to ensure technology and vendor neutrality, adaptability to
evolving needs, and to foster innovation and inclusivity within the healthcare ecosystem.
For more details please visit the NHCX website: https://nhcx.abdm.gov.in/#/
3. PMJAY OVERVIEW
Ayushman Bharat is the Pradhan Mantri Jan Arogya Yojana or PMJAY as it is popularly known
was launched by the Hon’ble Prime Minister of India, Shri Narendra Modi on 23rd September
2018 in Ranchi, Jharkhand. PMJAY is the largest health assurance scheme in the world which
aims at providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary
care hospitalization to over 10.74 crores poor and vulnerable families (approximately 50 crore
beneficiaries) that form the bottom 40% of the Indian population. PMJAY is fully funded by the
Government and cost of implementation is shared between the Central and State
Governments.
In PMJAY, claim adjudication is done through integrated workflows between three key
systems –
1. Beneficiary Identification System (BIS),
2. Transaction Management System (TMS) and
3. Hospital Empanelment Module (HEM)
The key tasks are performed under Transaction Management System (TMS), partially at the
time of Pre-authorization by Pre-authorization Processing Doctor (PPD) and later at the time of
final claim settlement by Claim Processing Doctor (CPD) based on the documents received
from the hospital.
4. EXISTING PMJAY WORKFLOW
4.1 Claims Adjudication Process
Claims adjudication refers to the decision on two key aspects of a claim: whether the claim is
admissible under the terms of policy/Scheme and if yes, what is the quantum payable. It
applies to the final decision on claims payment. The decision involves cross verification of
all-important aspects – covered person, medical condition – symptoms, diagnosis, treatment,
policy exclusions, period, available sum insured, pre-agreed tariff/package rate, empanelled
hospital etc.

---

## Page 10

The Process is illustrated below:
4.2 Claims Payment Process
Post approval of a claim by SHA (Trust model) or SHA – IC (Insurance model), claim payment
would be initiated by the bank. Amount will be transferred to EHCP (Empanelled Healthcare
Provider) account. SHA will follow applicable PFMS guidelines for making claims payment.
Users (Roles) involved:
● MEDCO – Medical Committee
● CEX – Claim Executive
● CPD – Claim Processing Doctor
● ACO – Accounts Officer
● SHA – State Health Authority
The detailed workflow along with Users(roles) is as below:

---

## Page 11

5. Transaction Management System (TMS) for Providers
5.1 About TMS Provider Application
TMS Provider Application was designed for the hospitals to encompass the entire lifecycle
and engagement with PMJAY beneficiaries and shall have modules/ functionalities like Patient
Registration, Patient Pre-Authorization, Treatment, Patient Discharge, Claims, Payments, MIS
Reports and Dashboards. Any Hospital Management Information System (HMIS) or Digital
Solution Company (DSC) that aims to process PMJAY claims should have the same
capabilities.
5.2 Detailed End-to-end Process Flow in TMS Provider Application
Functional step Details
Beneficiary ● ‘Search the beneficiary’ using Ayushman ID/Mobile
registration and number/ABHA and select the relevant payer
authentication
● Member Card of the beneficiary is displayed
● Beneficiary needs to be verified against Aadhaar using
fingerprint/Iris/face auth to proceed
● Proceed without Aadhaar option available for exceptional
circumstances

**Table 11.1**

| Functional step | Details |
|---|---|
| Beneficiary<br>registration and<br>authentication | ● ‘Search the beneficiary’ using Ayushman ID/Mobile<br>number/ABHA and select the relevant payer<br>● Member Card of the beneficiary is displayed<br>● Beneficiary needs to be verified against Aadhaar using<br>fingerprint/Iris/face auth to proceed<br>● Proceed without Aadhaar option available for exceptional<br>circumstances |


---

## Page 12

○ A template undertaking document is required for the
beneficiaries who do not have an Aadhaar card with
them but have the PMJAY card. This will have to be
submitted at the time of claim submission to the
payer.
● Communication address, Care Plan, Patient Attendant details
needs to be filled
● Authentication Consent to be uploaded
○ To be signed by the doctor and patient. This has a
specific format that providers should have access to.
There is a fraud engine that detects if this is the right
document and it passes only if it is valid.
● Once all mandatory details have been filled and submitted,
patient is registered and wallet balance is displayed
Pre-authorisation ● Following information will have to be fetched from the HMIS:
○ Medical information (which includes general findings,
personal history & family history)
○ Admission information (which includes authentication
consent & admission details)
○ Treatment (which includes diagnosis (ICD codes),
treatment plan, investigations & care team details)
○ Finance details
● Once the benefits are added, there is a check which verifies
if there is adequate balance to cover the benefits
● The pre-auth form is then validated
● After the pre-auth has been initiated, the request will go to
PPD (preauth processing doctor) at payer end for further
approval. If the selected procedure is an auto approved
procedure, it can automatically move for treatment.
Discharge details ● Once the patient is ready for discharge, provision to select
the type of discharge as normal/LAMA/DAMA/Death. Details
to be captured vary based on the type of discharge.
● Documents need to be fetched from the HMIS based on the
type
● Download the Mangalkamna Patra and handover to the
beneficiary and upload the same in the feedback form.
● Patient needs to be verified using biometric (proceed without
aadhaar option available)
Claim initiation ● Finance section details to be filled where the amount and
incentive details and amount claimed as per hospital bill
needs to be verified and need to upload/capture the
supporting documents say., hospital bill number, date,

**Table 12.1**

|  | ○ A template undertaking document is required for the<br>beneficiaries who do not have an Aadhaar card with<br>them but have the PMJAY card. This will have to be<br>submitted at the time of claim submission to the<br>payer.<br>● Communication address, Care Plan, Patient Attendant details<br>needs to be filled<br>● Authentication Consent to be uploaded<br>○ To be signed by the doctor and patient. This has a<br>specific format that providers should have access to.<br>There is a fraud engine that detects if this is the right<br>document and it passes only if it is valid.<br>● Once all mandatory details have been filled and submitted,<br>patient is registered and wallet balance is displayed |
|---|---|
| Pre-authorisation | ● Following information will have to be fetched from the HMIS:<br>○ Medical information (which includes general findings,<br>personal history & family history)<br>○ Admission information (which includes authentication<br>consent & admission details)<br>○ Treatment (which includes diagnosis (ICD codes),<br>treatment plan, investigations & care team details)<br>○ Finance details<br>● Once the benefits are added, there is a check which verifies<br>if there is adequate balance to cover the benefits<br>● The pre-auth form is then validated<br>● After the pre-auth has been initiated, the request will go to<br>PPD (preauth processing doctor) at payer end for further<br>approval. If the selected procedure is an auto approved<br>procedure, it can automatically move for treatment. |
| Discharge details | ● Once the patient is ready for discharge, provision to select<br>the type of discharge as normal/LAMA/DAMA/Death. Details<br>to be captured vary based on the type of discharge.<br>● Documents need to be fetched from the HMIS based on the<br>type<br>● Download the Mangalkamna Patra and handover to the<br>beneficiary and upload the same in the feedback form.<br>● Patient needs to be verified using biometric (proceed without<br>aadhaar option available) |
| Claim initiation | ● Finance section details to be filled where the amount and<br>incentive details and amount claimed as per hospital bill<br>needs to be verified and need to upload/capture the<br>supporting documents say., hospital bill number, date, |


---

## Page 13

hospital bill and any other related documents
● Provision to upload post OP investigations
Note: (1) E-Rupi initiation form is not required; (2) For more details and edge cases, please
refer to the TMS Provider User Manual.
6. FUNCTIONAL REQUIREMENTS
6.1 High-Level NHCX Process Flow
Step NHCX API Action/requirement Frequency
Pre-condition InsurancePlan Retrieve policy details (required to Once per
auto-fill benefits, validate policy, or
admissibility, STGs, documents, weekly
latest treatment packages, limits,
etc.)
Update InsurancePlan data for
active beneficiaries
Beneficiary Coverage Verify patient eligibility Per registration
registration and Eligibility Check
authentication
Biometric Verify patient identity Per registration
authentication
Pre-authorisation Insurance Plan Treatment, STG questionnaire, Per claim
mandatory documents and benefit
options fetched directly the payer
system
Pre-auth Submit as per InsurancePlan
references, directly fetched from
the HMIS.
Discharge InsurancePlan Documents required at the time of Per claim
discharge to be pre-populated
Claim submission InsurancePlan Treatment, STG questionnaire, Per claim
mandatory documents and benefit
options fetched directly the payer
system

**Table 13.1**

|  | hospital bill and any other related documents<br>● Provision to upload post OP investigations |
|---|---|


**Table 13.2**

| Step | NHCX API | Action/requirement | Frequency |
|---|---|---|---|
| Pre-condition | InsurancePlan | Retrieve policy details (required to<br>auto-fill benefits, validate<br>admissibility, STGs, documents,<br>latest treatment packages, limits,<br>etc.)<br>Update InsurancePlan data for<br>active beneficiaries | Once per<br>policy, or<br>weekly |
| Beneficiary<br>registration and<br>authentication | Coverage<br>Eligibility Check | Verify patient eligibility | Per registration |
|  | Biometric<br>authentication | Verify patient identity | Per registration |
| Pre-authorisation | Insurance Plan | Treatment, STG questionnaire,<br>mandatory documents and benefit<br>options fetched directly the payer<br>system | Per claim |
|  | Pre-auth | Submit as per InsurancePlan<br>references, directly fetched from<br>the HMIS. |  |
| Discharge | InsurancePlan | Documents required at the time of<br>discharge to be pre-populated | Per claim |
| Claim submission | InsurancePlan | Treatment, STG questionnaire,<br>mandatory documents and benefit<br>options fetched directly the payer<br>system | Per claim |


---

## Page 14

Claim Submit as per InsurancePlan
references, directly fetched from
the HMIS.
7. INTEGRATION REQUIREMENTS
7.1 API Requirements
● All communication via NHCX Gateway APIs
● JSON + FHIR R4 formats
● Standard HTTP status codes
7.2 Authentication
● JWT tokens
● Digital Signing Certificate required
7.3 Error Handling
Exception handling is a critical aspect of building robust and user-friendly REST APIs. It helps
to
achieve the following:
1. Improved User Experience: Clients receive clear and meaningful error messages
instead of cryptic stack traces.
2. Debugging and Maintenance: Proper exception handling makes it easier to identify
and fix issues.
3. Consistency: Standardized error responses ensure consistency across your API.
Best Practices for Exception Handling
1. Use Specific Exceptions: Create custom exceptions for specific error scenarios (e.g.,
ResourceNotFoundException, ValidationException).
2. Return Meaningful Error Messages: Provide clear and actionable error messages to
the client.
3. Log Exceptions: Log exceptions for debugging and monitoring purposes.
4. Use HTTP Status Codes Correctly: Follow REST conventions for status codes (e.g.,
404 for
missing resources, 400 for bad requests).
5. Avoid Exposing Sensitive Information: Do not include stack traces or internal details
in
production error responses.
System must support:
● NHCX error codes

**Table 14.1**

|  | Claim | Submit as per InsurancePlan<br>references, directly fetched from<br>the HMIS. |  |
|---|---|---|---|


**Table 14.2**

| Exception handling is a critical aspect of building robust and user-friendly REST APIs. It helps |  |  |
|---|---|---|
| to |  |  |
| achieve the following: |  |  |
|  | 1. Improved User Experience: Clients receive clear and meaningful error messages |  |
|  | instead of cryptic stack traces. |  |
|  | 2. Debugging and Maintenance: Proper exception handling makes it easier to identify |  |
|  | and fix issues. |  |
|  | 3. Consistency: Standardized error responses ensure consistency across your API. |  |
|  |  |  |
| Best Practices for Exception Handling |  |  |
|  | 1. Use Specific Exceptions: Create custom exceptions for specific error scenarios (e.g., |  |
|  |  | ResourceNotFoundException, ValidationException). |
|  | 2. Return Meaningful Error Messages: Provide clear and actionable error messages to |  |
|  | the client. |  |
|  | 3. Log Exceptions: Log exceptions for debugging and monitoring purposes. |  |
|  | 4. Use HTTP Status Codes Correctly: Follow REST conventions for status codes (e.g., |  |
|  | 404 for |  |
|  |  | missing resources, 400 for bad requests). |
|  | 5. Avoid Exposing Sensitive Information: Do not include stack traces or internal details |  |
|  | in |  |
|  |  | production error responses. |


---

## Page 15

● Retry logic
● Human-readable messages
For more information please refer to the following documents: API Response Handling to
avoid Failures, Standard error codes
7.4 Data Structure
All data objects must be encrypted and transmitted within the API request body, inaccessible
to NHCX gateways. Fast Healthcare Interoperability Resource (FHIR) Bundle resource has
been adopted for encapsulation of the data shared across NHCX APIs. A Bundle can carry a
collection of resources meeting certain criteria as part of any service operation. The structure
of the e-claim Bundle should follow certain guidelines. These bundles should contain FHIR
bundles of the "collection" type, where the type of bundle is specified by "bundle.type".
For more information please refer to the following documents: Implementation Guide for
Adoption of FHIR in ABDM and NHCX, NHCX Profiles - FHIR Implementation Guide for ABDM
v6.5.0, Benefit Category - FHIR Implementation Guide for ABDM v7.0.0
8. API Specifications
8.1. Insurance Plan
The InsurancePlan is a structured digital representation of the policy under which a patient is
covered in the PMJAY scheme. Since PMJAY is strictly package-based (bundled costs for
each service), referencing the correct InsurancePlan is critical for:
● Ensuring only admissible services/benefits are claimed.
● Avoiding claim rejections due to non-compliance with scheme guidelines.
● Providing transparency and auditability for both providers and payers (State Health
Agencies/Insurance Companies).
Key input ● Provider ID
parameters ● Policy Code
● Participant ID
Key value sets ● Only has the list of specialties relevant to each provider
returned (response is based on the Provider ID sent)
● List of covered services/benefits and their limits.
● Mandatory documents as per guidelines for both
pre-authorisation and claim submission. This document list will
be available both for the policy-level and for benefit-specific
requirements as well.
● Standard Treatment Guidelines (STGs) and clinical protocols.
● Policy conditions, exclusions, and renewal information.

**Table 15.1**

| Key input<br>parameters | ● Provider ID<br>● Policy Code<br>● Participant ID |
|---|---|
| Key value sets<br>returned | ● Only has the list of specialties relevant to each provider<br>(response is based on the Provider ID sent)<br>● List of covered services/benefits and their limits.<br>● Mandatory documents as per guidelines for both<br>pre-authorisation and claim submission. This document list will<br>be available both for the policy-level and for benefit-specific<br>requirements as well.<br>● Standard Treatment Guidelines (STGs) and clinical protocols.<br>● Policy conditions, exclusions, and renewal information. |


---

## Page 16

Technical ● The size of the plan object is more than 20 MB sometimes and
Implementation the system should be capable of receiving the payload and
Guidelines storing the details in a structured, queryable format linked to
each policy record.
● Updating Insurance Plan internally:
o Run weekly API calls to refresh the InsurancePlan for all
active beneficiaries to ensure the latest treatment
packages, benefits, and policy rules are applied.
o Trigger an immediate refresh whenever a policy is
renewed or amended by the payer.
o Implement version control for tariff and package
updates, as outdated tariff versions will cause rate
mismatches and automatic claim rejection due to
suspected tampering.
o Maintain detailed audit logs of every InsurancePlan
fetch, refresh, version update, and the version used
during preauth or claim submission for compliance and
traceability.
● Ensure all required documents and Standard Treatment
Guideline (STG) checklists are attached as per InsurancePlan
requirements. STG is mandatory for PMJAY and it should be
rendered dynamically as per the treatment plan selected.
o Under insurance plan - (provider gets url in the
questionnaire) - under questionnaire response this url
needs to be sent in preauth/claim
o Description of questionnaire - Previously item
description was sent in the prefix parameter now it will
go as a text in insurance plan
● Notify users if there are changes in policy guidelines or if a
selected package/service is no longer covered.
APIs to be called /v1/insuranceplan/request
Callback API to /v1/insuranceplan/on_request
be Implemented
Use case Request insurance plan details from the Payer via HCX
description
Protocol status request.initiated
Request Payload Encrypted payload of TaskBundle
Validations Payload should be validated against the profiles published by NRCES.

**Table 16.1**

| Technical<br>Implementation<br>Guidelines | ● The size of the plan object is more than 20 MB sometimes and<br>the system should be capable of receiving the payload and<br>storing the details in a structured, queryable format linked to<br>each policy record.<br>● Updating Insurance Plan internally:<br>o Run weekly API calls to refresh the InsurancePlan for all<br>active beneficiaries to ensure the latest treatment<br>packages, benefits, and policy rules are applied.<br>o Trigger an immediate refresh whenever a policy is<br>renewed or amended by the payer.<br>o Implement version control for tariff and package<br>updates, as outdated tariff versions will cause rate<br>mismatches and automatic claim rejection due to<br>suspected tampering.<br>o Maintain detailed audit logs of every InsurancePlan<br>fetch, refresh, version update, and the version used<br>during preauth or claim submission for compliance and<br>traceability.<br>● Ensure all required documents and Standard Treatment<br>Guideline (STG) checklists are attached as per InsurancePlan<br>requirements. STG is mandatory for PMJAY and it should be<br>rendered dynamically as per the treatment plan selected.<br>o Under insurance plan - (provider gets url in the<br>questionnaire) - under questionnaire response this url<br>needs to be sent in preauth/claim<br>o Description of questionnaire - Previously item<br>description was sent in the prefix parameter now it will<br>go as a text in insurance plan<br>● Notify users if there are changes in policy guidelines or if a<br>selected package/service is no longer covered. |
|---|---|
| APIs to be called | /v1/insuranceplan/request |
| Callback API to<br>be Implemented | /v1/insuranceplan/on_request |
| Use case<br>description | Request insurance plan details from the Payer via HCX |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of TaskBundle |
| Validations | Payload should be validated against the profiles published by NRCES. |


**Table 16.2**

| questionnaire) - under questionnaire response this url |
|---|
| needs to be sent in preauth/claim |


**Table 16.3**

| description was sent in the prefix parameter now it will |
|---|
| go as a text in insurance plan |


---

## Page 17

The entity to Payer
implement the
API is called
Callback API Callback API should be implemented by provider systems. It should
logic accept the payload in two forms, and it will be derived based on the
“type” parameter of the response.
1. Encrypted format (As per RFC7516) of the payload
InsurancePlanBundle using the private key of the provider
entity. Encrypted payload comes as a response only when the
payer has processed the request and responded, when
everything is validated and verified.
2. ProtocolResponse. ProtocolResponse comes as a response only
when the payer is able to process the request because the
payload is invalid or not.
Sample request ● PMJAY-insuranceplan request sample.txt
and response ● PMJAY-insuranceplan response sample.txt
Other reference ● InsurancePlan - FHIR Implementation Guide for ABDM v6.5.0
documents ● Sample IDs
○ Member ID: Will be assigned by the Integration during
onboarding of the integrator
○ Sample payer id: 1518@hcx
○ Sample policy code: PMJAY/CH/S/G
○ Sample HFR: currently, registry ID is mapped for stage
and test environment
Using InsurancePlan in Claims Submission
Step Details
Fetching and storing ● The Insurance Plan should be fetched at the hospital-level
the insurance plan based on the specialties and treatments a hospital is
authorised for under the PMJAY scheme.
● This call should fetch the latest value sets: covered benefits,
limits, required documents, STGs, and package details.
● This should be stored locally.
● The InsurancePlan API call is typically required once per
policy period (e.g., at renewal), but it is recommended to
refresh this data at least weekly to capture any updates in
policy guidelines.

**Table 17.1**

| The entity to<br>implement the<br>API is called | Payer |
|---|---|
| Callback API<br>logic | Callback API should be implemented by provider systems. It should<br>accept the payload in two forms, and it will be derived based on the<br>“type” parameter of the response.<br>1. Encrypted format (As per RFC7516) of the payload<br>InsurancePlanBundle using the private key of the provider<br>entity. Encrypted payload comes as a response only when the<br>payer has processed the request and responded, when<br>everything is validated and verified.<br>2. ProtocolResponse. ProtocolResponse comes as a response only<br>when the payer is able to process the request because the<br>payload is invalid or not. |
| Sample request<br>and response | ● PMJAY-insuranceplan request sample.txt<br>● PMJAY-insuranceplan response sample.txt |
| Other reference<br>documents | ● InsurancePlan - FHIR Implementation Guide for ABDM v6.5.0<br>● Sample IDs<br>○ Member ID: Will be assigned by the Integration during<br>onboarding of the integrator<br>○ Sample payer id: 1518@hcx<br>○ Sample policy code: PMJAY/CH/S/G<br>○ Sample HFR: currently, registry ID is mapped for stage<br>and test environment |


**Table 17.2**

| Step | Details |
|---|---|
| Fetching and storing<br>the insurance plan | ● The Insurance Plan should be fetched at the hospital-level<br>based on the specialties and treatments a hospital is<br>authorised for under the PMJAY scheme.<br>● This call should fetch the latest value sets: covered benefits,<br>limits, required documents, STGs, and package details.<br>● This should be stored locally.<br>● The InsurancePlan API call is typically required once per<br>policy period (e.g., at renewal), but it is recommended to<br>refresh this data at least weekly to capture any updates in<br>policy guidelines. |


---

## Page 18

Patient Registration ● When a patient presents at a provider facility, the system must
and Coverage first perform a Coverage Eligibility Check via the NHCX API.
Eligibility ● Upon confirmation of eligibility, the patient is registered under
the PMJAY scheme in the provider’s HMIS.
Fetching ● The provider system must fetch the locally stored
InsurancePlan InsurancePlan to retrieve the policy details for the patient
Details based on the policy code received from coverage eligibility
request (all policies relevant to the hospital would be
pre-loaded in your system so you would only be fetching it)
Populating Benefits ● The provider system should automatically populate the
and Admissible preauth/claim form with benefits and limits as per the
Checks InsurancePlan.
● Admissible checks must be performed to ensure:
▪ Only eligible packages/services are selected.
▪ All mandatory documents and clinical data (as per
STGs) are attached.
▪ Any package-specific conditions or exclusions are
validated before submission
Preauthorisation and ● Before submitting a preauthorization or claim, the system
Claim Submission should:
▪ Fetch all authorization requirements using
CoverageEligibilityRequest through NHCX APIs.
▪ Validate that all InsurancePlan requirements
(documents, clinical parameters, package selection)
are met.
▪ Submit the preauthorization/claim with references to
the InsurancePlan and associated value sets.
8.2 Biometric Authentication
This is not a NHCX API and has been created specifically for the PMJAY payer. To comply with
the mandatory requirements of the PMJAY scheme, all participating hospitals must follow the
below authentication protocol during patient registration, the pre-authorization and discharge
workflow. Please refer to the Postman Collection.
Biometric ● At the time of registering the patient or initiating a
Authentication pre-authorisation request, hospitals shall perform biometric
Using ABHA APIs authentication of the beneficiary using fingerprint, iris or face
auth to ensure the physical presence of the patient.
● Upon successful biometric verification, the system shall
generate a User Token.

**Table 18.1**

| Patient Registration<br>and Coverage<br>Eligibility | ● When a patient presents at a provider facility, the system must<br>first perform a Coverage Eligibility Check via the NHCX API.<br>● Upon confirmation of eligibility, the patient is registered under<br>the PMJAY scheme in the provider’s HMIS. |
|---|---|
| Fetching<br>InsurancePlan<br>Details | ● The provider system must fetch the locally stored<br>InsurancePlan to retrieve the policy details for the patient<br>based on the policy code received from coverage eligibility<br>request (all policies relevant to the hospital would be<br>pre-loaded in your system so you would only be fetching it) |
| Populating Benefits<br>and Admissible<br>Checks | ● The provider system should automatically populate the<br>preauth/claim form with benefits and limits as per the<br>InsurancePlan.<br>● Admissible checks must be performed to ensure:<br>▪ Only eligible packages/services are selected.<br>▪ All mandatory documents and clinical data (as per<br>STGs) are attached.<br>▪ Any package-specific conditions or exclusions are<br>validated before submission |
| Preauthorisation and<br>Claim Submission | ● Before submitting a preauthorization or claim, the system<br>should:<br>▪ Fetch all authorization requirements using<br>CoverageEligibilityRequest through NHCX APIs.<br>▪ Validate that all InsurancePlan requirements<br>(documents, clinical parameters, package selection)<br>are met.<br>▪ Submit the preauthorization/claim with references to<br>the InsurancePlan and associated value sets. |


**Table 18.2**

| Biometric<br>Authentication<br>Using ABHA APIs | ● At the time of registering the patient or initiating a<br>pre-authorisation request, hospitals shall perform biometric<br>authentication of the beneficiary using fingerprint, iris or face<br>auth to ensure the physical presence of the patient.<br>● Upon successful biometric verification, the system shall<br>generate a User Token. |
|---|---|


**Table 18.3**

| Biometric |
|---|
| Authentication |
| Using ABHA APIs |


---

## Page 19

● This User Token must be passed as a header parameter for
all subsequent PMJAY claim-related events, including
Coverage Eligibility Check, Pre-Authorization Request
Submission or nny additional PMJAY claim events requiring
proof of beneficiary presence. This token will be validated at
payer systems before considering it as legitimate request.
● Biometric authentication is also required at the discharge
stage. This token has to be passed for Claim Submission.
Token Validity ● The User Token issued after authentication remains valid for
and Refresh 30 minutes.
Mechanism ● Hospital systems must ensure that the token is refreshed
automatically, as required, until completion of the relevant
transaction cycle.
● If the token expires at any stage, a fresh biometric
authentication must be initiated. This step is mandatory to
meet the PMJAY requirement of ensuring proof of patient
presence at the hospital.
Please refer to API specifications and the postman collection for more
details.
Applicability ● This authentication process is applicable only for beneficiaries
whose ABHA ID is linked with their PMJAY card.
● For beneficiaries without ABHA linkage, the alternate
PMJAY-approved KYC protocols may be followed as per the
existing guidelines.
Handle ● In cases where biometric/aadhaar authentication is not
Exemption feasible, providers must obtain an Aadhaar exemption consent
document. This document must be signed by both the patient
and the hospital representative, digitally stored, and linked to
the beneficiary record to maintain compliance with ABDM
standards.
Key points ● Biometric authentication or a valid exemption is mandatory for
provider systems to submit claims in accordance with PMJAY
policy.
● The process ensures compliance, security, and verifiable
beneficiary identification throughout the claim submission
workflow.

**Table 19.1**

|  | ● This User Token must be passed as a header parameter for<br>all subsequent PMJAY claim-related events, including<br>Coverage Eligibility Check, Pre-Authorization Request<br>Submission or nny additional PMJAY claim events requiring<br>proof of beneficiary presence. This token will be validated at<br>payer systems before considering it as legitimate request.<br>● Biometric authentication is also required at the discharge<br>stage. This token has to be passed for Claim Submission. |
|---|---|
| Token Validity<br>and Refresh<br>Mechanism | ● The User Token issued after authentication remains valid for<br>30 minutes.<br>● Hospital systems must ensure that the token is refreshed<br>automatically, as required, until completion of the relevant<br>transaction cycle.<br>● If the token expires at any stage, a fresh biometric<br>authentication must be initiated. This step is mandatory to<br>meet the PMJAY requirement of ensuring proof of patient<br>presence at the hospital.<br>Please refer to API specifications and the postman collection for more<br>details. |
| Applicability | ● This authentication process is applicable only for beneficiaries<br>whose ABHA ID is linked with their PMJAY card.<br>● For beneficiaries without ABHA linkage, the alternate<br>PMJAY-approved KYC protocols may be followed as per the<br>existing guidelines. |
| Handle<br>Exemption | ● In cases where biometric/aadhaar authentication is not<br>feasible, providers must obtain an Aadhaar exemption consent<br>document. This document must be signed by both the patient<br>and the hospital representative, digitally stored, and linked to<br>the beneficiary record to maintain compliance with ABDM<br>standards. |
| Key points | ● Biometric authentication or a valid exemption is mandatory for<br>provider systems to submit claims in accordance with PMJAY<br>policy.<br>● The process ensures compliance, security, and verifiable<br>beneficiary identification throughout the claim submission<br>workflow. |


**Table 19.2**

| Token Validity |
|---|
| and Refresh |
| Mechanism |


---

## Page 20

8.2.1 API Details
1. Auth INIT
Request curl:
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init'
\
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{Token}}' \
--header ‘process: Preauth|Discharge' \
--header 'payerid: 123@hcx' \
--data-raw '{
"scope": ["abha-login", "aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or
["abha-login", "aadhaar-face-verify"] or ["abha-login", "aadhaar-iris-verify"]
"loginHint": "abha-number",
"loginId": "91-XXXX-XXXX-1234",
"otpSystem": "aadhaar",
"authMode": "FINGERPRINT"//FINGERPRINT,IRIS, FACE_AUTH,
}'
Response:
{
"txnId": "8c8a12e3-xxxx-4278-xxxx-10acffa44f07",
"authMode": null,
"message": "FingerPrint authentication request successfully sent.",
"status": null
}

---

## Page 21

2. Auth Verify
Request curl:
curl --location --request POST
'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {{Token}}' \
--header ‘process: Preauth|Discharge' \
--header 'payerid: 123@hcx' \
--data-raw '{
"scope": ["abha-login",
"aadhaar-bio-verify"],//["abha-login", "aadhaar-bio-verify"] or ["abha-login", "aadhaar-fac
e-verify"] or ["abha-login", "aadhaar-iris-verify"]
"authData": {
"authMethods": [
"bio"//bio | iris |face
],
"bio": {
"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
"fingerPrintAuthPid": "string"
},
"face": {
"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
"faceAuthPid": "string"
},
"iris": {
"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
"irisAuthPid": "string"

---

## Page 22

},
"otp": {
"txnId": "d21b3db9-xxxx-xxxx-8eed-8f75e7f86b9f",
"otpValue": "123456"
}
},
"authMode": "FINGERPRINT" //FINGERPRINT,IRIS, FACE_AUTH
}'
Response:
{
"txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",
"authResult": "success",
"message": "OTP verified successfully",
"token": "eyZhx….",
"refreshToken": "eyZhx….",
"expiresIn": 1800,
"refreshExpiresIn": 1296000,
"accounts": [
{
"ABHANumber": "91-XXXX-XXXX-1234",
"preferredAbhaAddress": "91XXXXXXXX1234@sbx",
"name": "Test Name",
"gender": null,
"dob": null,
"verifiedStatus": null,
"verificationType": null,

---

## Page 23

"status": "ACTIVE",
"profilePhoto": "base 64 image"
}
]
}
3. Auth Refresh Token:
During any ABHA transaction, when user enrolls or logs in, an X-Auth Token is
generated. This token is used to fetch the user’s profile details and is valid for 30
minutes.
Along with the X-Auth Token, a Refresh Token is also provided. This Refresh Token is
used to generate a new X-Auth Token through the given API. The Refresh Token is
valid for 15 days.
If you need a new X-Auth Token after 15 days, you can call the same API again. It will
give you a new Refresh Token, which will then be valid for another 15 days from the
time it was generated.
To keep the Refresh Token active continuously, you can call the API once within every
10 days and store the new Refresh Token. This way, you can extend access to the
X-Auth Token for as long as needed.
Request curl:
curl --location --request GET
'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token' \
--header 'R-token: Bearer {{RefreshToken}}' \
--header 'Authorization: Bearer {{Auth}}' \
--header 'payerid: 123@hcx' \
--header 'process: Preauth|Discharge' \
Response:
{

**Table 23.1**

| curl --location --request GET |
|---|
| 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token' \ |
|  |
| --header 'R-token: Bearer {{RefreshToken}}' \ |
| --header 'Authorization: Bearer {{Auth}}' \ |
| --header 'payerid: 123@hcx' \ |
| --header 'process: Preauth\|Discharge' \ |


---

## Page 24

"txnId": "d21b3db9-478a-xxxx-xxxx-8f75e7f86b9f",
"authResult": "success",
"message": "OTP verified successfully",
"token": "eyZhx….",
"refreshToken": "eyZhx….",
"expiresIn": 1800,
"refreshExpiresIn": 1296000,
"accounts": [
{
"ABHANumber": "91-XXXX-XXXX-1234",
"preferredAbhaAddress": "91XXXXXXXX1234@sbx",
"name": "Test Name",
"gender": null,
"dob": null,
"verifiedStatus": null,
"verificationType": null,
"status": "ACTIVE",
"profilePhoto": "base 64 image"
}
]
}
8.3 Coverage Eligibility
The PMJAY Coverage Eligibility Check via NHCX enables healthcare providers to verify a
patient’s eligibility and available benefits under the PMJAY scheme before registration or
treatment. This process ensures that only eligible beneficiaries receive scheme benefits,
prevent misuse, and streamline patient onboarding.
Key value sets Value sets are returned depending on the following purposes:
returned ● Discovery
● Validation

**Table 24.1**

| Key value sets<br>returned | Value sets are returned depending on the following purposes:<br>● Discovery<br>● Validation |
|---|---|


---

## Page 25

● Auth requirements
● Benefits
Technical ● Integrate and test the CoverageEligibilityCheck API.
Implementation ● Implement a callback endpoint for asynchronous responses.
Guidelines ● Parse and validate benefit limits and coverage status.
● Support family coverage validation.
● Capture and store Aadhaar exemption consent documents.
● Alert provider and patient if coverage is insufficient.
● Register patients only after validating coverage.
● Call coverage eligibility every time a new/additional treatment
(should be treated as a validation) is added to ensure it is within
the limits before submitting a pre-authorisation.
Example ● Individual Coverage Valid: Patient has sufficient coverage;
scenarios registration proceeds.
● Family Coverage with Shared Limit: Remaining family coverage
is checked before registration.
● Limit Exhausted: Registration is blocked if the family’s limit is
exhausted.
● Aadhaar Exemption: Consent is captured and eligibility check
proceeds if Aadhaar is unavailable.
APIs to be called /v1/coverageeligibility/check
Callback API to /v1/coverageeligibility/on_check
be Implemented
The entity to Payer
implement the
API is called
Protocol status request.initiated
Request Payload Encrypted payload of CoverageEligibilityRequestBundle
Validations Payload should be validated against the profiles published by NRCES.
Callback API The callback API should be implemented by provider /PHR systems. It
logic should accept the payload in two forms, and it will be derived based on
the “type” parameter of the response.

**Table 25.1**

|  | ● Auth requirements<br>● Benefits |
|---|---|
| Technical<br>Implementation<br>Guidelines | ● Integrate and test the CoverageEligibilityCheck API.<br>● Implement a callback endpoint for asynchronous responses.<br>● Parse and validate benefit limits and coverage status.<br>● Support family coverage validation.<br>● Capture and store Aadhaar exemption consent documents.<br>● Alert provider and patient if coverage is insufficient.<br>● Register patients only after validating coverage.<br>● Call coverage eligibility every time a new/additional treatment<br>(should be treated as a validation) is added to ensure it is within<br>the limits before submitting a pre-authorisation. |
| Example<br>scenarios | ● Individual Coverage Valid: Patient has sufficient coverage;<br>registration proceeds.<br>● Family Coverage with Shared Limit: Remaining family coverage<br>is checked before registration.<br>● Limit Exhausted: Registration is blocked if the family’s limit is<br>exhausted.<br>● Aadhaar Exemption: Consent is captured and eligibility check<br>proceeds if Aadhaar is unavailable. |
| APIs to be called | /v1/coverageeligibility/check |
| Callback API to<br>be Implemented | /v1/coverageeligibility/on_check |
| The entity to<br>implement the<br>API is called | Payer |
| Protocol status | request.initiated |
| Request Payload | Encrypted payload of CoverageEligibilityRequestBundle |
| Validations | Payload should be validated against the profiles published by NRCES. |
| Callback API<br>logic | The callback API should be implemented by provider /PHR systems. It<br>should accept the payload in two forms, and it will be derived based on<br>the “type” parameter of the response. |


---

## Page 26

1. Encrypted format (As per RFC7516) and decrypted using the
private key of the provider entity. Encrypted payload comes as a
response only when the payer has processed the request and
responded, when everything is validated and verified.
2. ProtocolResponse. ProtocolResponse comes as a response only
when the payer is able to process the request due to the
payload being invalid or not able to decrypt, or any protocol
errors.
References ● Coverage Eligibility API
● CoverageEligibilityRequest - FHIR Implementation Guide for
ABDM v6.5.0
● CoverageEligibilityResponse - FHIR Implementation Guide for
ABDM v6.5.0
Coverage Eligibility API Request and Response based on purpose
8.3.1 Validation
Description A check that the specified coverages are in-force is requested (and
wallet balance as well)
Mandatory input ● Beneficiary ID
parameters ● Coverage/Plan Code
● Payer ID
● Provider ID
Key value sets ● Coverage component
returned ○ Period
● Coverage eligibility response component
○ Status
○ Requester
○ Patient detail
○ Insurer
○ Insurance component
■ Item
● Benefit component (number of entries
here will be the same as number of
wallets applicable to the beneficiary)
○ Allowed (balance)
○ Used (consumed)
8.3.2 Discovery
Description The insurer is requested to report on any coverages which they are
aware of in addition to any specified. It provides a list of all active
coverages for the beneficiary.

**Table 26.1**

|  | 1. Encrypted format (As per RFC7516) and decrypted using the<br>private key of the provider entity. Encrypted payload comes as a<br>response only when the payer has processed the request and<br>responded, when everything is validated and verified.<br>2. ProtocolResponse. ProtocolResponse comes as a response only<br>when the payer is able to process the request due to the<br>payload being invalid or not able to decrypt, or any protocol<br>errors. |
|---|---|
| References | ● Coverage Eligibility API<br>● CoverageEligibilityRequest - FHIR Implementation Guide for<br>ABDM v6.5.0<br>● CoverageEligibilityResponse - FHIR Implementation Guide for<br>ABDM v6.5.0 |


**Table 26.2**

| Description | A check that the specified coverages are in-force is requested (and<br>wallet balance as well) |
|---|---|
| Mandatory input<br>parameters | ● Beneficiary ID<br>● Coverage/Plan Code<br>● Payer ID<br>● Provider ID |
| Key value sets<br>returned | ● Coverage component<br>○ Period<br>● Coverage eligibility response component<br>○ Status<br>○ Requester<br>○ Patient detail<br>○ Insurer<br>○ Insurance component<br>■ Item<br>● Benefit component (number of entries<br>here will be the same as number of<br>wallets applicable to the beneficiary)<br>○ Allowed (balance)<br>○ Used (consumed) |


**Table 26.3**

| Description | The insurer is requested to report on any coverages which they are<br>aware of in addition to any specified. It provides a list of all active<br>coverages for the beneficiary. |
|---|---|


---

## Page 27

Mandatory input ● Beneficiary ID
parameters ● Coverage/Plan Code
● Payer ID
● Provider ID
Key value sets ● Coverage component
returned ○ Period
● Coverage eligibility response component
○ Status
○ Requester
○ Patient detail
○ Insurer
○ Insurance component
8.3.3 Auth requirements
Description The prior authorization requirements for the listed, or discovered if
specified, coverages for the categories of service and/or specified
billing codes are requested.
Mandatory input ● Beneficiary ID
parameters ● Coverage/Plan Code
● Payer ID
● Provider ID
● Procedure/Package Codes
Key value sets ● Coverage component
returned ○ Period
● Coverage eligibility response component
○ Status
○ Requester
○ Patient detail
○ Insurer
○ Insurance component
■ Item
● Benefit component (this will have
procedure-wise auth requirement details)
8.3.4 Benefits
Description The plan benefits and optionally benefits consumed for the listed, or
discovered if specified, coverages are requested.
Mandatory input ● Beneficiary ID
parameters ● Coverage/Plan Code
● Payer ID
● Provider ID
● Procedure/Package Codes
Key value sets ● Coverage component

**Table 27.1**

| Mandatory input<br>parameters | ● Beneficiary ID<br>● Coverage/Plan Code<br>● Payer ID<br>● Provider ID |
|---|---|
| Key value sets<br>returned | ● Coverage component<br>○ Period<br>● Coverage eligibility response component<br>○ Status<br>○ Requester<br>○ Patient detail<br>○ Insurer<br>○ Insurance component |


**Table 27.2**

| Description | The prior authorization requirements for the listed, or discovered if<br>specified, coverages for the categories of service and/or specified<br>billing codes are requested. |
|---|---|
| Mandatory input<br>parameters | ● Beneficiary ID<br>● Coverage/Plan Code<br>● Payer ID<br>● Provider ID<br>● Procedure/Package Codes |
| Key value sets<br>returned | ● Coverage component<br>○ Period<br>● Coverage eligibility response component<br>○ Status<br>○ Requester<br>○ Patient detail<br>○ Insurer<br>○ Insurance component<br>■ Item<br>● Benefit component (this will have<br>procedure-wise auth requirement details) |


**Table 27.3**

| Description | The plan benefits and optionally benefits consumed for the listed, or<br>discovered if specified, coverages are requested. |
|---|---|
| Mandatory input<br>parameters | ● Beneficiary ID<br>● Coverage/Plan Code<br>● Payer ID<br>● Provider ID<br>● Procedure/Package Codes |
| Key value sets | ● Coverage component |


---

## Page 28

returned ○ Period
● Coverage eligibility response component
○ Status
○ Requester
○ Patient detail
○ Insurer
○ Insurance component
■ Item
● Benefit component (this will have
procedure-wise auth requirement details)
Using CoverageEligibility in Claims Submission
Step Detail
Initiate Coverage ● The provider’s system sends a request to the Payer system
through NHCX using the CoverageEligibilityCheck API.
Eligibility Check ● Required details: beneficiary’s Payer ID, ABHA Id, PMJAY Id,
Aadhaar number, or other identifiers which are supported by
PMJAY.
Receive ● The Payer system processes the request and sends an
CoverageEligibilit asynchronous response to the provider’s system through
yResponse NHCX.
● The response includes beneficiary details, coverage status,
benefit limits, and family coverage information.
Validate ● The provider’s system parses the response to extract benefit
Coverage and limits and coverage status.
Limits ● It checks if the requested services/packages are covered and
within the available limits.
● If coverage is insufficient or the service is not covered, the
system alerts the provider and patient.
Register Patient ● If coverage is confirmed, the patient is registered for treatment.
with Validated ● If Aadhaar authentication is not possible, the system captures
Coverage Aadhaar exemption consent and stores the documentation.
Inform Patient ● The provider communicates the coverage status and limits to
and Prepare for the patient.
Next Steps ● If coverage is insufficient, alternative options are discussed.

**Table 28.1**

| returned | ○ Period<br>● Coverage eligibility response component<br>○ Status<br>○ Requester<br>○ Patient detail<br>○ Insurer<br>○ Insurance component<br>■ Item<br>● Benefit component (this will have<br>procedure-wise auth requirement details) |
|---|---|


**Table 28.2**

| Step | Detail |
|---|---|
| Initiate Coverage | ● The provider’s system sends a request to the Payer system<br>through NHCX using the CoverageEligibilityCheck API. |
| Eligibility Check | ● Required details: beneficiary’s Payer ID, ABHA Id, PMJAY Id,<br>Aadhaar number, or other identifiers which are supported by<br>PMJAY. |
| Receive<br>CoverageEligibilit<br>yResponse | ● The Payer system processes the request and sends an<br>asynchronous response to the provider’s system through<br>NHCX.<br>● The response includes beneficiary details, coverage status,<br>benefit limits, and family coverage information. |
| Validate<br>Coverage and<br>Limits | ● The provider’s system parses the response to extract benefit<br>limits and coverage status.<br>● It checks if the requested services/packages are covered and<br>within the available limits.<br>● If coverage is insufficient or the service is not covered, the<br>system alerts the provider and patient. |
| Register Patient<br>with Validated<br>Coverage | ● If coverage is confirmed, the patient is registered for treatment.<br>● If Aadhaar authentication is not possible, the system captures<br>Aadhaar exemption consent and stores the documentation. |
| Inform Patient<br>and Prepare for<br>Next Steps | ● The provider communicates the coverage status and limits to<br>the patient.<br>● If coverage is insufficient, alternative options are discussed. |


---

## Page 29

8.4. Pre-authorisation
8.4.0 Structured Data Exchange
Supporting documents need to be sent in a fully structured FHIR format. This will have to be
aligned with the Health Information (HI) Types defined under ABDM.
● When submitting structured clinical data as part of a Preauthorization or Claim, the
information must be shared through the SupportingInfo → DocumentReference
resource.
● Within the DocumentReference.content.attachment element, the attachment.data
field should contain a Base64-encoded FHIR Bundle. This bundle should include the
relevant structured FHIR resources (for example, DiagnosticReport,
DischargeSummary, WellnessRecord, and any associated resources) required to
support the preauth or claim.
● This differs from unstructured submissions, where the attachment typically contains a
Base64-encoded PDF or JPG document.
● For structured submissions:
○ The attachment represents a FHIR Bundle encoded in Base64, not a static
document.
○ The bundle contains the necessary FHIR resources describing the clinical
information relevant to the claim or preauthorization.
The DocumentReference.content.attachment.contentType should be set to
either application/json or application/fhir+json.
● For structured data, category code of supporting info needs to be among DIA, HDS,
CD, INF and the value needs to be reference.
● For unstructured data, the category code of supporting info needs to be among POI,
POA, DOB, DEF, FIR, ATT and the value needs to be attachment.
● Reference documents:
○ ABDM Sandbox Health Record Formats
○ Understanding_the_Structure_of_ABDM_HI_Types_its_Creation_and_Validati
on
○ FHIR Profiles for ABDM Health Data Interchange
Key input Documents to be submitted and questionnaires for Pre-Auth to be
parameters fetched from ‘Coverage Eligibility API’ with purpose ‘auth requirements’
The following dates need to be sent mandatorily in the NRCeS
prescribed date-time format with the correct codes:
Registration Date
● Code: EDT
● Display: EncounterDateTime
● Code System: ndhm-supportinginfo-code

**Table 29.1**

| ○ ABDM Sandbox Health Record Formats |
|---|
| ○ Understanding_the_Structure_of_ABDM_HI_Types_its_Creation_and_Validati |
| on |
| ○ FHIR Profiles for ABDM Health Data Interchange |


**Table 29.2**

| Key input<br>parameters | Documents to be submitted and questionnaires for Pre-Auth to be<br>fetched from ‘Coverage Eligibility API’ with purpose ‘auth requirements’<br>The following dates need to be sent mandatorily in the NRCeS<br>prescribed date-time format with the correct codes:<br>Registration Date<br>● Code: EDT<br>● Display: EncounterDateTime<br>● Code System: ndhm-supportinginfo-code |
|---|---|


---

## Page 30

● Category Code: OTH
● Category Display: Other
● Category System: ndhm-supportinginfo-category
Admission Date
● Code: ADDD
● Display: Admission date – Discharge date
● Code System: ndhm-supportinginfo-code
● Category Code: ADMD
● Category Display: Admission Date
● Category System: ndhm-supportinginfo-category
Technical ● The file limit for each document should be 2 MB as the
Implementation maximum size for the whole bundle can only be 20 MB.
Guidelines ● Documents need to be double encrypted in Base64 format.
There can only be one document linked per item (for e.g., if one
item has multiple documents, they need to be merged into one)
● Procedure components should have the same value based on
the response from the insurance plan
● Documents and questionnaires that are mandatory for
pre-authorisation will come for the Coverage Eligibility ‘auth
requirement’ response
● Supporting documents need to be sent in a fully structured
FHIR format. This will have to be aligned with the Health
Information (HI) Types defined under ABDM.
Functional points ● Pre-authorisation cannot be raised more than one day in
to note advance
● Integrators should ideally call coverage eligibility every time a
new/additional treatment (should be treated as a validation) is
added to ensure it is within the limits before submitting a
pre-authorisation
Questionnaire ● For submitting questionnaire responses in a pre-auth/claim
Responses as request: it needs to be configured in ‘Supporting Info’ with
part of category INF, code AT and reference value
Pre-authorisation
Bundle
APIs to be called /v1/preauth/submit
API to be /v1/preauth/on_submit
Implemented
Use case Submit the Preauthorization request from the Provider end.
description

**Table 30.1**

|  | ● Category Code: OTH<br>● Category Display: Other<br>● Category System: ndhm-supportinginfo-category<br>Admission Date<br>● Code: ADDD<br>● Display: Admission date – Discharge date<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: ADMD<br>● Category Display: Admission Date<br>● Category System: ndhm-supportinginfo-category |
|---|---|
| Technical<br>Implementation<br>Guidelines | ● The file limit for each document should be 2 MB as the<br>maximum size for the whole bundle can only be 20 MB.<br>● Documents need to be double encrypted in Base64 format.<br>There can only be one document linked per item (for e.g., if one<br>item has multiple documents, they need to be merged into one)<br>● Procedure components should have the same value based on<br>the response from the insurance plan<br>● Documents and questionnaires that are mandatory for<br>pre-authorisation will come for the Coverage Eligibility ‘auth<br>requirement’ response<br>● Supporting documents need to be sent in a fully structured<br>FHIR format. This will have to be aligned with the Health<br>Information (HI) Types defined under ABDM. |
| Functional points<br>to note | ● Pre-authorisation cannot be raised more than one day in<br>advance<br>● Integrators should ideally call coverage eligibility every time a<br>new/additional treatment (should be treated as a validation) is<br>added to ensure it is within the limits before submitting a<br>pre-authorisation |
| Questionnaire<br>Responses as<br>part of<br>Pre-authorisation<br>Bundle | ● For submitting questionnaire responses in a pre-auth/claim<br>request: it needs to be configured in ‘Supporting Info’ with<br>category INF, code AT and reference value |
| APIs to be called | /v1/preauth/submit |
| API to be<br>Implemented | /v1/preauth/on_submit |
| Use case<br>description | Submit the Preauthorization request from the Provider end. |


---

## Page 31

Protocol status request.initiated
Request Payload Encrypted payload of ClaimBundle
Validations Payload should be validated against the profiles published by NRCES.
The entity to Payer
implement the
API is called
Callback API Callback API should be implemented by provider systems. It should
logic accept the payload in two forms, and it will be derived based on the
“type” param of the response.
1. Encrypted format (As per RFC7516) of the payload
ClaimResponseBundle and decrypted using the private key of
the provider entity. Encrypted payload comes as a response
only when the payer processes the request and responds when
everything is validated and verified.
2. ProtocolResponse: ProtocolResponse comes as response only
when the payer is not able to process the request due to the
payload is invalid or not able to decrypt or any protocol errors.
Other reference ● Checklist of mandatory fields for a successful pre-auth bundle
documents ● Adjudication codes for PMJAY
● NHCX Preauthorisation API
● Claim - FHIR Implementation Guide for ABDM v6.5.0
● ClaimResponse - FHIR Implementation Guide for ABDM v6.5.0
● NHCX Workflow IDs
Pre-Authorisation Scenarios
8.4.1 Auto-approval / manual adjudication
Description The bundle structure for both of these remains the same. The request
will get auto-approved/rejected if it adheres to certain parameters. If it
does not, it will be manually responded to. If the case is not responded
to within the stipulated time, it will automatically get approved.
A case will be auto-approved only if the selected procedure(s) are
eligible for auto approval. For auto approval to apply, the
pre-authorization request must be the first pre-auth for the case, and
all requested procedures must be eligible for auto approval. Only when
both conditions are met will the case be auto-approved.
Separately, cases may also be auto-approved under the TAT-based
approval rule. If the policy is eligible for TAT approval and no action is
taken within the defined TAT timeframe, the case will be automatically
approved.

**Table 31.1**

| Protocol status | request.initiated |
|---|---|
| Request Payload | Encrypted payload of ClaimBundle |
| Validations | Payload should be validated against the profiles published by NRCES. |
| The entity to<br>implement the<br>API is called | Payer |
| Callback API<br>logic | Callback API should be implemented by provider systems. It should<br>accept the payload in two forms, and it will be derived based on the<br>“type” param of the response.<br>1. Encrypted format (As per RFC7516) of the payload<br>ClaimResponseBundle and decrypted using the private key of<br>the provider entity. Encrypted payload comes as a response<br>only when the payer processes the request and responds when<br>everything is validated and verified.<br>2. ProtocolResponse: ProtocolResponse comes as response only<br>when the payer is not able to process the request due to the<br>payload is invalid or not able to decrypt or any protocol errors. |
| Other reference<br>documents | ● Checklist of mandatory fields for a successful pre-auth bundle<br>● Adjudication codes for PMJAY<br>● NHCX Preauthorisation API<br>● Claim - FHIR Implementation Guide for ABDM v6.5.0<br>● ClaimResponse - FHIR Implementation Guide for ABDM v6.5.0<br>● NHCX Workflow IDs |


**Table 31.2**

| ● Checklist of mandatory fields for a successful pre-auth bundle |
|---|
| ● Adjudication codes for PMJAY |


**Table 31.3**

| Description | The bundle structure for both of these remains the same. The request<br>will get auto-approved/rejected if it adheres to certain parameters. If it<br>does not, it will be manually responded to. If the case is not responded<br>to within the stipulated time, it will automatically get approved.<br>A case will be auto-approved only if the selected procedure(s) are<br>eligible for auto approval. For auto approval to apply, the<br>pre-authorization request must be the first pre-auth for the case, and<br>all requested procedures must be eligible for auto approval. Only when<br>both conditions are met will the case be auto-approved.<br>Separately, cases may also be auto-approved under the TAT-based<br>approval rule. If the policy is eligible for TAT approval and no action is<br>taken within the defined TAT timeframe, the case will be automatically<br>approved. |
|---|---|


---

## Page 32

How to raise Standard pre-authorisation format with the relevant workflow ID
8.4.2 Resubmission/Reprocess
Description Once a base pre-auth request already exists in the system, a
resubmission can be raised. Resubmission will nullify all the previous
instances and the payer system will consider this request as the base
request.
Example If there is an approved (or rejected) pre-authorisation or enhancement
scenario case, but this needs to be revised for a higher amount or different
package, resubmission has to be initiated.
How to raise Same as pre-authorisation request bundle but with workflow ID for
Pre-auth reprocess
8.4.3 Enhancement
Description Once there is an already approved pre-auth request, an enhancement
request needs to be raised to extend the procedure or add new
procedures.
Functional ● Multiple enhancements can be raised (unlimited) until discharge
points to note as long as it is within the limit (after initial pre-authorisation).
● Enhancement requests can only be sent after any previous
request (pre-auth or resubmission) has been closed.
How to raise Following items need to be in the bundle:
● Workflow ID for enhancement,
● Already approved treatments and
● Treatments for approval
8.4.4 Query updation
Description If there is a query in the pre-authorisation submitted, this will be noted
in the pre-auth response bundle which has an item-wise adjudication
field. Providers should be able to read this query and respond to the
same.
How to raise Once a query has been received, a pre-auth query response (with
relevant workflow ID) has to be initiated, and not a resubmission. The
bundle structure will be the same.
Sample To test this, currently it has to be flagged to the TCS team along with
response correlation ID and number. They will respond with a dummy query that
the integrator can then respond to.
8.4.5 Cancellation
Description The complete pre-authorisation request gets cancelled. Can be raised if

**Table 32.1**

| How to raise | Standard pre-authorisation format with the relevant workflow ID |
|---|---|


**Table 32.2**

| Description | Once a base pre-auth request already exists in the system, a<br>resubmission can be raised. Resubmission will nullify all the previous<br>instances and the payer system will consider this request as the base<br>request. |
|---|---|
| Example<br>scenario | If there is an approved (or rejected) pre-authorisation or enhancement<br>case, but this needs to be revised for a higher amount or different<br>package, resubmission has to be initiated. |
| How to raise | Same as pre-authorisation request bundle but with workflow ID for<br>Pre-auth reprocess |


**Table 32.3**

| Description | Once there is an already approved pre-auth request, an enhancement<br>request needs to be raised to extend the procedure or add new<br>procedures. |
|---|---|
| Functional<br>points to note | ● Multiple enhancements can be raised (unlimited) until discharge<br>as long as it is within the limit (after initial pre-authorisation).<br>● Enhancement requests can only be sent after any previous<br>request (pre-auth or resubmission) has been closed. |
| How to raise | Following items need to be in the bundle:<br>● Workflow ID for enhancement,<br>● Already approved treatments and<br>● Treatments for approval |


**Table 32.4**

| Description | If there is a query in the pre-authorisation submitted, this will be noted<br>in the pre-auth response bundle which has an item-wise adjudication<br>field. Providers should be able to read this query and respond to the<br>same. |
|---|---|
| How to raise | Once a query has been received, a pre-auth query response (with<br>relevant workflow ID) has to be initiated, and not a resubmission. The<br>bundle structure will be the same. |
| Sample<br>response | To test this, currently it has to be flagged to the TCS team along with<br>correlation ID and number. They will respond with a dummy query that<br>the integrator can then respond to. |


**Table 32.5**

| Description | The complete pre-authorisation request gets cancelled. Can be raised if |
|---|---|


---

## Page 33

there is an active pre–auth or if there is a pre-auth with decision
pending at the payer end.
How to raise Task Reprocess Request Bundle should be used for pre-auth
cancellation (format can be found here)
The task component should have:
● type of input parameter code which is the intimation number in
pre-auth (and claim number in claim),
● code for this task is ‘cancel’
(http://terminology.hl7.org/CodeSystem/financialtaskcode),
● reason code based on whatever is used in the system,
● remarks can be set in the disposition parameter
8.5. Claim
8.5.0 Structured Data Exchange
Supporting documents need to be sent in a fully structured FHIR format. This will have to be
aligned with the Health Information (HI) Types defined under ABDM.
● When submitting structured clinical data as part of a Preauthorization or Claim, the
information must be shared through the SupportingInfo → DocumentReference
resource.
● Within the DocumentReference.content.attachment element, the attachment.data
field should contain a Base64-encoded FHIR Bundle. This bundle should include the
relevant structured FHIR resources (for example, DiagnosticReport,
DischargeSummary, WellnessRecord, and any associated resources) required to
support the preauth or claim.
● This differs from unstructured submissions, where the attachment typically contains a
Base64-encoded PDF or JPG document.
● For structured submissions:
○ The attachment represents a FHIR Bundle encoded in Base64, not a static
document.
○ The bundle contains the necessary FHIR resources describing the clinical
information relevant to the claim or preauthorization.
The DocumentReference.content.attachment.contentType should be set to
either application/json or application/fhir+json.
● For structured data, category code of supporting info needs to be among DIA, HDS,
CD, INF and the value needs to be reference.
● For unstructured data, the category code of supporting info needs to be among POI,
POA, DOB, DEF, FIR, ATT and the value needs to be attachment.
● Reference documents:
○ ABDM Sandbox Health Record Formats
○ Understanding_the_Structure_of_ABDM_HI_Types_its_Creation_and_Validati
on

**Table 33.1**

|  | there is an active pre–auth or if there is a pre-auth with decision<br>pending at the payer end. |
|---|---|
| How to raise | Task Reprocess Request Bundle should be used for pre-auth<br>cancellation (format can be found here)<br>The task component should have:<br>● type of input parameter code which is the intimation number in<br>pre-auth (and claim number in claim),<br>● code for this task is ‘cancel’<br>(http://terminology.hl7.org/CodeSystem/financialtaskcode),<br>● reason code based on whatever is used in the system,<br>● remarks can be set in the disposition parameter |


**Table 33.2**

| ○ ABDM Sandbox Health Record Formats |
|---|
| ○ Understanding_the_Structure_of_ABDM_HI_Types_its_Creation_and_Validati |
| on |


---

## Page 34

○ FHIR Profiles for ABDM Health Data Interchange
Key input All documents to be submitted and questionnaires for Claim will be
parameters found in the Insurance Plan response. The ‘Coverage Eligibility API’
with purpose ‘auth requirements’ will have those required only for
Pre-auth. The remaining documents are mandatory for Claim.
The following dates need to be sent mandatorily in the NRCeS
prescribed date-time format with the correct codes:
Registration Date
● Code: EDT
● Display: EncounterDateTime
● Code System: ndhm-supportinginfo-code
● Category Code: OTH
● Category Display: Other
● Category System: ndhm-supportinginfo-category
Admission Date
● Code: ADDD
● Display: Admission date – Discharge date
● Code System: ndhm-supportinginfo-code
● Category Code: ADMD
● Category Display: Admission Date
● Category System: ndhm-supportinginfo-category
Surgery Date
● Code: ADDD
● Display: Admission date – Discharge date
● Code System: ndhm-supportinginfo-code
● Category Code: SURD
● Category Display: Surgery Date
● Category System: ndhm-supportinginfo-category
Discharge Date
● Code: ADDD
● Display: Admission date – Discharge date
● Code System: ndhm-supportinginfo-code
● Category Code: DSCHD
● Category Display: Discharge Date
● Category System: ndhm-supportinginfo-category
Discharge Status
● Code: DTH

**Table 34.1**

| Key input<br>parameters | All documents to be submitted and questionnaires for Claim will be<br>found in the Insurance Plan response. The ‘Coverage Eligibility API’<br>with purpose ‘auth requirements’ will have those required only for<br>Pre-auth. The remaining documents are mandatory for Claim.<br>The following dates need to be sent mandatorily in the NRCeS<br>prescribed date-time format with the correct codes:<br>Registration Date<br>● Code: EDT<br>● Display: EncounterDateTime<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: OTH<br>● Category Display: Other<br>● Category System: ndhm-supportinginfo-category<br>Admission Date<br>● Code: ADDD<br>● Display: Admission date – Discharge date<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: ADMD<br>● Category Display: Admission Date<br>● Category System: ndhm-supportinginfo-category<br>Surgery Date<br>● Code: ADDD<br>● Display: Admission date – Discharge date<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: SURD<br>● Category Display: Surgery Date<br>● Category System: ndhm-supportinginfo-category<br>Discharge Date<br>● Code: ADDD<br>● Display: Admission date – Discharge date<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: DSCHD<br>● Category Display: Discharge Date<br>● Category System: ndhm-supportinginfo-category<br>Discharge Status<br>● Code: DTH |
|---|---|


---

## Page 35

● Display: Discharge To Home (Discharge disposition status)
● Code System: ndhm-supportinginfo-code
● Category Code: DIS
● Category Display: Discharge status and discharge to location
detail
● Category System: ndhm-supportinginfo-category
Technical ● Supporting documents need to be sent in a fully structured
Implementation FHIR format. This will have to be aligned with the Health
Guidelines Information (HI) Types defined under ABDM.
○ For structured data, category code of supporting info
needs to be among DIA, HDS, CD, INF.. and the value
needs to be reference..
○ For unstructured data, the category code of
supporting info needs to be among POI, POA, DOB,
DEF, FIR, ATT.. and the value needs to be attachment.
Functional points ● A claim cannot be cancelled.
to note ● The PMJAY system does not have a separate discharge
workflow. When a claim is raised, the system implicitly assumes
that the patient has been discharged. Accordingly, discharge
details must be included as part of the claim request itself.
Once the pre-authorisation is approved and the treatment is
completed, the patient may be discharged and the claim can be
submitted.
Questionnaire ● For submitting questionnaire responses in a pre-auth/claim
Responses as request: it needs to be configured in ‘Supporting Info’ with
part of Claim category INF, code AT and reference value
Request Bundle
APIs to be called /v1/claim/submit (for claim submission)
/v1/claim/on_submit (for claim response)
API to be /v1/claim/on_submit (for claim submission)
Implemented /v1/claim/submit (for claim response)
Use case Submit the Claim from the Provider end to the NHCX.
description
Protocol status Payer
Request Payload request.initiated
Validations Encrypted payload of ClaimBundle

**Table 35.1**

|  | ● Display: Discharge To Home (Discharge disposition status)<br>● Code System: ndhm-supportinginfo-code<br>● Category Code: DIS<br>● Category Display: Discharge status and discharge to location<br>detail<br>● Category System: ndhm-supportinginfo-category |
|---|---|
| Technical<br>Implementation<br>Guidelines | ● Supporting documents need to be sent in a fully structured<br>FHIR format. This will have to be aligned with the Health<br>Information (HI) Types defined under ABDM.<br>○ For structured data, category code of supporting info<br>needs to be among DIA, HDS, CD, INF.. and the value<br>needs to be reference..<br>○ For unstructured data, the category code of<br>supporting info needs to be among POI, POA, DOB,<br>DEF, FIR, ATT.. and the value needs to be attachment. |
| Functional points<br>to note | ● A claim cannot be cancelled.<br>● The PMJAY system does not have a separate discharge<br>workflow. When a claim is raised, the system implicitly assumes<br>that the patient has been discharged. Accordingly, discharge<br>details must be included as part of the claim request itself.<br>Once the pre-authorisation is approved and the treatment is<br>completed, the patient may be discharged and the claim can be<br>submitted. |
| Questionnaire<br>Responses as<br>part of Claim<br>Request Bundle | ● For submitting questionnaire responses in a pre-auth/claim<br>request: it needs to be configured in ‘Supporting Info’ with<br>category INF, code AT and reference value |
| APIs to be called | /v1/claim/submit (for claim submission)<br>/v1/claim/on_submit (for claim response) |
| API to be<br>Implemented | /v1/claim/on_submit (for claim submission)<br>/v1/claim/submit (for claim response) |
| Use case<br>description | Submit the Claim from the Provider end to the NHCX. |
| Protocol status | Payer |
| Request Payload | request.initiated |
| Validations | Encrypted payload of ClaimBundle |


---

## Page 36

The entity to Payload should be validated against the profiles published by NRCES.
implement the
API is called
Callback API Callback API should be implemented by provider systems. It should
logic accept the payload in two forms, and it will be derived based on the
“type” parameter of the response.
1. Encrypted format (As per RFC7516) of the payload
ClaimResponseBundle and decrypt using the private key of the
provider entity.
Encrypted payload comes as a response only when the payer has
processed the request and responded, and everything is validated.
Other reference ● Checklist of mandatory fields for a successful pre-auth bundle
documents ● Adjudication codes for PMJAY
● NHCX Claim API
● Claim - FHIR Implementation Guide for ABDM v6.5.0
● ClaimResponse - FHIR Implementation Guide for ABDM v6.5.0
● Reference documents for structured data:
○ ABDM Sandbox Health Record Formats
○ Understanding_the_Structure_of_ABDM_HI_Types_its
_Creation_and_Validation
○ FHIR Profiles for ABDM Health Data Interchange
8.5.1 Manual adjudication (approval and rejection)
Description The bundle structure for both of these remains the same. The request
will get approved or rejected on a case-by-case basis.
How to raise Standard claim format
8.5.2 Query updation
Description The bundle structure for both of these remains the same. The request
will get approved or rejected on a case-by-case basis.
How to raise Once a query has been received, a claim query response (with workflow
ID for claim query response) has to be initiated. The bundle structure
will be the same as the Claim Bundle.
Sample To test this, currently it has to be flagged to the TCS team along with
response correlation ID and number. They will respond with a dummy query that
the integrator can then respond to.

**Table 36.1**

| The entity to<br>implement the<br>API is called | Payload should be validated against the profiles published by NRCES. |
|---|---|
| Callback API<br>logic | Callback API should be implemented by provider systems. It should<br>accept the payload in two forms, and it will be derived based on the<br>“type” parameter of the response.<br>1. Encrypted format (As per RFC7516) of the payload<br>ClaimResponseBundle and decrypt using the private key of the<br>provider entity.<br>Encrypted payload comes as a response only when the payer has<br>processed the request and responded, and everything is validated. |
| Other reference<br>documents | ● Checklist of mandatory fields for a successful pre-auth bundle<br>● Adjudication codes for PMJAY<br>● NHCX Claim API<br>● Claim - FHIR Implementation Guide for ABDM v6.5.0<br>● ClaimResponse - FHIR Implementation Guide for ABDM v6.5.0<br>● Reference documents for structured data:<br>○ ABDM Sandbox Health Record Formats<br>○ Understanding_the_Structure_of_ABDM_HI_Types_its<br>_Creation_and_Validation<br>○ FHIR Profiles for ABDM Health Data Interchange |


**Table 36.2**

| ● Checklist of mandatory fields for a successful pre-auth bundle |
|---|
| ● Adjudication codes for PMJAY |


**Table 36.3**

| ○ ABDM Sandbox Health Record Formats |
|---|
| ○ Understanding_the_Structure_of_ABDM_HI_Types_its |
| _Creation_and_Validation |
| ○ FHIR Profiles for ABDM Health Data Interchange |


**Table 36.4**

| Description | The bundle structure for both of these remains the same. The request<br>will get approved or rejected on a case-by-case basis. |
|---|---|
| How to raise | Standard claim format |


**Table 36.5**

| Description | The bundle structure for both of these remains the same. The request<br>will get approved or rejected on a case-by-case basis. |
|---|---|
| How to raise | Once a query has been received, a claim query response (with workflow<br>ID for claim query response) has to be initiated. The bundle structure<br>will be the same as the Claim Bundle. |
| Sample<br>response | To test this, currently it has to be flagged to the TCS team along with<br>correlation ID and number. They will respond with a dummy query that<br>the integrator can then respond to. |


---

## Page 37

8.5.3 Erroneous flow
Description This is a use case for if the claim approved amount is less than the
claimed amount. For the remaining amount that has been requested, it
will go through the different levels of processing.
How to raise They need to initiate task request with workflow ID for arbitration
request and the following details:
● Claim number
● Difference amount for which it is being raised
8.5.4 Reprocess/Resubmit
Description This is a use case for if the claim is rejected and then has to be
resubmitted.
How to raise Once a pre-auth has been approved, a claim has been raised and gets
rejected, the claim has to be resubmitted. The same bundle structure
but with workflow ID used for reprocess.
Sample request https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Task.html
and response
8.5.5 Payment Notice
Description Once a claim has been approved by the payer and the payment has
been made, a payment notice is sent to the provider system.
Payment notice will give overall consolidated status:
● Cleared - amount has been initiated
● Paid - amount has been received
● Rejected - amount has been initiated but failed due to any
server issues
● Adjusted - any balance being adjusted
Payment reconciliation will give a breakup of payment for that case.
How to raise The provider system should have the capability to accept and
acknowledge the same.
9. APPENDIX
Glossary

**Table 37.1**

| Description | This is a use case for if the claim approved amount is less than the<br>claimed amount. For the remaining amount that has been requested, it<br>will go through the different levels of processing. |
|---|---|
| How to raise | They need to initiate task request with workflow ID for arbitration<br>request and the following details:<br>● Claim number<br>● Difference amount for which it is being raised |


**Table 37.2**

| Description | This is a use case for if the claim is rejected and then has to be<br>resubmitted. |
|---|---|
| How to raise | Once a pre-auth has been approved, a claim has been raised and gets<br>rejected, the claim has to be resubmitted. The same bundle structure<br>but with workflow ID used for reprocess. |
| Sample request<br>and response | https://www.nrces.in/ndhm/fhir/r4/StructureDefinition-Task.html |


**Table 37.3**

| Description | Once a claim has been approved by the payer and the payment has<br>been made, a payment notice is sent to the provider system.<br>Payment notice will give overall consolidated status:<br>● Cleared - amount has been initiated<br>● Paid - amount has been received<br>● Rejected - amount has been initiated but failed due to any<br>server issues<br>● Adjusted - any balance being adjusted<br>Payment reconciliation will give a breakup of payment for that case. |
|---|---|
| How to raise | The provider system should have the capability to accept and<br>acknowledge the same. |


---

## Page 38

Term Meaning
Ayushman Bharat Digital
ABDM
Mission
National Health Claims
NHCX
Exchange
Pradhan Mantri Jan Arogya
PMJAY
Yojana
TPA Third Party Administrator
Fast Healthcare Interoperability
Resources
FHIR
Hospital Management
HMIS
Information System
TMS
Transaction Management
System

---

*7 embedded image(s) extracted to `NHCX-PMJAY-HMIS Integration Guide_images/`*