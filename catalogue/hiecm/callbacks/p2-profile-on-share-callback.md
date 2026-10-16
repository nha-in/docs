---
id: hiecm.callback.p2-profile-on-share-callback
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Profile share result callback
summary: ABDM posts the facility's answer to a profile share, with the person's
  token number.
generated: true
operation: p2_post_v3_hiu_patient_on_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_hiu_patient_on_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_hiu_patient_on_share.mdx#p2-profile-on-share-callback.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-scan-and-share
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-patient-share
---

# Profile share result callback

## In plain words

ABDM posts the facility's answer to a profile share here. On success, `acknowledgement.profile.tokenNumber` is the token number the person shows at the counter. `acknowledgement.profile.expiry` says how long it stays valid.

## What happens

Either `acknowledgement` or `error` is present, and `response` always is. `response.requestId` is the request id of the share call.

## How you know it worked

`acknowledgement.profile.tokenNumber` is present. Show it to the person. Answer with `200`.

## When it goes wrong

An `error` object instead of `acknowledgement` means the share failed. Show the error `message` and let the person scan again.
