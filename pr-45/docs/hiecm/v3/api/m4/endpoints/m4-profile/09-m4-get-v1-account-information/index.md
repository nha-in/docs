# Get user profile by JWT

`GET /v1/account/information`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/account/information \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

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

Example 200 response. The values are placeholders:

```json
{
  "hprIdNumber": "<HPR_ID>",
  "hprId": "<EMAIL>",
  "mobile": "******2125",
  "firstName": "Ayushman",
  "middleName": "Bharat",
  "lastName": "Mission",
  "name": "Ayushman Bharat Mission",
  "yearOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "gender": "M",
  "email": "<ABHA_ADDRESS>.com",
  "profilePhoto": "<BASE64 ENCODED STRING>",
  "stateCode": "27",
  "districtCode": "490",
  "subDistrictCode": null,
  "villageCode": null,
  "townCode": null,
  "wardCode": null,
  "pincode": "<PINCODE>",
  "address": "9th Floor, Tower-l, Jeevan Bharati Building, Connaught Place, New Delhi - 110001",
  "kycPhoto": "<BASE64 ENCODED STRING>",
  "stateName": "MAHARASHTRA",
  "districtName": "<ADDRESS>",
  "subdistrictName": null,
  "villageName": null,
  "townName": "<ADDRESS>",
  "wardName": null,
  "authMethods": [
    "MOBILE_OTP",
    "DEMOGRAPHICS",
    "... 1 more of the same shape"
  ],
  "kycVerified": true,
  "verificationStatus": "true",
  "categoryId": 1,
  "categoryName": "DOCTOR",
  "categorySubId": 3,
  "categorySubName": "AYURVEDA",
  "emailVerified": false,
  "new": false
}
```
