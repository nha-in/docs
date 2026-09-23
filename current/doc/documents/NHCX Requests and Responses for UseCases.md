# NHCX Requests and Responses for UseCases

*Source: `documents/NHCX Requests and Responses for UseCases.xlsx` — all sheets*


## Sheet: Value sets

| Workflow IDs |  |
|---|---|
| Code | Value |
| 10 | Patient Registered |
| 11 | Patient Admitted |
| 12 | Preauth  Request Initiated |
| 121 | PreAuth Reprocess(Resubmission) Initimation |
| 13 | Enhancement Request Initiated |
| 131 | Enhancement Query Response Submitted |
| 19 | PreAuth Query Response Submitted |
| 14 | Discharge Submitted |
| 141 | Discharge Query Response Submitted |
| 15 | Claim Request Initiated |
| 16 | Preauth Request Resubmitted |
| 151 | Claim Query Response Submitted |
| 17 | Payment Received |
| 18 | PreAuth Query Ack Success/Failure |
| 20 | Preauth Request Received |
| 21 | Preauth Request Approved |
| 22 | Enhancement Request Approved |
| 241 | Enhancement Request Queried |
| 23 | Preauth Request Rejected |
| 24 | Preauth Request Queried |
| 25 | Claim Request Received |
| 26 | Claim Request Approved |
| 261 | Discharge Request Approved |
| 262 | Discharge Request Rejected |
| 263 | Discharge Request Queried |
| 27 | Claim Request Queried |
| 28 | Claim Request in process |
| 29 | Claim Forwarded |
| 251 | Preauth Reprocess Request Received |
| 252 | Reprocess Request Approved |
| 253 | Reprocess Request Rejected |
| 254 | Reprocess Request Queried |
| 30 | Payment Initiated |
| 31 | Payment Processed |
| 33 | Payment Settled |
| Use case |  |
| Code | Description |
| Preauthorization New | New Preauthorization request |
| Preauthorization Enhancement | Enhancement request for the Preapproved case |
| Preauthorization Resubmit | Resubmission of the preauthorization |
| Claim New | New Claim Request |
| Claim Resubmit | Resubmission of the claim request |
| Claim Reprocess | Request for processing the claim incase of partial or rejecttion of the claim |
| Task Codes |  |
| Code | Description |
| reprocess | Reprocess will be used when Providers request for readjudication of the claim incase of partial approval/rejecttions |
| nullify | nullify will be used to close the claim which is submitted by provider |
| cancel | cacel will be used to cancel the claim which is submitted by provider |
| approve | approve will be |
| search | used to search the resources (claim responses) for a given input types |
| poll | use to retrieve for any given input |
| suspend | suspend the preauthorization or claim that was submitted by provider. |
| Task Input Type Values |  |
| Code | Description |
| PayerId | An ID which is used to identify the payer |
| ProviderId | An ID which is used to identify the provider (Hospital) |
| PolicyNumber | Policy Number of the member which is used to identify the insurance details |
| ProductNumber | An ID/code which is used to identify the benefits of an insurance policy purchanged by member. |
| ClaimNumber | An ID or Number which is used to find the claim details from payer system. |
| InitimationNumber | An ID or Number which is used to find the Preauthorisation/claim details from payer system. |
| FromDate | From date of the search crieteria |
| ToDate | TO date of the search crieteria |
| FinanceYear | Policy year/Financial year |
| ServiceCode | Benefit codes which are typically services offered by the insurance |
| Payment Type Code |  |
| Code | Description |
| approvedamount | Amount approved for a given claim number |
| tds | Amount deducted as TDS for a given claim number |
| servicetax | Service Tax paid for a given claim |
| advance | Advance amount Paid for a given claim number |
| recovered | Amount recovered from the approved amount for a given claim |
| penality | Amount deducted as Penality from a given claim number |
| claimedamount | Amount claimed by the hospital for a given claim number |
| Task out put Values |  |
| Code | Description |
| paymentack | Payment is acknowledged |
| claimcancelled | Requested claim is cancelled |
| claimreinitiated | Requested claim is reinitiated |
| claimsuspended | Requested claim is suspended |
| taskak | Requested task is acknowleged |
| taskdelivered | Requested task is delivered |
| Task Reason Code |  |
| Code | Description |
| partialpayment | Reprocess request due to partial payment by payer |
| erroneousclaim | Reprocess request due to erroneous claim submission by provider |
| claimrejected | Reprocess request due to claim rejected by payer |
| referred | Referred to another hospital |
| erroneousregistration | Beneficiary registered by mistakenly for a given policy |
| wrongdiagnosis | Additional facts were diagnosed during treatment. |
| treatmentplanchanged | Treatment plan changed during hospitalization. |
| Adjudication Reason Code |  |
| Code | Description |
| Non-CoveredService | The claimed service is not covered under the policy, and therefore, the amount is deducted. |
| ExceededCoverageLimit | The claimed amount exceeds the maximum coverage limit, leading to a deduction. |
| DuplicateClaim | The same claim has been submitted more than once, resulting in a deduction. |
| Coordination-of-Benefits | The claim needs to be coordinated with another insurance policy, leading to a deduction. |
| IncompleteDocumentation | The claim lacks essential documentation, leading to a partial deduction until proper documents are provided. |
| PolicyDeductible | The claim amount is subject to the policy deductible, leading to a deduction. |
| Co-Payment | The claimant is responsible for a portion of the service cost due to co-payment or coinsurance. |
| ClaimError-1 | There is an error in the claim submission, leading to a deduction until the correct information is provided. |
| FraudulentClaim | The claim is determined to be fraudulent, leading to a complete/partial deduction of the amount. |
| MedicalNecessity | The claimed service is deemed medically unnecessary, leading to a deduction. |
| BenefitLimitReached | The claimant has reached the maximum benefit limit, resulting in a deduction. |
| MissedFilingDeadline | The claim was not submitted within the required time frame, leading to a deduction. |
| PaymentAlreadyMade | The claimed service has already been paid for, leading to a deduction. |
| ClaimError-2 | Claim has been rejected due to less than 24 hours of hospitalization |
| ClaimError-3 | Claim has been rejected as the Package is Reserved to Public Hospital |
| ClaimError-4 | Claim has been closed due to Incomplete submission of documents by hospital after multiple queries |
| ClaimError-5 | Claim has been rejected as there was misrepresentation of bed category booked |
| ClaimError-6 | Claim has been rejected due to Outside Scope of cover (Exclusions as per scheme) |
| ClaimError-7 | Claim has been rejected as the claim was found be False/Fraudulent |
| ClaimError-8 | Claim has been rejected due to Mismatch of package and disease/diagnosis/treatment |
| ClaimError-9 | Claim has been rejected due to Hospital not empanelled for this speciality |
| ClaimError-10 | Claim has been closed due to non submission of the documents |
| ClaimError-11 | Claim rejected as the treatment provided does not support the blocked package, request you to book a fresh relevant package |
| ClaimError-12 | Claim has been closed as the photo of the operative site is not available |
| ClaimError-13 | Claim has been rejected due to apparent manipulation in medical record |
| ClaimError-14 | Claim has been rejected as the hospital expenses have been paid by patient |
| ClaimError-15 | Claim has been closed due Missing Pre-Auth patient photo/post operative photo/After discharge photo |
| ClaimError-16 | Claim has been rejected due to less tha 24 hours of hospitalization |
| ClaimError-17 | Claim has been closed as Referral Letter Mandatory for Package Selected has not been provided |
| ClaimError-18 | Claim has been rejected as the need for hospitalization was not justified based on the availabe documents |
| ClaimError-19 | Claim has been rejected as the Package is  Reserved to Public Hospital |
| ClaimError-20 | Claim has been closed  due to Incomplete submission of documents by hospital after multiple queries |
| ClaimError-21 | Claim has been rejected as there was misrepresentation of bed category booked |
| ClaimError-22 | Claim has been rejected due to Outside Scope of cover (Exclusions as per scheme) |
| ClaimError-23 | Claim has been rejected as  the claim was found be False/Fraudulent |
| ClaimError-24 | Claim has been rejected due to Mismatch of package and disease/diagnosis/treatment |
| ClaimError-25 | Claim has been rejected due to Hospital not empanelled for this speciality |
| ClaimError-26 | Claim has been closed due to non submission of the documents |
| PreauthError-1 | Pre-Auth has been rejected as the diagnosis is outside Scope of cover (Exclusions as per scheme) |
| ClaimError-27 | Claim rejected as the treatment provided does not support the blocked package, request you to book a fresh relevant package |
| ClaimError-28 | Others |
| PreauthError-2 | Pre-auth has been rejected due to delay in raising enhancement requests |
| PreauthError-3 | Pre-Auth has been rejected as it was found to be False/Fraudulent |
| PreauthError-4 | Pre-Auth  has been closed due to delay in preauth Intimation (as per state guidelines) |
| PreauthError-5 | Pre-Auth has been rejected as the  Hospital is not empanelled for this speciality |
| PreauthError-6 | Pre- Auth has been rejected due to mismatch in dialysis records |
| PreauthError-7 | Enhancement request rejected as the medical necessity of enhancement request not met |
| PreauthError-8 | Pre-Auth rejected as the Medical necessity of ICU bed category not met |
| PreauthError-9 | Pre-Auth has been rejected as the package selected is  reserved  for public hospital |
| PreauthError-10 | Pre-Auth has been closed due to non submision of  mandatory document as per STG |
| PreauthError-11 | Pre-Auth has been rejected as the Surgery was  Done Before Pre auth Approval |
| PreauthError-12 | Pre-auth enhancement rejected due to missing patient photo to depict bed category |
| PreauthError-13 | Pre-Auth has been rejected as the diagnosis is outside Scope of cover (Exclusions as per scheme) |
| PreauthError-15 | Others |
| ClaimResponse - FormCode Valueset |  |
| Code | Description |
| preauthapproval | Approval letter for Preauthorisation |
| claimapproval | Approval letter for claim settlement |
| preauthdenial | Rejection letter for Preauthorisation |
| claimdenial | Rejection letter for claim |
| feedbackletter | Patient feedback form |
| policydocument | Policy Document with terms and conditions |
| dischargeapproval | Provisional approval of claim for the discharge |
| http://hl7.org/fhir/ValueSet/procedure-category |  |
| Procedure | Selected treatment or service or product is a type of procedure |
| Investigation | Selected treatment or service or product is a type of investigation |
| Implant | Selected treatment or service or product is a type of Implant |
| Drug | Selected treatment or service or product is a type of Drug |
| Package | Selected treatment or service or product is a type of package |
| Room | Selected treatment or service or product is a type of room |
| Stratifications | Selected treatment or service or proudct is a type of stratification |
| Consultation | Selected treatment or service or proudct is a type of consultation |
| Item category https://nrces.in/ndhm/fhir/r4/ValueSet/ndhm-benefitcategory |  |
| Code | Description |
| BM | Burns Management |
| ER | Emergency Room Packages |
| HD | High end Diagnostics |
| HM | High end Medicine |
| HP | High end procedures |
| ID | Infectious Diseases, General Medicine |
| IN | Interventional |
| MC | Cardiology |
| MG | General Medicine, Pediatric Medical Management |
| MM | Mental Disorders |
| MN | Neo - natal Care |
| MO | Medical Oncology |
| MP | Ophthalmology,Pediatric Medical Management, General Medicine |
| MR | Radiation Oncology |
| OT | Organ and Tissue Transplant |
| SB | Orthopedics |
| SC | Surgical Oncology |
| SE | Ophthalmology |
| SG | General Surgery, Pediatric Surgery |
| SL | ENT |
| SM | Oral & Maxillofacial Surgery |
| SN | Neurosurgery |
| SO | OBG & Gynec |
| SP | Plastic & Reconstructive Surgery |
| SS | Pediatric Surgery |
| ST | Polytrauma |
| SU | Urology |
| SV | CTVS |
| US | Unspecified Surgical Package |
| Procedure code  http://hl7.org/fhir/ValueSet/procedure-code |  |
| Code | Description |
| Attached the excel sheet where it has all the masters of different type of procedures/services |  |

