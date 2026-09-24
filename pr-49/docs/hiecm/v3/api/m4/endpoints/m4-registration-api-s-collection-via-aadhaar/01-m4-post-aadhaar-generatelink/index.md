# Generate Aadhaar link

`POST /aadhaar/generateLink`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/aadhaar/generateLink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scopes": [
    "nhpr-register"
  ],
  "source": "NHPR"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `scopes` (string[])
- `source` (string)

## Responses

- `200`: OK
  - `status` (string)
  - `txnId` (string)
  - `url` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "txnId": "de4ff682-fcc6-4bcf-a978-0dbb19a288b4",
  "mobileNumber": "******1234"
}
```
