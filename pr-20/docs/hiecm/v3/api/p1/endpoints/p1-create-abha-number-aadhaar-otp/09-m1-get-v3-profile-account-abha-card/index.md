# Retrieve ABHA card image

`GET /abha/api/v3/profile/account/abha-card`

**Endpoint:** `GET /abha/api/v3/profile/account/abha-card`

**Flow:** **ABHA Card & Profile** - independent API; call the one that fits your identifier / modality.

---

This API endpoint is used to retrieve the ABHA card image. It requires valid credentials and headers for authentication.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `X-token` (string, required): User token (`Bearer `) received after ABHA creation / login.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Responses

- `200`: Successfully retrieved ABHA card image.
- `400`: Invalid X-token.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
