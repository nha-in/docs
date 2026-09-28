---
id: hiecm.endpoint.p1-enrollment-enrol
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Create the health address
summary: Creates the ABHA address the person chose and signs them in.
generated: true
operation: p1_post_v3_phr_app_enrollment_enrol
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_enrol.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p1_post_v3_phr_app_enrollment_enrol.mdx#p1-enrollment-enrol.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.gateway-session
---

# Create the health address

## In plain words

The call that creates the [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). Everything before it was checking. Send the verified `txnId` and the person's details in `phrDetails`, with `mobile` and `password` encrypted with the public certificate. A success returns the profile and the session `tokens`.

## Before you start

A `txnId` from a verified registration OTP, and an address the existence check reported free.

## How you know it worked

`message` is `ABHA Address Created Successfully`, `abhaAddress` in `phrDetails` carries the address, and `tokens` carries a `token` and a `refreshToken`.

## When it goes wrong

`ABDM-9999` with `This ABHA Address already exists. Please create with unique ABHA address` means the address was taken in the meantime. Offer another and check it first. Other `ABDM-9999` messages name the invalid field, such as `Invalid Transaction Id`.
