# Recover password confirm by Aadhaar

`POST /password/recover/confirmByAadhaar`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/password/recover/confirmByAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "otp": "<BASE64 ENCODED STRING>",
  "txnId": "9b78fdfb-3ba4-4707-8913-63c7c5e3a743"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## Body

- `newPassword` (string): Encrypted new Password.
- `otp` (string): Encrypted OTP.
- `txnId` (string, required)

## Responses

- `200`: OK
  - `verified` (boolean)
  - `txnId` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "verified": true,
  "txnId": "9b78fdfb-3ba4-4707-8913-63c7c5e3a743"
}
```
