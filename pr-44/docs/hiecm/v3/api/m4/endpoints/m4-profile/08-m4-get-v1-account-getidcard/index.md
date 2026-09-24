# Get account png card

`GET /v1/account/getIdCard`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/account/getIdCard \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-Token: <X_TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.

## Headers

- `X-Token` (string): The HPR token of the signed-in professional, from the HPR login.

## Responses

- `200`: OK
  - `pdf` (string)
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "pdf": "JVBERi0xLjMK"
}
```
