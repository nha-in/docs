---
id: hiecm.endpoint.m2-on-discover-care-contexts
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: On Discovery, HIP responds with found care contexts
summary: The HIP answers a discovery request with the patient's unlinked care
  contexts and how it matched the patient.
generated: true
operation: m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340.mdx#m2-on-discover-care-contexts.
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

# On Discovery, HIP responds with found care contexts

## In plain words

Answer a [discovery request](/docs/hiecm/v3/api/m2/endpoints/m2-callbacks/05-m2-post-v3-hip-patient-care-context-discover) with the patient's unlinked care contexts. Match the patient on the name, gender, year of birth and identifiers in the request, and say how in `matchedBy`. Share only records that are not linked yet. Echo the request's `transactionId`, and put its request id in `response.requestId`.

## Before you start

A gateway session token and the discovery request. Send the `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `X-HIU-ID` headers.

## What happens

`matchedBy` takes `MR`, `MOBILE`, `ABHA_NUMBER` or `ABHA_ADDRESS`. `hiType` is one value per patient entry, and `count` must equal the care contexts in it. The call returns 202 Accepted.

## When it goes wrong

A repeated answer is the `ABDM-1106` case, Duplicate On discovery request. Answer each discovery once. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
