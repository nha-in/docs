# Verify OTP

`POST /v2/registration/aadhaar/verifyOTP`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v2/registration/aadhaar/verifyOTP \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "de4ff682-fcc6-4bcf-a978-0dbb19a288b4"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `txnId` (string)

## Responses

- `200`: OK
  - `txnId` (string)
  - `mobileNumber` (string)
  - `photo` (string)
  - `gender` (string)
  - `name` (string)
  - `email` (string)
  - `pincode` (string)
  - `birthdate` (string)
  - `careOf` (string)
  - `house` (string)
  - `street` (string)
  - `landmark` (string)
  - `locality` (string)
  - `villageTownCity` (string)
  - `subDist` (string)
  - `district` (string)
  - `state` (string)
  - `postOffice` (string)
  - `address` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "<TXN_ID>",
  "mobileNumber": "<MOBILE_NUMBER>",
  "photo": "<PHOTO>",
  "gender": "<GENDER>",
  "name": "<NAME>",
  "email": "<EMAIL>",
  "pincode": "<PINCODE>",
  "birthdate": "<BIRTHDATE>",
  "careOf": "<CARE_OF>",
  "house": "<HOUSE>",
  "street": "<STREET>",
  "landmark": "<LANDMARK>",
  "locality": "<LOCALITY>",
  "villageTownCity": "<VILLAGE_TOWN_CITY>",
  "subDist": "<SUB_DIST>",
  "district": "<DISTRICT>",
  "state": "<STATE>",
  "postOffice": "<POST_OFFICE>",
  "address": "<ADDRESS>"
}
```
