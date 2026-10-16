---
id: hiecm.flow.scan-and-register-share
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Receive a scanned profile share and reply with a token
summary: Every field of the profile share that arrives on your bridge, and the
  on-share reply with the counter, token number and expiry.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/use-cases/scan-and-register.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/use-cases/scan-and-register.mdx#scan-and-register-share.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-receive-patient-share
    - hiecm.endpoint.m1-on-share-acknowledgement
  concepts:
    - hiecm.concept.scan-and-register-qr
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.callback-authenticity
  flows:
    - hiecm.flow.p2-scan-and-share
---

# Receive a scanned profile share and reply with a token

## In plain words

### What arrives on your bridge

ABDM posts the profile to `/api/v3/hip/patient/share`, relative to your bridge
callback URL, with `Authorization: Bearer <token>`, `REQUEST-ID`, `TIMESTAMP`
and `X-HIP-ID`. A profile share looks like this:

```json
{
  "intent": "PROFILE_SHARE",
  "metaData": {
    "hipId": "<HIP_ID>",
    "context": "OPD1",
    "hprId": null,
    "latitude": "12.97",
    "longitude": "77.71"
  },
  "profile": {
    "patient": {
      "abhaNumber": "<ABHA_NUMBER>",
      "abhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dayOfBirth": "6",
      "monthOfBirth": "6",
      "yearOfBirth": "2000",
      "address": {
        "line": "<ADDRESS_LINE>",
        "district": "<DISTRICT>",
        "state": "<STATE>",
        "pincode": "<PINCODE>"
      },
      "phoneNumber": "<MOBILE_NUMBER>"
    }
  }
}
```

| Field | Always present | What it holds |
| --- | --- | --- |
| `intent` | Yes | `PROFILE_SHARE` for a profile share. |
| `metaData.hipId` | Yes | Your HIP id, the same as `X-HIP-ID`. |
| `metaData.context` | Yes | The counter id from the QR code. Send it back in your reply. |
| `metaData.hprId` | No | The HPR id of a healthcare professional, or `null`. |
| `metaData.latitude`, `metaData.longitude` | No | Where the share was made, or `null`. Read each as a number whether it arrives as a number or as a numeric string. |
| `profile.patient.abhaNumber` | No | The 14 digit ABHA number, or `null` when the person has an ABHA address only. |
| `profile.patient.abhaAddress` | Yes | The ABHA address, ending `@sbx` in the sandbox. Match the patient on this. |
| `profile.patient.name` | Yes | The name as it stands on the ABHA. |
| `profile.patient.gender` | Yes | One of `M`, `F`, `O`, `D`, `T` and `U`. |
| `profile.patient.dayOfBirth`, `monthOfBirth` | No | The day and month of birth, as strings, or `null`. |
| `profile.patient.yearOfBirth` | Yes | The four digit year of birth, as a string. |
| `profile.patient.address` | Yes | `line`, `district`, `state` and `pincode`, spelled with a lower case `c`. |
| `profile.patient.phoneNumber` | Yes | The mobile number on the ABHA. |

Answer with `200` at once. Register the patient afterwards.

### Your reply

Call `POST /api/hiecm/patient-share/v3/on-share` on the gateway, with a fresh
`REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and the gateway access token.

Set `response.requestId` to the `REQUEST-ID` of the share. On success send
`acknowledgement` alone:

```json
{
  "acknowledgement": {
    "status": "SUCCESS",
    "abhaAddress": "<ABHA_ADDRESS>",
    "profile": {
      "context": "OPD1",
      "tokenNumber": "1",
      "expiry": "1800"
    }
  },
  "response": {
    "requestId": "<REQUEST-ID of the share>"
  }
}
```

When you cannot register the patient, send `error` alone, with a `code` and a
`message`, and the same `response`. The gateway answers `202`, and the
patient's app shows the token number.

## Before you start

The QR code above, printed at a counter, and a gateway session token.

## What happens

Log the whole share body on arrival, answer `200`, then register or match the patient on `abhaAddress` and send the on-share reply within 30 seconds. Send `acknowledgement` on success and `error` on failure, never both. Send `expiry` in seconds until its unit is confirmed at onboarding.

## How you know it worked

The on-share call returns `202`, and the patient's PHR app shows the `tokenNumber` you sent.

## When it goes wrong

`ABDM-1001` with a 404 means no share matches `response.requestId`. `ABDM-1006` with a 400 means the reply body is invalid. `ABDM-1007` means your answer to the share or your reply came too late.
