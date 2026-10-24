# Fetch the list of govt programmes

`GET /api/hiecm/gateway/v3/govt-programs`

Retrieve a list of government programmes. When invoked, it queries the system to fetch comprehensive information about various government programmes available. This functionality is particularly useful for users who need to access detailed information about different programmes.
 **Note:**

This API will retrive the list of govt-programmes in the form of list.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/govt-programs \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended

## Responses

- `200`: OK
- `204`: No Content
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1015 - Invalid Response. May be returned either bare (`ABDM-1015`) or with a trailing ": " separator (`ABDM-1015: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden. The caller is authenticated but is not permitted to perform this operation on this resource.
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "identifier": {
      "name": "AB - PMJAY",
      "id": "PMJAY"
    },
    "facilityType": [
      "HIP"
    ],
    "isHIP": true
  }
]
```
