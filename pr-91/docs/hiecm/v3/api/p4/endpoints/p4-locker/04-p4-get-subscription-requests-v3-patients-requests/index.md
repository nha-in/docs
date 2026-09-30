# Get all the consent and subscription requests with given filters

`GET /api/hiecm/subscription-requests/v3/patients/requests`

Retrieve all consent and subscription requests based on specified filters. By invoking this API, users can obtain a comprehensive list of requests that match the given criteria, including details about their status, scope, and any associated conditions. This functionality is essential for managing and tracking consent and subscription requests efficiently, ensuring that users have access to accurate and up-to-date information.

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/requests?consentLimit=<CONSENTLIMIT>&consentOffset=<CONSENTOFFSET>&subscriptionLimit=<SUBSCRIPTIONLIMIT>&subscriptionOffset=<SUBSCRIPTIONOFFSET>&status=ALL" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for tracking the end-to-end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds, and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password

## Query parameters

- `consentLimit` (string, required): The consent limit - to limit records being fetched
- `consentOffset` (string, required): The consent offset - to skip the records before fetching the first record
- `subscriptionLimit` (string, required): The subscription limit - to limit records being fetched
- `subscriptionOffset` (string, required): The subscription offset - to skip the records before fetching the first record
- `status` (string, required): The status of the subscription and consent

## Responses

- `200`: OK
  - `consents` (object)
  - `consents.size` (integer)
  - `consents.limit` (integer)
  - `consents.offset` (integer)
  - `consents.requests` (object[])
  - `consents.requests.requestId` (string)
  - `consents.requests.createdAt` (string)
  - `consents.requests.lastUpdated` (string)
  - `consents.requests.status` (string) One of: REQUESTED, EXPIRED, DENIED, GRANTED, REVOKED.
  - `consents.requests.purpose` (object)
  - `consents.requests.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `consents.requests.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `consents.requests.purpose.refUri` (string, required): The reference URL.Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `consents.requests.patient` (object)
  - `consents.requests.patient.id` (string, required): The abha address of the patient
  - `consents.requests.hip` (object): Identifier and name of the health information provider.
  - `consents.requests.hip.id` (string, required): The service ID of the health information provider. Allows alpha numeric and _ or - in middle
  - `consents.requests.hip.name` (string, required): The name of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `consents.requests.hip.type` (string): The type of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `consents.requests.hiu` (object)
  - `consents.requests.hiu.id` (string, required): The service ID of the health information user.  Allows alpha numeric and _ or - in middle
  - `consents.requests.hiu.name` (string, required): The name of the health information user. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `consents.requests.hiu.type` (string): The type of the health information user. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `consents.requests.requester` (object)
  - `consents.requests.requester.name` (string, required): The name of the requester
  - `consents.requests.requester.identifier` (object, required)
  - `consents.requests.hiTypes` (string[]): Types of health information document.
  - `consents.requests.careContexts` (object[]): List of care contexts linked at the HIP end for the identified patient.
  - `consents.requests.careContexts.patientReference` (string, required): A patient identifier with which patient is registered in the facility/hospital
  - `consents.requests.careContexts.careContextReference` (string, required): An identifier of patient's care context created in HIP. A care context is a group of patient's health data (Not the actual health data)
  - `consents.requests.permission` (object)
  - `consents.requests.permission.accessMode` (string, required) One of: VIEW, STORE, STREAM, QUERY.
  - `consents.requests.permission.dateRange` (object, required)
  - `consents.requests.permission.dataEraseAt` (string, required): The date at which the consent expire. Should be UTC date time in ISO format
  - `consents.requests.permission.frequency` (object, required)
  - `subscriptions` (object)
  - `subscriptions.limit` (integer, required)
  - `subscriptions.size` (integer, required)
  - `subscriptions.offset` (integer, required)
  - `subscriptions.requests` (object[], required)
  - `subscriptions.requests.id` (string)
  - `subscriptions.requests.requestId` (string, required)
  - `subscriptions.requests.subscriptionId` (string)
  - `subscriptions.requests.patient` (object)
  - `subscriptions.requests.patient.id` (string, required): The abha address of the patient. Must start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx
  - `subscriptions.requests.purpose` (object)
  - `subscriptions.requests.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `subscriptions.requests.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `subscriptions.requests.purpose.refUri` (string, required): The reference URL. Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `subscriptions.requests.hiu` (object)
  - `subscriptions.requests.hiu.id` (string, required): The service ID of the health information user. Must be Alpha numeric and _ or - in middle
  - `subscriptions.requests.hiu.name` (string): The name of the health information user. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.requests.hiu.type` (string): The type of the health information user. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.requests.hips` (object[])
  - `subscriptions.requests.hips.id` (string, required): The service ID of the health information provider. Must be Alpha numeric and _ or - in middle
  - `subscriptions.requests.hips.name` (string): The name of the health information provider. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.requests.hips.type` (string): The type of the health information provider. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.requests.categories` (string[])
  - `subscriptions.requests.period` (object)
  - `subscriptions.requests.period.from` (string, required): UTC date time in ISO format
  - `subscriptions.requests.period.to` (string, required): UTC date time in ISO format
  - `subscriptions.requests.createdAt` (string)
  - `subscriptions.requests.lastUpdated` (string)
  - `subscriptions.requests.status` (string) One of: REQUESTED, GRANTED, DENIED, EXPIRED, REVOKED.
  - `subscriptions.requests.requestType` (string) One of: HEALTH_LOCKER, HIU, HIP.
