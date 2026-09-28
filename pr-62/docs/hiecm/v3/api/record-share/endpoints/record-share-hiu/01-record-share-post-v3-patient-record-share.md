# Receive a patient's share request, as the HIU

`POST /api/v3/patient-record/share`

**Hosted by the HIU, not by ABDM.** The HIE-CM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.

This is a callback API for the HIU. The HIE-CM provides the record share request the PHR app raised: the patient's profile, the number of records and the care contexts to share, and a transactionId for the transfer. Reply by calling POST /api/hiecm/patient-record/v3/on-share with the data push URL and the encryption key, carrying this transactionId and this request's REQUEST-ID.

```bash
curl --request POST \
  --url {bridgeUrl}/api/v3/patient-record/share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'request-id: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'timestamp: 2022-10-06T15:10:00.587Z' \
  --header 'x-hiu-id: HIU_ID' \
  --header 'Content-Type: application/json' \
  --data '{
  "metaData": {
    "hiuId": "MANISH_HIU",
    "counterId": "cf554160-1db7-453e-9d7a-3793ae2f50e0"
  },
  "transactionId": "56582bc6-5c17-4b32-9244-9b61d47a8059",
  "profile": {
    "patient": {
      "abhaNumber": null,
      "abhaAddress": "abhaAddress@sbx",
      "name": "Nitesh",
      "gender": "M",
      "dayOfBirth": "18",
      "monthOfBirth": "10",
      "yearOfBirth": "1912",
      "address": {
        "line": "Rohini Delhi",
        "district": "Delhi",
        "state": "Delhi",
        "pincode": "110042"
      },
      "phoneNumber": "989141XXXX"
    }
  },
  "sharedRecordCount": 2,
  "consent": {
    "careContexts": [
      {
        "patientReference": "manikandanb87@sbx",
        "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b4"
      },
      {
        "patientReference": "manikandanb87@sbx",
        "careContextReference": "COC497647c1-0627-48fa-8131-0dddc1b3e0b5"
      }
    ],
    "permission": {
      "accessMode": "VIEW"
    },
    "dataEraseAt": "2026-10-12T08:58:09.738Z"
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

- `metaData` (object, required): The HIU and the counter the QR code named.
- `metaData.hiuId` (string, required): The HIU's identifier, read from the QR code.
- `metaData.counterId` (string, required): The counter at the HIU, read from the QR code.
- `transactionId` (string, required): The transfer's identifier, assigned by the HIE-CM. Carry it in on-share and in notify.
- `profile` (object, required): The essential patient details, including ABHA number, ABHA address and the patient's contact address, used for initiating the record share process.
- `profile.patient` (object, required)
- `profile.patient.abhaNumber` (string,null): The 14 digit ABHA number, or null when the patient has an address only.
- `profile.patient.abhaAddress` (string, required): The patient's ABHA address.
- `profile.patient.name` (string, required)
- `profile.patient.gender` (string, required): M, F or O.
- `profile.patient.dayOfBirth` (string)
- `profile.patient.monthOfBirth` (string)
- `profile.patient.yearOfBirth` (string, required)
- `profile.patient.address` (object, required)
- `profile.patient.address.line` (string)
- `profile.patient.address.district` (string)
- `profile.patient.address.state` (string)
- `profile.patient.address.pincode` (string)
- `profile.patient.phoneNumber` (string, required)
- `sharedRecordCount` (integer, required): Number of records that are to be shared to the HIU.
- `consent` (object, required): The care contexts to share, the permission specifying how the records can be accessed, and the dataEraseAt date until which the data remains accessible.
- `consent.careContexts` (object[], required)
- `consent.careContexts.patientReference` (string, required): The patient reference the care context was linked under.
- `consent.careContexts.careContextReference` (string, required)
- `consent.permission` (object, required)
- `consent.permission.accessMode` (string, required): How the HIU may use the records. One of: VIEW.
- `consent.dataEraseAt` (string, required): Until when the data remains accessible to the HIU.

## Responses

- `202`: Accepted. Answer with the on-share call.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
