# A request for the records a consent covers

`POST /api/v3/hip/health-information/request`

Inbound to the HIP, carrying the consent id, the date range, the data push URL and the encryption parameters. You have 20 minutes from this request to the data push.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hip/health-information/request
```
