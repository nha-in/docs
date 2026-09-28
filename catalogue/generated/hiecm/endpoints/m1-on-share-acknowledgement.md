---
id: hiecm.endpoint.m1-on-share-acknowledgement
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Send share acknowledgement
summary: The facility tells ABDM it received a shared profile and gives the
  person a token number.
generated: true
operation: scan-and-register_post_patient_share_v3_on_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/scan-and-register_post_patient_share_v3_on_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/scan-and-register_post_patient_share_v3_on_share.mdx#m1-on-share-acknowledgement.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Send share acknowledgement

## In plain words

After your [Health Information Provider (HIP)](/docs/hiecm/v3/getting-started/glossary#hip) receives a person's shared profile, send this acknowledgement. On success, set `acknowledgement.status` to `SUCCESS`, and give the person's `abhaAddress` and a `profile` holding the counter `context` and the `tokenNumber` you assigned. `expiry` says how long the token stays valid. If you could not register the person, send `error` instead, with a code and message.

## Before you start

The `REQUEST-ID` of the share ABDM posted to you, for `response.requestId`, and the access token as `Authorization: Bearer <gateway token>`.

## When it goes wrong

A 404 with `ABDM-1001` means no share matches `response.requestId`. A 429 with `ABDM-1022` means wait before retrying.
