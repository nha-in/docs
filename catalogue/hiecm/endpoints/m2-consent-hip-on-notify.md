---
id: hiecm.endpoint.m2-consent-hip-on-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Acknowledge a consent notification
summary: The HIP acknowledges a consent granted, revoked or expired
  notification, one consent artefact at a time.
generated: true
operation: m2_post_consent_v3_request_hip_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_consent_v3_request_hip_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_consent_v3_request_hip_on_notify.mdx#m2-consent-hip-on-notify.
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

# Acknowledge a consent notification

## In plain words

Call this after ABDM [notifies your bridge](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/08-m2-post-v3-consent-request-hip-notify) that a consent was granted, revoked or expired. Send one `acknowledgement` with the artefact's `consentId`. Put the notification's request id in `response.requestId`.

## Before you start

A gateway session token, and the `REQUEST-ID` of the notification you are acknowledging. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

`acknowledgement` is one object on this call, with `status` and `consentId`. The HIU acknowledgement takes an array instead. The call returns 202 Accepted.

## When it goes wrong

`ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
