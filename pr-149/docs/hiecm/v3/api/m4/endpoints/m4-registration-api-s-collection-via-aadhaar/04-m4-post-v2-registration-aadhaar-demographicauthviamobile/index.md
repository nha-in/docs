# Submit the demographic auth via mobile

`POST /v2/registration/aadhaar/demographicAuthViaMobile`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v2/registration/aadhaar/demographicAuthViaMobile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "mobileNumber": "<MOBILE_NUMBER>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `txnId` (string)
- `mobileNumber` (string)

## Responses

- `200`: OK
  - `verified` (boolean)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "verified": true,
  "errorCode": null,
  "reason": null,
  "uidaiToken": null
}
```
