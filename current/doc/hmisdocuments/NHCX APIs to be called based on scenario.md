# NHCX APIs to be called based on scenario

*Source: `hmisdocuments/NHCX APIs to be called based on scenario.xlsx` — all sheets*


## Sheet: Scenarios

| S No. | Usecase | API Used | Points to be noted | Place to call |
|---|---|---|---|---|
| 1 | To get the policies linked for the beneficiaries under the selected payer | /participant/get/policies | Need ABHA or mobile number of the beneficiary. | After Registration to get the beneficiary's policy details |
| 2 | To get the detailed info on all the products & service, rules and documents under the given policy mapped to the hospital. Can be retrieved once in 15 days or after policy update | /v1/insuranceplan/request<br> | Policy code & HFRID is required | Retrieving the insurance details. |
| 3 | Once the patient is registered, to check the wallet balance and the coverage | /v1/coverageeligibility/check | Purpose: Validation | After Registration to check the coverage details |
| 4 | During the preauth, to check the benefits that are covered under the policy | /v1/coverageeligibility/check | Purpose: Benefits | Before raising the preauth/enhancement |
| 5 | Once the products and services are selected, to check their eligibility & the required documents for those and at what stage are those documents needed to avoid rejection or query | /v1/coverageeligibility/check | Purpose: Auth-Requirements | Preauth/enhancement page before submission & doc upload |
| 6 | To raise a preauthorization, the products & service are selected, the preauth amount to the payer has to be less than or equal to the balance remaining from coverage | /v1/preauth/submit | Pratitioner Details: HPRID ; Claim Identifier ; Items : All billable items ; Diagnostic Report DIA, clinical docs CD ; | Preauth page |
| 7 | After preauth approval, if enhancement is required. Check the rules received in insurance plan and see the eligibility, this will be a new preauth request with the old reference but new correlation id | /v1/preauth/submit | claim resource purpose=preauthorisation, workflow should be as appropriate | Enhancement |
| 8 | If the preauth is sent back with query, check the query remarks & take the necessary action, and proceed with submitting the query update request, this will be a new preauth request with the old reference but new correlation id | /v1/preauth/submit | claim resource purpose=preathorisation, workflow should be as appropriate | Query Update |
| 9 | Until the claim is raised, the preauth can be cancelled. To cancel the preauth the provider must initiate the cancellation request. | /v1/task/submit | code: cancel ;     inputType: ClaimNumber ; value: claimNumber | Preauth cancel page |
| 10 | Once the treatment is done, after patient is discharged, the claim is initiated by the provider, submitting the required info, the claim amount to the payer has to be less than or equal to the preauth approvd amount | /v1/claim/submit | claim resource purpose=claim, workflow should be as appropriate | Claim Page |
| 11 | If the claim is sent back with query, check the query remarks & take the necessary action, and proceed with submitting the query update request, this will be a new claim request with the old reference but new correlation id | /v1/claim/submit | claim resource purpose=claim, workflow should be as appropriate | Claim Query Update |
| 12 | If the claim is rejected, then the provider can raise the reprocess request. | /v1/task/submit | code: reprocess;     inputType: ClaimNumber ; value: claimNumber; reasonCode: claimrejected | Reprocess Request Page |
| 13 | Once the claim is approved by the payer, the provider will receive a payment notice, this is not immediate unlike the claim approval. The provider can send an acknowlegement to the payment. | /v1/paymentnotice/on_request |  | Payment Acknowledgement page |
| 14 | In case of partial payment, the provider can raise a request for erroneous claim, where they can submit the required documents and submit a request for remaining amount | /v1/task/submit | code: reprocess;     inputType: ClaimNumber ; value: claimNumber; reasonCode: partialpayment | Erroneous claim |