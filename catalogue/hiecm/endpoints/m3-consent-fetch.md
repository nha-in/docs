---
id: hiecm.endpoint.m3-consent-fetch
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Fetch the full consent artefact
summary: The HIU fetches a granted consent artefact by id; the artefact arrives
  on the on-fetch callback.
generated: true
operation: m3_post_consent_v3_fetch
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_consent_v3_fetch.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_consent_v3_fetch.mdx#m3-consent-fetch. Edit
      the page, never this file.
related:
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.gateway-session
---

# Fetch the full consent artefact

## In plain words

Fetch a [consent artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact) by its id after a `GRANTED` [consent notification](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/03-m3-post-v3-hiu-consent-request-notify). The call returns 202 Accepted, and the artefact arrives on [consent on-fetch](/docs/hiecm/v3/api/m3/endpoints/m3-callbacks/04-m3-post-v3-hiu-consent-on-fetch). It lists:

- the care contexts approved
- the health information types permitted
- the date range, and the date to erase the data
- the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) and [HIU](/docs/hiecm/v3/getting-started/glossary#hiu), and a signature

Store the artefact. Your health information request needs its id.

## Before you start

A gateway session token and the artefact ids from the notification. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIU-ID` headers.

## How you know it worked

The artefact arrives on `/api/v3/hiu/consent/on-fetch` with `status` of `GRANTED`.

## When it goes wrong

`ABDM-1001` (No data found): check `consentId`. Fetch every artefact id the notification listed, not only the first. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
