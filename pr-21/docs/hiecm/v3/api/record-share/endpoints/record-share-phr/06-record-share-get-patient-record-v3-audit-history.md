# List the record sharing history of the signed in user

`GET /api/hiecm/patient-record/v3/audit-history`

Retrieve the complete history of record-sharing transactions for a specific user. It provides details of all past and ongoing transactions, including associated care-contexts. The user is the one the X-AUTH-TOKEN was issued to. Filter by date with startDate and endDate, and page with limit and offset.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/audit-history \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <USER_TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `REQUEST-ID` (string, required): Random UUID, a v4 style guid, unique per request.
- `TIMESTAMP` (string, required): ISO 8601 timestamp of when the request was initiated.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended. sbx in the sandbox, abdm in production.
- `X-AUTH-TOKEN` (string, required): JWT access token issued by the PHR service after successful user authentication. If the HIP does not have any role, then it is mandatory.

## Query parameters

- `limit` (integer): The number of records to return.
- `startDate` (string): Start date of the records, ISO 8601.
- `endDate` (string): End date of the records, ISO 8601.
- `offset` (integer): Where to start. When the offset is 0, retrieval starts from the very first record in the dataset.

## Responses

- `200`: The sharing transactions of the user, newest first.

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "requestId": "ed9f451d-9e07-484d-ab68-9972d6529d68",
    "abhaAddress": "manishk1991@sbx",
    "senderFacilityId": "MANISH_PHR_TEST",
    "senderFacilityName": "MANISH-PHR-TEST",
    "receiverFacilityId": "MANISH_HIU",
    "receiverFacilityName": "MANISH_HIU",
    "counterCode": "f4cd0d8e-25ec-465f-993c-01c91a56e0e4",
    "transactionId": "f413b202-16b6-4d4a-9900-5cdcfb8baa50",
    "status": "RECORD_SHARE_REQUESTED",
    "sharedRecordCount": 2,
    "consent": {
      "accessMode": "VIEW",
      "dataEraseAt": "2026-10-12T08:58:09.738Z",
      "careContexts": [
        {
          "patientReference": "manikandanb87@sbx",
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b4"
        },
        {
          "patientReference": "manikandanb87@sbx",
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b5"
        }
      ]
    },
    "dateCreated": "2025-12-08T12:04:53.594Z",
    "dateModified": "2025-12-08T12:04:53.594Z"
  }
]
```
