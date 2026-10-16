---
id: hiecm.endpoint.m1-download-phr-card
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Download PHR card
summary: Returns the card for the ABHA address the person signed in with.
generated: true
operation: m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_e1bae9
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_e1bae9.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_phr_web_login_profile_abha_phr_card_abha_addres_e1bae9.mdx#m1-download-phr-card.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Download PHR card

## In plain words

Returns the card for the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) the person signed in with, to show or save in your [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app. It needs the `X-token` from the ABHA address verify step, and the same call serves every ABHA address login method.

## How you know it worked

A 202 that carries the card.

## When it goes wrong

A 400 with `ABDM-1006` and `Invalid X-token` means the token is missing or wrong. A 401 with `900902` means the access token was not sent.
