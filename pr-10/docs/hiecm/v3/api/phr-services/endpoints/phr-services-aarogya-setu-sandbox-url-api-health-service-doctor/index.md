# {{aarogya-setu-sandbox-url}}api/health/service/doctor/geo-location/search-within-radius

`POST /health/service/doctor/geo-location/search-within-radius`

Finds doctors within a radius of a point, filtered by name, speciality, facility ownership and type, with paging.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/health/service/doctor/geo-location/search-within-radius \
  --header 'Content-Type: application/json' \
  --data '{
  "abdmSoftware": "0",
  "centerLat": "18.<REDACTED_ID>",
  "centerLon": "73.<REDACTED_ID>",
  "facilityOwnership": "",
  "from": "0",
  "hospitalSpecialityType": "",
  "radiusInKm": "5000",
  "size": "100",
  "speciality": "",
  "doctorName": "",
  "gender": "",
  "doctorSystemOfMedicine": "M",
  "languages": ""
}'
```
