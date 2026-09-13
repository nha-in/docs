# Create

`POST /health/service/bookmark/create`

Saves a place as a bookmark for the signed-in ABHA address, with a title, address and coordinates.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/health/service/bookmark/create \
  --header 'Content-Type: application/json' \
  --data '{
  "title": "House_05",
  "address": "<ADDRESS>",
  "latitude": 40.7128,
  "longitude": -74.006
}'
```
