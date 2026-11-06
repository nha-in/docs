# Fetch his/her subscription details by subscription ID

`GET /api/hiecm/subscription-requests/v3/{subscriptionID}`

Be invoked by the patient or user through the Personal Health Record (PHR) application to fetch their subscription details using the subscription ID. By using this API, individuals can retrieve comprehensive information about a specific subscription, including its status, scope, and any associated conditions. This functionality is essential for enabling users to manage their health data subscriptions effectively, ensuring they have access to accurate and up-to-date subscription information.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/{subscriptionID} \
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

## Path parameters

- `subscriptionID` (string, required): The subscription id

## Responses

- `200`: OK
  - `subscriptionId` (string, required)
  - `purpose` (object, required)
  - `purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `purpose.refUri` (string, required): The reference URL. Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `dateCreated` (string, required)
  - `status` (string, required) One of: REQUESTED, GRANTED, DENIED, EXPIRED, REVOKED.
  - `dateGranted` (string, required)
  - `patient` (object, required)
  - `patient.id` (string, required): The abha address of the patient. Must start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx
  - `requester` (object, required)
  - `requester.id` (string, required)
  - `requester.name` (string, required)
  - `requester.type` (string, required)
  - `includedSources` (object[], required): Included sources, carrying the list of hi types.
  - `includedSources.hip` (object, required): Identifier and name of the health information provider.
  - `includedSources.hip.id` (string, required): The service ID of the health information provider. Allows alpha numeric character and special characters like [A-Z a-z 0-9]+[A-Z a-z 0-9 //_//-]*[A-Z a-z 0-9]$
  - `includedSources.hip.name` (string, required): The name of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `includedSources.hip.type` (string): The type of the health information provider. Allows alphanumeric characters and special characters like "^[a-zA-Z0-9_\\-@,. \":]{0,255}$"
  - `includedSources.categories` (string[], required)
  - `includedSources.hiTypes` (string[], required): Types of health information document.
  - `includedSources.period` (object, required): The date range between when the subscription will be active
  - `includedSources.period.from` (string, required): UTC date time in ISO format
  - `includedSources.period.to` (string, required): UTC date time in ISO format
  - `includedSources.status` (string): The status of the subscription approval
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p3/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1015 - Invalid Response. May be returned either bare (`ABDM-1015`) or with a trailing ": " separator (`ABDM-1015: `); match on the code itself and tolerate the separator.
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
  "subscriptionId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
  "purpose": {
    "text": "Care Management",
    "code": "CAREMGT",
    "refUri": "https://abc.def.in"
  },
  "dateCreated": "2021-09-28T12:30:08.573Z",
  "status": "GRANTED",
  "dateGranted": "2021-09-28T12:30:08.573Z",
  "patient": {
    "id": "<ABHA_ADDRESS>"
  },
  "requester": {
    "id": "<ABHA_ADDRESS>",
    "name": "ABDM_HIU",
    "type": "HIU"
  },
  "includedSources": [
    {
      "hip": {
        "id": "INDIA_HIP",
        "name": "INDIA HIP",
        "type": "HIP"
      },
      "categories": [
        "LINK"
      ],
      "hiTypes": [
        "Prescription"
      ],
      "period": {
        "from": "2024-05-09T10:34:00.389Z",
        "to": "2024-05-09T10:34:00.389Z"
      },
      "status": "GRANTED"
    }
  ]
}
```
