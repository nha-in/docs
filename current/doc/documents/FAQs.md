# FAQs

*Source: `documents/FAQs.pdf` — extracted full text*

**Pages: 19**


---

## Page 1

Commonly Asked Questions
(Frequently asked technical queries)
Integrator Guide
NHCX FAQ
Version 1.2
Version history:
Version Release Date Nature of Changes
1.2 21 Aug 2026 Approval Pending

**Table 1.1**

|  | Version |  |  | Release Date |  |  | Nature of Changes |  |
|---|---|---|---|---|---|---|---|---|
| 1.2 |  |  | 21 Aug 2026 |  |  | Approval Pending |  |  |


---

## Page 2

1. What is a Registry ID in the NHCX Participant API?
Solution:
Registry ID is the unique identifier of an entity issued by an external authorized registry. It is
used to uniquely identify participants (Provider/Payer/TPA/EUA) across the NHCX ecosystem
and is mandatory during onboarding and transactions.
2. Base URLs for the sandbox instances(Provider End).
Solution:
Milestone API Type Base URL
Session API Session Token https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions
Create
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create
Onboarding Participant
API Update
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/update
Participant
Get Policy https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies
De-Link Policy https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy
Participant
Fetch Certs https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs
API
Fetch
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list
Participant List
Link Policy https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy
Insurance Plan https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request
Coverage
https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check
Eligibility
Pre Auth https://apisbx.abdm.gov.in/hcx/v1/preauth/submit
Use-Cases Enhancement https://apisbx.abdm.gov.in/hcx/v1/preauth/submit
Communication https://apisbx.abdm.gov.in/hcx/v1/communication/request
Claim https://apisbx.abdm.gov.in/hcx/v1/claim/submit
Payment Notice https://apisbx.abdm.gov.inhcx/v1/paymentnotice/on_request
3. Why does an "401-Unauthorized" error appear when calling an API?
Solution: Whenever you encounter this error, kindly check your access token.
While passing it in bearer_auth, you have to pass it with Bearer as prefix, even if the token
expires this unauthorized error occurs. It Should look like example, Authorization: Bearer
eyJhbGciOiJSUzI1NiIs…….

**Table 2.1**

| Milestone | API Type |  |  | Base URL |
|---|---|---|---|---|
| Session API | Session Token |  |  | https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions |
| Onboarding<br>API |  | Create |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create |
|  |  | Participant |  |  |
|  |  | Update |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/update |
|  |  | Participant |  |  |
| Participant<br>API | Get Policy |  |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies |
|  | De-Link Policy |  |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy |
|  | Fetch Certs |  |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs |
|  |  | Fetch |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list |
|  |  | Participant List |  |  |
|  | Link Policy |  |  | https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy |
| Use-Cases | Insurance Plan |  |  | https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request |
|  |  | Coverage |  | https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check |
|  |  | Eligibility |  |  |
|  | Pre Auth |  |  | https://apisbx.abdm.gov.in/hcx/v1/preauth/submit |
|  | Enhancement |  |  | https://apisbx.abdm.gov.in/hcx/v1/preauth/submit |
|  | Communication |  |  | https://apisbx.abdm.gov.in/hcx/v1/communication/request |
|  | Claim |  |  | https://apisbx.abdm.gov.in/hcx/v1/claim/submit |
|  | Payment Notice |  |  | https://apisbx.abdm.gov.inhcx/v1/paymentnotice/on_request |


**Table 2.2**

| Onboarding |
|---|
| API |


**Table 2.3**

| Participant |
|---|
| API |


---

## Page 3

