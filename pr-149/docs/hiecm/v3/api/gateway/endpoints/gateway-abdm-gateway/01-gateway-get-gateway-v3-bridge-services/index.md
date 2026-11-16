# Fetch the service ids registered against a bridge

`GET /api/hiecm/gateway/v3/bridge-services`

Retrieve the unique identifiers, known as service IDs, that are associated with a specific bridge. In this context, a bridge acts as an intermediary component that connects various services or networks, enabling them to communicate with each other. When you call this API, it queries the bridge to gather a list of all the service IDs that have been registered with it.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-services \
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
  - `bridge` (object)
  - `bridge.id` (string)
  - `bridge.name` (string)
  - `bridge.url` (string)
  - `bridge.active` (boolean)
  - `bridge.blocklisted` (boolean)
  - `services` (object[])
  - `services.id` (string)
  - `services.name` (string)
  - `services.types` (string[])
  - `services.endpoints` (object)
  - `services.endpoints.hipEndpoints` (object[])
  - `services.endpoints.hipEndpoints.use` (string)
  - `services.endpoints.hipEndpoints.connectionType` (string)
  - `services.endpoints.hipEndpoints.address` (string)
  - `services.endpoints.hiuEndpoints` (object[])
  - `services.endpoints.hiuEndpoints.use` (string)
  - `services.endpoints.hiuEndpoints.connectionType` (string)
  - `services.endpoints.hiuEndpoints.address` (string)
  - `services.endpoints.healthLockerEndpoints` (object[])
  - `services.endpoints.healthLockerEndpoints.use` (string)
  - `services.endpoints.healthLockerEndpoints.connectionType` (string)
  - `services.endpoints.healthLockerEndpoints.address` (string)
  - `services.active` (boolean)
- `204`: No Content
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `400`: Bad Request
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1015 - Invalid Response. May be returned either bare (`ABDM-1015`) or with a trailing ": " separator (`ABDM-1015: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden. The caller is authenticated but is not permitted to perform this operation on this resource.
- `500`: Internal Server Error
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `503`: Service Unavailable
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "bridge": {
    "id": "Bridge_ABC",
    "name": "ABC Bridge",
    "url": "https://abc.def.in",
    "active": true,
    "blocklisted": false
  },
  "services": [
    {
      "id": "ABC_Service",
      "name": "Service ABC",
      "types": [
        "HIP"
      ],
      "endpoints": {
        "hipEndpoints": [
          {
            "use": "registration",
            "connectionType": "HTTPS",
            "address": "https://abc.com/register"
          }
        ],
        "hiuEndpoints": [
          {
            "use": "registration",
            "connectionType": "HTTPS",
            "address": "https://abc.com/register"
          }
        ],
        "healthLockerEndpoints": [
          {
            "use": "registration",
            "connectionType": "HTTPS",
            "address": "https://abc.com/register"
          }
        ]
      },
      "active": true
    }
  ]
}
```
