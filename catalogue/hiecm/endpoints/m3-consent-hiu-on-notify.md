---
id: hiecm.endpoint.m3-consent-hiu-on-notify
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Acknowledge a consent notification
summary: The HIU acknowledges a consent granted, denied, revoked or expired
  notification, one entry per artefact.
generated: true
operation: m3_post_consent_v3_request_hiu_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_consent_v3_request_hiu_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_consent_v3_request_hiu_on_notify.mdx#m3-consent-hiu-on-notify.
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

Call this after ABDM [notifies your bridge](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/03-m3-post-v3-hiu-consent-request-notify) that the patient granted or denied a consent, or that a consent was revoked or expired. `acknowledgement` is an array, with one entry per artefact carrying `status` and `consentId`. Put the notification's request id in `response.requestId`.

## Before you start

A gateway session token and the notification. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

The call returns 202 Accepted. The HIP acknowledgement takes a single object instead of an array.

## When it goes wrong

`ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
