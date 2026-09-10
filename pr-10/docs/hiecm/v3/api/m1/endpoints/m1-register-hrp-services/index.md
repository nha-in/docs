# Register / Update HIP-HIU Services (Facility Registry)

`POST /v1/bridges/MutipleHRPAddUpdateServices`

Register or update HIP/HIU services in the Facility Registry.
Must be called after updating the bridge URL.
**Server:** `https://facilitysbx.abdm.gov.in`

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v1/bridges/MutipleHRPAddUpdateServices \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "facilityId": "IN0710000001",
  "facilityName": "City General Hospital",
  "HRP": [
    {
      "bridgeId": "your-client-id",
      "hipName": "City General Hospital",
      "hipId": "CityGeneralHospital_HIP",
      "hipType": "HOSPITAL",
      "facilityName": "City General Hospital"
    }
  ]
}'
```
