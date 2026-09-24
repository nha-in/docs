# Search facility 1

`POST /FacilityManagement/v1.5/facility/search`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/FacilityManagement/v1.5/facility/search \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "ownershipCode": "P",
  "subDistrictLGDCode": "",
  "pincode": "",
  "facilityName": "hospital",
  "facilityId": "",
  "page": 1,
  "resultsPerPage": 10,
  "stateLGDCode": "27",
  "districtLGDCode": ""
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `ownershipCode` (string)
- `subDistrictLGDCode` (string)
- `pincode` (string)
- `facilityName` (string)
- `facilityId` (string)
- `page` (integer)
- `resultsPerPage` (integer)
- `stateLGDCode` (string)
- `districtLGDCode` (string)

## Responses

- `200`: OK
  - `facilities` (object[])
  - `message` (string)
  - `totalFacilities` (integer)
  - `numberOfPages` (integer)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "facilities": [
    "<FACILITIES>"
  ],
  "message": "<MESSAGE>",
  "totalFacilities": 0,
  "numberOfPages": 0
}
```
