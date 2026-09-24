# Get facility within radius with filter

`POST /FacilityManagement/v1.5/facility/bygeoLocation/searchWithinRadiusWithFilter`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/FacilityManagement/v1.5/facility/bygeoLocation/searchWithinRadiusWithFilter \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "centerLat": "<CENTER_LAT>",
  "centerLon": "<CENTER_LON>",
  "radiusInKm": "<RADIUS_IN_KM>",
  "speciality": "<SPECIALITY>",
  "facilityOwnership": "<FACILITY_OWNERSHIP>",
  "abdmSoftware": "<ABDM_SOFTWARE>",
  "hospitalSpecialityType": "<HOSPITAL_SPECIALITY_TYPE>",
  "facilityName": "<FACILITY_NAME>",
  "facilityStatus": "<FACILITY_STATUS>",
  "som": "<SOM>",
  "gender": "<GENDER>",
  "doctorName": "<DOCTOR_NAME>",
  "doctorSystemOfMedicine": "<DOCTOR_SYSTEM_OF_MEDICINE>",
  "languages": "<LANGUAGES>",
  "isIcuBedsAvailable": "<IS_ICU_BEDS_AVAILABLE>",
  "size": "<SIZE>",
  "from": "<FROM>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `centerLat` (string)
- `centerLon` (string)
- `radiusInKm` (string)
- `speciality` (string)
- `facilityOwnership` (string)
- `abdmSoftware` (string)
- `hospitalSpecialityType` (string)
- `facilityName` (string)
- `facilityStatus` (string)
- `som` (string)
- `gender` (string)
- `doctorName` (string)
- `doctorSystemOfMedicine` (string)
- `languages` (string)
- `isIcuBedsAvailable` (string)
- `size` (string)
- `from` (string)

## Responses

- `200`: OK
  - `searchCountTotal` (integer)
  - `recordList` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "searchCountTotal": 0,
  "recordList": [
    "<RECORD_LIST>"
  ]
}
```