## Sheet: CoverageEligibility

| /v1/coverageeligibility/check |  |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | CoverageEligibilityRequestBundle | FHIR Resource Bundle |  |  |
|  |  | CoverageEligibilityRequest | Resource as bundlecomponent |  |  |
|  |  |  | Prepare the request as per the usecase |  |  |
|  |  | identifier |  |  | Mandatory |
|  |  | status | active |  | Mandatory |
|  |  | priority | normal |  | Mandatory |
|  |  | purpose | validation |  | Mandatory |
|  |  | patient | reference of subscriber |  | Mandatory |
|  |  | created | dateandtime of enquiry |  | Mandatory |
|  |  | enterer | reference of operator |  | Mandatory |
|  |  | provider | reference of doctor |  | Mandatory |
|  |  | facility | reference of hospital |  | Mandatory |
| /v1/coverageeligibility/on_check |  |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.completed | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | CoverageEligibilityResponseBundle | FHIR Resource bundle |  |  |
|  |  |  | CoverageEligibilityResponse |  |  |
|  |  |  | And required reference resources |  |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.error | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: Preauth

| /v1/preauth/submit | This API is for providers to submit pre-authorization requests (and resubmit updated request) to HCX gateway and for HCX gateway to route the same request to payors. |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |
|  |  | x-hcx-workflow_id | String | 11 | Optional |
|  |  | x-hcx-use_case | String | New/Enhancement/Resubmit | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | ClaimBundle | FHIR Resource Bundle |  |  |
|  |  | Claim | Resource as bundlecomponent |  |  |
|  |  |  | Prepare the request as per the usecase |  |  |
|  |  | identifier |  |  | Mandatory |
|  |  | status | active |  | Mandatory |
|  |  | priority | normal |  | Mandatory |
|  |  | purpose | validation |  | Mandatory |
|  |  | use | preauthorization |  | Mandatory |
|  |  | patient | reference of subscriber |  | Mandatory |
|  |  | type | claimType |  | Mandatory |
|  |  | created | dateandtime of enquiry |  | Mandatory |
|  |  | enterer | reference of operator |  | Mandatory |
|  |  | provider | reference of doctor |  | Mandatory |
|  |  | facility | reference of hospital |  | Mandatory |
| /v1/preauth/on_submit | This is the callback API on HCX gateways and on Provider systems which will be called by Payor systems and HCX gateways to return the response for Pre-Authorization requests. |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.complete | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | ClaimResponseBundle | FHIR Resource bundle |  |  |
|  |  | ClaimResponse | ClaimResponse Resource |  |  |
|  |  |  | And required reference resources |  |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.error | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: Claim

