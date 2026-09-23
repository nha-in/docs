# NHCX-PMJAY-HMIS Test Cases

*Source: `hmisdocuments/NHCX-PMJAY-HMIS Test Cases.xlsx` — all sheets*


## Sheet: Sheet1

| Test Case ID | Scenario Description | Pre-Conditions | API / FHIR Resource | Input Parameters | Processing / Validation Rules | Expected Output | Remarks |
|---|---|---|---|---|---|---|---|
| TC-ABHA-01 | Validate PMJAY policy using ABHA | Valid ABHA, consent available | CoverageEligibilityRequest (validation) | ABHA: 91-XXXX-XXXX-XXXX, Purpose: validation | Check ABHA linkage and active policy | CoverageEligibilityResponse with active coverage | Happy path |
| TC-HBP-01 | Fetch admissible HBP package | Policy validated | InsurancePlan | PlanId: PMJAY-TS-001, Provider Id:HOSP123<br><br>PayerID- SHA-HARYANA | Validate provide against state network hospitals | InsurancePlan with all HBP packages along with inclusions and exclusions,claim conditions, document requirements | State-specific HBP applied |
| TC-CE-01 | Coverage eligibility for auth-requirements | Wallet available | CoverageEligibilityRequest (auth-requirements) | Amount: 25000, Package: HBP-123 | Check wallet balance and speciality rules | Eligible, balance sufficient | Preauth allowed |
| TC-PA-01 | Submit preauthorisation request | Eligibility successful | /preauth/submit (Claim) | Diagnosis: I10,<br><br>Treatment Plan, Support Documents. Doctor Details | Validate clinical & financial rules | Preauth ID generated, status=PENDING | Sent to workflow |
| TC-PA-02 | Submit Preauth Query Update | Preauth should be submitted | /preauth/submit (Claim) | Additional Documents | Match Preauth & treatment details | Preauth Query details accepted for adjudication | Sent to workflow |
| TC-CL-01 | Submit claim post discharge | Preauth approved | /claim/submit (Claim) | ApprovedAmount: 23000, Docs attached | Match preauth & treatment details | Claim accepted for adjudication | Sent to workflow |
| TC-CL-02 | Submit Claim Query Update | Claim should be submitted | /claim/submit (Claim) | Documents | Match claim & treatment details | Claim Query details accepted for adjudication | Sent to workflow |
| TC-CL-03 | Submit CRC claim | Claim should be rejected/Partially paid | /task/submit (Task) |  | Match claim and Treatment details |  |  |

## Sheet: Sheet2

| Registration |
|---|
| Wallet update |
| Registration Cancel |
| Preauth Submission: |
| Preauth Query |
| Preauth submit with Query response |
| Preauth Enhancement |
| Preauth with Implant |
| Preauth Resubmission |
| Preauth Rejection |
| Peauth Approval |
| Preauth Cancel/Delete |
| Discharge in multiple mode and respective amount calculation |
| Claim Submission |
| Claim Query |
| Claim Rejection |
| Claim Approval |
| Claim final paid and update at Payer bank transaction detail |
| CRC in case of Claim Rejection and Partial Payment |