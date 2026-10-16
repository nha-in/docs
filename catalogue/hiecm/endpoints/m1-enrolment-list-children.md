---
id: hiecm.endpoint.m1-enrolment-list-children
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: List the child ABHA accounts linked to this account
summary: Returns the child ABHA accounts held under a parent's ABHA.
generated: true
operation: m1_get_v3_enrollment_profile_children_child_abha
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m1_get_v3_enrollment_profile_children_child_abha.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m1_get_v3_enrollment_profile_children_child_abha.mdx#m1-enrolment-list-children.
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

# List the child ABHA accounts linked to this account

## In plain words

Returns the child [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) accounts held under a parent's account. For each child it gives the name, date of birth, gender, ABHA number and ABHA address. Send the parent's `X-token` and your `BENEFIT_NAME`.

## Before you start

The `X-token` from the child ABHA creation response or from the parent's login, sent as `Bearer <token>`.

## When it goes wrong

A 401 with `ABDM-1021` means your integration lacks the privilege for this call.
