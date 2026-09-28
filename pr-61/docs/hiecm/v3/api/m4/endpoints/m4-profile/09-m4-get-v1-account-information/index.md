# Get user profile by JWT

`GET /v1/account/information`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/account/information \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Query parameters

- `masked` (boolean)

## Responses

- `200`: OK
  - `hprIdNumber` (string)
  - `hprId` (string)
  - `mobile` (string)
  - `firstName` (string)
  - `middleName` (string)
  - `lastName` (string)
  - `name` (string)
  - `yearOfBirth` (string)
  - `dayOfBirth` (string)
  - `monthOfBirth` (string)
  - `gender` (string)
  - `email` (string)
  - `profilePhoto` (string)
  - `stateCode` (string)
  - `districtCode` (string)
  - `subDistrictCode` (string)
  - `villageCode` (string)
  - `townCode` (string)
  - `wardCode` (string)
  - `pincode` (string)
  - `address` (string)
  - `kycPhoto` (string)
  - `stateName` (string)
  - `districtName` (string)
  - `subdistrictName` (string)
  - `villageName` (string)
  - `townName` (string)
  - `wardName` (string)
  - `authMethods` (string[])
  - `kycVerified` (boolean)
  - `verificationStatus` (string)
  - `categoryId` (integer)
  - `categoryName` (string)
  - `categorySubId` (integer)
  - `categorySubName` (string)
  - `emailVerified` (boolean)
  - `role` (integer)
  - `new` (boolean)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "hprIdNumber": "<HPR_ID_NUMBER>",
  "hprId": "<HPR_ID>",
  "mobile": "<MOBILE>",
  "firstName": "<FIRST_NAME>",
  "middleName": "<MIDDLE_NAME>",
  "lastName": "<LAST_NAME>",
  "name": "<NAME>",
  "yearOfBirth": "<YEAR_OF_BIRTH>",
  "dayOfBirth": "<DAY_OF_BIRTH>",
  "monthOfBirth": "<MONTH_OF_BIRTH>",
  "gender": "<GENDER>",
  "email": "<EMAIL>",
  "profilePhoto": "<PROFILE_PHOTO>",
  "stateCode": "<STATE_CODE>",
  "districtCode": "<DISTRICT_CODE>",
  "subDistrictCode": "<SUB_DISTRICT_CODE>",
  "villageCode": "<VILLAGE_CODE>",
  "townCode": "<TOWN_CODE>",
  "wardCode": "<WARD_CODE>",
  "pincode": "<PINCODE>",
  "address": "<ADDRESS>",
  "kycPhoto": "<KYC_PHOTO>",
  "stateName": "<STATE_NAME>",
  "districtName": "<DISTRICT_NAME>",
  "subdistrictName": "<SUBDISTRICT_NAME>",
  "villageName": "<VILLAGE_NAME>",
  "townName": "<TOWN_NAME>",
  "wardName": "<WARD_NAME>",
  "authMethods": [
    "AADHAAR_OTP"
  ],
  "kycVerified": false,
  "verificationStatus": "<VERIFICATION_STATUS>",
  "categoryId": 0,
  "categoryName": "<CATEGORY_NAME>",
  "categorySubId": 0,
  "categorySubName": "<CATEGORY_SUB_NAME>",
  "emailVerified": false,
  "role": 0,
  "new": false
}
```
