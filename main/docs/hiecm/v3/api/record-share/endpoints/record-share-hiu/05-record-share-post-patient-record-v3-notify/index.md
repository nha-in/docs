# Notify patient record

`POST /api/hiecm/patient-record/v3/notify`

Update the status of the health record transfer process. It is invoked by the PHR application and HIU to notify the HIE-CM about the completion status of the transaction and the individual care-contexts. Each care-context's transfer status is included to provide a detailed update on which records were successfully shared and received.

The PHR app or health locker, on the transfer of data, sends sessionStatus as one of TRANSFERRED, PARTIAL_TRANSFERRED or FAILED, and an hiStatus for each careContextReference as one of DELIVERED or ERRORED.

The HIU, on receipt of data, sends sessionStatus as one of RECEIVED, PARTIAL_RECEIVED or FAILED, for example FAILED when data was not received or invalid data was received, and an hiStatus for each careContextReference as one of VALID, CORRUPTED, BLANK or ERRORED.

Send the notification once, after the data transfer has completed. The HIE-CM forwards it to the other side's /api/v3/patient-record/on-notify callback.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "transactionId": "3acbbb52-6de0-441f-b452-3c9488462b25",
    "doneAt": "2023-01-24T06:35:44.167Z",
    "statusNotification": {
      "sessionStatus": "RECEIVED",
      "statusResponses": [
        {
          "careContextReference": "10004-20200001768-1",
          "hiStatus": "VALID",
          "description": "Data received successfully"
        },
        {
          "careContextReference": "10004-20200001768-2",
          "hiStatus": "ERRORED",
          "description": "Data could not be decrypted"
        }
      ]
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `REQUEST-ID` (string, required): Random UUID, a v4 style guid, unique per request.
- `TIMESTAMP` (string, required): ISO 8601 timestamp of when the request was initiated.
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended. sbx in the sandbox, abdm in production.

## Body

- `notification` (object, required): The transaction id, the session status and each care context's transfer status.
- `notification.transactionId` (string, required)
- `notification.doneAt` (string, required): When the transfer completed.
- `notification.statusNotification` (object, required)
- `notification.statusNotification.sessionStatus` (string, required): TRANSFERRED, PARTIAL_TRANSFERRED or FAILED from the PHR app or health locker; RECEIVED, PARTIAL_RECEIVED or FAILED from the HIU. One of: TRANSFERRED, PARTIAL_TRANSFERRED, RECEIVED, PARTIAL_RECEIVED, FAILED.
- `notification.statusNotification.statusResponses` (object[], required)
- `notification.statusNotification.statusResponses.careContextReference` (string, required)
- `notification.statusNotification.statusResponses.hiStatus` (string, required): DELIVERED or ERRORED from the PHR app or health locker; VALID, CORRUPTED, BLANK or ERRORED from the HIU. One of: DELIVERED, ERRORED, VALID, CORRUPTED, BLANK.
- `notification.statusNotification.statusResponses.description` (string)

## Responses

- `202`: Accepted. The HIE-CM forwards the status to the other side's on-notify callback.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
