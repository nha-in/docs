# Policy Linking and De-Linking Process

*Source: `documents/Policy Linking and De-Linking Process.pdf` — extracted full text*

**Pages: 2**


---

## Page 1

Policy Linking Process:
Each and every payer has to create their own participant, irrespective of if they are under any TPA or
not, every payer will have an individual Participant Code(payerid).
While linking the policies the below format should be followed.
For individual payers the payerid will be their participant code, whereas if any payer is under
any TPA in that scenario the payer id will be the individual insurance company’s participant
code and the processingid will be the TPA’s participant code.
Processing_ID is the TPA under which the insurance company is mapped.
In future if there is any change like the Insurance Company is moving from one TPA to
another, in that scenario the Participant has to delink the existing policies and link back again
passing the new TPA’s participant code as the processing ID.
For Sandbox:
ParticipantAPIs(envBaseUrl)-
https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice
For Production:
ParticipantAPIs(envBaseUrl)-
https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice
URL: {{envBaseUrl}}/participanthcxservice/participant/link/abha/policy
Request:
{
"requestid": "e011c4a2-xxxx-xxxx-xxxx-50d06af51555",
"abhanumber": "12345678910111",
"mobilenumber": "1234567890",
"memberid": "Cust00",
"payerid": "XXXXXX@sbx",
"processingid": "XXXXXX@sbx",

**Table 1.1**

| Policy Linking Process: |
|---|
|  |
| Each and every payer has to create their own participant, irrespective of if they are under any TPA or |
| not, every payer will have an individual Participant Code(payerid). |
|  |
| While linking the policies the below format should be followed. |
|  |
| For individual payers the payerid will be their participant code, whereas if any payer is under |
| any TPA in that scenario the payer id will be the individual insurance company’s participant |
| code and the processingid will be the TPA’s participant code. |
|  |
| Processing_ID is the TPA under which the insurance company is mapped. |
|  |
| In future if there is any change like the Insurance Company is moving from one TPA to |
| another, in that scenario the Participant has to delink the existing policies and link back again |
| passing the new TPA’s participant code as the processing ID. |
|  |
|  |
| For Sandbox: |
|  |
| ParticipantAPIs(envBaseUrl)- |
| https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice |
|  |
| For Production: |
|  |
| ParticipantAPIs(envBaseUrl)- |
| https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice |
|  |
| URL: {{envBaseUrl}}/participanthcxservice/participant/link/abha/policy |


**Table 1.2**

| Request: |
|---|
|  |
| { |
| "requestid": "e011c4a2-xxxx-xxxx-xxxx-50d06af51555", |
| "abhanumber": "12345678910111", |
| "mobilenumber": "1234567890", |
| "memberid": "Cust00", |
| "payerid": "XXXXXX@sbx", |
| "processingid": "XXXXXX@sbx", |


---

## Page 2

"policies": [
{
"productid": "Prod01",
"productname": "Active Asure"
},{
"productid": "Prod02",
"productname": "Life Insurance Policy"
}
]
}
Validation for De-Linking:
The delinking process can only be done by the participant either mentioned in the payerID or the
processingID during the Linking Process.
The check at NHCX end:
We will extract the client ID from the token during De-link and check if it matches with the one who
registered the IC (payerID) or the TPA (processingID), if it matches then only, we will allow
otherwise it will not allow to Delink with an error message.
When trying to delink a Policy that is not there in the “policies” list, an error will be encountered with
message “There is no policies with requested details”.
URL: {{envBaseUrl}}/participanthcxservice/participant/delink/abha/policy
Request:
{
"requestid": "5f314cf3-xxxx-xxxx-xxxx-585b5d7d0bc0",
"payerid": "XXXXXXXX@sbx",
"memberid": "Cust00",
"policies": [
{
"productid": "Prod01",
"productname": "Active Asure"
}
]
}

**Table 2.1**

| "policies": [ |
|---|
| { |
| "productid": "Prod01", |
| "productname": "Active Asure" |
| },{ |
| "productid": "Prod02", |
| "productname": "Life Insurance Policy" |
| } |
| ] |
| } |


**Table 2.2**

| URL: {{envBaseUrl}}/participanthcxservice/participant/delink/abha/policy |
|---|
|  |
| Request: |
|  |
| { |
