# Upload documents

`POST /apis/v1/uploads/upload-document`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/uploads/upload-document \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hpr_token": "<HPR_TOKEN>",
  "document": [
    {
      "document_id": 0,
      "document_type": "<DOCUMENT_TYPE>",
      "fileType": "<FILE_TYPE>",
      "data": [
        "<DATA>"
      ]
    }
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `hpr_token` (string)
- `document` (object[])
- `document.document_id` (integer)
- `document.document_type` (string)
- `document.fileType` (string)
- `document.data` (string[])

## Responses

- `200`: OK
  - `profilePhoto` (object)
  - `profilePhoto.status` (string)
  - `profilePhoto.msg` (string)
  - `degreeCertificate` (object)
  - `degreeCertificate.status` (string)
  - `degreeCertificate.msg` (string)
  - `registrationCertificate` (object)
  - `registrationCertificate.status` (string)
  - `registrationCertificate.msg` (string)
  - `proofOfWorkCertificate` (object)
  - `proofOfWorkCertificate.status` (string)
  - `proofOfWorkCertificate.msg` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "profilePhoto": {
    "status": "<STATUS>",
    "msg": "<MSG>"
  },
  "degreeCertificate": {
    "status": "<STATUS>",
    "msg": "<MSG>"
  },
  "registrationCertificate": {
    "status": "<STATUS>",
    "msg": "<MSG>"
  },
  "proofOfWorkCertificate": {
    "status": "<STATUS>",
    "msg": "<MSG>"
  }
}
```