| /v1/claim/submit | This API is for providers to submit claim requests (and resubmit updated request) to HCX gateway and for HCX gateway to route the same request to payors. |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |
|  |  | x-hcx-workflow_id | String | 11 | Optional |
|  |  | x-hcx-use_case | String | New/Resubmit | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | ClaimBundle | FHIR Resource Bundle |  |  |
|  |  | Claim | Resource as bundlecomponent |  |  |
|  |  |  | Prepare the request as per the usecase |  |  |
|  |  | identifier |  |  | Mandatory |
|  |  | status | active |  | Mandatory |
|  |  | priority | normal |  | Mandatory |
|  |  | purpose | validation |  | Mandatory |
|  |  | use | claim |  | Mandatory |
|  |  | patient | reference of subscriber |  | Mandatory |
|  |  | type | claimType |  | Mandatory |
|  |  | created | dateandtime of enquiry |  | Mandatory |
|  |  | enterer | reference of operator |  | Mandatory |
|  |  | provider | reference of doctor |  | Mandatory |
|  |  | facility | reference of hospital |  | Mandatory |
| /v1/claim/on_submit | This is the callback API on HCX gateways and on Provider systems which will be called by Payor systems and HCX gateways to return the response for Claim requests. |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.partial/response.complete | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | ClaimResponseBundle | FHIR Resource bundle |  |  |
|  |  | ClaimResponse | ClaimResponse Resource |  |  |
|  |  |  | And required reference resources |  |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.error | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: PaymentNotice

