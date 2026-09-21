# Get PHR card

`GET /abha/api/v3/phr/web/login/profile/abha/phr-card`

**Endpoint:** `GET /abha/api/v3/phr/web/login/profile/abha/phr-card`

**Flow:** **ABHA Address Login - Aadhaar OTP** - step 5 of 6
- Previous: *Get ABHA-address profile*
- Next: *Get ABHA-address QR code*

---

This API endpoint is used to generate a PHR Card profile. It requires valid credentials and headers for authentication.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha/phr-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `X-token` (string, required): User token (`Bearer <token>`) received after ABHA creation / login.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Responses

- `202`: Indicates a successful generation of PHR card
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: A 400 Bad Request error with the description “invalid X-token”  indicates that the server received a request with an invalid or missing authentication token.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Invalid Credentials error occurs when a server receives a request but cannot authorize it due to incorrect or missing authentication
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
