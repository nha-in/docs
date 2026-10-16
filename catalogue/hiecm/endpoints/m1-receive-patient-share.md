---
id: hiecm.endpoint.m1-receive-patient-share
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Receive a patient's shared profile
summary: The call ABDM makes to a facility's bridge when a person scans its code
  and shares their profile.
generated: true
operation: scan-and-register_post_v3_hip_patient_share
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/scan-and-register_post_v3_hip_patient_share.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/scan-and-register_post_v3_hip_patient_share.mdx#m1-receive-patient-share.
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

# Receive a patient's shared profile

## In plain words

Your [Health Information Provider (HIP)](/docs/hiecm/v3/getting-started/glossary#hip) hosts this call, and [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) makes it. When a person scans your facility's code and agrees to share, ABDM posts their profile to `/api/v3/hip/patient/share`, relative to your bridge callback URL. `X-HIP-ID` names your facility. Answer with 200, then send the on-share acknowledgement.

## What happens

`intent` is `PROFILE_SHARE`. The date of birth arrives as `dayOfBirth`, `monthOfBirth` and `yearOfBirth`, and the mobile number as `phoneNumber`.

## When it goes wrong

A slow answer loses the share: ABDM reports `ABDM-1007` when the connection times out. Answer first, then register the person.
