# Fetch his/her subscription requests details

`GET /api/hiecm/subscription-requests/v3/requests`

Be invoked by the patient or user through the Personal Health Record (PHR) application to fetch details of their subscription requests. By using this API, patients can retrieve comprehensive information about all their subscription requests, including the status and specifics of each request. This functionality is essential for maintaining transparency and enabling patients to manage their subscriptions effectively. The API supports secure and efficient access to subscription data, enhancing the overall user experience within the healthcare ecosystem.

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/requests?limit=5&offset=5&status=ALL" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password

## Query parameters

- `limit` (integer, required): How many items to return at one time
- `offset` (integer, required): How many items out of line
- `status` (string, required): Query string parameter restricts the data returned from your request

## Responses

- `200`: OK
  - `size` (integer, required)
  - `limit` (integer, required)
  - `offset` (integer, required)
  - `requests` (object[], required)
  - `requests.subscriptionId` (string)
  - `requests.requestId` (string, required)
  - `requests.createdAt` (string)
  - `requests.lastUpdated` (string)
  - `requests.purpose` (object)
  - `requests.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `requests.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `requests.purpose.refUri` (string, required): The reference URL.Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `requests.patient` (object)
  - `requests.patient.id` (string, required): The abha address of the patient. Must start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx. Allows alpha numeric character and special characters like ^[a-zA-Z0-9][a-zA-Z0-9_.\\-!]+[a-zA-Z0-9]@(abdm|sbx)$
  - `requests.hiu` (object)
  - `requests.hiu.id` (string, required): The service ID of the health information user. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `requests.hiu.name` (string): The name of the health information user. Allows alphanumeric characters and special characters like"^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `requests.hiu.type` (string): The type of the health information user. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `requests.hips` (object[])
  - `requests.hips.id` (string, required): The service ID of the health information provider. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `requests.hips.name` (string): The name of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `requests.hips.type` (string): The type of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `requests.categories` (string[])
  - `requests.period` (object)
  - `requests.period.from` (string, required): UTC date time in ISO format.Allows alpha numeric character and special characters like  "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$"
  - `requests.period.to` (string, required): UTC date time in ISO format.Allows alpha numeric character and special characters like  "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$"
  - `requests.status` (string) One of: REQUESTED, GRANTED, DENIED, EXPIRED, REVOKED.
  - `requests.requestType` (string) One of: HEALTH_LOCKER, HIU, HIP.
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1066 - Invalid JWT token. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
- `404`: server cannot find the requested resource
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
  - `timestamp` (number, required)
  - `path` (string, required)
  - `status` (integer, required)
  - `error` (string, required): The error code and message, if any occurred.
  - `requestId` (string, required)
- `503`: Service Unavailable
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "size": 0,
  "limit": 5,
  "offset": 5,
  "requests": [
    {
      "subscriptionId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
      "requestId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
      "createdAt": "2024-05-09T10:34:00.389Z",
      "lastUpdated": "2024-05-09T10:34:00.389Z",
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "https://abc.def.in"
      },
      "patient": {
        "id": "<ABHA_ADDRESS>"
      },
      "hiu": {
        "id": "INDIA_HIU",
        "name": "INDIA HIU",
        "type": "HIU"
      },
      "hips": [
        {
          "id": "INDIA_HIP",
          "name": "INDIA HIP",
          "type": "HIP"
        }
      ],
      "categories": [
        "LINK"
      ],
      "period": {
        "from": "2024-05-09T10:34:00.389Z",
        "to": "2024-05-09T10:34:00.389Z"
      },
      "status": "GRANTED",
      "requestType": "HEALTH_LOCKER"
    }
  ]
}
```
