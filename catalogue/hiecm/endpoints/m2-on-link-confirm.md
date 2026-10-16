---
id: hiecm.endpoint.m2-on-link-confirm
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link On-Confirm, HIP confirms linked care contexts
summary: The HIP checks the patient's code and answers a link confirm request
  with the care contexts it linked.
generated: true
operation: m2_post_user_initiated_linking_v3_link_care_context_on_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_link_care_context_on_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_link_care_context_on_confirm.mdx#m2-on-link-confirm.
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

# Link On-Confirm, HIP confirms linked care contexts

## In plain words

Answer a [link confirm request](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/07-m2-post-v3-hip-link-care-context-confirm) here. Check the code the patient entered against the one you sent for that link reference number. On success, return the linked care contexts in `patient`. On failure, return `error`. Include `response.requestId` either way.

## Before you start

A gateway session token and the confirm request. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

A wrong or expired code is a failure: send `error` with a `code` and a `message` the patient can read. No code is published for a wrong code; the sandbox accepts `ABDM-9999` with a message and answers 202. `hiType` is one value per patient entry, such as `Prescription`, and `count` must equal its care contexts. The call returns 202 Accepted.

## When it goes wrong

`ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
