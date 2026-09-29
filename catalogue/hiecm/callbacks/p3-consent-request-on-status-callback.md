---
id: hiecm.callback.p3-consent-request-on-status-callback
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Consent request status callback
summary: ABDM posts the current status of a consent request to the HIU that asked.
generated: true
operation: m3_post_v3_hiu_consent_request_on_status
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_status.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_status.mdx#p3-consent-request-on-status-callback.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
---

# Consent request status callback

## In plain words

ABDM posts the current status of a consent request here, in answer to the consent request status call. `consentRequest.status` is `REQUESTED`, `DENIED`, `EXPIRED` or `REVOKED`.

## How you know it worked

`consentRequest` carries the `id` you asked about. Answer with `200`.
