# Search Facilities Within Radius

`POST /health/service/facility/geo-location/search-within-radius`

The same facility-radius search as
`phr_services_search_facilities_within_radius` in this file. Request
and response are identical. NHA's Postman collection recorded this
as a separate request against a second route, without the `/api`
prefix the other route carries, so it is kept here as a separate
operation rather than merged away.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/health/service/facility/geo-location/search-within-radius \
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
