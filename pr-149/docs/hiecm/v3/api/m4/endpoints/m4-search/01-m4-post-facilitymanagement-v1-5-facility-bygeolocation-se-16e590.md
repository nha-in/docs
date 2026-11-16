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

- `centerLat` (string, required): Latitude of the center point. Real Number ranging from -90.000000 to +90.000000, with 1-6 decimal places.
- `centerLon` (string, required): Longitude of the center point. Real Number ranging from -180.000000 to +180.000000 with 1-6 decimal places.
- `radiusInKm` (string, required): Search radius. Numeric value (in kilometres).
- `speciality` (string): List of specialities for each system of medicine offered by the facility. Comma separated list of speciality names Accepted values of the specialities as specified in /v1.5/facility/get-specialities API as per the respective system of medicine. See `POST /v1.5/facility/get-specialities`.
- `facilityOwnership` (string): Ownership of the facility. Accepted codes are "G", "P" or "PP".
- `abdmSoftware` (string): Software identifier. Accepted value: 0 - non-ABDM enabled 1 - ABDM enabled).
- `hospitalSpecialityType` (string): Codes for hospital specialities. Comma separated facility type codes. Accepted cod specified in v1.5/facility/fetchfacilitytype API as per the respective Ownership and system of medicine. See `POST /v1.5/facility/fetch-facility-type`.
- `facilityName` (string): Name of the facility. Accepted characters: Alphanumeric, -_.(),/. The first character must be an alphabet or digit, and only one space is allowed between words.
- `facilityStatus` (string)
- `som` (string)
- `gender` (string)
- `doctorName` (string)
- `doctorSystemOfMedicine` (string)
- `languages` (string)
- `isIcuBedsAvailable` (string)
- `size` (string, required): Results per page. Numeric value. Minimum value to be passed is 1.
- `from` (string, required): Offset for pagination. Numeric value. Minimum value to be passed is 0.

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
