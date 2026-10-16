---
id: hiecm.callback.m3-on-consent-request-init
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: The consent request was accepted, with its request id
summary: ABDM answers a consent request on the HIU's bridge with the consent
  request id, or the error that refused it.
generated: true
operation: m3_post_v3_hiu_consent_request_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_init.mdx#m3-on-consent-request-init.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The consent request was accepted, with its request id

## In plain words

After you [create a consent request](/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/01-m3-post-consent-v3-request-init), ABDM answers on your [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) bridge at `/api/v3/hiu/consent/request/on-init`. `consentRequest.id` is the consent request id. Store it: the patient's decision and any status check refer to it.

## Before you start

Store the `REQUEST-ID` of the init call before you send it, so the answer can be matched.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIU-ID` headers, and expects 200 OK.

## When it goes wrong

An `error` in place of `consentRequest` means the request was refused. Check the patient id, HIU id, purpose, health information types, date range and permission.
