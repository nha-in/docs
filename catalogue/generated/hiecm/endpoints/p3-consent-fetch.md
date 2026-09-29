---
id: hiecm.endpoint.p3-consent-fetch
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Fetch a consent artefact in full
summary: Ask for what a consent artefact covers; the artefact arrives on a callback.
generated: true
operation: m3_post_consent_v3_fetch
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_consent_v3_fetch.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_consent_v3_fetch.mdx#p3-consent-fetch. Edit
      the page, never this file.
related:
  flows:
    - hiecm.flow.p3-fetch-records
  concepts:
    - hiecm.concept.gateway-session
---

# Fetch a consent artefact in full

## In plain words

A consent artefact id says permission exists. This call asks for what the permission covers. Send the `consentId`. The artefact arrives on your consent on-fetch callback, not on this response.

## Before you start

Your `X-HIU-ID`, `X-CM-ID`, and the artefact id from a granted consent.

## What happens

You receive `202`. The artefact arrives at `/api/v3/hiu/consent/on-fetch`.

## How you know it worked

The on-fetch callback carries the artefact with its date range and HI types. Check its validity before requesting data under it.

## When it goes wrong

`404` with `ABDM-1001` means no artefact has that id.
