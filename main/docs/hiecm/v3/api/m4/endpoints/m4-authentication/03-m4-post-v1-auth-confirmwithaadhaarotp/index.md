# Verify Aadhaar OTP

`POST /api/v1/auth/confirmWithAadhaarOtp`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/api/v1/auth/confirmWithAadhaarOtp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "otp": "308709",
  "txnId": "de4ff682-fcc6-4bcf-a978-0dbb19a288b4"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `otp` (string)
- `txnId` (string)

## Responses

- `200`: OK
  - `token` (string)
  - `expiresIn` (integer)
  - `refreshToken` (string)
  - `refreshExpiresIn` (integer)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "token": "<TOKEN>",
  "expiresIn": 0,
  "refreshToken": "<REFRESH_TOKEN>",
  "refreshExpiresIn": 0
}
```
