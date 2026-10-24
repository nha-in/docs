# Get user details

`GET /v1/account/user-details/{hprId}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/account/user-details/{hprId} \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Path parameters

- `hprId` (string, required)

## Responses

- `200`: OK
  - `hprIdNumber` (string)
  - `name` (string)
  - `hprId` (string)
  - `categoryName` (string)
  - `categorySubName` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "hprIdNumber": "<HPR_ID_NUMBER>",
  "name": "<NAME>",
  "hprId": "<HPR_ID>",
  "categoryName": "<CATEGORY_NAME>",
  "categorySubName": "<CATEGORY_SUB_NAME>"
}
```
