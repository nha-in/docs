# Schedule-push-notification - internal

`POST /api/notification/schedule-push-notification`

Schedules a push notification to a person for a given time, for example a medication reminder.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/notification/schedule-push-notification \
  --header 'Content-Type: application/json' \
  --data '{
  "patient_id": "<PATIENT_ID>",
  "push_notification_data": {
    "healthId": "<ABHA_ADDRESS>",
    "target": "TELECONSULTATION",
    "title": "Doctor Consultation",
    "body": "You have a doctor booking for Dr Nithish at 09.00 am today.",
    "timestamp": "2026-04-15T12:30:45.123Z",
    "params": {
      "orderId": "001"
    }
  },
  "timestamp_to_push": "2026-04-15T18:30:00",
  "medical_remainder_id": "01"
}'
```
