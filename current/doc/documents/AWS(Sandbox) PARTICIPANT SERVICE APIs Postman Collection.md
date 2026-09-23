# AWS(Sandbox) PARTICIPANT SERVICE APIs Postman Collection

*Source: `documents/AWS(Sandbox) PARTICIPANT SERVICE APIs Postman Collection.zip` — archive extracted to `AWS(Sandbox) PARTICIPANT SERVICE APIs Postman Collection_extracted/`*

**1 file(s) in archive:**

- `AWS(Sandbox)-PARTICIPANT SERVICE_APIs.postman_collection.json` (6,177 bytes)


---

## AWS(Sandbox)-PARTICIPANT SERVICE_APIs.postman_collection.json

**Collection:** SANDBOX-Participant_APIs

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies` — Get Policies
  - headers: `Accept`, `Content-Type`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "identifiertype": "MobileNo",//AbhaNumber|MemberId|MobileNo
    "identifiervalue": "1234567890"
}
  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy` — Delink Abha
  - headers: `Accept`, `Content-Type`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "requestid": "5f314cf3-b24f-4cde-98e3-585b5d7d0bc0",//UUID
    "payerid": "XXXXX@hcx",//Participant id of the insurance compsny for which ben has the policy
    "memberid": "CustXXXXX085", //Policy Holder Id 
    "processingid":"XXXXX@hcx", //Participant id of the TPA under which the IC is processing
    "policies": [
        {
            "productid": "Prod01",
            "productname": "Active Asure"
        }
    ]
}
  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs` — Fetch Certs
  - headers: `Accept`, `Content-Type`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "participantid": "1XXXXXXX2@hcx"
}
  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list` — Participant List
  - headers: `Accept`, `Content-Type`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "role": "PAYER",//PAYER|PROVIDER|TPA
    "fromdate": "10/05/2023", //dd/MM/yyyy format only
    "todate": "11/05/2024" //dd/MM/yyyy format only
}
  ```
  </details>

- **POST** `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy` — Link Abha
  - headers: `Accept`, `Content-Type`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "requestid": "e011c4a2-XXXX-XXXX-XXXX-50d06af51555",//UUID
    "abhanumber": "112233XXXXXX12",//Abha Number of Policy Holder
    "mobilenumber": "1234567890",//Mobile Number of Policy Holder
    "payerid": "XXXXX@hcx",//Participant id of the insurance compsny for which ben has the policy
    "memberid": "Cust0XXXXX085", //Policy Holder Id 
    "processingid":"XXXXX@hcx", //Participant id of the TPA under which the IC is processing
    "policies": [
        {
            "productid": "ProdXX01",
            "productname": "Active Asure"
        },{
            "productid": "ProdXX02",
            "productname": "Life Insurance Policy"
        }
    ]
}
  ```
  </details>
