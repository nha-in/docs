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

- `ownershipCode` (string): Ownership of the facility to be searched. Accepted codes are "G", "P" or "PP". Required if facilityId not present.
- `subDistrictLGDCode` (string): Sub district of the facility. Sub District LGD Code. See `GET /v1.5/facility/lgd/subdistricts`.
- `pincode` (string): Pin code of the facility. 6-digit number.
- `facilityName` (string): Name of the facility being searched. This value can be either full or partial name. Accepted characters: Alphanumeric, -_.(),/. The first character must be an alphabet or digit, and only one space is allowed between words. Required if facilityId not present.
- `facilityId` (string): 12-character Facility Id allotted to each facility at the time of submission. Should start with 'IN' and have the length of 12 characters. Required if ownershipCode, stateLGDCode and facilityName not present.
- `page` (integer, required): The page number of which results need to be seen. Numeric value. Minimum value to be passed is 1.
- `resultsPerPage` (integer, required): Number of facilities what will come in one page. Numeric value. Minimum value to be passed is 10.
- `stateLGDCode` (string): State of the facility. State LGD code. See `GET /v1.5/facility/lgd/states`. Required if facilityId not present.
- `districtLGDCode` (string): District of the facility. District LGD Code. See `GET /v1.5/facility/lgd/districts`.

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
