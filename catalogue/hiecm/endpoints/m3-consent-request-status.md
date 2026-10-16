---
id: hiecm.endpoint.m3-consent-request-status
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Check the status of a consent request
summary: The HIU asks for the current state of a consent request; the state
  arrives on the on-status callback.
generated: true
operation: m3_post_consent_v3_request_status
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_consent_v3_request_status.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_consent_v3_request_status.mdx#m3-consent-request-status.
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

# Check the status of a consent request

## In plain words

Ask for the current state of a consent request by its `consentRequestId`. The call returns 202 Accepted. The state arrives on [consent request on-status](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/02-m3-post-v3-hiu-consent-request-on-status) as `REQUESTED`, `DENIED`, `EXPIRED` or `REVOKED`. Artefact ids for a granted request arrive on [the consent notification](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/03-m3-post-v3-hiu-consent-request-notify).

## Before you start

A gateway session token and the consent request id from on-init. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIU-ID` headers.

## When it goes wrong

`ABDM-1001` (No data found): check `consentRequestId`. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
