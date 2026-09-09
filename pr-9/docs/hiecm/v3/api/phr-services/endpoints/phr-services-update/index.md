# Update

`PUT /health/service/bookmark/update/{id}`

Updates the title or address of a saved place bookmark.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/health/service/bookmark/update/{id} \
  --header 'Content-Type: application/json' \
  --data '{
  "title": "Happy Family",
  "address": "<ADDRESS>"
}'
```
