---
id: hiecm.endpoint.p3-revoke-consent-request
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Revoke a granted consent
summary: Let the person withdraw consent they already granted.
generated: true
operation: p2_post_consent_v3_revoke
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_consent_v3_revoke.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_consent_v3_revoke.mdx#p3-revoke-consent-request.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-all-consent-artifact-details-for-an-abha-address
    - hiecm.endpoint.p3-get-consent-artefact-details-by-artifact-id
---

# Revoke a granted consent

## In plain words

Lets the person withdraw consent they already granted, from their [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. Send the [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) ids in `consents`. Access under those artefacts ends.

## Before you start

The person's `X-AUTH-TOKEN` and the artefact ids, from the list of consent artefacts.

## How you know it worked

You receive `202` with `message`. The artefacts then read `REVOKED`.

## When it goes wrong

`400` with `ABDM-1080` means an id is not a valid consent artefact id. Send artefact ids, not consent request ids. `404` with `ABDM-1001` means an artefact was not found.
