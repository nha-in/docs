# Notify the gateway that a data transfer finished

`POST /hiecm/data-flow/v3/health-information/notify`

Also known as: HIP Data Flow Notification.
After successfully pushing all encrypted FHIR health data to the HIU's `dataPushUrl`,
the HIP calls this endpoint to notify the ABDM Gateway that the data transfer session
is complete. The Gateway relays this status to the HIU.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/notify \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "consentId": "consent-art-uuid-001",
    "transactionId": "txn-uuid-data-001",
    "doneAt": "2024-01-15T10:30:00.000Z",
    "notifier": {
      "type": "HIP",
      "id": "HIP_SERVICE_ID"
    },
    "statusNotification": {
      "sessionStatus": "TRANSFERRED",
      "hipId": "HIP_SERVICE_ID",
      "statusResponses": [
        {
          "careContextReference": "VISIT-2024-001",
          "hiStatus": "OK",
          "description": "Successfully transferred"
        }
      ]
    }
  }
}'
```
