---
id: hiecm.endpoint.p2-patient-share
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Share the profile with the facility whose code was scanned
summary: Send the person's profile to the facility whose code they scanned; the
  facility answers with a token number on a callback.
generated: true
operation: p2_post_patient_share_v3_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_patient_share_v3_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_patient_share_v3_share.mdx#p2-patient-share.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-scan-and-share
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p2-profile-on-share-callback
---

# Share the profile with the facility whose code was scanned

## In plain words

The call behind scan and share. When the person scans a facility's code and agrees to share, your [Personal Health Record (PHR)](/docs/hiecm/v3/getting-started/glossary#phr) app sends their profile to that facility. The facility and counter come from the code, in `metaData.hipId` and `metaData.context`. The facility answers on your on-share callback.

## Before you start

The person's agreement to share, taken before the call. The person's `X-AUTH-TOKEN`, your `X-HIU-ID`, and `X-CM-ID`.

## What happens

Set `intent` to `PROFILE_SHARE`. You receive `202`. The facility's answer arrives at `/api/v3/hiu/patient/on-share`.

## How you know it worked

The on-share callback carries `tokenNumber`, the token the person shows at the counter.

## When it goes wrong

`408` with `ABDM-1007` means the facility did not answer in time. `429` with `ABDM-1022` means too many requests: wait before retrying. `400` with `ABDM-1006` means the body is invalid.
