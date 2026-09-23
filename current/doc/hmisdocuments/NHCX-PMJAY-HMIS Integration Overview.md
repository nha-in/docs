# NHCX-PMJAY-HMIS Integration Overview

*Source: `hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf` — extracted full text*

**Pages: 9**


---

## Page 1

National Health Claims Exchange
NHCX-PMJAY-HMIS Integration
.

**Table 1.1**

| National Health Claims Exchange<br>NHCX-PMJAY-HMIS Integration<br>. |
|---|
|  |
|  |


**Table 1.2**

|  |
|---|
|  |


---

## Page 2

Context: Current Challenges with TMS-Based PMJAY Workflow
PMJAY claims processing is currently dependent on the TMS 2.0 Provider System, irrespective of hospitals having their own
Hospital Management Information Systems (HMIS).
Challenges
Lack of System Single-System Restricted Innovation
Duplication of data entry
Interoperability Dependency and Customisation
Parallel data entry in Poor interoperability
Exclusive reliance on a System constraints
hospital HMIS and TMS prevents seamless
single provider system restrict innovation and
increases administrative exchange of beneficiary,
impacts scalability and flexibility for hospitals
workload and the risk of clinical, and claims data
operational flexibility and technology partners
errors. across systems.

---

## Page 3

Solution: Transition to ABDM-Enabled HMIS Integrated with NHCX
Unlike the current model where PMJAY processing must be done on TMS 2.0,
Elimination of Mandatory TMS hospitals can operate PMJAY workflows entirely within their own HMIS without
Dependency mandatory portal usage. Claims move directly from hospital systems to payer
systems via NHCX.
PMJAY data is recorded once within the hospital HMIS and reused for claims
Single-Source PMJAY Data
processing, removing the need to re-enter or reconcile data across systems
Capture
(thereby reducing errors)
Greater Choice of Hospitals are no longer tied to a single PMJAY processing system and can choose
PMJAY-Compliant Systems any ABDM-enabled HMIS
Scalable PMJAY Operations for HMIS-based integrations support higher transaction volumes more reliably than
High-Volume Hospitals portal-based workflows.

---

## Page 4

Solution: Transition to ABDM-Enabled HMIS Integrated with NHCX
Current scenario:
Insurer
Hospital
TMS 2.0 Payer
TMS 2.0 Provider
HMIS
System
System
With NHCX Integration:
Hospital Insurer
TMS 2.0 Payer
NHCX-Integrated HMIS
System

---

## Page 5

Benefits: What this means for PMJAY-empanelled Hospitals
PMJAY cases can be handled as part of routine hospital workflows within HMIS,
PMJAY Workflow Embedded in rather than as a separate, portal-driven activity. Hospital PMJAY operations are no
Hospital Operations longer impacted by portal downtime, access constraints, or concurrent user
limitations.
Availability of structured data will enable to automation of Pre-Auth/Claim
resulting in low processing cost and time. This will reduce manual errors and
Availability of Structured Data
improve the data quality (enabling basic requirement for use of any AI model) as
well as aid in fraud control.
All PMJAY-related clinical and financial records reside within hospital systems,
Improved Internal Audit and simplifying audits, internal reviews, and compliance. PMJAY claims data flows
Financial Management natively into hospital billing and accounting systems, improving reconciliation and
financial reporting.
Simplified Training and User Staff require training on a single system instead of managing separate user roles
Management and workflows across HMIS and TMS.

---

## Page 6

