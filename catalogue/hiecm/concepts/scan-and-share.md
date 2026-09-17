---
id: hiecm.concept.scan-and-share
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Scan and share, the counter code and the token you issue
summary: >
  A patient scans a code printed at your counter and their profile
  arrives on your bridge. You register them and answer with a token
  number. This page is the code format, the two bodies and the token
  rules.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 5. Observed by an integrator on 2026-09-16, not yet run
      from this repository.
  - file: catalogue/openapi/.raw/nha-2026-09-05/NewDocumant-PHR-app.docx
    fetched: 2026-09-05
    hash: sha256:4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542
    note: >
      The counter name rules and the one token rule, as carried by the
      P2 scan and share flow.
related:
  endpoints:
    - hiecm.endpoint.m1-receive-patient-share
    - hiecm.endpoint.m1-on-share-acknowledgement
    - hiecm.endpoint.p2-patient-share
  callbacks:
    - hiecm.callback.p2-profile-share-callback
  flows:
    - hiecm.flow.p2-scan-and-share
  concepts:
    - hiecm.concept.bridge-url-ownership
    - hiecm.concept.callback-authenticity
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.phr
skills:
  - hiecm-m1-build
  - hiecm-p2-build
---

# Scan and share, the counter code and the token you issue

## In plain words

Scan and share is registration without a form. You print a code at each
counter. A patient scans it with their [PHR](shared.glossary.phr) app,
agrees to share, and their profile arrives on your bridge. You create or
find their record and answer with a token number, which their app shows
them for the queue.

## Before you start

- A bridge URL registered for your client id and proven to deliver. See [who owns the bridge URL](hiecm.concept.bridge-url-ownership).
- Your HIP id.

## What happens

**The code.** It holds this URL, with your HIP id and a counter id:

```
https://phrsbx.abdm.gov.in/share-profile?hip-id=<YOUR_HIP_ID>&counter-id=<COUNTER_ID>
```

The counter id is 1 to 20 alphanumeric characters, no special
characters, and it cannot be your facility id, your HIP id or your HIP
name. It comes back to you as `metaData.context`.

**The share.** The gateway posts the profile to
`/api/v3/hip/patient/share` under your bridge URL. The body and its
field rules are on [receive a patient's shared profile](hiecm.endpoint.m1-receive-patient-share):
`abhaNumber` may be `null`, the birth parts are strings, and the
postcode key is `pincode`.

**Your reply.** Answer the POST with 2xx, register the patient, then
call [acknowledge a shared profile](hiecm.endpoint.m1-on-share-acknowledgement)
on the gateway host with `status: SUCCESS`, the counter id as
`context`, your `tokenNumber`, an `expiry`, and the inbound
`REQUEST-ID` header as `response.requestId`. The gateway answers 202
within the same second.

**Token rules.** Issue tokens sequentially per counter per day: 1, 2, 3.
A token is valid for 30 minutes, and a rescan inside that window returns
the same token rather than a new one. The unit of `expiry` is not
published; send seconds and confirm at onboarding how the PHR app
renders it.

**Testing without a phone.** [The PHR side share call](hiecm.endpoint.p2-patient-share)
sends the same share from a signed in PHR session, so a test client can
drive your counter handling end to end.

## How you know it worked

You have understood this when you can answer both of these.

1. A patient scans the same code twice in ten minutes. What token number
   do they see the second time?
2. The scan produces nothing on your bridge and your code is correct.
   What is the first thing you check?

## When it goes wrong

No callback after a scan. The bridge URL points elsewhere. See
[who owns the bridge URL](hiecm.concept.bridge-url-ownership).

The acknowledgement answers 404. It went to the ABHA host instead of
`https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share`.

Your parser rejects the share because `abhaNumber` is `null`. An
address only ABHA has no number. Register on the address.
