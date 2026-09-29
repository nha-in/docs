---
id: hiecm.callback.m2-on-link-confirm
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Confirmation of a link, carrying the token the patient approved
summary: ABDM posts the code the patient entered and the link reference number;
  the HIP checks them and answers on-confirm.
generated: true
operation: m2_post_v3_hip_link_care_context_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_hip_link_care_context_confirm.mdx#m2-on-link-confirm.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# Confirmation of a link, carrying the token the patient approved

## In plain words

After the patient enters the [OTP](/docs/hiecm/v3/getting-started/glossary#otp) you sent, ABDM posts it to your bridge at `/api/v3/hip/link/care-context/confirm`. `confirmation.token` is that six digit code. `confirmation.linkRefNumber` is the reference you issued at init. Check both, then answer through [on-confirm](/docs/hiecm/v3/api/m2/endpoints/m2-abdm-user-initiated-linking-hip/03-m2-post-user-initiated-linking-v3-link-care-context-on-confirm).

## Before you start

The link reference number you issued in on-init, and the code you sent the patient.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID` headers, and expects 200 OK.

## When it goes wrong

A repeated confirm request is the `ABDM-1105` case, Duplicate Confirm request. An on-confirm answer that cannot be accepted is the `ABDM-1111` case, Invalid On confirm response.