4. What value should be passed in the ‘x-hcx-api_call_id, x-hcx-request_id
, x-hcx-correlation_id’ attribute in the JWE Protected headers?
Solution:
The x-hcx-api_call_id, x-hcx-request_id,x-hcx-correlation_id should be a random 36-character
UUID, such as 'd9f1-a2c2e3b-6499f8c2d-071b13ba85ab'
5. Is there a specific format for the timestamp mentioned in the x-hcx-timestamp
of the APIs where Key is “timestamp”?
Solution:
APIs that require a timestamp, use the current ISO timestamp at zero UTC in the format:
YYYY-MM-DD’T’HH:MM.SS.SSS’Z’. For example, 2024-05-20T11:29:27.358Z.
6. Which Registry ID should be used for different participant types?
Solution:
Provider: Use HFR ID (generated during ABDM integration)
Payer/TPA: Use IRDAI/respective authority-issued ID
EUA: Can use their Client ID
7. What are the valid Role codes in the NHCX Participant API for the Sandbox and Production
environments?
Solution:
The system uses enum-based role codes:
• PROVIDER → 10001
• PAYER → 10002
• AGENCY_TPA (Third Party Administrator) → 10003
• EUA (End User Application or PHR Application) → 10009
8. What are the valid Registry codes in NHCX?
Solution:
Registry codes define the source registry of the participant:
• HFR/EUA → 10001
• PAYER/TPA → 10004
9. Why is correct Role and Registry mapping important?
Solution:
Incorrect mapping can lead to API access issues, request rejection, or improper routing of
transactions between provider and payer systems.
10. When using bio auth APIs, we are getting error K-547.?
Solution:
To resolve this issue, use the following attribute values as specified:
• lr = 'Y' (The attribute was previously passed as 'N')
The rest of the parameters should remain as is:
• ra = deviceType; //'F' for fingerprint
• rc = 'Y'
• de = 'N'
• pfr = 'N'
To generate the text parameter, use the formula:
text = '2.5' + ra + rc + lr + de + pfr;
Then, perform the following operations:

---

## Page 4

1. Convert the text to SHA-256.
2. Encode the SHA-256 hash to Base64:
wadh = Base64.stringify(sha256(text));
11. Can an Entity have multiple Participant IDs?
Solution:
Yes, an Entity can have multiple Participant IDs, one for each linked with separate HFR ID.
12. Does NHCX support synchronous responses for use case requests?
Solution:
No for Use Cases. All communication with NHCX is fully asynchronous.
Providers must implement callback endpoints to receive responses from payers. The NHCX
gateway never returns a synchronous FHIR decision for any request. All decisions,
acknowledgements, or errors are delivered via provider callback APIs.
13. How is data secured when sending requests to NHCX?
Solution:
Every outgoing request to NHCX must use JWE Compact Serialization.
The JWE protected header includes:
• Standard JWE fields (such as alg, enc)
• NHCX-specific metadata fields prefixed with x-hcx-*
This ensures confidentiality, integrity, and traceability of all exchanged messages.
14. What are the requirements for provider callback endpoints?
Solution:
The provider’s callback endpoint must acknowledge receipt with HTTP 202 within 30 seconds.
If an HTTP 202 response is not received within this time window, the NHCX gateway will treat
the delivery as failed and automatically retry sending the callback.
15. Why should providers integrate the InsurancePlan API?
Solution:
Providers are strongly encouraged to deeply integrate the InsurancePlan API into their
workflows.
This integration:
• Surfaces benefit rules upfront
• Identifies required documents before pre-authorization submission
• Reduces rework and rejection rates
• Enables faster approvals and a smoother payer-provider interaction
16. What is dummy payer(1000003538@hcx)?
Solution:
In the NHCX / ABDM context, a Dummy Payer(1000003538@hcx) is basically a test insurance
payer system used in the Sandbox environment.

---

## Page 5

17. Could you please provide the document link for NHCX integration?
Solution:
Please find the document link for NHCX integration here
https://hcxsbx.abdm.gov.in/#/documents
18. What is the difference between regular NHCX integration and PMJAY–NHCX integration?
Solution:
Regular NHCX integration enables an integrator (such as a hospital, insurer, or TPA) to connect
with NHCX and test or process claims, primarily for private insurance use cases.
PMJAY–NHCX integration, on the other hand, extends this capability to government health
schemes, including Pradhan Mantri Jan Arogya Yojana. While it is built on the same NHCX
framework, it involves additional onboarding and configuration steps specific to scheme
requirements, such as alignment with PMJAY workflows, package definitions, and state health
agency processes.
19. Could you please provide the document link for NHCX–PMJAY integration?
Solution:
Please find the document link for NHCX-PMJAY integration here
https://hcxsbx.abdm.gov.in/#/hmisdocuments
20. When does the error 401 Unauthorized - ‘Sender is not authorized to execute the
operation’ occur?
Solution:
• This error occurs when the session token has expired.
21. Not getting call back on my server?
Solution:
Please ensure the following:
1. Callback URL: The callback URL should use a domain name, not an IP address or port
number.
2. Server Location: Verify that your server is India-based, as required.
3. IP Whitelisting: Ensure the IP address NAT IPs: 3.109.99.210, 13.126.152.0,
13.200.129.223 is whitelisted in your server configuration or firewall settings.
4. Firewall Rules: Check your firewall rules to confirm they are not blocking incoming
requests from the mentioned IP address.
5. Application Routing: Situation where requests or data are not directed to the intended
destination within the application. Please ensure that
• URL paths or endpoints are properly and correctly configured
• Mismatch Between Frontend and Backend Routes
• Microservices Misrouting
• Load balancers or API gateways may misroute due to incorrect rules or policies
(port number configuration, services enable/disable)
• incorrect version of an endpoint due to mismatched routing configurations
Example scenarios:
• A user tries to access `/user/profile`, but due to misrouting, it ends up hitting

