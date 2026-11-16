# Get college by state and medicine ID

`GET /apis/v1/masters/colleges/{stateId}/{medicineId}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/colleges/{stateId}/{medicineId} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Path parameters

- `stateId` (integer, required)
- `medicineId` (string, required)

## Responses

- `200`: OK
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "id": 0,
    "name": "<NAME>",
    "status": false,
    "visibleStatus": false,
    "createdAt": "2026-08-24T10:15:30.000Z",
    "systemOfMedicineId": 0,
    "stateId": 0,
    "courseId": 0,
    "stateName": "<STATE_NAME>",
    "systemOfMedicineName": "<SYSTEM_OF_MEDICINE_NAME>",
    "deleted": false,
    "courseName": "<COURSE_NAME>"
  }
]
```
