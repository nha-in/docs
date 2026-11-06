# Get all specialities by system of medicine code

`POST /v1.5/facility/get-specialities`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/get-specialities \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "systemOfMedicineCode": "<SYSTEM_OF_MEDICINE_CODE>"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `systemOfMedicineCode` (string, required): System of MedicineCode, as available in HFR, for which you want to know the specializations offered. Accepted codes as specified in get-master-data API with type="MEDICINE". See `GET /v1.5/facility/get-master-data`.

## Responses

- `200`: OK
- `404`: Not Found

Example 200 response. The values are placeholders:

```json
{
  "type": "SPECIALITIES",
  "data": [
    {
      "code": "D-S44",
      "value": "OralMedicine and Radiology"
    },
    {
      "code": "D-S46",
      "value": "Oral& Maxillofacial Surgery"
    },
    "... 1 more of the same shape"
  ]
}
```
