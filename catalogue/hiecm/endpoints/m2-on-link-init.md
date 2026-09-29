---
id: hiecm.endpoint.m2-on-link-init
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link On-Init, HIP responds with OTP communication details
summary: The HIP answers a link init request with a link reference number and
  where it sent the patient's OTP.
generated: true
operation: m2_post_user_initiated_linking_v3_link_care_context_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_link_care_context_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_link_care_context_on_init.mdx#m2-on-link-init.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.gateway-session
---

# Link On-Init, HIP responds with OTP communication details

## In plain words

Answer a [link init request](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/06-m2-post-v3-hip-link-care-context-init) here. Generate a unique link reference number. Send an [OTP](/docs/hiecm/v3/getting-started/glossary#otp) to the mobile number you hold for the patient. Return the reference in `link.referenceNumber`, and say where the code went and when it expires in `link.meta`.

## Before you start

A gateway session token and the init request. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

`authenticationType` is `DIRECT` or `MEDIATED`. `communicationMedium` is `MOBILE` or `EMAIL`. `communicationExpiry` is a UTC date time. Echo `transactionId`, and put the init request's `REQUEST-ID` in `requestId`. The call returns 202 Accepted.

## How you know it worked

A confirm request arrives on `/api/v3/hip/link/care-context/confirm`, carrying your reference number as `linkRefNumber`.

## When it goes wrong

A repeated answer is the `ABDM-1107` case, Duplicate On init request. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
