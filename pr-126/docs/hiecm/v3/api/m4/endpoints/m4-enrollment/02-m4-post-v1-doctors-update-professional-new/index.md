# Update professional

`POST /apis/v1/doctors/update-professional-new`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/update-professional-new \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "practitioner": {
    "personalInformation": "<PERSONAL_INFORMATION>",
    "communicationAddress": "<COMMUNICATION_ADDRESS>",
    "contactInformation": "<CONTACT_INFORMATION>",
    "registrationAcademic": "<REGISTRATION_ACADEMIC>",
    "specialities": [
      "<SPECIALITIES>"
    ],
    "currentWorkDetails": "<CURRENT_WORK_DETAILS>",
    "apiClientId": "<API_CLIENT_ID>",
    "profilePhoto": "<PROFILE_PHOTO>",
    "healthProfessionalType": "<HEALTH_PROFESSIONAL_TYPE>",
    "officialMobileCode": "<OFFICIAL_MOBILE_CODE>",
    "officialMobile": "<OFFICIAL_MOBILE>",
    "officialMobileStatus": "<OFFICIAL_MOBILE_STATUS>",
    "officialEmail": "<OFFICIAL_EMAIL>",
    "officialEmailStatus": "<OFFICIAL_EMAIL_STATUS>",
    "visibleProfilePicture": "<VISIBLE_PROFILE_PICTURE>",
    "profileVisibleToPublic": "<PROFILE_VISIBLE_TO_PUBLIC>",
    "addressAsPerKYC": "<ADDRESS_AS_PER_KYC>"
  },
  "hprToken": "<HPR_TOKEN>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `practitioner` (object)
- `practitioner.personalInformation` (object)
- `practitioner.communicationAddress` (object)
- `practitioner.contactInformation` (object)
- `practitioner.registrationAcademic` (object)
- `practitioner.specialities` (object[])
- `practitioner.currentWorkDetails` (object)
- `practitioner.apiClientId` (string)
- `practitioner.profilePhoto` (string)
- `practitioner.healthProfessionalType` (string)
- `practitioner.officialMobileCode` (string)
- `practitioner.officialMobile` (string)
- `practitioner.officialMobileStatus` (string)
- `practitioner.officialEmail` (string)
- `practitioner.officialEmailStatus` (string)
- `practitioner.visibleProfilePicture` (string)
- `practitioner.profileVisibleToPublic` (string)
- `practitioner.addressAsPerKYC` (string)
- `hprToken` (string)

## Responses

- `200`: OK
  - `referenceNumber` (string)
  - `status` (string)
  - `message` (string)
  - `error` (object)
  - `hprId` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "referenceNumber": "<REFERENCE_NUMBER>",
  "status": "<STATUS>",
  "message": "<MESSAGE>",
  "hprId": "<HPR_ID>"
}
```
