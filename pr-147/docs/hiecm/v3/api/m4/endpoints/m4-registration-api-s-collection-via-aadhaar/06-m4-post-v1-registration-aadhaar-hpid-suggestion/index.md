# Get suggesstion

`POST /v1/registration/aadhaar/hpid/suggestion`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/registration/aadhaar/hpid/suggestion \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "a825f76b-0696-40f3-864c-5a3a5b389a83"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `txnId` (string, required): Based on UUID

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
[
  "anujsharma"
]
```
