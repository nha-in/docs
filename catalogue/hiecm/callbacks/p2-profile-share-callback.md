---
id: hiecm.callback.p2-profile-share-callback
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Profile share callback
summary: ABDM posts a person's profile to the facility whose code they scanned.
generated: true
operation: scan-and-register_post_v3_hip_patient_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/scan-and-register_post_v3_hip_patient_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/scan-and-register_post_v3_hip_patient_share.mdx#p2-profile-share-callback.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-scan-and-share
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-profile-on-share
---

# Profile share callback

## In plain words

When a person scans your facility's code and agrees to share, ABDM posts their profile here. `metaData.context` names the counter the code belongs to. `profile.patient` holds the details to register the person with.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

Answer with `200`, then send the on-share call with a token number for the person.

## How you know it worked

The person's PHR app shows the token number you sent.
