# Receive the other side's transfer status

`POST /api/v3/patient-record/on-notify`

**Hosted by the PHR application and by the HIU, not by ABDM.** The HIE-CM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.

This is a callback API for the PHR application and the HIU. This API is used to receive the status of the health record transfer process: the HIU receives what the PHR app sent to notify, and the PHR app receives what the HIU sent.

```bash
curl --request POST \
  --url {bridgeUrl}/api/v3/patient-record/on-notify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'request-id: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'timestamp: 2022-10-06T15:10:00.587Z' \
  --header 'x-hiu-id: HIU_ID' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "transactionId": "103a6265-8d5d-411b-9a9d-b460b5f00e4e",
    "doneAt": "2026-03-19T08:01:11.090Z",
    "statusNotification": {
      "sessionStatus": "TRANSFERRED",
      "statusResponses": [
        {
          "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b4",
          "hiStatus": "DELIVERED",
          "description": "Data sent successfully"
        }
      ]
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `request-id` (string, required): Random UUID, a v4 style guid, unique per callback.
- `timestamp` (string, required): ISO 8601 timestamp of when the callback was sent.
- `x-hiu-id` (string, required): Identifier of the health information user to which the request was intended.

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

- `202`: Accepted.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
