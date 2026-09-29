---
id: hiecm.endpoint.p3-get-all-consent-request-for-an-abha-address
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: List the consent requests of an ABHA address
summary: List the consent requests made to the logged-in person, a page at a time.
generated: true
operation: p2_get_consent_v3_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_consent_v3_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_consent_v3_request.mdx#p3-get-all-consent-request-for-an-abha-address.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-consent-request-details-by-consent-request-id
    - hiecm.endpoint.p3-deny-consent-request
---

# List the consent requests of an ABHA address

## In plain words

Lists the consent requests made to the logged-in person, a page at a time. `limit` is required. `offset` and `status` are optional, and `status=ALL` returns every state.

## Before you start

The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `200` with `size`, `limit`, `offset` and the page in `requests`. Show requests with `status` `REQUESTED` for a decision.

## When it goes wrong

`404` with `ABDM-1001` means the person has no consent requests in that state.
