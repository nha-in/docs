# Find Bridge Service by Service ID

`GET /api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}`

Look up a specific registered HIP/HIU service by its service ID.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId} \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>'
```
