# Acknowledgement of a health information request

`POST /api/v3/hiu/health-information/on-request`

Carries the transaction id, the request id and the current status. This is an acknowledgement, not the records. The records arrive at the data push URL you supplied.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hiu/health-information/on-request \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "8376a2b0-3fc9-4bb5-8af5-54a49a3910f4",
    "sessionStatus": "REQUESTED"
  },
  "error": null,
  "response": {
    "requestId": "e492d2b5-5f0a-4406-8a5d-5b4351e2ff2c"
  }
}'
```
