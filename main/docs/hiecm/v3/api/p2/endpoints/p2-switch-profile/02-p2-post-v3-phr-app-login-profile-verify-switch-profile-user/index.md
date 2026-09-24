# Verify user switch profile

`POST /abha/api/v3/phr/app/login/profile/verify/switch-profile/user`

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/verify/switch-profile/user \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'T-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `T-token` (string, required): The transaction token from the preceding login step, sent with a `Bearer ` prefix. It is valid only for that login.
- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.

## Body

- `abhaAddress` (string, required)
- `txnId` (string, required)

## Responses

- `200`: OK
  - `token` (string)
  - `expiresIn` (integer)
  - `refreshToken` (string)
  - `refreshExpiresIn` (integer)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `code` (string)
  - `message` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors

Example 200 response. The values are placeholders:

```json
{
  "token": "<JWT TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<JWT TOKEN>",
  "refreshExpiresIn": 1296000
}
```
