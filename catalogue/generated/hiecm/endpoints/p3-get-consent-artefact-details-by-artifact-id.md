---
id: hiecm.endpoint.p3-get-consent-artefact-details-by-artifact-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get one consent artefact by its id
summary: Fetch one consent artefact by its id for the logged-in person.
generated: true
operation: p2_get_consent_v3_artefact_artefact_id
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_consent_v3_artefact_artefact_id.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_consent_v3_artefact_artefact_id.mdx#p3-get-consent-artefact-details-by-artifact-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-consent-artifact-details-for-an-abha-address
    - hiecm.endpoint.p3-get-all-consent-artefact-details-by-request-id
---

# Get one consent artefact by its id

## In plain words

Returns one [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) by its id. `status` says whether it is still in force, and `consentDetail` says what it permits. The path parameter `consentId` is the artefact id.

## Before you start

The person's `X-AUTH-TOKEN` and the artefact id.

## How you know it worked

You receive `200` with `status` and `consentDetail`.

## When it goes wrong

`400` with `ABDM-1080` means the id is not a valid consent artefact id. `404` with `ABDM-1001` means no artefact has that id.
