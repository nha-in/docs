# Get the exists by HPR ID

`GET /v1/search/existsByHprId/{hprId}`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/search/existsByHprId/{hprId} \
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
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
true
```
