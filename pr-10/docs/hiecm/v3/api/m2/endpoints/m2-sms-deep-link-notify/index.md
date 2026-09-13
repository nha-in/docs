# Send an SMS with a deep link to the ABHA App

`POST /hiecm/hip/v3/link/patient/links/sms/notify2`

Also known as: SMS Deep Link Notify.
Requests ABDM to send an SMS to a patient's mobile number containing a deep link
to download/open the ABHA App. Used when a patient is not yet on ABDM and the HIP
wants to invite them to link their health records.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/patient/links/sms/notify2 \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "notification": {
    "phoneNo": "917812345678",
    "hip": {
      "name": "S Y Hospital",
      "id": "HIP_SERVICE_ID"
    }
  }
}'
```
