# Get all states

`GET /apis/v1/masters/states`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/states \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Responses

- `200`: OK
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "id": 0,
    "name": "<NAME>",
    "isoCode": "<ISO_CODE>",
    "status": false,
    "countryId": 0,
    "visibleStatus": false,
    "isSystemOfMedicine": false,
    "position": false,
    "councilLabel": "<COUNCIL_LABEL>"
  }
]
```