---

## Page 6

`/admin/dashboard`.
• An API call to fetch patient data is routed to a billing service instead of the
health record service.
21. How to follow the Best Practices for development/sending data in APIs?
Solution:
Always ensure that the data sent through APIs is accurate and follows the expected format.
Remove unnecessary white spaces by using trim(), and ensure that all values are case-sensitive
and exactly match the expected values. Also, validate the data before sending the API request
to avoid errors.
PMJAY Specific Question/Answer
22. Erroneous Claim
1. What is an Erroneous Claim?
Solution:
An Erroneous Claim is a claim that has already been settled or paid, but the adjudication was
different. For example, the amount paid was less than the actual payable amount, or the
claim amount was not payable as per the scheme's terms and conditions.
2. What is an Erroneous claim used for?
Solution:
For a partial-payment scenario only — e.g. a claim raised for ₹10,000 is approved/paid at
₹6,000–7,000, and the remaining balance is claimed via Erroneous.
3. Is the Erroneous amount capped?
Solution:
Yes. It cannot exceed the actual shortfall between the claimed and approved amounts (e.g.
up to ₹4,000 in a ₹10,000-claimed/₹6,000-approved example) — it can be any lesser figure
with justification, but never more than that difference.
4. When can an Erroneous request be raised?
Solution:
Only after the payment cycle is complete, i.e. after workflow code 33 (payment cleared) is
received.
5. Which Workflow ID is used to raise an Erroneous Claim?
Solution:
Workflow ID 36 is used to raise an Erroneous Claim. For the updated workflow ID, please refer
to the relevant workflow ID - https://hcxsbx.abdm.gov.in/#/documents.

---

## Page 7

6. Which payment-notice workflow codes are relevant to Erroneous, and how do they
interact?
Solution:
Workflow 30 = Payment Initiated (sent when the payer initiates payment to the bank, right
after adjudication/approval);
Workflow 33 = Payment Completed/Cleared (sent once the bank confirms clearance — this is
the trigger point after which Erroneous can be raised);
Workflow 17 = Acknowledgement, sent by the provider/HMIS in response to either the 30 or 33
notice.
7. Which API endpoint is used to raise an Erroneous Claim?
Solution:
The API endpoint /v1/task/submit is used, which is the same endpoint used for Reprocess
requests.
8. What FHIR Bundle is created for an Erroneous Claim?
Solution:
A Task Bundle is created using the Task resource, similar to the Reprocess flow. A separate
Claim or ClaimResponse Bundle is not required. Also, Mandatory to send an document as
valueAttachment.
9. What values should be passed in Task.code and reasonCode?
Solution:
The following values should be passed:
• Task.code: reprocess
• reasonCode: partialpayment
Additionally, the amount sent should not exceed the incorrect settlement amount
10. Which Claim Number should be sent in a Erroneous Claim request Bundle?
Solution:
The Claim Number should be sent in the FHIR Bundle. The value of the Claim Number should
be the Pre-Authorization Number generated at the provider’s end.
11. How many times can Erroneous be raised for the same claim?
Solution:
Currently a single time under PMJAY, same governing principle as Reprocess.
12. Once workflow 33 (payment cleared) arrives, what should the provider do before
proceeding to Erroneous?
Solution:
Verify the cleared payment first, then send the acknowledgement (17) — this verification can
be done immediately/promptly. Only after acknowle verify-and-acknowledge step should the
provider proceed with the Erroneous flow.

---

## Page 8

