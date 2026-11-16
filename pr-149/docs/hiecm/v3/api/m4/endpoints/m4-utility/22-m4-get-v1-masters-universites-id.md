# Get university by college

`GET /apis/v1/masters/universites/{id}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/universites/{id} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Path parameters

- `id` (integer, required)

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
    "collegeId": 0,
    "collegeName": "<COLLEGE_NAME>",
    "deleted": false,
    "college": "<COLLEGE>"
  }
]
```