- `400`: Bad Request
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1066 - Invalid JWT token. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900901 - Invalid Credentials. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
- `404`: server cannot find the requested resource
- `500`: Internal Server Error
  - `timestamp` (number, required)
  - `path` (string, required)
  - `status` (integer, required)
  - `error` (string, required): The error code and message, if any occurred.
  - `requestId` (string, required)
- `503`: Internal Server Error
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "consents": {
    "size": 10,
    "limit": 10,
    "offset": 0,
    "requests": [
      {
        "requestId": "e5ec415f-c098-40f6-a0db-faa162fc5295",
        "createdAt": "2021-09-28T12:30:08.573Z",
        "lastUpdated": "2021-09-28T12:30:08.573Z",
        "status": "GRANTED",
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "www.abc.com"
        },
        "patient": {
          "id": "<ABHA_ADDRESS>"
        },
        "hip": {
          "id": "cowin_hip_01",
          "name": "Cowin",
          "type": "HIP"
        },
        "hiu": {
          "id": "cowin_hiu_01",
          "name": "Cowin",
          "type": "HIU"
        },
        "requester": {
          "name": "<ABHA_ADDRESS>",
          "identifier": {
            "value": "REG1",
            "type": "MH1001",
            "system": "https://www.sample.com"
          }
        },
        "hiTypes": [
          "Prescription"
        ],
        "careContexts": [
          {
            "patientReference": "batman@tmh",
            "careContextReference": "Episode1"
          }
        ],
        "permission": {
          "accessMode": "VIEW",
          "dateRange": {
            "from": "2021-09-28T12:30:08.573Z",
            "to": "2021-09-28T12:30:08.573Z"
          },
          "dataEraseAt": "2021-09-28T12:30:08.573Z",
          "frequency": {
            "unit": "HOUR",
            "value": 1,
            "repeats": 0
          }
        }
      }
    ]
  },
  "subscriptions": {
    "limit": 5,
    "size": 0,
    "offset": 5,
    "requests": [
      {
        "id": "1234",
        "requestId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
        "subscriptionId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
        "patient": {
          "id": "<ABHA_ADDRESS>"
        },
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "https://abc.def.in"
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
        "createdAt": "2024-05-09T10:34:00.389Z",
        "lastUpdated": "2024-05-09T10:34:00.389Z",
        "status": "GRANTED",
        "requestType": "HEALTH_LOCKER"
      }
    ]
  }
}
```
