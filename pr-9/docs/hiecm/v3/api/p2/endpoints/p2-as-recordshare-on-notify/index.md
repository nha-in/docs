# AS - RecordShare on-notify

`POST /scan-share/record-share/on-notify`

Callback the gateway sends to notify the PHR that a record share has been acted on.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/scan-share/record-share/on-notify \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "transactionId": "<TXN_ID>",
    "doneAt": "2026-06-24T06:35:44.167Z",
    "statusNotification": {
      "sessionStatus": "TRANSFERRED",
      "statusResponses": [
        {
          "careContextReference": "74538",
          "hiStatus": "DELIVERED",
          "description": "Data received successfully"
        }
      ]
    }
  }
}'
```
