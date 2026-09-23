# AWS(PROD) NHCX-OnBoarding APIs Postman Collection

*Source: `documents/AWS(PROD) NHCX-OnBoarding APIs Postman Collection.zip` — archive extracted to `AWS(PROD) NHCX-OnBoarding APIs Postman Collection_extracted/`*

**1 file(s) in archive:**

- `AWS(PROD)_NHCX-OnBoarding APIs.postman_collection.json` (4,274 bytes)


---

## AWS(PROD)_NHCX-OnBoarding APIs.postman_collection.json

**Collection:** PROD_NHCX-OnBoarding APIs

- **POST** `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update` — /v2/participant/update
  - headers: `Accept`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "participantcode": "12345678934@hcx",//participant code
    "encryptioncert": "Y3JlYXRlZCBzdWNjZXNzZnVsbHk=",//public key certificate in base64
    "endpointurl": "www.test.com" //endpoint or bridge url
}
  ```
  </details>

- **GET** `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/update/validate?transactionId=-zbjoennufojo-1twv2mbiqcsjo&passcode=123456` — /update/validate
  - headers: `Accept`
- **GET** `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/validate?transactionId=-xev3rbjw9to0-1dg7djp4j5s10&passcode=123456` — /validate
  - headers: `Accept`
- **POST** `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create` — /v2/participant/create
  - headers: `Accept`, `bearer_auth`

  <details><summary>request body</summary>

  ```json
{
    "registrytype":"1000X",
    "registryid":"12345678934",//Payer/TPA-IRDAI ID | Provider-HFR ID
    "role":["1000X"],
    "endpoint_url":"www.test.com",//bridge/endpoint url
    "mobilenumber":"1234567890",//registered mobile No 
    "email":"test01@gmail.com"//registered email 
}

//Valid Role Enums : PROVIDER("10001") PAYER("10002") AGENCY_TPA("10003") AGENCY_REGULATOR("10004") RESEARCH("10005") MEMBER_ISNP("10006") AGENCY_SPONSOR("10007") HIE_HIO_HCX("10008") 

//Valid Registry Enums: HFR ("10001") NIN ("10002") ROHINI(" 10003") PAYER ("10004")
  ```
  </details>
