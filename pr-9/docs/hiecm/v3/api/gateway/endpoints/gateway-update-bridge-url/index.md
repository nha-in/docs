# Update HIP/HIU Bridge Callback URL

`PATCH /api/hiecm/gateway/v3/bridge/url`

Register the HIP/HIU callback URL with the ABDM Gateway.
All gateway push notifications (e.g. patient-share) are delivered to this URL.

```bash
curl --request PATCH \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge/url \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "url": "<URL>"
}'
```
