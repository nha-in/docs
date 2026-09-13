# Health Information Request Status

`GET /hiecm/data-flow/v3/health-information/request/status/{transaction-id}`

Polls the current status of a previously made health information request, by
transaction id. An alternative to waiting for the `on-request` and data flow
notify callbacks: useful if a callback was missed, or if the integration
prefers to poll rather than depend on inbound delivery.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request/status/{transaction-id} \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>'
```