23. Claim Reprocess / Claim Appeals
1. What is Claim Reprocess?
Solution:
Claim Reprocess is the process where a claim has been fully rejected after adjudication, and
the provider disputes or appeals the decision and requests a re-evaluation of the claim.
2. What is a Reprocess claim used for?
Solution:
For a claim that has been rejected. The provider disputes the rejection and requests re-
evaluation.
3. Does Reprocess need to wait for a payment notice?
Solution:
No — since Reprocess relates to claim rejection (not payment), there is no payment-notice
dependency. It can be raised as soon as the rejection is received.
4. How many times can Reprocess be raised for the same claim?
Solution:
Currently a single time under PMJAY. The exact cap is policy configurable.
5. Which Workflow ID is used for Claim Reprocess?
Solution:
Workflow ID 36 is used for Claim Reprocess. For the updated workflow ID, please refer to the
relevant workflow ID - https://hcxsbx.abdm.gov.in/#/documents.
6. Which API endpoint is used for Claim Reprocess?
Solution:
The provider submits the request through /v1/task/submit. The payer's response is received
through the callback endpoint /v1/task/on_submit.
7. What FHIR Bundle is created for Claim Reprocess?
Solution:
A Task Bundle is created using the Task resource. It is similar to the Erroneous flow and is not
a standalone Claim or ClaimResponse Bundle. Also, Mandatory to send an document as
valueAttachment.
8. What values should be passed in Task.code and reasonCode?
Solution:
The following values should be passed:
• Task.code.coding.code: reprocess
• Task.reasonCode.coding.code: claimrejected
9. Which Claim Number should be sent in a Reprocess request?
Solution:
The Claim Number should be sent in the FHIR Bundle. The value of the Claim Number should
be the Pre-Authorization Number generated at the provider’s end.
10. Does raising Reprocess generate a new case/claim number, or does the original one carry
forward?
Solution:
The original claim number is carried forward — the Reprocess request references the existing
claim number rather than generating a new case number.

---

## Page 9

11. Is an amount field sent with a Reprocess request?
Solution:
No. Since the entire claim was rejected, the full claimed amount is implicit — no separate
amount field is sent (unlike Erroneous, which sends the balance amount).
12. Is a supporting/additional document mandatory for Reprocess?
Solution:
Yes, without a supporting document, there is no ground to justify the Reprocess request.
13. Is there a fixed TAT (turnaround time), e.g. 30 days, to raise Reprocess?
Solution:
No fixed TAT as of now.
14. Field Comparison
Field comparison — Erroneous vs Reprocess
Field Reprocess Erroneous
Claim Required Required
number
Amount Not sent — full Required —
claim amount balance/difference
implicit amount only
Supporting Mandatory Mandatory
attachment
Reason code “claimrejected” “partialpayment”
Payment- None — can Requires workflow
notice raise 33 (payment
dependency immediately on cleared) first
rejection
15. If a Reprocess results in only a partial approval, can Erroneous be raised afterward for the
remaining balance?
Solution:
No — Reprocess cases are routed to the Claim Review Committee (CRC), and the CRC's
decision is treated as final. No further Erroneous can be raised against a CRC decision.
24. Unspecified Procedure
1. What is an Unspecified Procedure?
Solution:
It is a procedure that is not defined/included in the beneficiary's package (HBP), but the
patient still needs it. Such cases fall under 'unspecified'. This is always planned — it cannot be
an emergency case.
Example: For an Unspecified Procedure, the unspecified package must be available under the
same specialty in which the patient is being treated.
For example, if the patient is being treated under General Surgery, the Unspecified Procedure
must be available under General Surgery.
If no unspecified procedure is available under that specialty, it cannot be selected from
another specialty.
The system should ensure that only the Unspecified Procedure available under the patient's
treating specialty can be used.

**Table 9.1**

| Field | Reprocess | Erroneous |
|---|---|---|
| Claim<br>number | Required | Required |
| Amount | Not sent — full<br>claim amount<br>implicit | Required —<br>balance/difference<br>amount only |
| Supporting<br>attachment | Mandatory | Mandatory |
| Reason code | “claimrejected” | “partialpayment” |
| Payment-<br>notice<br>dependency | None — can<br>raise<br>immediately on<br>rejection | Requires workflow<br>33 (payment<br>cleared) first |


---

## Page 10

