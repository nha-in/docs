---
id: hiecm.endpoint.p3-get-all-consent-artifact-details-for-an-abha-address
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: List the consent artefacts of an ABHA address
summary: List the logged-in person's consent artefacts, a page at a time.
generated: true
operation: p2_get_consent_v3_artefact
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_get_consent_v3_artefact.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_get_consent_v3_artefact.mdx#p3-get-all-consent-artifact-details-for-an-abha-address.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-consent-artefact-details-by-artifact-id
    - hiecm.endpoint.p3-revoke-consent-request
---

# List the consent artefacts of an ABHA address

## In plain words

Lists the [consent artefacts](/docs/hiecm/v3/getting-started/glossary#consent-artefact) of the logged-in person, a page at a time. `limit` is required. `offset` and `status` are optional, and `status=ALL` returns every state.

## Before you start

The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `200` with `size`, `limit`, `offset` and the page in `consentArtefacts`.

## When it goes wrong

`404` with `ABDM-1001` means the person has no consent artefacts in that state.