| /v1/paymentnotice/request | This API is for Payors to send Payment notification/reconciliation objects to Providers via the HCX gateway. This API is available on HCX gateways and Provider systems. |  |  |  |  |  |
|---|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | request.initiated | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |  |
|  |  | x-hcx-workflow_id | String | 11 | Optional |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | TaskBundle | FHIR Resource Bundle |  |  | PaymentReconciliation should be added as bundlecomponent and it should be created with following mandatory fields.<br>1. status as active/canceled<br>2. paymentDate - Payment processed date by the bank<br>3. paymentAmount - Amount paid to the hospital for given claim request<br>4. paymentIdentifier - UTR number of the payment<br>Note: There are other fileds covered in "detail" which can be used to send additional details for the payment but not mandatory. |
|  |  |  | Task (code=deliver, input=PaymentNotice) |  |  |  |
|  |  | PaymentNotice | Resource as bundlecomponent |  |  |  |
|  |  |  | Prepare the request as per the usecase |  |  |  |
|  |  | identifier |  |  | Mandatory |  |
|  |  | status | active |  | Mandatory |  |
|  |  | request | reference of claim |  | Mandatory |  |
|  |  | payment | PaymentReconsiliation reference |  | Mandatory |  |
|  |  | recipient | reference of hospital |  | Mandatory |  |
|  |  | amount | Money |  | Mandatory |  |
| /v1/paymentnotice/on_request | This is callback API for payment acknowledgement by the Providers. This API is available on HCX gateways and Payor systems. |  |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | response.complete | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |  |
|  |  | x-hcx-debug_flag | Enum | INFO |  |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | Task | FHIR Resource bundle |  |  |  |
|  |  |  | Task (output=ACKNOWLEDGED,RECEIVED) |  | ERROR CODES |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | response.error | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |  |
|  |  | x-hcx-debug_flag | Enum | INFO |  |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |

