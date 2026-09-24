# Get public certificate

`GET /api/v1/auth/cert`

```bash
curl --request GET \
  --url "https://apihspsbx.abdm.gov.in/v4/int/api/v1/auth/cert?publicCertificateRequestDto=<PUBLICCERTIFICATEREQUESTDTO>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Query parameters

- `publicCertificateRequestDto` (object, required)

## Responses

- `200`: OK
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
"<VALUE>"
```
