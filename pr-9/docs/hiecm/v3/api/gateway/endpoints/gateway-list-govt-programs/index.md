# List government programs

`GET /api/hiecm/gateway/v3/govt-programs`

List government programs registered with the gateway. The response
items share the same shape, field for field, as the provider-by-id
response. That shape has not been observed against the sandbox.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/govt-programs \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>'
```