## Sheet: Communication (additional docs)

| /v1/communication/request | This API is for payors to raise a communication requests to HCX gateway and for HCX gateway to route the same request to providers during the claims cycle. |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |
|  |  | x-hcx-workflow_id | String | 11 | Optional |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | TaskBundle | FHIR Resource Bundle |  | Bundle of resources |
|  |  |  | Task (code=poll, input=CommunicationRequest) |  |  |
|  |  | CommunicationRequest | Resource as bundlecomponent |  |  |
|  |  |  | Prepare the request as per the usecase |  |  |
|  |  | identifier |  | ClaimNumber | Mandatory |
|  |  | status | active |  | Mandatory |
|  |  | priority | routine |  | Mandatory |
|  |  | reasonReference | Reference of DiagnosticReport/DocumentReference) |  | Mandatory |
|  |  | basedon | Reference of ClaimRequest/PreauthRequest |  | Mandatory |
| /v1/communication/on_request | This is the callback API on HCX gateways and on Payor systems which will be called by Provider systems and HCX gateways to return the response for Communication requests. |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.complete | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | TaskBundle | FHIR Resource bundle | Bundle of resources |  |
|  |  |  | Task (code=deliver, input=Communication) |  |  |
|  |  | Communication | Resource as bundle component |  |  |
|  |  | identifier |  | ClaimNumber | Mandatory |
|  |  | status | completed |  | Mandatory |
|  |  | priority | routine |  | Mandatory |
|  |  | statusReason | Reference of DiagnosticReport/DocumentReference) |  | Mandatory |
|  |  | about | Reference of ClaimRequest/PreauthRequest |  | Mandatory |
|  |  | payload | contentAttachment |  | Mandatory |
|  |  |  | contentReference |  | Optional |
|  |  |  | contentCodeableConcept | Type and Code | Mandatory |
|  |  | recipient | Reference of Orgnaisation |  | Optional |
|  |  | sender | Reference of Orgnaisation |  | Optional |
|  |  | note |  |  | Optional |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.error | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: Reprocess

| /v1/task/submit | This API is for providers to reporcess/cancel the claims or preauthorisations. For example, a provider can request for reprocessing of the claim incase of rejection or partial approval. |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |
|  |  | x-hcx-workflow_id | String | 11 | Optional |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | TaskBundle | FHIR Resource Bundle |  |  |
|  |  | Task | Task resource as Bundle component |  |  |
|  |  | code | reprocess/cancel/release/nullify |  | As per the usecase |
|  |  | input | type | codeableConcept | This will be type of element (This usecase should be as "ClaimNumber") |
|  |  |  | value | String | Claim Number |
|  |  | basedon |  | request reference number |  |
|  |  | status | requested | TaskStatus | Mandatory |
| /v1/task/on_submit | This is the callback API to return the response for task requests such as reprocess/cancel.<br><br>Domain Payload for this API has to an encrypted Task resource containing the Task.output.type as ClaimResponse resource reference to the entity sent by the sender in the original request. |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.complete | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | TaskBundle | FHIR Resource bundle |  |  |
|  |  |  | Task as bundlecomponent |  |  |
|  |  |  | ClaimResponse as bundlecomponent |  |  |
|  |  |  | Task (output=ClaimResponse) |  |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | response.error | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: Search

