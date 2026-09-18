# Download the ABHA card as a file

`GET /v3/profile/account/download-abha-card`

The same card, delivered as a downloadable file rather than for inline
display.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/download-abha-card \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
```

## Authorization

- `Authorization` (bearer token, required): The `accessToken` from `POST /api/hiecm/gateway/v3/sessions`. Send it as `Authorization: Bearer <ACCESS_TOKEN>`.

## Headers

- `REQUEST-ID` (string, required): Unique UUID v4 per request. Used for idempotency and distributed tracing. Generate a fresh UUID for every call.
- `TIMESTAMP` (string, required): ISO 8601 UTC timestamp of the request.
- `X-token` (string): The user scoped token returned when a person logs in or verifies an OTP. Profile calls act on one account, so they need this in addition to the gateway token. Required on the calls that read or change a specific person's account. Send it as `Bearer` followed by the token, the same shape as the Authorization header. The bare form is refused as HTTP 400 `Invalid X-token`. A transfer token, the one a mobile OTP login returns without `refreshToken`, is refused on profile calls in either form; exchange it at the account selection call first. `ABDM-1094` on a profile or benefit call is an entitlement refusal for the client, not a token format error.

## Responses

- `200`: The specification does not describe this body. Send the call with Try it to see what comes back.
