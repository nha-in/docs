# After ABHA creation - create ABHA address

`POST /abha/api/v3/enrollment/enrol/abha-address`

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/abha-address`

**Flow:** **Create ABHA - Face Authentication** - step 9 of 9
- Previous: *After ABHA creation - get ABHA address suggestions*
- Next: none (last call of this flow)

---

This API endpoint is used to enrol a new ABHA address. It allows users to create a unique ABHA address that can be used for accessing and managing their health records. The endpoint ensures that the provided ABHA address is unique and valid..

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "abhaAddress": "{{ABHA Address}}",
  "preferred": 1
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `txnId` (string, required): The transaction ID returned by the previous call in this flow.
- `abhaAddress` (string, required): The ABHA address chosen for the account, without the @ suffix.
- `preferred` (integer, required): 1 to make this the preferred ABHA address of the account, 0 otherwise.

## Responses

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful operation of the Enroll ABHA Address API.
  - `txnId` (string)
  - `abhaAddress` (string)
  - `preferred` (integer)
- `400`: The 400 response code indicates a bad request. In this context, it refers to various errors encountered during the operation of the Suggestion API. **Types of Suggestion API Errors:** **Invalid Preferred Flag:** This error occurs when the transaction ID provided in the request is invalid. The transaction ID is essential for tracking the request and ensuring that the correct information is processed. An invalid transaction ID means the server cannot verify the request, leading to a failure in enrolling the ABHA address. . **Invalid Transaction Id:** This error occurs when the preferred flag provided in the request is invalid. The preferred flag indicates the user’s preference for the suggested ABHA address. An invalid preferred flag means the server cannot process the user’s preference correctly, leading to a failure in enrolling the ABHA address.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `preferred` (string)
  - `timestamp` (string)
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "txnId": "23acf181-339d-4771-b532-5c5df4a28d19",
  "healthIdNumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>"
}
```
