# https://hcxsbx.abdm.gov.in/#/introduction-NHCX/guidlines-for-participant-onboarding

Guidelines for Participant Onboarding
While the actual onboarding/deboarding process for an NHCX ecosystem would be drafted by its operator and agreed upon by its participants, this section outlines key design guidelines and an overall approach to arrive at such a policy.
A list of different kinds of participants who would need onboarding into an NHCX registry is provided in the
Access Control
section above. Onboarding onto the NHCX is envisioned as a two step process:
Sandbox - for compliance testing and certification
Go Live on live instances
Sections below provide high level guidelines for each of these steps.
Sandbox Process
The key goal of the sandbox is to help the ecosystem test its specific components against the communication standards, and get certified to become a part of the system. Once a participant successfully completes the sandbox process, they can use the certification to get onboarded to the NHCX production environment with the necessary access.
NHCX operator(s) may nominate or list Sandbox operator(s) whose certification will be considered valid for onboarding to their platforms.
The following are the steps to integrate, test and launch with the help of sandbox.
Step 1: Registration
The participants submit
an online application 
to express their interest to access the NHCX sandbox. The requests from different participants are verified to see if the participant is eligible to participate in the sandbox environment by doing basic checks against the details provided in the application form.
There may be requests that would not satisfy the conditions required for the sandbox access such as multiple requests from the same participant, participants not registered with any registry, TSPs without a valid website, spam applications, etc., which would prove to be redundant and may have to be filtered. This process would be semi-manual.
On successful verification, the approved participants are added to the NHCX sandbox and provisioned with the necessary credentials to access the sandbox environment.
Step 2: API integration and testing
In this step, the participants integrate their respective claim processing applications with the sandbox NHCX. This is to aid the developments as well as ensure that their applications are compliant with the NHCX standards and build all the missing pieces on their side to use the set of NHCX APIs necessary for their planned workflows.
Sandbox website would also include documentation and suggestions regarding the software libraries, tools and example implementations for encryption, FHIR resource generation, code generation and other new/complex parts of the NHCX protocol. The sandbox portal would ensure that the participants are provided with all the necessary help to get started and complete the API integration.
Step 3: Sandbox certification
All participants are expected to fulfil a set of functional and security tests/flows applicable to them.
Based on affiliate NHCX policies, the sandbox may necessitate additional security testing and reviews like STQC or CERT-IN. Suggestive pointers on infrastructural requirements for security testing clearance can be found in this
document.
Once the system is ready and tested against the applicable test cases, the participant will be required to submit their test results including the application's usage of and interaction with NHCX APIs to the Sandbox Operator for review and approval.
On successful review, the sandbox will issue a successful completion certificate valid for a configured period of time. This certificate can be used by the participant to get onboarded to the production environments of the NHCX operators.
Go Live process
After obtaining the affiliated sandbox certification, the participant would have to apply for onboarding into the NHCX production environment. This process will consist of the following key steps:
Step 1: Registration on NHCX
In this step, interested participants will be required to go through the onboarding process with the NHCX. NHCX operators are expected to provide a choice of registration flows with the following high level guidelines:
If the participants are registered in the NDHM Health Facility registry, then they should be allowed to use HFR authentication as a means to register in the NHCX registry, if they choose to do so.
If the participants are not registered in the ABDM Health facility registry then the participant should be allowed to use alternate means of verification like
Option to complete the ABDM HFR process and use the resultant credentials.
Authentication/Certificates/documents from IRDA or equivalent such agency identified and clearly stated in NHCX’s onboarding policy.
Summary details of the NHCX application duly filled. This application form will be more detailed, requiring more details of the participant including contact numbers, company registration details, and other details as needed in the NHCX registry.
Step 2: Review of Sandbox certification
A final round of approval for application go-live will be sought from the internal team at NHCX. Applicants will be required to share Functional and security testing certificates issued by the affiliate sandbox environment.
Step 3: Provisioning of production credentials
Once these requirements are met, the participant id along with the production access secret credentials will be provided. Participants are expected to keep the secret credentials safe and report any compromises at the earliest to the NHCX operators.
Step 4: Go-Live
The application is now expected to be prepared for go-live in respective participant ends. All the participants are advised to plan the change management at their end and conduct necessary training for their staff before going live in production NHCX, preferably after piloting with a small set of clients.
Deboarding scenarios
This section lists some of the deboarding scenarios that may be considered as part of the final deboarding policies by the NHCX operators:
Involuntary deboarding of a participant initiated by Regulator/Legal Authority. Few examples:
Suspension/Deactivation of a provider by a regulator for fraudulent activity.
Suspension/Deactivation of a TPA or a Payer by IRDA
Involuntary deboarding of a participant (mostly TSPs) initiated by NHCX. Few cases:
Serious violation of NHCX policies (e.g. grave SLA violation repeatedly)
Hacking attempts made by participants for unauthorized access, after an investigation by NHCX
Bad or irresponsible behaviour from participants if it significantly impacts the stability and performance of the NHCX (like frequent bursts of requests beyond authorised rate limits).
Voluntary deboarding of participants. Few examples:
A provider or payer shifting to another NHCX
A provider or payer shuts down their business
A provider or payer merges with another entity listed on the exchange
Please note that while the above list suggests a few of the scenarios for potential deboarding of a participant, this process should be treated with utmost care and an elaborate warning mechanism should be kept in place whenever the deboarding is not voluntary.
In addition, to provide a fair chance of appeal, the grievance redressal process on NHCX is expected to provide grievance mechanisms to handle appeal against deboarding of a participant


## Links on this page

- https://sandbox.abdm.gov.in/
- https://sandbox.abdm.gov.in/documents/NDHM_Secure_Application_Development-Reference_Document.pdf
