---
id: hiecm.endpoint.p1-enrollment-address-exists
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Check whether an address is taken
summary: Says whether the ABHA address the person chose already exists.
generated: true
operation: p1_get_v3_phr_app_enrollment_isexists
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_get_v3_phr_app_enrollment_isexists.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_get_v3_phr_app_enrollment_isexists.mdx#p1-enrollment-address-exists.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.gateway-session
---

# Check whether an address is taken

## In plain words

Checks one [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address) before you try to create it. The person learns at once that a name is taken, rather than being refused at the end. Pass the candidate as the `abhaAddress` query parameter. The response is a bare boolean: `false` means the address is free.

## What happens

A `GET` with the `abhaAddress` query parameter and no body.

## How you know it worked

A `200` with `false`. Offer that address to the enrol call.

## When it goes wrong

`ABDM-1006` with `Invalid ABHA Address` means the candidate is malformed. A `401` with `900902` and `Missing Credentials` means the access token is missing.
