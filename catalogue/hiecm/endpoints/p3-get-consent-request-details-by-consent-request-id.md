---
id: hiecm.endpoint.p3-get-consent-request-details-by-consent-request-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get one consent request by its id
summary: Fetch one consent request by its id for the logged-in person.
generated: true
operation: p2_get_consent_v3_request_request_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_consent_v3_request_request_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_consent_v3_request_request_id.mdx#p3-get-consent-request-details-by-consent-request-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-consent-request-for-an-abha-address
    - hiecm.endpoint.p3-deny-consent-request
---

# Get one consent request by its id

## In plain words

Returns one consent request by its id: who asked, for what purpose, which records and for which dates. Show it to the person before they approve or deny it.

## Before you start

The person's `X-AUTH-TOKEN` and the `consentRequestId`, from the list of consent requests.

## How you know it worked

You receive `200` with `requestId`, `purpose`, `hiu` and `permission`.

## When it goes wrong

`400` with `ABDM-1039` means the consent request id is invalid. `404` with `ABDM-1001` means no request has that id.
