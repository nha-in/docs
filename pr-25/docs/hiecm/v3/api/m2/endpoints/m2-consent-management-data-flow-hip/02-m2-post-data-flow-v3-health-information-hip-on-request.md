# Submit the health information data request acknowledgement from HIP

`POST /api/hiecm/data-flow/v3/health-information/hip/on-request`

Acknowledge the Health information request receipt. Either the hiRequest or error must be specified. hiRequest element returns the same transaction ID as before with a status indicating that the request is acknowledged.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/hip/on-request \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "18235d89-cb13-479d-ad71-7a57d5f669a8",
    "sessionStatus": "ACKNOWLEDGED"
  },
  "response": {
    "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Body

- `hiRequest` (object, required)
- `hiRequest.transactionId` (string, required): The UUID generated when the health information request was initiated.Allows alpha numeric character and special characters like "^[a-zA-Z0-9_\\-@,. \":/]{0,255}$"
- `hiRequest.sessionStatus` (string, required): The status of the health information request that was initiated.Allows alpha numeric character and special characters like "^[a-zA-Z0-9_\\-@,. \":/]{0,255}$"
- `response` (object, required): The request id from the /hip/health-information/request callback. Allows alpha numeric character and special characters like "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}"
- `response.requestId` (string, required): The requestId that was passed

## Responses

- `202`: Accepted
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `403`: Access Denied
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/m2/errors
