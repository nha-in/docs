---
id: hiecm.endpoint.m1-benefit-get-by-abha
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get the benefit record for an ABHA number
summary: Lists the benefit programmes linked to one ABHA number.
generated: true
operation: m1_get_v3_profile_benefit_abha_abhanumber
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_profile_benefit_abha_abhanumber.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_profile_benefit_abha_abhanumber.mdx#m1-benefit-get-by-abha.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-1013
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Get the benefit record for an ABHA number

## In plain words

Lists the benefit programmes linked to one [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number). Put the ABHA number in the path and your approved programme name in the `BENEFIT_NAME` header. The response names each linked programme in `benefitName`.

## Before you start

The programme name approved for your integration, sent as `BENEFIT_NAME`, and the access token as `Authorization: Bearer <gateway token>`.

## How you know it worked

A 200 with the `abhaNumber` you asked about and a `programme` list.

## When it goes wrong

A 404 with `ABDM-1114` means no account holds that ABHA number. A 401 with `900901` means the access token is missing or expired.
