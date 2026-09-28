---
id: hiecm.callback.m3-on-consent-request-notify-hip
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: The patient's decision, sent to the record holder
summary: ABDM tells the HIP that a consent covering its records was granted,
  revoked or expired.
generated: true
operation: m2_post_v3_consent_request_hip_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_consent_request_hip_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_consent_request_hip_notify.mdx#m3-on-consent-request-notify-hip.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The patient's decision, sent to the record holder

## In plain words

When a consent covering your records is granted, revoked or expires, ABDM notifies your [HIP](/docs/hiecm/v3/getting-started/glossary#hip) bridge at `/api/v3/consent/request/hip/notify`. A `GRANTED` notification carries the full [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact), with every care context reference it covers, and a signature. `REVOKED` and `EXPIRED` name the artefact by `consentId`.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers, and expects 200 OK. Acknowledge through `/api/hiecm/consent/v3/request/hip/on-notify`.

## When it goes wrong

You track expiry yourself. Refuse any data request on an expired or revoked artefact.
