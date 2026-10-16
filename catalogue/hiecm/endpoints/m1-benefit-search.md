---
id: hiecm.endpoint.m1-benefit-search
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Search benefit records for a person
summary: Lists the benefit programmes linked to a person, found by encrypted
  xmlUid or ABHA number.
generated: true
operation: m1_post_v3_profile_benefit_search_xmluid
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_benefit_search_xmluid.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_benefit_search_xmluid.mdx#m1-benefit-search.
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

# Search benefit records for a person

## In plain words

Lists the benefit programmes linked to a person, found by their Aadhaar `xmlUid` or their [ABHA number](/docs/hiecm/v3/getting-started/glossary#abha-number). Set `loginHint` to `xmlUid` or `abha-number` and put the encrypted value in `loginId`, with `scope` as `["search"]`. The response is a list with one entry per programme, each with the programme name, the ABHA number and a status.

## Before you start

Encrypt `loginId` with the key from the public certificate call. Send your approved programme name as `BENEFIT_NAME`.

## When it goes wrong

A 400 with `Invalid LoginId` means the value was refused: check it was encrypted with the published key and `encryptionAlgorithm`. A 400 with `Invalid Benefit Name` means `BENEFIT_NAME` is not approved for you. A 404 with `ABDM-1114` means no account matched.