2. How is an unspecified procedure different from a normal (package-based) procedure?
Solution:
For a normal procedure, the procedure name and cost come automatically from the insurance
plan (non-editable). For an unspecified procedure, both the procedure name and the amount
must be entered manually by the user — the rest of the flow stays the same.
3. Can an unspecified procedure be clubbed with any other procedure/package?
Solution:
No. An unspecified procedure always goes as a single, standalone line item — it cannot be
combined with any normal package, enhancement, or core-implant scenario.
4. How is an Unspecified Procedure identified in the system?
Solution:
Each benefit/package in the InsurancePlan has an Unspecified Claim Condition flag with a
value of Y/N.
• Y: The selected package is treated as an Unspecified Procedure.
• N: The package is a standard procedure/package.
When the flag is Y, the procedure name and cost can be entered manually instead of being
pre-populated from the package master.
5. Is Auth-Requirement required for an Unspecified Procedure?
Solution:
Yes. As of now, CoverageEligibility with Auth-Requirement needs to be called for an
Unspecified Procedure.
6. Which fields should remain free/editable for an Unspecified Procedure?
Solution:
The following fields should be free-entry:
• Procedure Name: Free text, entered by the provider.
• Procedure Amount/Cost: Free entry, entered by the provider.
Unlike standard packages, these values are not selected from a fixed master list.
7: How should the specialty be selected?
Solution:
Every specialty has a defined unspecified code (e.g. codes like SG215, SM215 — pattern:
specialty prefix + '215'). First search/select the specialty (typing 'unspecified' will surface it),
then manually enter the procedure name and amount.
8. What validation is required for the entered amount?
Solution:
The entered amount must not exceed the allowed amount/limit of the beneficiary. This
validation should be implemented at the server/system level, rather than relying only on UI
restrictions, since the amount is a free-entry field.
9. Is co-payment allowed for an Unspecified Procedure?
Solution:
No. PMJAY is a fully cashless scheme, and co-payment is not allowed for any package,
including Unspecified Procedures.

---

## Page 11

10: What is different in the FHIR bundle for an unspecified procedure?
Solution:
The standard Claim Bundle is used, similar to a regular claim.
The overall bundle structure remains the same as a normal procedure. Field-level mapping is
as follows:
• Category — pass the specialty (same as for a normal procedure)
• Product/Service — pass the unspecified code (e.g. 'U100')
• Display — pass the free-entry procedure name
• Amount/Unit price — pass the free-entry amount (in the net-balance field)
Note: Apart from this, there is no other change at the FHIR level — everything else remains
the same as a normal procedure.
11: How should room type be sent, since unspecified has no defined package?
Solution:
There is no separate field for room type — it can be mentioned as free text along with the
procedure name in the Display field (e.g. 'General Ward').
25. LM100 and Discharge Types
1. What is Item/Procedure Code LM100?
Solution:
LM100 is a special claim-only procedure code used when a PMJAY patient is discharged before
surgery or after surgery under LAMA/DAMA. It is not applicable at the pre-authorization stage
and is required only at the time of claim submission for these specific discharge scenarios.
2. How is the LM100 package identified?
Solution:
The LM100 package should be identified using the hardcoded package code LM100.
3. What are the different discharge type codes?
Solution:
The following discharge codes are used:
Code Display Meaning
Normal discharge/Live discharge
DTH DischargeToHome — patient goes home after
treatment/surgery.
DTM DischargeToMortuary Patient has Deceased/died.
Left Against Medical Advice —
LAMA Discharge with LAMA patient leaves despite the doctor's
advice to continue treatment.
Discharged Against Medical Advice
Discharge with
DAMA — hospital records the discharge
DAMA
as against medical advice.

---

## Page 12

3. How is the discharge information sent in the claim request?
Solution:
Discharge information is sent in the Claim resource's supportingInfo with the following details:
• Category: DIS (Discharge Summary)
• Code: One of DTH, LAMA, DAMA, or DTM
• Value: The discharge stage:
o Before Surgery
o After Surgery
4. What happens if the discharge information is missing/wrong?
Solution:
You will get the validation error.
5. What happens to previously approved pre-authorization items if LM100 applies?
Solution:
If the case qualifies as LAMA/DAMA before or after surgery, only LM100 is accepted for the
claim.
All other previously approved pre-authorization items are disqualified and cannot be used in
that claim submission.
If the LAMA Discharge is selected, then during the claim submission user need to send
stratification along with duration.
6. What happens in case of normal discharge or discharge due to death?
Solution:
• Normal discharge → DTH: Standard post-treatment discharge. LM100 is not required.
• Discharge to mortuary → DTM: Used when the patient has expired. LM100 is not required.
• LAMA/DAMA before or during surgery → LM100 is mandatory, and other pre-authorization
items are disqualified.
• LAMA/DAMA after surgery → The discharge stage is recorded as After Surgery. The LM100
rule does not override the surgery items in this case.
7. Where and how is discharge-stage information sent in the FHIR claim bundle?
Solution:
In the Claim resource's Supporting Information section: category = DIS (Discharge Stage),code=
one of DTH / DTM / LAMA / DAMA, and value = Before Surgery / After Surgery — sent
regardless of whether the case is surgical or purely medical/treatment-based.
8. What is the difference between LAMA and DAMA?
Solution:
LAMA (Leave Against Medical Advice): the patient leaves without informing the hospital. DAMA
(Discharge Against Medical Advice): the patient informs the hospital and signs a discharge
form/undertaking before leaving (e.g. declining a planned surgery).
9. What discharge types does PMJAY recognise?
Solution:
DTH (normal discharge to home), DTM (discharge to mortuary / death), LAMA, and DAMA.
10. Is “refer to another hospital” treated as a discharge type?
Solution:
No. PMJAY has no “refer” discharge type. The patient must be formally discharged (normal,
LAMA, DAMA, or death) before being registered/admitted at another hospital.

