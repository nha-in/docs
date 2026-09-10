# Post - add App Notification Token

`POST /notification/app-notification-token`

Registers a device token for push notifications, with the operating system it belongs to.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/notification/app-notification-token \
  --header 'Content-Type: application/json' \
  --data '{
  "healthId": "<ABHA_ADDRESS>",
  "appToken": "<APPTOKEN>",
  "osType": "android"
}'
```
