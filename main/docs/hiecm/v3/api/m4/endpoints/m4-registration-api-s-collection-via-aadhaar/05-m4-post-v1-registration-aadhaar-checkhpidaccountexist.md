# Submit the account exist

`POST /v1/registration/aadhaar/checkHpIdAccountExist`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/registration/aadhaar/checkHpIdAccountExist \
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
- `preverifiedCheck` (boolean)

## Responses

- `200`: OK
  - `token` (string)
  - `hprIdNumber` (string)
  - `categoryId` (integer)
  - `categoryName` (string)
  - `subCategoryId` (integer)
  - `categorySubName` (string)
  - `txnId` (string)
  - `name` (string)
  - `gender` (string)
  - `yearOfBirth` (string)
  - `monthOfBirth` (string)
  - `dayOfBirth` (string)
  - `firstName` (string)
  - `middleName` (string)
  - `lastName` (string)
  - `stateCode` (string)
  - `districtCode` (string)
  - `stateName` (string)
  - `districtName` (string)
  - `address` (string)
  - `pincode` (string)
  - `profilePhoto` (string)
  - `mobile` (string)
  - `hprId` (string)
  - `new` (boolean)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "token": "<TOKEN>",
  "hprIdNumber": "<HPR_ID_NUMBER>",
  "categoryId": 0,
  "categoryName": "<CATEGORY_NAME>",
  "subCategoryId": 0,
  "categorySubName": "<CATEGORY_SUB_NAME>",
  "txnId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
  "name": "<NAME>",
  "gender": "<GENDER>",
  "yearOfBirth": "<YEAR_OF_BIRTH>",
  "monthOfBirth": "<MONTH_OF_BIRTH>",
  "dayOfBirth": "<DAY_OF_BIRTH>",
  "firstName": "<FIRST_NAME>",
  "middleName": "<MIDDLE_NAME>",
  "lastName": "<LAST_NAME>",
  "stateCode": "<STATE_CODE>",
  "districtCode": "<DISTRICT_CODE>",
  "stateName": "<STATE_NAME>",
  "districtName": "<DISTRICT_NAME>",
  "address": "<ADDRESS>",
  "pincode": "<PINCODE>",
  "profilePhoto": "<PROFILE_PHOTO>",
  "mobile": "<MOBILE>",
  "hprId": "<HPR_ID>",
  "new": false
}
```
