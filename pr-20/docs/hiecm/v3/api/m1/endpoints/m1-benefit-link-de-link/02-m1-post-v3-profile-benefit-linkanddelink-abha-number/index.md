# Link / De-link benefit using ABHA number

`POST /abha/api/v3/profile/benefit/linkAndDelink`

Links (`scope: ["link"]`) or de-links (`scope: ["de-link"]`) the benefit named in the `BENEFIT_NAME` header for an ABHA number. `loginId` is the RSA-encrypted ABHA number.

**Endpoint:** `POST /abha/api/v3/profile/benefit/linkAndDelink`

**Flow:** **Benefit - Link / De-link** - independent API; call the one that fits your identifier / modality.

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |
| BENEFIT_NAME | yes | Benefit / programme name approved by NHA for the integrator. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["link"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"abha-number"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/linkAndDelink \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "link"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}"
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
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: abha-number.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.

## Responses

- `200`: Success: Linked successfully; Linked successfully (2); Linked successfully (Postman); De-linked successfully
- `400`: Bad Request (request validation failed): Already de-linked (spec); Already linked; Already de-linked; Invalid Login ID
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid access token; Invalid Benefit Name - Link; Invalid Benefit Name - De-link; Insurance Restricted - Link; Insurance Restricted - De-link
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "benefitName": "COVIN",
  "healthId": "<ABHA_NUMBER>",
  "status": "Benefit record has been linked successfully"
}
```
