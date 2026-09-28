---
id: hiecm.callback.m3-on-consent-request-status
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: The consent manager reports the state of a consent request you asked about
summary: ABDM answers a consent status request on the HIU's bridge with the
  request's current state.
generated: true
operation: m3_post_v3_hiu_consent_request_on_status
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_status.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_request_on_status.mdx#m3-on-consent-request-status.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The consent manager reports the state of a consent request you asked about

## In plain words

After you [ask for a consent request's status](/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/02-m3-post-consent-v3-request-status), ABDM answers on your [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) bridge at `/api/v3/hiu/consent/request/on-status`. `consentRequest.status` is `REQUESTED`, `DENIED`, `EXPIRED` or `REVOKED`. Artefact ids for a granted request arrive on [the consent notification](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/03-m3-post-v3-hiu-consent-request-notify).

## Before you start

Store the `REQUEST-ID` of the status call before you send it.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIU-ID` headers, and expects 200 OK.

## When it goes wrong

An `error` object means the status could not be read. `ABDM-1001` (No data found): check the consent request id.
