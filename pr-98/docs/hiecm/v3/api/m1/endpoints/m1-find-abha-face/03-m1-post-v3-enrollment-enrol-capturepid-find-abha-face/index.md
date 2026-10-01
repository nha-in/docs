# Face auth - capture PID / track status

`POST /abha/api/v3/enrollment/enrol/capturePID`

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/capturePID`

**Flow:** **Find ABHA - Face** - step 3 of 4
- Previous: *Find ABHA via Face - send authentication request*
- Next: *Find ABHA via Face - verify*

> **Note:** The original description below says the next step is ABHA enrolment. In this flow the next step is the verify API named above.

---

This API is designed to verify the status of a transaction ID that was generated during the invocation of the `auth/init` API. It serves as a follow-up mechanism to ensure that the transaction is still valid, active, and has not expired or been invalidated.

 Wait for PID capture and submission confirmation from the ABHA App. The response of the API will return status of that transactionId. It can be either **PENDING,VERIFIED,FAILED,COMPLETE.**

 Once the status in the response of this API is returned as **COMPLETE**, it indicates that the face authentication process has been successfully completed. At this stage, the next step is to invoke the `/enrollment/enrol/byAadhaar` (You can find this API in ABHA ENROLLMENT Via Aadhaar section) API to proceed further.

User can poll the `/capturePID` API in every 5 - 10 seconds interval to check the status of face capture process or alternatively skip this step and call the `/enrollment/enrol/byAadhaar` API once they see the PID submission success message in the ABHA app.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/capturePID \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
    "face-verify"
  ],
  "txnId": "ea1dc7aa-d7c3-40ab-bee8-84c6f1eb90fa"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): The scopes of the request, which name the flow this call belongs to.
- `txnId` (string, required): The transaction ID returned by the previous call in this flow.

## Responses

- `200`: The 200 response code indicates a successful request. The reponse of the API will return status of that transactionId. It can be either **PENDING,VERIFIED,FAILED,COMPLETE.**
  - `status` (string)
  - `message` (string)
- `400`: The 400 response code indicates a bad request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "status": "PENDING",
  "message": "Awaiting PID capture"
}
```
