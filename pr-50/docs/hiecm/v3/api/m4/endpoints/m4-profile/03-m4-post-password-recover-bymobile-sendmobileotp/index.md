# Generate mobile OTP 1

`POST /password/recover/byMobile/sendMobileOTP`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/password/recover/byMobile/sendMobileOTP \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "hprId": "amol.xxxxxx"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string, required)

## Body

- `hprId` (string, required)
- `categories` (object)

## Responses

- `200`: OK
  - `txnId` (string)
  - `msg` (string)
  - `mobileNumber` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "txnId": "7ebad8aa-127b-492f-bd0e-56da716bd39e",
  "msg": "Please enter OTP sent on your mobile number ******2021",
  "otp": 0,
  "mobileNumber": "******2021"
}
```
