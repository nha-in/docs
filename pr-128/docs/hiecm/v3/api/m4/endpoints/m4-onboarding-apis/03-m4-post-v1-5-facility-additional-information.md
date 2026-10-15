# Submit the v15Facility additional information

`POST /v1.5/facility/additional-information`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/additional-information \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "trackingId": "80266",
  "linkedProgramIds": {
    "nhrrId": "1234",
    "nin": "1234",
    "abpmjayId": "1234",
    "rohiniId": "1234",
    "echsId": "1234",
    "cghsId": "1234",
    "ceaRegistration": "1234",
    "stateInsuranceSchemeId": "1234"
  },
  "generalInformation": {
    "hasDialysisCenter": "YALL",
    "hasPharmacy": "YALL",
    "hasBloodBank": "YALL",
    "hasCathLab": "YALL",
    "hasDiagnosticLab": "YALL",
    "hasImagingCenter": "YALL",
    "servicesByImagingCenter": [
      {
        "service": "S36",
        "count": 7
      },
      {
        "service": "S16",
        "count": 5
      },
      {
        "service": "S23",
        "count": 3
      }
    ]
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `trackingId` (string, required): Unique identification number for your facility. Tracking id generated from basic information API.
- `linkedProgramIds` (object)
- `linkedProgramIds.nhrrId` (string): National Health Resource Repository Unique ID. Should be a valid NHRR ID.
- `linkedProgramIds.nin` (string): National Identification Number. Should be a valid NIN id.
- `linkedProgramIds.abpmjayId` (string): Hospital Id as allotted by ABPMJAY Hospital Empanelment Module. Should be a valid AB-PMJAY Hospital Id.
- `linkedProgramIds.rohiniId` (string): Rohini Id. Should be a valid Rohini Id.
- `linkedProgramIds.echsId` (string): Unique id in Ex-Servicemen Contributory Health Scheme. Should be a valid ECHS Id.
- `linkedProgramIds.cghsId` (string): Unique Id in Central Government Health Scheme. Should be a valid CGHS Id.
- `linkedProgramIds.ceaRegistration` (string): CEA Registration Number. Should be a valid CEA registration number.
- `linkedProgramIds.stateInsuranceSchemeId` (string): State Insurance Scheme ID. Alphanumeric value.
- `generalInformation` (object)
- `generalInformation.hasDialysisCenter` (string): Value to identify if a facility has dialysis center. Accepted codes as specified in get-master-data API with type='GENERAL-INFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have dialysis center.
- `generalInformation.hasPharmacy` (string): Value to identify if a facility has pharmacy. Accepted codes as specified in get-master-data API with type='GENERAL-INFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have pharmacy.
- `generalInformation.hasBloodBank` (string): Value to identify if a facility has bloodbank. Accepted codes as specified in get-master-data API with type='GENERAL-INFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have bloodbank.
- `generalInformation.hasCathLab` (string): Value to identify if a facility has cath lab. Accepted codes as specified in get-master-data API with type='GENERAL-INFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have cath lab.
- `generalInformation.hasDiagnosticLab` (string): Value to identify if a facility has diagnostic center. Accepted codes as specified in get-master-data API with type='GENERAL-INFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have diagnostic center.
- `generalInformation.hasImagingCenter` (string): Value to identify if a facility has imaging center. Accepted codes as specified in get-master-data API with type='GENERALINFO-OPTIONS'. See `GET /v1.5/facility/get-master-data`. Required If facility have imaging centre.
- `generalInformation.servicesByImagingCenter` (object[]): Required if imaging center is present.

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
