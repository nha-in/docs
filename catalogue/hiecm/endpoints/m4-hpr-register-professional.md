---
id: hiecm.endpoint.m4-hpr-register-professional
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Register the professional's profile
summary: Adds qualifications, council registration and current work to an HPID
  that already exists.
generated: true
operation: m4_post_v1_doctors_register_professional_new
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_v1_doctors_register_professional_new.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_v1_doctors_register_professional_new.mdx#m4-hpr-register-professional.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-register-professional
  concepts:
    - hiecm.concept.gateway-session
---

# Register the professional's profile

## In plain words

An [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) is an identity. This call turns it into a profile in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr). The `practitioner` object carries personal details, qualifications and council registration under `registrationAcademic`, and current work under `currentWorkDetails`. The body also carries the `hprToken`.

## Before you start

The `token` returned when the HPID was created, sent as `hprToken`. Council, course, college, university, state, district and language values from the HPR master data calls, not typed by hand.

## How you know it worked

The response carries the `hprId`, a `status`, a `message` and a `referenceNumber`. Read the profile back with the professional info call to confirm it holds what you sent.
