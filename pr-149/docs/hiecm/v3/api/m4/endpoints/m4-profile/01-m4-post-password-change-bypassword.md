# Change password

`POST /password/change/byPassword`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/password/change/byPassword \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "oldPassword": "<OLD_PASSWORD>",
  "newPassword": "<NEW_PASSWORD>",
  "txnId": "<TXN_ID>",
  "hprID": "<HPR_ID>",
  "otp": "<OTP>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string, required)

## Body

- `oldPassword` (string)
- `newPassword` (string, required)
- `txnId` (string)
- `hprID` (string)
- `otp` (string)

## Responses

- `200`: OK
  - `message` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "message": "Password has been changed successfully!"
}
```
