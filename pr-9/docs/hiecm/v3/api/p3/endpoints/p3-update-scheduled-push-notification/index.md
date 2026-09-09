# Update-scheduled push notification

`PUT /api/notification/schedule-push-notification`

Changes the delivery time of a scheduled push notification.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/api/notification/schedule-push-notification \
  --header 'Content-Type: application/json' \
  --data '{
  "patient_id": "<PATIENT_ID>",
  "id": 42,
  "timestamp_to_push": "2025-08-25 15:00:00",
  "medical_remainder_id": "MED-NEW-001"
}'
```
