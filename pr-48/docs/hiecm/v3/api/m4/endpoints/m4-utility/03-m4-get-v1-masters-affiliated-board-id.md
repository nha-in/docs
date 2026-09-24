# Get affiliated board by ID

`GET /apis/v1/masters/affiliated-board/{id}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/affiliated-board/{id} \
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
  - `id` (integer)
  - `name` (string)
  - `status` (boolean)
  - `visibleStatus` (boolean)
  - `stateId` (integer)
  - `stateName` (string)
  - `courseId` (integer)
  - `courseName` (string)
  - `nationalBoard` (boolean)
  - `councilBoard` (boolean)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "id": 0,
  "name": "<NAME>",
  "status": false,
  "visibleStatus": false,
  "stateId": 0,
  "stateName": "<STATE_NAME>",
  "courseId": 0,
  "courseName": "<COURSE_NAME>",
  "nationalBoard": false,
  "councilBoard": false
}
```
