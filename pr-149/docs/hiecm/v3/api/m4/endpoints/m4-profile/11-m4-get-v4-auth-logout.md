# Logout

`GET /v4/auth/logout`

```bash
curl --request GET \
  --url https://apihspsbx.abdm.gov.in/v4/int/v4/auth/logout \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string, required)

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
"User Profile LoggedOut Successfully!!"
```