---

## Page 13

11. When is the LM-100 line item applicable in a LAMA/DAMA case?
Solution:
Only when the discharge stage is “before surgery.” It is not required when the discharge
happens “after” surgery.
12. What happens to an already-approved pre-auth if the case ends in a LAMA/DAMA discharge
before surgery?
Solution:
The original approved amount is nulled and voided. Only the amount corresponding to the
actual stay, via the LM-100 line item, is payable.
13. What are the discharge questionnaire forms, and how are they mapped?
Solution:
The insurance plan exposes discharge questionnaire types — Death, Life (normal), LAMA,
DAMA — each identified via a form ID and title. The HMIS selected discharge type
(DTH/DTM/LAMA/DAMA) must be internally mapped to the matching questionnaire by title.
14. How is eligibility for LM-100 (i.e. whether a procedure is a valid LAMA/DAMA case)
determined?
Solution:
From the insurance plan's claim conditions, which include a specific “LAMA-DAMA procedure”
property or claim-condition. If a procedure is marked valid for this, the LM-100 line item
becomes applicable for that case.
15. What value should be sent for quantity on the LM-100 line item?
Solution:
The number of days the patient was admitted/stayed.
16. Can “before/after surgery” terminology be relabelled to cover purely medical (non-
surgical) cases?
Solution:
This was raised as a valid concern. The value sent to the payer must still conform to the
standard NRCeS code set (before /after surgery) for now; UI-level labelling shown to hospital
staff can be adapted by the HMIS for clarity, but the underlying transmitted value must stay
within the standard code set. The terminology issue itself is to be discussed internally by the
NHA team, with an update to follow.
17. In the FHIR bundle, what exactly gets sent for a before-surgery LAMA/DAMA case?
Solution:
The LM-100 line item is added to the bundle with number of days admitted, alongside the DIS
supportingInfo entry (code = LAMA or DAMA, value = Before Surgery).
26.Cyclic Procedure
1. What is Cyclic Procedure?
Solution:
A cyclic case is a treatment scenario where the patient requires the same or related
healthcare service repeatedly over a defined period. For example, a dialysis patient may
require three dialysis sessions every week. Instead of treating the overall treatment
requirement as a single one-time service, the implementation must support repeated
utilization against the approved treatment cycle. Pre-authorization defines what is
approved—such as number of sessions and validity period—while claims represent the services
actually delivered during that cycle.

---

## Page 14

Below parameters need to be included in FHIR Bundle
Whether the benefit is a cyclic procedure or
not, i.e., it can be repeated multiple times
cyclic_proc_yn with one approval e.g., dialysis
Maximum number of cycles allowed for the
no_of_cycles cyclic benefit after one approval
2. For a cyclic procedure (e.g. chronic hemodialysis), when is bio-authentication mandatory?
Solution:
Bio-authentication is mandatory at three points for a cyclic procedure:
(1) at the time of pre-auth,
(2) at every entry-point/cycle when the beneficiary comes in for treatment, and
(3) at the time of discharge/claim submission.
No treatment cycle is considered valid without biometric authentication.
3. What happens if biometric authentication is not found against a particular cycle?
Solution:
During adjudication at the payer level, that particular claim/cycle can get rejected,
which leads to grievances from the hospital. This is why it's essential to build this
validation into your HMIS.
4. What is the maximum quantity (number of cycles) that can be entered in a single pre-
auth?
Solution:
The maximum quantity is state-specific — it is configured in the policy's 'claim condition'
in insurance-plan.
5. How soon can a patient take two cycles of the same procedure, one after another?
Solution:
Two cycles of the same procedure cannot be taken within 24 hours — this is a rolling 24-
hour window, not based on calendar date (for example, if a cycle is done on 20 August,
the next cycle is enabled only after a full 24 hours, regardless of whether that falls on the
morning or evening of 21 August). As soon as a fingerprint is captured, the biometric-
capture button is disabled and re-enables automatically after 24 hours.
6. If a pre-auth is approved for 4 cycles but the patient only takes 2, how is payment
calculated?
Solution:
Approval is always for the maximum number of cycles allowed, but payment is made only
for the cycles that were actually captured (bio-authenticated).
So even if 4 cycles are approved, if only 2 cycles have biometric capture, the claim will
settle for only those 2 cycles. Biometric capture is mandatory for every cycle.
7. Does a separate claim need to be submitted after every cycle?
Solution:
No. Biometric capture and an audit trail (start date, end date, biometric status) are
maintained in the hospital's system for every cycle, but the claim itself is submitted only
once — after the final cycle is completed.

