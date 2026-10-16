---
id: hiecm.endpoint.p3-get-all-consent-artefact-details-by-request-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get the consent artefacts of one consent request
summary: Fetch every consent artefact created from one consent request, for the
  logged-in person.
generated: true
operation: p2_get_consent_v3_artefact_request_request_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_consent_v3_artefact_request_request_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_consent_v3_artefact_request_request_id.mdx#p3-get-all-consent-artefact-details-by-request-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-consent-request-details-by-consent-request-id
    - hiecm.endpoint.p3-get-consent-artefact-details-by-artifact-id
---

# Get the consent artefacts of one consent request

## In plain words

Returns every [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) created from one consent request. One request can produce several artefacts, so the response is an array.

## Before you start

The person's `X-AUTH-TOKEN` and the `consentRequestId`.

## How you know it worked

You receive `200` with an array. Each entry has a `status` and a `consentDetail` with its `consentId`.

## When it goes wrong

`404` with `ABDM-1001` means no artefact exists for that request, for example because it was not granted.
