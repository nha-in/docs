---
id: hiecm.endpoint.m4-hpr-create-hprid
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Create the HPID
summary: Issues the healthcare professional's HPID and the token that stands for
  them on later calls.
generated: true
operation: m4_post_v2_registration_aadhaar_createhpridwithpreverified
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v2_registration_aadhaar_createhpridwithpreverified.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v2_registration_aadhaar_createhpridwithpreverified.mdx#m4-hpr-create-hprid.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-create-hpid
  concepts:
    - hiecm.concept.gateway-session
---

# Create the HPID

## In plain words

The last call in creating an [HPID](/docs/hiecm/v3/getting-started/glossary#hpid), the identity a healthcare professional holds in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr). It takes the `txnId` of the Aadhaar transaction the earlier steps verified, the `hprId` the professional chose, a `password`, and the category and subcategory codes. The response carries the new `hprIdNumber`, the `hprId` and a `token`.

## Before you start

The `txnId` from the verified Aadhaar steps earlier in the journey. `email` and `txnId` are required. Offer `hprId` candidates from the HPID suggestion call. Take `hpCategoryCode` and `hpSubCategoryCode` from the HPID categories and subcategories calls rather than hard coding them.

## How you know it worked

The response carries `hprIdNumber`, `hprId` and a non empty `token`. Keep the `token`: registering the professional's profile sends it as `hprToken`.
