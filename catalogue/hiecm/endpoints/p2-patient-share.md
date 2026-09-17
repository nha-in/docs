---
id: hiecm.endpoint.p2-patient-share
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Share the profile with the facility whose code was scanned
summary: >
  Hands a facility the health address and profile so it can register the person without a form.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 5.3.1. The path, the method, the
      request body and the error scenarios below are transcribed from it.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The X-HIU-ID and X-AUTH-TOKEN headers on this call. Recorded by an integrator on 2026-09-16 from a working PHR client and not exercised by them; not yet run from this repository.
related:
  flows: [hiecm.flow.p2-scan-and-share]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.scan-and-share]
  callbacks: [hiecm.callback.p2-profile-on-share-callback]
skills:
  - hiecm-p2-build
---

# Share the profile with the facility whose code was scanned

## In plain words

The call behind scan and share. It goes out once the person has agreed, and the facility answers on a callback.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The HIP id and the counter context read out of the scanned code, and the person's agreement in the wording NHA specifies.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/patient-share/v3/share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-HIU-ID: <YOUR_CLIENT_ID>' \
  -H 'X-AUTH-TOKEN: Bearer <PHR_USER_TOKEN_FROM_LOGIN>' \
  -H 'Content-Type: application/json' \
  -d '{
  "intent": "PROFILE_SHARE",
  "metaData": {
    "hipId": "MAYUR_HIP",
    "context": "ABC123",
    "hprId": "abdulkalam@abdm",
    "latitude": "-38.679",
    "longitude": "58.498"
  },
  "profile": {
    "patient": {
      "abhaNumber": 91178386101251,
      "abhaAddress": "9117838@sbx",
      "name": "User 1",
      "gender": "M",
      "dayOfBirth": "10",
      "monthOfBirth": "10",
      "yearOfBirth": "1994",
      "address": {
        "line": "C/O Sandipan Kshirsagar Ambejogai Road Renuka Nagar",
        "district": null,
        "state": null,
        "pincode": null
      },
      "phoneNumber": "9876543210"
    }
  }
}'
```

The call goes to the gateway host with the standard headers plus two of
its own: `X-HIU-ID` carrying your client id, and `X-AUTH-TOKEN` carrying
`Bearer` and the signed in person's PHR user token. The same call is a
way to exercise a facility's scan and share handling without a phone:
send it with the facility's HIP id and counter id and watch the
facility's bridge receive the share. See
[scan and share](hiecm.concept.scan-and-share).

## How you know it worked

The call returns 202. The facility's acknowledgement then arrives on your bridge at `/api/v3/hiu/patient/on-share`, carrying the token number where the facility issued one. That token is what the person needs at the counter.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
