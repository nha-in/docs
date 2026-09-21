# Login via Mobile number - verify user (select ABHA)

`POST /abha/api/v3/profile/login/verify/user`

**Endpoint:** `POST /abha/api/v3/profile/login/verify/user`

**Flow:** **Login - Mobile Number** - step 3 of 3
- Previous: *Login via Mobile number - verify OTP*
- Next: none (last call of this flow)

---

This API is used to verify the selected ABHA user during the login journey after the user has searched or identified available ABHA accounts. It confirms that the user is proceeding with the correct ABHA number and validates the requested authentication flow. This step helps securely continue login for the chosen account and prevents access to the wrong profile. It is typically used when multiple ABHA accounts are available against the same mobile number or identifier. After successful verification, the user can proceed with the remaining authentication steps.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify/user \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'T-token: Bearer {{jwtToken}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "ABHANumber": "{{abha-number}}",
  "txnId": "{{txnId}}"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `T-token` (string, required): Short-lived token (`Bearer <token>`) returned by *Login via Mobile number - verify OTP*.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `ABHANumber` (string, required): The 14 digit ABHA number to sign in to, chosen from the accounts the previous call listed.
- `txnId` (string, required): The transaction ID returned by the previous call in this flow.

## Responses

- `200`: The 200 response code indicates a successful request. **
- `400`: The 400 response code indicates a bad request. In this context, it refers to various errors encountered during the OTP (One-Time Password) verification process due to invalid inputs or parameters. **Types of OTP Verification Errors:** **Invakid T-Token:** This error occurs when the T -token. **Verify OTP - Invalid Abha Number:** This error occurs when the authentication methods provided for invalid abha number are invalid.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: **Unauthorized:** Indicates that the request requires user authentication. The server returns a 401 status code when the client has not provided valid authentication credentials.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
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
