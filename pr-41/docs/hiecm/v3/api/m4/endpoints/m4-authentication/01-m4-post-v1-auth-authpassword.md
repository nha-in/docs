# Login via password

`POST /api/v1/auth/authPassword`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/api/v1/auth/authPassword \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "idType": "",
  "domainName": "",
  "hprId": "<HPR_ID>",
  "password": "XXXX@992"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## Body

- `idType` (string)
- `domainName` (string)
- `hprId` (string)
- `password` (string)

## Responses

- `200`: OK
  - `token` (string)
  - `expiresIn` (integer)
  - `refreshToken` (string)
  - `refreshExpiresIn` (integer)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "token": "<JWT TOKEN>",
  "expiresIn": 1733639805,
  "refreshToken": null,
  "refreshExpiresIn": 0
}
```
