# Get filtered address post

`POST /search/address/filter/deduplicate`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/search/address/filter/deduplicate \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Jethana",
  "address": "<ADDRESS>",
  "district": "511",
  "subDistrict": "5271",
  "village": "",
  "geolocation": "",
  "facilityId": "69765"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string, required)

## Body

- `name` (string, required): Name of the facility. Accepted characters: Alphanumeric, with only one space is allowed between words.
- `address` (string): Address of the facility. Accepted characters: Alphanumeric with -_.(),/ and only one space is allowed between words.
- `district` (string, required): District of the facility. District LGD Code. See `GET /v1.5/facility/lgd/districts`.
- `subDistrict` (string, required): Sub District of the facility. Sub District LGD Code. See `GET /v1.5/facility/lgd/subdistricts`.
- `village` (string): Village of the facility. Village LGD Code. Please visit https://lgdirectory.gov.in/ for more information.
- `geolocation` (string): Geolocation coordinates of the facility. Latitude - Real Number ranging from - 90.000000 to +90.000000 with 1-6 decimal places Longitude - Real Number ranging from -180.000000 to +180.000000 with 1-6 decimal places.
- `facilityId` (string): Unique Id of the facility. 6-digit numeric value (fac unique id).

## Responses

- `200`: OK
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
[
  {
    "facility_name": "<FACILITY_NAME>",
    "alternate_id": "<ALTERNATE_ID>",
    "sub_district": "<SUB_DISTRICT>",
    "district": "<DISTRICT>",
    "state": "<STATE>",
    "distances": "<DISTANCES>"
  }
]
```
