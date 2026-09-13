# PHR - Save Care Context Bundle URL

`POST /api/care-context-link/phr/care-context/bundle-url`

Records where the FHIR bundle for a care context was stored, with its fetch status.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/phr/care-context/bundle-url \
  --header 'Content-Type: application/json' \
  --data '{
  "careContextLinkId": 12345,
  "bundleUrl": "https://example.com/bundle/url",
  "status": "RECEIVED"
}'
```