**Table 14.1**

| cyclic_proc_yn | Whether the benefit is a cyclic procedure or<br>not, i.e., it can be repeated multiple times<br>with one approval e.g., dialysis |  |  |
|---|---|---|---|
| no_of_cycles |  | Maximum number of cycles allowed for the |  |
|  |  | cyclic benefit after one approval |  |


---

## Page 15

8. If a patient takes 2 cycles at Hospital A and then moves to Hospital B, what happens?
Solution:
Hospital A gets paid only for the 2 cycles that were captured. The patient then has to be
discharged from Hospital A. To continue treatment at Hospital B, a completely new pre-
auth must be raised — the earlier pre-auth does not carry over to another hospital; it gets
closed at Hospital A.
9. For a cyclic procedure (e.g. dialysis) involving pre-auth, multiple discharge cycles, and a
claim, how does the biometric authentication and process type flow work, for cycle
scenario?
Solution:
Pre-auth: Biometric authentication is taken, with process type set as "Preauth".
Each Cycle (Cycle 1, Cycle 2, and so on): Biometric authentication is taken again for every
individual cycle, with process type set as "Discharge". This is mandatory for each cycle,
and the same process repeats when the patient returns for the next cycle.
Claim: At the time of raising the claim, either a new biometric authentication can be
captured, or the refresh token from the last cycle's token (if still valid) can be used, with
process type set as "Discharge". We recommend for the new token.
10. How should the clinical information for each cycle be sent — as an attachment/PDF or as
structured data?
Solution:
Structured (FHIR) data is the approach and mandatory. A sequence number must be
maintained in supporting info for each cycle — the clinical document (e.g. dialysis report)
is linked to that sequence, and this reference goes into the 'information sequence' field
within the item.
For example :-
"item": [
{
"id": "item-1",
"sequence": 1,
"informationSequence": [
1
],
}]
supportingInfo": [
{
"sequence": 1,
"category": {
"coding": [
{
"system": "https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-supportinginfo-
code",

---

## Page 16

"code": "CD",
"display": "Clinical document"
}
]
},
"code": {
"coding": [
{
"system": "https://payer.pmjay.nha.gov.in",
"code": "TD",
"display": "Treatment detail"
}
]
},
"timingPeriod": {
"start": "2026-08-05T13:01:33+05:30", // check-in time of cyclic mandatory
"end": "2026-08-05T13:02:41+05:30"
},
"valueReference": {
"reference": "urn:uuid:3f40b4ef-5359-43d3-aa31-c1e54b2d813a" // Supporting
documentation ref
}
}
]
10. Why is the time period (start date/end date) field important?
Solution:
The payer validates this time period against the actual biometric-capture timestamp — if
it doesn't match, the cycle is not considered genuine. This field must be filled correctly in
the clinical document for every single cycle.
11. Can a refresh token be used for biometric authentication for cycles ?
Solution:
No. Biometric authentication must always be a real, live capture — not a refresh token.
The refresh token is only for Claim.
12. Can pre-auth and discharge for a cyclic procedure be done using a consent form (without
fingerprint/iris/face)?
Solution:
No, When a cyclic package is selected, bio-auth (fingerprint/iris/face is mandatory — any
one mode) is mandatory for pre-auth/claim-discharge.
13. At the time of cycles what is the process type should be send?
Solution:
Process-type should be Discharge.

---

## Page 17

