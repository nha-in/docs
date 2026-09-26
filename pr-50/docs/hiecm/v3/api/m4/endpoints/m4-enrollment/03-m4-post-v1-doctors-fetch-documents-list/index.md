# Fetch documents

`POST /apis/v1/doctors/fetch-documents-list`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/fetch-documents-list \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hprid": "<HPR_ID>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `hprid` (string)

## Responses

- `200`: OK
  - `documentList` (object)
  - `documentList.profileDetails` (object)
  - `documentList.registrationDetails` (object[])
  - `documentList.qualificationDetails` (object[])
  - `documentList.qualification` (object[])
  - `documentList.internationalDoctorQualificationDetails` (object[])
  - `message` (string)
  - `Message` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "documentList": {
    "profileDetails": "<PROFILE_DETAILS>",
    "registrationDetails": [
      "<REGISTRATION_DETAILS>"
    ],
    "qualificationDetails": [
      "<QUALIFICATION_DETAILS>"
    ],
    "qualification": [
      "<QUALIFICATION>"
    ],
    "internationalDoctorQualificationDetails": [
      "<INTERNATIONAL_DOCTOR_QUALIFICATION_DETAILS>"
    ]
  },
  "message": "<MESSAGE>",
  "Message": "<MESSAGE>"
}
```
