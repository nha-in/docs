# Benefit search by xmlUid

`POST /abha/api/v3/profile/benefit/search`

Lists the benefit programmes linked to an Aadhaar xmlUid. `loginId` is the RSA-encrypted xmlUid.

**Endpoint:** `POST /abha/api/v3/profile/benefit/search`

**Flow:** **Benefit - Search** - independent API; call the one that fits your identifier / modality.

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |
| BENEFIT_NAME | yes | Benefit / programme name approved by NHA for the integrator. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["search"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"xmlUid"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search"
  ],
  "loginHint": "xmlUid",
  "loginId": "{{encrypted xmlUid}}"
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `BENEFIT_NAME` (string, required): Benefit / program name approved by NHA for the integrator.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: xmlUid.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.

## Responses

- `200`: Success: Benefit Search via xmlUid; Benefit found (Postman)
- `400`: Bad Request (request validation failed): Invalid Scope; Invalid Login Hint; Invalid LoginId; Invalid Benefit Name
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: User Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "benefitName": "healthid api",
    "abhaNumber": "<ABHA_NUMBER>",
    "status": 1
  }
]
```
