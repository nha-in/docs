# Search Facilities Within Radius

`POST /api/health/service/facility/geo-location/search-within-radius`

Finds health facilities within a radius of a point, filtered by ownership, speciality and facility type, with paging.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/health/service/facility/geo-location/search-within-radius \
  --header 'Content-Type: application/json' \
  --data '{
  "abdmSoftware": "0",
  "centerLat": "11.9601971",
  "centerLon": "79.812865",
  "facilityOwnership": "",
  "hospitalSpecialityType": "",
  "radiusInKm": "50",
  "from": "0",
  "size": "100",
  "speciality": ""
}'
```
