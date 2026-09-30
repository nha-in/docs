---
id: hiecm.endpoint.m2-sms-deep-link-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Send an SMS telling the patient a care context is linked
summary: The HIP asks ABDM to send the patient an SMS saying a care context is
  linked to their ABHA address.
generated: true
operation: m2_post_hip_v3_link_patient_links_sms_notify2
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_hip_v3_link_patient_links_sms_notify2.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_hip_v3_link_patient_links_sms_notify2.mdx#m2-sms-deep-link-notify.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.gateway-session
---

# Send an SMS telling the patient a care context is linked

## In plain words

Ask ABDM to send the patient an SMS (text message) saying that a [care context](/docs/hiecm/v3/getting-started/glossary#care-context) is linked to their [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). Send the mobile number in `phoneNo`, with your [HIP](/docs/hiecm/v3/getting-started/glossary#hip) `id` and `name`. The call returns 202 Accepted, and the outcome arrives on [patients SMS on-notify](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/04-m2-post-v3-patients-sms-on-notify).

## Before you start

A gateway session token. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## How you know it worked

A callback on `/api/v3/patients/sms/on-notify` with `acknowledgement` `status` of `SUCCESS`. That means accepted for sending, not delivered.

## When it goes wrong

The body holds only `notification`. The request id and timestamp travel as headers, not in the body. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
