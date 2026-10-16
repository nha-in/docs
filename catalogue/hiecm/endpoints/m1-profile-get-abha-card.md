---
id: hiecm.endpoint.m1-profile-get-abha-card
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the ABHA card
summary: Returns the signed in person's ABHA card as an image for display.
generated: true
operation: m1_get_v3_profile_account_abha_card
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_account_abha_card.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_account_abha_card.mdx#m1-profile-get-abha-card.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.900900
    - hiecm.error.abdm-2401
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Get the ABHA card

## In plain words

Returns the signed in person's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) card as an image, for display inside your application. Send the person's `X-token`. To give the person a file to keep, use the download call.

## When it goes wrong

A 400 with `Invalid X-token` means the token is missing, wrong or expired. A 401 with `900901` means the access token is missing or expired.
