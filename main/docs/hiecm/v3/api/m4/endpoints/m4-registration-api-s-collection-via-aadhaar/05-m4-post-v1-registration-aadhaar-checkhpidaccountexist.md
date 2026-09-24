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

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

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

Example 200 response. The values are placeholders:

```json
{
  "token": "<JWT TOKEN>",
  "hprIdNumber": "<HPR_ID>",
  "categoryId": 100,
  "subCategoryId": 85,
  "txnId": "79dbf65d-affa-4249-8935-3d01676d8b82",
  "name": "Ayushman Bharat Mission",
  "gender": "M",
  "yearOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "firstName": "Ayushman",
  "middleName": "",
  "lastName": "Mission",
  "stateCode": "9",
  "districtCode": "145",
  "stateName": "Uttar Pradesh",
  "districtName": "<ADDRESS>",
  "address": "9th Floor, Tower-l, Jeevan Bharati Building, Connaught Place, New Delhi - 110001",
  "pincode": "<PINCODE>",
  "profilePhoto": "<BASE64 ENCODED STRING>",
  "mobile": null,
  "hprId": "<EMAIL>",
  "new": false
}
```
