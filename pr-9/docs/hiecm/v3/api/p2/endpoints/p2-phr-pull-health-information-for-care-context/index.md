# PHR - Pull Health Information for Care Context

`POST /api/care-context-link/phr/patient/health-information/pull`

Asks a HIP to send the records for one care context. The data arrives later through the transfer endpoint.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/phr/patient/health-information/pull \
  --header 'Content-Type: application/json' \
  --data '{
  "careContextReference": "care-context-ref-001",
  "hipId": "HIP001"
}'
```
