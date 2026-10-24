# Send via Aadhaar OTP

`POST /api/v1/auth/init`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/api/v1/auth/init \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "idType": "",
  "domainName": "",
  "authMethod": "AADHAAR_OTP",
  "hprId": "<HPR_ID>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `idType` (string)
- `domainName` (string)
- `authMethod` (string)
- `hprId` (string)

## Responses

- `200`: OK
  - `transactionId` (string)
  - `mobileNumber` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "transactionId": "227654a1-a627-48e3-a617-f6fa7595a512",
  "mobileNumber": "******1234"
}
```
