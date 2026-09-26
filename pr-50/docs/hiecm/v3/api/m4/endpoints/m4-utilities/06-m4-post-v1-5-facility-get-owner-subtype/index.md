# Get all sub types by owner ship type and sub type

`POST /v1.5/facility/get-owner-subtype`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/get-owner-subtype \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "ownershipCode": "<OWNERSHIP_CODE>",
  "ownerSubtypeCode": "<OWNER_SUBTYPE_CODE>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `ownershipCode` (string, required)
- `ownerSubtypeCode` (string, required)

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "type": "CENTRAL-GOVERNMENT",
  "data": [
    {
      "code": "MOHF",
      "value": "Mo Health and Family Welfare"
    },
    {
      "code": "MOR",
      "value": "Mo Railways"
    },
    "... 1 more of the same shape"
  ]
}
```
