# Link patient links

`GET /api/hiecm/hip/v3/link/patient/links`

Retrieve all linked care contexts for a patient from various Health Information Providers (HIPs). By invoking this API, users can obtain a comprehensive list of care contexts associated with a patient’s ABHA (Ayushman Bharat Health Account) address. This functionality is essential for ensuring that all relevant health records are accessible and consolidated, thereby supporting coordinated and efficient patient care. The API facilitates seamless health information exchange, enhancing the overall quality and continuity of care within the healthcare ecosystem.

```bash
curl --request GET \
  --url "https://dev.abdm.gov.in/api/hiecm/hip/v3/link/patient/links?limit=<LIMIT>" \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: <X_AUTH_TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for track the end to end request transaction
- `TIMESTAMP` (string, required): Actual time of the request was initiated, ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended
- `X-AUTH-TOKEN` (string, required): JWT Authentication token which was issued by ABDM after successful validation of username and password

## Query parameters

- `limit` (integer, required): Limit the number of records returned. Send -1 to get all the links of the patient.

## Responses

- `200`: OK
  - `Patient` (object)
  - `Patient.id` (string, required)
  - `Patient.links` (object[], required)
  - `Patient.links.hip` (object): Identifier and name of the health information provider.
  - `Patient.links.hip.id` (string)
  - `Patient.links.hip.name` (string)
  - `Patient.links.hip.type` (string)
  - `Patient.links.referenceNumber` (string): Reference number used while linking the health records of the patient.
  - `Patient.links.display` (string): Displayed information about the care context.
  - `Patient.links.hiType` (string) One of: DiagnosticReport, DischargeSummary, HealthDocumentRecord, ImmunizationRecord, OPConsultation, Prescription, WellnessRecord, Invoice.
  - `Patient.links.careContexts` (object[]): List of care contexts linked at the HIP end for the identified patient.
  - `Patient.links.careContexts.referenceNumber` (string): Reference number used while linking the health records of the patient.
  - `Patient.links.careContexts.display` (string): Displayed information about the care context.
  - `Patient.links.dateCreated` (string)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1065 - Invalid X Auth token. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string): 900902 - Unauthorized. May be returned either bare or with a trailing ": " separator; match on the code itself and tolerate the separator.
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `404`: server cannot find the requested resource
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `error` (object): The error code and message, if any occurred.
  - `error.code` (string, required): ABDM-1001 - No data found. May be returned either bare (`ABDM-1001`) or with a trailing ": " separator (`ABDM-1001: `); match on the code itself and tolerate the separator.
  - `error.message` (string, required)
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
  - `code` (string): ABDM-9999 - Unknown exception. May be returned either bare (`ABDM-9999`) or with a trailing ": " separator (`ABDM-9999: `); match on the code itself and tolerate the separator.
  - `message` (string)

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "Patient": {
    "id": "<ABHA_ADDRESS>",
    "links": [
      {
        "hip": {
          "id": "ABDM_HIP",
          "name": "ABC Hospital",
          "type": "HIP"
        },
        "referenceNumber": "string",
        "display": "string",
        "hiType": "DiagnosticReport",
        "careContexts": [
          {
            "referenceNumber": "TMH-PUID-001",
            "display": "display 1"
          }
        ],
        "dateCreated": "2024-05-09T10:34:00.387Z"
      }
    ]
  }
}
```
