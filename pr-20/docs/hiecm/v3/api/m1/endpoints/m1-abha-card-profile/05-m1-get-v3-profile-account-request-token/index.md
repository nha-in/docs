# Refresh user token

`GET /abha/api/v3/profile/account/request/token`

**Endpoint:** `GET /abha/api/v3/profile/account/request/token`

**Flow:** **Access Tokens & Encryption** - independent API; call the one that fits your identifier / modality.

---

This API endpoint is used to request a token for accessing a user’s ABHA (Ayushman Bharat Health Account) profile. This token is essential for authenticating and authorizing the user to perform various actions within their profile.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/token \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'R-token: Bearer {{R-jwtToken}}' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `R-token` (string, required): Refresh token (`Bearer <refreshToken>`) received at login.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `REQUEST-ID` (string, required): Unique UUID for every request.

## Responses

- `200`: The token was successfully generated and sent to the user’s registered contact method.
- `400`: The 400 response code indicates a bad request
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: A 404 Not Found error occurs when a server cannot find the requested resource. This error indicates that the server is reachable, but the specific page or resource is not available
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000
}
```
