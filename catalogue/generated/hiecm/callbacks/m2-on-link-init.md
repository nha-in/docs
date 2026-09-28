---
id: hiecm.callback.m2-on-link-init
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: A request to start linking a care context
summary: ABDM posts the care contexts a patient chose to link; the HIP issues a
  link reference number and sends an OTP.
generated: true
operation: m2_post_v3_hip_link_care_context_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_init.mdx#m2-on-link-init.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# A request to start linking a care context

## In plain words

When the patient picks care contexts to link, ABDM posts them to your bridge at `/api/v3/hip/link/care-context/init`. Generate a link reference number and send an [OTP](/docs/hiecm/v3/getting-started/glossary#otp) to the mobile number you hold for the patient. Then answer through [on-init](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-user-initiated-linking-hip/02-m2-post-user-initiated-linking-v3-link-care-context-on-init).

## Before you start

The `transactionId` from the discovery request.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers. The body carries `transactionId`, `abhaAddress` and the `patient` care contexts to link.

## When it goes wrong

A repeated init request is the `ABDM-1104` case, Duplicate Init request. An on-init answer that cannot be accepted is the `ABDM-1110` case, Invalid On init response.
