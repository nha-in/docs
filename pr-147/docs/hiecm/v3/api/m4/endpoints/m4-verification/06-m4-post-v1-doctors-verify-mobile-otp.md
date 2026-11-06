# Verify mobile OTP

`POST /apis/v1/doctors/verify-mobile-otp`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/verify-mobile-otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hpr_token": "<JWT TOKEN>",
  "txnId": "dd392164-0f4a-4894-8d64-1fce027ee033",
  "otp": "<BASE64 ENCODED STRING>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `txnId` (string)
- `otp` (string)

## Responses

- `200`: OK
  - `status` (string)
  - `txnId` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "status": "<string>",
  "txnId": "<string>"
}
```
