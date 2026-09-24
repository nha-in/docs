# Resend verification email

`POST /apis/v1/doctors/resent-verify-email`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/resent-verify-email \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "emailAddress": "<ABHA_ADDRESS>.com",
  "otp_type": ""
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## Body

- `emailAddress` (string)
- `otp_type` (string)

## Responses

- `200`: OK
  - `msg` (string)
  - `status` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "emailAddress": "<ABHA_ADDRESS>.com",
  "otp_type": ""
}
```
