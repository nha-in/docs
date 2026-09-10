# Notify the gateway that data was received

`POST /hiecm/data-flow/v3/health-information/notify`

Also known as: HIU Data Flow Notification.
After receiving all FHIR health data at the `dataPushUrl`, the HIU calls this endpoint
to notify the ABDM Gateway that the data transfer session is complete.

The `statusNotification.sessionStatus` should be:
- `RECEIVED`, All data received successfully
- `FAILED`, Data receipt failed (with details in `statusResponses`)

The `notifier.type` must be `HIU` (contrast with M2 where the HIP sends the same
endpoint with `notifier.type: HIP`, and the value it sends is `TRANSFERRED` rather
than `RECEIVED`; the two milestones report the same event with different values
because they are the two ends of the same transfer).

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/notify \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "consentId": "consent-art-uuid-001",
    "transactionId": "txn-uuid-data-001",
    "doneAt": "2024-01-15T10:30:00.000Z",
    "notifier": {
      "type": "HIU",
      "id": "HIU_SERVICE_ID"
    },
    "statusNotification": {
      "sessionStatus": "RECEIVED",
      "hipId": "HIP_SERVICE_ID",
      "statusResponses": [
        {
          "careContextReference": "VISIT-2024-001",
          "hiStatus": "OK",
          "description": "Data received and decrypted successfully"
        },
        {
          "careContextReference": "LAB-2024-001",
          "hiStatus": "OK",
          "description": "Data received and decrypted successfully"
        }
      ]
    }
  }
}'
```
