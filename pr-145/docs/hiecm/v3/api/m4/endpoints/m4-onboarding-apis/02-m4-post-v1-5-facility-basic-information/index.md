# Submit the v15Basic facility information

`POST /v1.5/facility/basic-information`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/basic-information \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'x-hprid-auth: <X_HPRID_AUTH>' \
  --header 'Content-Type: application/json' \
  --data '{
  "trackingId": "",
  "facilityInformation": {
    "facilityName": "Sahyadri Hospital",
    "facilityAddressDetails": {
      "country": "India",
      "stateLGDCode": "24",
      "districtLGDCode": "438",
      "subDistrictLGDCode": "6512",
      "facilityRegion": "U",
      "villageCityTownLGDCode": "",
      "addressLine1": "townhall, Pune",
      "addressLine2": "Pune",
      "pincode": "<PINCODE>",
      "latitude": "23.068570",
      "longitude": "23.068570"
    },
    "facilityContactInformation": {
      "facilityEmailId": "<ABHA_ADDRESS>.com",
      "facilityContactNumber": "976243xxxx",
      "websiteLink": "nha.abdm.gov.in",
      "facilityLandlineNumber": "",
      "facilityStdCode": ""
    },
    "ownershipCode": "G",
    "ownershipSubTypeCode": "C",
    "ownershipSubTypeCode2": "MOHF",
    "systemOfMedicineCode": "M,D,UN",
    "typeOfServiceCode": "IPD,OPD",
    "facilityTypeCode": "5",
    "specialityTypeCode": "SINGLE",
    "facilityUploads": {
      "facilityBoardPhoto": {
        "name": "",
        "value": ""
      },
      "facilityBuildingPhoto": {
        "name": "",
        "value": ""
      }
    },
    "facilitySubType": "47",
    "facilityOperationalStatus": "F",
    "timingsOfFacility": [
      {
        "workingDays": "MON",
        "openingHours": "9:00 AM - 6:00 PM"
      },
      {
        "workingDays": "TUE",
        "openingHours": "9:00 AM - 4:00 PM"
      },
      {
        "workingDays": "WED",
        "openingHours": "9:00 AM - 6:00 PM"
      }
    ],
    "abdmCompliantSoftware": [
      {
        "existingSoftwares": [
          ""
        ],
        "anyOther": ""
      }
    ]
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)
- `x-hprid-auth` (string, required): The HPR token of the signed-in professional, from the HPR login.

## Body

- `facilityInformation` (object)
- `facilityInformation.facilityName` (string, required): Name of the facility that is to be created in HFR. Accepted characters: Alphanumeric, _.(),/. The first character must be an alphabet or digit, and only one space is allowed between words.
- `facilityInformation.facilityAddressDetails` (object, required)
- `facilityInformation.facilityContactInformation` (object, required)
- `facilityInformation.ownershipCode` (string, required): Ownership of the facility. Accepted codes are "G", "P" or "PP".
- `facilityInformation.ownershipSubTypeCode` (string, required): Ownership subtype of the facility. ownershipCode = "G" Accepted codes are "C" or "S" ownershipCode = "P" or "PP" Accepted codes are "P" or "NP".
- `facilityInformation.ownershipSubTypeCode2` (string)
- `facilityInformation.typeOfServiceCode` (string): Type of services offered by facility. Accepted codes as specified in getmaster-data API with type='TYPE-SERVICE'. See `GET /v1.5/facility/get-master-data`. typeOfServiceCode is not required if facility type is any of the following ( 'Diagnostic Laboratory (10,45)', 'Imaging Center (74,75)', 'Cath Laboratory (12,47)', 'Dialysis Center (13,48)', 'Blood Bank (9,44)', 'Pharmacy (11,46)' ) If facility type is any of the following, ( 'Ayurveda Dispensary/ Clinic/ Polyclinic (OPD only) (17,52)', 'Unani Dispensary/ Clinic/ Polyclinic (OPD only) (20,55)', 'Siddha Dispensary/ Clinic/ Polyclinic (OPD only) (23,58)', 'Homeopathy Dispensary/ Clinic/ Polyclinic (OPD only) (26,61)', 'Sowa-Rigpa Dispensary/ Clinic/ Polyclinic (OPD only) (29,64)', ) then typeOfServiceCode – IPD is not applicable. Required based on the facility type provided.
- `facilityInformation.systemOfMedicineCode` (string, required): System of medicine followed by your facility. Accepted codes as specified in getmaster-data API with type= "MEDICINE". In case you have multiple systems of medicine, send a comma separated string of codes. See `GET /v1.5/facility/get-master-data`.
- `facilityInformation.facilityTypeCode` (string, required): Type of your facility as defined by HFR. Accepted codes as specified in fetchfacility-type API. See `POST /v1.5/facility/fetch-facility-type`.
- `facilityInformation.specialityTypeCode` (string, required): Whether facility offers Single or Multiple Specialities. Accepted codes as specified in getmaster-data API with type='SPECIALITY-TYPE'. See `GET /v1.5/facility/get-master-data`.
- `facilityInformation.facilityUploads` (object, required)
- `facilityInformation.facilityAddressProof` (object[])
- `facilityInformation.facilitySubType` (string, required): Subtype corresponding to facility type as define by HFR. Accepted codes as specified in fetchfacility-sub-type API. See `POST /v1.5/facility/fetch-facility-Sub-type`.
- `facilityInformation.workingInPsu` (boolean)
- `facilityInformation.facPsuName` (string)
- `facilityInformation.facilityOperationalStatus` (string, required): Whether your facility is currently operational or not. Accepted codes as specified in getmaster-data API with type='FACSTATUS'. See `GET /v1.5/facility/get-master-data`.
- `facilityInformation.timingsOfFacility` (object[]): Required if facility operational status is Functional.
- `facilityInformation.abdmCompliantSoftware` (object[])
- `trackingId` (string)

## Responses

- `200`: OK
  - `trackingId` (string)
  - `status` (string)
  - `message` (string)
  - `errorStatus` (object[])
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "trackingId": "<TRACKING_ID>",
  "status": "<STATUS>",
  "message": "<MESSAGE>",
  "errorStatus": []
}
```
