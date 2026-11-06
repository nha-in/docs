# Get countries by ID

`GET /apis/v1/masters/countries/{id}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/masters/countries/{id} \
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
  - `alpha_2_code` (string)
  - `alpha_3_code` (string)
  - `enShortName` (string)
  - `nationality` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "id": 0,
  "alpha_2_code": "<ALPHA_2_CODE>",
  "alpha_3_code": "<ALPHA_3_CODE>",
  "enShortName": "<EN_SHORT_NAME>",
  "nationality": "<NATIONALITY>"
}
```
