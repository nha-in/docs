---
id: hiecm.callback.m2-callback-api-for-sms-notification-to-patients
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Callback API for SMS Notification to patients
summary: ABDM answers the HIP's SMS notification request on the HIP's bridge.
generated: true
operation: m2_post_v3_patients_sms_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_patients_sms_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_patients_sms_on_notify.mdx#m2-callback-api-for-sms-notification-to-patients.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
---

# Callback API for SMS Notification to patients

## In plain words

After you ask ABDM to [send the patient an SMS](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-hip-initiated-linking-hip/03-m2-post-hip-v3-link-patient-links-sms-notify2), ABDM answers on your bridge at `/api/v3/patients/sms/on-notify`. The path is relative to the callback URL you registered.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers. The body carries `acknowledgement`, `response` and, on failure, `error`.

## When it goes wrong

`ABDM-1024` (Dependent service unavailable): the message was not sent. Send the notify call again later.