| /v1/search/submit | This API is for any authorised entity to search the claim related information. For example, NHA/IRDAI can search for the claim information for a given case number by sending Task resource and payers will provide the claim documents as requested. |  |  |  |  |  |
|---|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | request.initiated | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |  |
|  |  | x-hcx-workflow_id | String | 11 | Optional |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | TaskBundle | FHIR Resource Bundle |  |  |  |
|  |  | Task | Task Resource as bundle component |  |  |  |
|  |  | code | status |  |  |  |
|  |  | input | type | codeableConcept | This will be type of element (This usecase will have one or more input values based on the search requirements) | Ex. <br>ClaimNumner<br>FromDate<br>ToDate<br>PolicyNumber<br>ProductNumber |
|  |  |  | value | String | Claim Number |  |
|  |  | basedon |  | request reference number |  |  |
|  |  | status | requested | TaskStatus | Mandatory |  |
| /v1/search/on_submit | This is the callback API to return the response for search requests based on the task type (code=poll). |  |  |  |  |  |
|  | Response | "type": "JWEPayload" | Type as "ProtocolResponse" incase of error |  |  |  |
|  |  | "payload":"encrypted payload" |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | response.partial/response.complete | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |  |
|  |  | x-hcx-debug_flag | Enum | INFO |  |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | TaskBundle | FHIR Resource bundle |  |  |  |
|  |  |  | Task as bundle component |  |  |  |
|  |  |  | ClaimResponse as bundle component |  |  |  |
|  |  |  | Task (output=ClaimResponse) |  |  |  |
|  |  | Incase of error while processing the payload , please follow below response |  |  |  |  |
|  |  | type | String | ProtocolResponse | Mandatory |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | response.error | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Mandatory |  |
|  |  | x-hcx-debug_flag | Enum | INFO |  |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |

## Sheet: Status

| /v1/status | This API is for senders to query the status of a request made by them. For example, a provider can query the status of a pre-auth request using the status API. |  |  |  |  |
|---|---|---|---|---|---|
|  | Request | "payload":"encripted payload" |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | UUID | request.initiated | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID of the request that requires a status check. | Mandatory |
|  |  | x-hcx-workflow_id | String | 11 | Optional |
|  |  | x-hcx-use_case | String | New/Enhancement/Resubmit | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |
|  |  | Payload |  |  |  |
|  |  | Payload should be empty string |  |  |  |
| /v1/on_status | This is the callback API on which the status of the request is reported |  |  |  |  |
|  |  | Protected Header |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |
|  |  | enc |  | A256GCM | Mandatory |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |
|  |  | x-hcx-status | String | request.dispatched | Mandatory |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |
|  |  | x-hcx-workflow_id | String |  | Optional |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |
|  |  | x-hcx-debug_flag | Enum | INFO |  |
|  |  | x-hcx-use_case | String |  | Optional |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |

## Sheet: Insurance Plan

| /v1/insuranceplan/request |  |  |  |  |  |  |
|---|---|---|---|---|---|---|
|  | Request |  |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | request.initiated | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as API caller ID | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | Task | FHIR Resource |  |  |  |
|  |  | code | poll |  |  |  |
|  |  | input[] | type | codeableConcept | Mandatory | PolicyNumber |
|  |  |  | value | String |  |  |
|  |  |  | type | codeableConcept | Optional | ProductNumber |
|  |  |  | value | String |  |  |
|  |  |  |  |  |  | ProviderId |
|  |  |  | type | codeableConcept | Optional |  |
|  |  |  | value | String |  |  |
| /v1/insuranceplan/on_request |  |  |  |  |  |  |
|  | Response |  |  |  |  |  |
|  |  | Protected Header |  |  |  |  |
|  |  | alg |  | RSA-OAEP-256 | Mandatory |  |
|  |  | enc |  | A256GCM | Mandatory |  |
|  |  | x-hcx-api_call_id | UUID |  | Mandatory |  |
|  |  | x-hcx-status | String | response.complete | Mandatory |  |
|  |  | x-hcx-timestamp | Unix Timestamp | 1706308383 | Mandatory |  |
|  |  | x--hcx-sender_code | String | 1000002@sbx | Mandatory |  |
|  |  | x-hcx-recipient_code | String | 1000001@sbx | Mandatory |  |
|  |  | x-hcx-correlation_id | UUID | Correllation ID should be same as correlation of the request | Mandatory |  |
|  |  | x-hcx-workflow_id | String |  | Optional |  |
|  |  | x-hcx-error_details | ProtocolError | code,message,trace | Optional |  |
|  |  | x-hcx-debug_flag | Enum | INFO |  |  |
|  |  | x-hcx-use_case | String |  | Optional |  |
|  |  | x-hcx-ben-abha-id | String |  | Mandatory |  |
|  |  | Payload |  |  |  |  |
|  |  | TaskBundle | FHIR Resource |  |  |  |
|  |  |  | InsurancePlan | output = InsurancePlanBundle |  |  |
|  |  |  |  | Bundle should contain InsurancePlan as resource |  |  |