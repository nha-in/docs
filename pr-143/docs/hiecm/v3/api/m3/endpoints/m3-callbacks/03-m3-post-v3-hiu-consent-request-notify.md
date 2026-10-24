# Notify HIU when consent is APPROVED, DENIED or REVOKED

`POST /api/v3/hiu/consent/request/notify`

**Hosted by the HIP/HIU, not by ABDM.** ABDM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.
Health information user will get notified about the consent request granted or denied, consent revoked, consent expired.
For consent request grant, status=GRANTED, consentRequestId=, and consentArtefacts is an array of generated consent artefact Ids. For consent request expiry, status=EXPIRED, consentRequestId= For consent request denied, status=DENIED, consentRequestId= For consent revocation, status=REVOKED, consentArtefacts is an array of revoked consent artefact ids.

```bash
curl --request POST \
  --url {bridgeUrl}/api/v3/hiu/consent/request/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "consentRequestId": "e3c74829-3f82-4f94-959e-e10f57bcd57b",
    "status": "GRANTED",
    "reason": null,
    "consentArtefacts": [
      {
        "id": "6f0b4665-a915-4c92-aa36-65afb4a2cd71"
      }
    ]
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds.
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended

## Body

- `notification` (object, required)
- `notification.consentRequestId` (string, required): The consent request id from a consent. Allows alpha numeric character and special characters like "^[a-zA-Z0-9_\-@,. ":/]{0,255}$"
- `notification.status` (string, required) One of: GRANTED, EXPIRED, DENIED, REQUESTED, REVOKED.
- `notification.reason` (string, required)
- `notification.consentArtefacts` (object[], required): List of consent artefact ids that were created.
- `notification.consentArtefacts.id` (string, required)

## Responses

- `200`: OK
- `400`: Bad Request. The request could not be processed because it was malformed or failed validation - a missing mandatory field, a value in the wrong format, or a header that did not match the body.
  See Error codes for this module: /docs/hiecm/v3/api/m3/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1006 - Bad Request, invalid request Body. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required): Short description of the failure.
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Unauthorized. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/m3/errors
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m3/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m3/errors
  - `code` (string): 900900 - Unclassified Authentication Failure. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/m3/errors
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)