NHCX-PMJAY-HMIS Integrator Journey (Sandbox)
3.
1. Get Compliant 2. NHCX Sandbox 3. Sandbox Exit
NHCX-PMJAY-HMIS
for ABDM M1 Registration Testing
integration
❏ Send Request to ❏ Register on NHCX ❏ Test API flows with
access Sandbox Sandbox using NHCX dummy payer ❏ Internal Demo: Test
APIs ABDM Client ID (recommended) and Showcase
❏ Integrate with ❏ Generate participant ❏ Implement all Interoperability, FHIR
Sandbox APIs for ID usecase APIs Bundle Validation
Milestone 1 ❏ Create public and including biometric ❏ PMJAY Team Demo
❏ Functional private key authentication and ❏ WASA (security
Testing/ WASA ❏ Review NHCX structured data audit)
(Security audit) Documentation exchange ❏ HTC Demo
❏ HTC Demo ❏ Comprehensively ❏ Ensure all cases, ❏ Fill NHCX Sandbox
❏ Go Live for understand the API including happy flow Exit Form
ABDM M1 flows are tested internally
DISCLAIMER: THIS JOURNEY IS TENTATIVE AND NOT FINAL.

---

## Page 7

Additional Requirements for NHCX-PMJAY-HMIS
Item Description
Utilising the Insurance Plan ● The PMJAY scheme extensively uses the InsurancePlan FHIR bundle, which is configured at the
Response hospital level and serves as a key reference for scheme operations. As this configuration drives
several downstream workflows, it is critical for enabling subsequent steps in the
pre-authorisation and claims lifecycle.
Biometric authentication ● The PMJAY scheme mandates biometric authentication of a beneficiary during registration,
of the Beneficiary treatment and discharge. This is an additional API that has to be implemented.
Structured data exchange ● For a HMIS to process PMJAY claims, it is mandatory to send supporting health information in
ABDM-defined structured Health Information Types.
Query flow ● The PMJAY payer does not use the Communication API for queries. Instead, a query is raised
by the payer with the relevant workflow ID for preauth/claim which has to be responded to by
the provider with the relevant workflow ID (preauth/claim bundle structure remains the
same).

**Table 7.1**

| Item | Description |
|---|---|
| Utilising the Insurance Plan<br>Response | ● The PMJAY scheme extensively uses the InsurancePlan FHIR bundle, which is configured at the<br>hospital level and serves as a key reference for scheme operations. As this configuration drives<br>several downstream workflows, it is critical for enabling subsequent steps in the<br>pre-authorisation and claims lifecycle. |
| Biometric authentication<br>of the Beneficiary | ● The PMJAY scheme mandates biometric authentication of a beneficiary during registration,<br>treatment and discharge. This is an additional API that has to be implemented. |
| Structured data exchange | ● For a HMIS to process PMJAY claims, it is mandatory to send supporting health information in<br>ABDM-defined structured Health Information Types. |
| Query flow | ● The PMJAY payer does not use the Communication API for queries. Instead, a query is raised<br>by the payer with the relevant workflow ID for preauth/claim which has to be responded to by<br>the provider with the relevant workflow ID (preauth/claim bundle structure remains the<br>same). |


---

## Page 8

Additional Requirements for NHCX-PMJAY-HMIS
NHCX normal flow NHCX-PMJAY-HMIS flow
Get Insurance Plan Same
Get Policy Same
Coverage eligibility check Same
Pre-Auth Same (but before pre-auth need to do mandatory biometric authentication of beneficiary)
Communication API is not used. Instead, a query is raised by the payer with the relevant
Communication Request workflow ID for preauth/claim which has to be responded to by the provider with the relevant
workflow ID.
Claim Submission Same
Payment Notice Same
Status Check Same

**Table 8.1**

| NHCX normal flow | NHCX-PMJAY-HMIS flow |
|---|---|
| Get Insurance Plan | Same |
| Get Policy | Same |
| Coverage eligibility check | Same |
| Pre-Auth | Same (but before pre-auth need to do mandatory biometric authentication of beneficiary) |
| Communication Request | Communication API is not used. Instead, a query is raised by the payer with the relevant<br>workflow ID for preauth/claim which has to be responded to by the provider with the relevant<br>workflow ID. |
| Claim Submission | Same |
| Payment Notice | Same |
| Status Check | Same |


---

## Page 9

Thank You
After the tech changes are made by TCS team, we will
kick of Pilot with 5 PHR players and 5 Insurance
Companies, to test this functionality in real world

---

*16 embedded image(s) extracted to `NHCX-PMJAY-HMIS Integration Overview_images/`*