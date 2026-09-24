# Download ABHA card

`GET /abha/api/v3/profile/account/download-abha-card`

**Endpoint:** `GET /abha/api/v3/profile/account/download-ABHA-card`

**Flow:** **ABHA Card & Profile** - independent API; call the one that fits your identifier / modality.

---

Downloads the ABHA card of the logged-in user (`X-token`).

> **Note:** This API is only in the Postman collection (ABHA Profile/3. ABHA Card/3.4). The response is assumed to be a PDF / binary card, the same as *Retrieve ABHA Card image*.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/download-abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): User token (`Bearer <token>`) received after ABHA creation / login.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Responses

- `200`: ABHA card file.
- `400`: Invalid X-token.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `message` (string)
  - `timestamp` (string)
- `401`: Unauthorized.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
