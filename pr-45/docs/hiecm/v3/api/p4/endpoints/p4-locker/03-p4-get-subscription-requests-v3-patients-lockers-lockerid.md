# Get health locker settings of a patient by locker ID

`GET /api/hiecm/subscription-requests/v3/patients/lockers/{locker-id}`

Retrieve the health locker settings of a patient using the locker ID. By invoking this API, users can access detailed information about the configuration and preferences of the patient’s health locker. This functionality is essential for managing and customizing the storage and access settings of health records, ensuring that patients have control over their health information. The API supports secure and efficient retrieval of health locker settings, enhancing the overall management of health data within the healthcare ecosystem.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/patients/lockers/{locker-id} \
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
- `X-AUTH-TOKEN` (string, required): JWT Authentication token issued by ABDM after successful validation of username and password

## Path parameters

- `locker-id` (string, required): The locker id

## Responses

- `200`: OK
  - `lockerId` (string)
  - `lockerName` (string)
  - `active` (boolean)
  - `dateCreated` (string)
  - `subscriptions` (object[])
  - `subscriptions.subscriptionId` (string, required)
  - `subscriptions.purpose` (object, required)
  - `subscriptions.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `subscriptions.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `subscriptions.purpose.refUri` (string, required): The reference URL. Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `subscriptions.status` (string, required) One of: REQUESTED, GRANTED, DENIED, EXPIRED, REVOKED.
  - `subscriptions.dateCreated` (string, required)
  - `subscriptions.dateGranted` (string, required)
  - `subscriptions.patient` (object, required)
  - `subscriptions.patient.id` (string, required): The abha address of the patient. Must start with Alphanumeric . and  _  in the middle and must be ending with @abdm or @sbx
  - `subscriptions.requester` (object, required)
  - `subscriptions.requester.id` (string, required)
  - `subscriptions.requester.name` (string, required)
  - `subscriptions.requester.type` (string, required)
  - `subscriptions.includedSources` (object[], required): Included sources, carrying the list of hi types.
  - `subscriptions.includedSources.hiTypes` (string[], required): Types of health information document.
  - `subscriptions.includedSources.purpose` (object, required)
  - `subscriptions.includedSources.purpose.text` (string, required) One of: Care Management, Break the Glass, Public Health, Healthcare Payment, Disease Specific Healthcare Research, Self Requested.
  - `subscriptions.includedSources.purpose.code` (string, required) One of: CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQT.
  - `subscriptions.includedSources.purpose.refUri` (string, required): The reference URL. Allows alpha numeric character and special characters like "^[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$"
  - `subscriptions.includedSources.hip` (object, required): Identifier and name of the health information provider.
  - `subscriptions.includedSources.hip.id` (string, required): The service ID of the health information provider. Must be Alpha numeric and _ or - in middle
  - `subscriptions.includedSources.hip.name` (string, required): The name of the health information provider. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.includedSources.hip.type` (string): The type of the health information provider. Allows alphanumeric characters and special characters like _\-@,. ":
  - `subscriptions.includedSources.categories` (string[], required)
  - `subscriptions.includedSources.period` (object, required): The date range between when the subscription will be active
  - `subscriptions.includedSources.period.from` (string, required): UTC date time in ISO format
  - `subscriptions.includedSources.period.to` (string, required): UTC date time in ISO format
  - `subscriptions.includedSources.status` (string): The status of the subscription approval
  - `autoApprovals` (object[])
  - `autoApprovals.id` (number)
  - `autoApprovals.autoApprovalId` (string)
  - `autoApprovals.hiuId` (string): Identifier of the health information user that raised the request.
  - `autoApprovals.patientId` (string)
  - `autoApprovals.isActive` (boolean)
  - `autoApprovals.dateCreated` (string)
  - `autoApprovals.dateModified` (string)
  - `autoApprovals.policy` (object)
  - `autoApprovals.policy.isApplicableForAllHIPs` (boolean, required)
  - `autoApprovals.policy.hiu` (object, required)
  - `autoApprovals.policy.hiu.id` (string, required): The service ID of the health information user. Must be Alpha numeric and _ or - in middle
  - `autoApprovals.policy.hiu.name` (string): The name of the health information user. Allows alphanumeric characters and special characters like _\-@,. ":
  - `autoApprovals.policy.hiu.type` (string): The type of the health information user. Allows alphanumeric characters and special characters like _\-@,. ":
  - `autoApprovals.policy.includedSources` (object[], required): Included sources, carrying the list of hi types.
  - `autoApprovals.policy.includedSources.hiTypes` (string[], required): Types of health information document.
  - `autoApprovals.policy.includedSources.purpose` (object, required)
  - `autoApprovals.policy.includedSources.hip` (object, required): Identifier and name of the health information provider.
  - `autoApprovals.policy.includedSources.categories` (string[], required)
  - `autoApprovals.policy.includedSources.period` (object, required): The date range between when the subscription will be active
  - `autoApprovals.policy.includedSources.status` (string): The status of the subscription approval
  - `autoApprovals.policy.excludedSources` (object[], required): Excluded sources, carrying the list of hi types.
  - `autoApprovals.policy.excludedSources.hiTypes` (string[], required): Types of health information document.
  - `autoApprovals.policy.excludedSources.purpose` (object, required)
  - `autoApprovals.policy.excludedSources.hip` (object, required): Identifier and name of the health information provider.
  - `autoApprovals.policy.excludedSources.categories` (string[], required)
  - `autoApprovals.policy.excludedSources.period` (object, required): The date range between when the subscription will be active
  - `autoApprovals.policy.excludedSources.status` (string): The status of the subscription approval
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
- `503`: Service Unavailable
  - `code` (string, required): ABDM-1024 - Dependent service unavailable. May be returned either bare (`ABDM-1024`) or with a trailing ": " separator (`ABDM-1024: `); match on the code itself and tolerate the separator.
  - `message` (string, required)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "lockerId": "1234",
  "lockerName": "Locker 1",
  "active": true,
  "dateCreated": "2021-09-28T12:30:08.573Z",
  "subscriptions": [
    {
      "subscriptionId": "f29f0e59-8388-4698-9fe6-05db67aeac46",
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "https://abc.def.in"
      },
      "status": "GRANTED",
      "dateCreated": "2021-09-28T12:30:08.573Z",
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
          "hiTypes": [
            "Prescription"
          ],
          "purpose": {
            "text": "Care Management",
            "code": "CAREMGT",
            "refUri": "https://abc.def.in"
          },
          "hip": {
            "id": "INDIA_HIP",
            "name": "INDIA HIP",
            "type": "HIP"
          },
          "categories": [
            "LINK"
          ],
          "period": {
            "from": "2024-05-09T10:34:00.389Z",
            "to": "2024-05-09T10:34:00.389Z"
          },
          "status": "SUCCESS"
        }
      ]
    }
  ],
  "autoApprovals": [
    {
      "id": 1234,
      "autoApprovalId": "e5ec415f-c098-40f6-a0db-faa162fc5295",
      "hiuId": "India_HIU",
      "patientId": "<ABHA_ADDRESS>",
      "isActive": false,
      "dateCreated": "2021-09-28T12:30:08.573Z",
      "dateModified": "2021-09-28T12:30:08.573Z",
      "policy": {
        "isApplicableForAllHIPs": true,
        "hiu": {
          "id": "INDIA_HIU",
          "name": "INDIA HIU",
          "type": "HIU"
        },
        "includedSources": [
          {
            "hiTypes": [],
            "categories": [],
            "status": "SUCCESS"
          }
        ],
        "excludedSources": [
          {
            "hiTypes": [],
            "categories": [],
            "status": "SUCCESS"
          }
        ]
      }
    }
  ]
}
```
