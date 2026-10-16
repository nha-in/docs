---
id: hiecm.endpoint.m1-benefit-link-or-delink
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Link or unlink a benefit record from an ABHA
summary: Links or unlinks the programme named in the BENEFIT_NAME header for an ABHA.
generated: true
operation: m1_post_v3_profile_benefit_linkanddelink_x_token
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_post_v3_profile_benefit_linkanddelink_x_token.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_post_v3_profile_benefit_linkanddelink_x_token.mdx#m1-benefit-link-or-delink.
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

# Link or unlink a benefit record from an ABHA

## In plain words

One call does both. Send `scope` as `["link"]` to link the programme named in the `BENEFIT_NAME` header to the signed in person's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha), or `["de-link"]` to remove it. The person's `X-token` identifies the account.

The success response confirms the change in a readable `status` sentence. Match on the HTTP status and `benefitName`, not on that text.

## Before you start

The person's `X-token` from login, sent as `Bearer <token>`. Without a signed in person, the same path takes `loginHint` set to `abha-number` and the encrypted ABHA number in `loginId`.

## How you know it worked

A 200 whose `benefitName` is the programme you sent and whose `healthId` is the person's ABHA number.

## When it goes wrong

A 400 with `ABDM-1138` means the record is already in the state you asked for. A 401 covers an invalid programme name and a programme restricted from linking, as well as a bad access token.