27. Biometric Authentication
1. If I raise a pre-authorization using biometric authentication, does the claim also need to be
submitted using biometric authentication?
Solution:
No. The pre-authorization or claim can be raised using any available authentication method. For
example, if biometric authentication is not possible for the patient at that time raise that claim
using medical consent authentication form.
2. If the pre-authorization is raised using fingerprint authentication, can the claim be submitted
using another biometric option, such as face/iris auth?
Solution:
Yes. The claim can be submitted using another supported biometric authentication method,
such as face/iris/face authentication.
3. For cyclic procedures, does biometric authentication for each cycle need to be performed
specifically using only Fingerprint Authentication?
Solution:
No. For cyclic procedures under PMJAY, biometric authentication for each cycle using any Bio-
matric authentication (Fingerprint, IRIS or Face authentication).
4. For PMJAY–NHCX implementation, is it mandatory to implement all three biometric
authentication methods—Fingerprint, Iris, and Face Authentication?
Solution:
Yes. At the time of integration with PMJAY, all three biometric authentication methods—
Fingerprint, Iris, and Face Authentication—need to be implemented to support beneficiary
authentication.
28. Conservative (Medical) Procedure
1. What is a Conservative/Medical Procedure?
Solution:
Treatment given to a patient without surgery — through medicines, therapy, or monitoring —
like managing pneumonia, dengue, or non-surgical kidney/liver disease. PMJAY classifies this as
a "Medical Package" category (as opposed to Surgical).
2. Can two medical (conservative) packages be booked/claimed together?
Solution:
No — booking multiple medical packages together is not allowed under PMJAY. Only one medical
package can be claimed per episode.
3. Can a medical and a surgical package be booked together?
Solution:
No — if a patient is admitted for a medical case and later needs surgery too, medical and
surgical packages cannot be combined in the same booking. Surgical packages already include
the cost of pre- and post-operative care, so the system doesn't allow them to be clubbed with a
medical package.

---

## Page 18

29. New-Born Baby/Child (Or Less than 6 year)
1. How can I raise a claim for a newborn baby?
Solution:
A claim can be raised for a newborn baby when the Member ID has not yet been generated for
the baby and the baby's age is less than or equal to 6 years.
2. Whose PMJAY card is used for a newborn's treatment?
Solution:
The mother's or father's PMJAY card is used throughout the journey. Only the child's own
details (name, DOB, gender) are captured on the linked child Patient resource.
3. For twins, how can raise pre-authorisation requests?
Solution:
Two separate, independent pre-auth requests — one per child — since twins are two distinct
individuals with two distinct treatments. Both can be raised in parallel.
4. Whose wallet is consumed when a child (newborn or older, e.g. age 4–6) is treated?
Solution:
The parent's wallet is always consumed. There is no separate wallet for a child of any age —
PMJAY operates a single-family wallet with a combined annual cap (referenced as ₹5 lakh)
shared across the whole family.
5. Does a non-newborn child (e.g. 4–6 years old) get treated under the same “newborn”
construct?
Solution:
No. That is handled as a normal patient case drawing on the parent's wallet, without the
newborn-specific linked-child construct being mandatory in the same way.
6. What document is mandatory to prove a newborn's date of birth?
Solution:
A supporting document under category DOB (Proof of Date of Birth) is mandatory. The code
can be the Birth Certificate once available (BCF), or DCB (the government hospital's discharge
card/slip) if no birth certificate exists yet.
Category - https://nrces.in/ndhm/fhir/r4/CodeSystem-ndhm-supportinginfo-category.html
Code - https://nrces.in/ndhm/fhir/r4/CodeSystem-ndhm-supportinginfo-code.html
7. How should I send a Pre-Auth/Claim for a newborn baby in the FHIR Bundle?
Solution:
The parent (mother or father) is always the primary Patient resource, since a newborn has no
independent policy at birth. The child is represented as a separate, linked Patient resource.
Inside patient resource (mother or father)
"link": [
{
"other": {
"reference": "urn:uuid:cc81ceb5-2966-****-****",(this is referring to child patient resource)
"type": "Patient"
},
"type": "refer"
}
]

---

## Page 19

8. How is the child linked to the parent structurally in the FHIR bundle?
Solution:
Inside the parent's Patient resource, the “link” component is used with type = “refer”, and
the “other” reference points to a separate Patient resource representing the child. For twins,
two independent child Patient resources are created.
9. What fields are mandatory on the linked child Patient resource?
Solution:
Gender, date of birth, and name of the child. Name is not treated as strictly mandatory in the
way DOB and the proof-of-birth document are — those two are the essential fields.
10. How should the hospital bill be named for a newborn, and what happens if it isn't?
Solution:
Bill under the parent's name with a “Baby of <parent name>” designation, plus a supporting
attachment justifying this (important for distinguishing twins). A bill carrying only the baby's
name is likely to be rejected by the payer unless a supporting attachment is provided.
<End of Document>

---

*38 embedded image(s) extracted to `FAQs_images/`*