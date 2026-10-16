---
id: hiecm.endpoint.m4-hpr-fetch-professional-info
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Read a professional's profile
summary: Returns what the registry holds for a healthcare professional, found by
  HPR ID or other details.
generated: true
operation: m4_post_v1_doctors_fetch_professional_info
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_doctors_fetch_professional_info.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_doctors_fetch_professional_info.mdx#m4-hpr-fetch-professional-info.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-register-professional
  concepts:
    - hiecm.concept.gateway-session
---

# Read a professional's profile

## In plain words

Reads back what the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) holds for a healthcare professional. Call it before you register someone, so a professional who already has a profile is not registered again. Search by the HPR ID in `practitioner.id`, or by `name`, `contactNumber`, `state`, `registrationNumber` and `stateCouncilName`.

## How you know it worked

The response carries a `message` and the matching `practitioners`.
