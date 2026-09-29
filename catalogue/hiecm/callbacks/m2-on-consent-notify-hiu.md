---
id: hiecm.callback.m2-on-consent-notify-hiu
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: A consent notification to an HIU bridge
summary: ABDM posts a patient's consent decision to the HIU's bridge, which
  acknowledges it through hiu on-notify.
generated: true
operation: m3_post_v3_hiu_consent_request_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_notify.mdx#m2-on-consent-notify-hiu.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# A consent notification to an HIU bridge

## In plain words

When a patient decides on your consent request, ABDM posts the decision to your [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) bridge at `/api/v3/hiu/consent/request/notify`. The path is relative to the callback URL you registered. Acknowledge each notification by calling [consent HIU on-notify](/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/03-m3-post-consent-v3-request-hiu-on-notify).

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIU-ID` headers, and expects 200 OK. Then acknowledge on `/api/hiecm/consent/v3/request/hiu/on-notify`, with this notification's `REQUEST-ID` as `requestId`.

## When it goes wrong

No notification arrives: check that the callback URL is public, registered and quick to answer. Make the handler idempotent on `consentRequestId` and `status`.
