---
id: hiecm.endpoint.p3-deny-consent-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Deny a consent request
summary: Let the person refuse a consent request from their PHR app.
generated: true
operation: p2_post_consent_v3_request_request_id_deny
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_consent_v3_request_request_id_deny.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_consent_v3_request_request_id_deny.mdx#p3-deny-consent-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-consent-request-for-an-abha-address
    - hiecm.endpoint.p3-get-consent-request-details-by-consent-request-id
---

# Deny a consent request

## In plain words

Lets the person refuse a consent request from their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. The [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) that asked gets no access to the records. Send the person's reason in `reason`.

## Before you start

The person's `X-AUTH-TOKEN` and the `consentRequestId`, from the list of consent requests.

## How you know it worked

You receive `202`. The request's `status` then reads `DENIED` in the consent request calls.

## When it goes wrong

`404` with `ABDM-1001` means no consent request has that id. `400` with `ABDM-1065` means the `X-AUTH-TOKEN` is invalid.
