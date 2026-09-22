# Face auth - generate transaction ID (init)

`POST /abha/api/v3/enrollment/enrol/auth/init`

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/auth/init`

**Flow:** **Create ABHA - Face Authentication** - step 1 of 9
- Previous: none (first call of this flow)
- Next: *Face auth - capture PID / track status*

---

This API will help to generate transaction ID. This transaction ID will be used for whole face authentication process.

 The user can submit this transaction ID to the **ABHA** app using either intent-based sharing or by generating a QR code.

User can use this transaction ID to generate QR code using any QR generator tool. Open ABHA app and scan this QR code on ABHA App to start and complete the face capture process.

The data format of the QR code should follow this pattern:
https:///face-auth?txnId=.

**For example:** https://phrsbx.ABDM.gov.in/face-auth?txnId=bac7251b-cd25-44d5-9707-f3d2ba181c1c

 For Sandbox- PHR-env-base-URL - https://phrsbx.ABDM.gov.in
 For Production - PHR-env-base-URL - https://phr.ABDM.gov.in

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/auth/init \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-auth"
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): The scopes of the request, which name the flow this call belongs to.

## Responses

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful generation of Transaction Id.
- `400`: The 400 response code indicates a bad request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "message": "Transaction Id generated Successfully"
}
```
