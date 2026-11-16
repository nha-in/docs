# Submit the is Aadhaar authenticated

`POST /aadhaar/isAuthenticated`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/aadhaar/isAuthenticated \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "259813b1-a339-4482-8df5-16ee45b8dcf2"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `txnId` (string)

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
true
```
