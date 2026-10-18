# Get medical council by system of medicine name

`GET /apis/v1/masters/medical-councils/name`

```bash
curl --request GET \
  --url "https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/medical-councils/name?medicineName=<MEDICINENAME>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Query parameters

- `medicineName` (string, required)

## Responses

- `200`: OK
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "id": 0,
    "name": "<NAME>",
    "stateId": "<STATE_ID>",
    "systemOfMedicineId": 0,
    "position": 0,
    "status": false
  }
]
```
