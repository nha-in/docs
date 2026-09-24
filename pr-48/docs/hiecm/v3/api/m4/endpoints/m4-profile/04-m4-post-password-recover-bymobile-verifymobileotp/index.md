# Verify mobile OTP 1

`POST /password/recover/byMobile/verifyMobileOTP`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/password/recover/byMobile/verifyMobileOTP \
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
  - `txnId` (string)
  - `msg` (string)
  - `mobileNumber` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "verified": true,
  "txnId": "7ebad8aa-127b-492f-bd0e-56da716bd39e"
}
```
