---
id: hiecm.callback.m3-on-consent-fetch
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: The consent artefact detail, fetched by artefact id
summary: ABDM posts the fetched consent artefact to the HIU's bridge, with its
  status, detail and signature.
generated: true
operation: m3_post_v3_hiu_consent_on_fetch
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_consent_on_fetch.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_consent_on_fetch.mdx#m3-on-consent-fetch.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# The consent artefact detail, fetched by artefact id

## In plain words

After you [fetch a consent artefact](/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/04-m3-post-consent-v3-fetch), ABDM posts it to your [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) bridge at `/api/v3/hiu/consent/on-fetch`. It carries the artefact's `status`, its detail and its `signature`. The detail says which care contexts, health information types and dates you may request, and when to erase the data.

## Before you start

A callback URL registered for your bridge, and the artefact id you fetched.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIU-ID` headers, and expects 200 OK.

## How you know it worked

You hold an artefact with `status` of `GRANTED` and its `consentId`, ready for the health information request.

## When it goes wrong

Do not request data on an artefact whose `status` is `REVOKED` or `EXPIRED`. Erase stored data by `dataEraseAt`.
