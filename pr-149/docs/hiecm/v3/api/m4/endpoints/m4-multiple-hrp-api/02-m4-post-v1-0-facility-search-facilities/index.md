# Search facility

`POST /v1.0/facility/search-facilities`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.0/facility/search-facilities \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestId": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11",
  "timestamp": "<TIMESTAMP>",
  "facility": {
    "facilityName": "<FACILITY_NAME>",
    "systemOfMedicine": "<SYSTEM_OF_MEDICINE>",
    "facilityType": "<FACILITY_TYPE>",
    "state": "<STATE>",
    "district": "<DISTRICT>",
    "photo": "<PHOTO>",
    "ownership": "<OWNERSHIP>"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `requestId` (string)
- `timestamp` (string)
- `facility` (object)
- `facility.facilityName` (string)
- `facility.systemOfMedicine` (string)
- `facility.facilityType` (string)
- `facility.state` (string)
- `facility.district` (string)
- `facility.photo` (string)
- `facility.ownership` (string)

## Responses

- `200`: OK
  - `referenceNumber` (string)
  - `facilities` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "referenceNumber": "<REFERENCE_NUMBER>",
  "facilities": [
    "<FACILITIES>"
  ]
}
```
