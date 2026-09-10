# Single/Multiple Notification read

`POST /api/notification/app-push-notification/all`

Marks one or more push notifications as read.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/notification/app-push-notification/all \
  --header 'Content-Type: application/json' \
  --data '[
  {
    "id": 515459874,
    "patientId": "<PATIENT_ID>",
    "pushNotificationData": {
      "healthId": "<ABHA_ADDRESS>",
      "target": "in.projecteka.jataayu.consent.ui.activity.ConsentDetailsActivity",
      "title": "Dr. ManishTEST_HIU",
      "body": "Wants to access your records\nPurpose : Care Management",
      "timestamp": 1743788382266,
      "params": {
        "consentRequestId": "<TXN_ID>"
      }
    },
    "dateCreated": "2025-04-04T17:39:42.268Z",
    "dateModified": "2025-04-04T17:39:42.270Z",
    "isNotificationRead": false,
    "unreadCount": 3
  }
]'
```
