# Share a patient's records with the HIU whose QR code was scanned

`POST /api/hiecm/patient-record/v3/share`

Is the first step in initiating the health data sharing process. It is invoked by an integrator application (such as any PHR application like ABHA) after scanning the HIU's QR code. The QR code provides the Health Information User (HIU) identifier, which is then used to share the user's profile details and care-context information with the HIE-CM.

The HIE-CM answers 202 Accepted and forwards the request to the HIU as a POST to /api/v3/patient-record/share on the HIU's bridge. The HIU's reply, with the data push URL and encryption key, arrives on the PHR app's /api/v3/patient-record/on-share callback.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'X-AUTH-TOKEN: Bearer <USER_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "metaData": {
    "hiuId": "MANISH_HIU",
    "counterId": "IN081010313"
  },
  "profile": {
    "patient": {
      "abhaNumber": null,
      "abhaAddress": "abhaAddress@sbx",
      "name": "String",
      "gender": "M",
      "dayOfBirth": "18",
      "monthOfBirth": "10",
      "yearOfBirth": "1991",
      "address": {
        "line": "String",
        "district": "String",
        "state": "String",
        "pincode": "XXXXXX"
      },
      "phoneNumber": "989141XXXX"
    }
  },
  "sharedRecordCount": 2,
  "consent": {
    "careContexts": [
      {
        "patientReference": "manishk1991@sbx",
        "careContextReference": "10004-20200001768-1"
      },
      {
        "patientReference": "manishk1991@sbx",
        "careContextReference": "10004-20200001768-2"
      }
    ],
    "permission": {
      "accessMode": "VIEW"
    },
    "dataEraseAt": "2025-10-11T08:58:09.738Z"
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
- `X-AUTH-TOKEN` (string, required): JWT access token issued by the PHR service after successful user authentication. If the HIP does not have any role, then it is mandatory.

## Body

- `metaData` (object, required): The HIU and the counter the QR code named.
- `metaData.hiuId` (string, required): The HIU's identifier, read from the QR code.
- `metaData.counterId` (string, required): The counter at the HIU, read from the QR code.
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
- `sharedRecordCount` (integer, required): Number of records that are to be shared to the health information user (HIU).
- `consent` (object, required): The care contexts to share, the permission specifying how the records can be accessed, and the dataEraseAt date until which the data remains accessible.
- `consent.careContexts` (object[], required)
- `consent.careContexts.patientReference` (string, required): The patient reference the care context was linked under.
- `consent.careContexts.careContextReference` (string, required)
- `consent.permission` (object, required)
- `consent.permission.accessMode` (string, required): How the HIU may use the records. One of: VIEW.
- `consent.dataEraseAt` (string, required): Until when the data remains accessible to the HIU.

## Responses

- `202`: Accepted. The HIE-CM forwards the request to the HIU; the HIU's data push URL and key arrive on the on-share callback.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
