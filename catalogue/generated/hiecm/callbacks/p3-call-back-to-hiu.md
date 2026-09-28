---
id: hiecm.callback.p3-call-back-to-hiu
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Health information request acknowledgement
summary: ABDM tells the HIU that its health information request is valid for the
  consent it names.
generated: true
operation: m3_post_v3_hiu_health_information_on_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_health_information_on_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_health_information_on_request.mdx#p3-call-back-to-hiu.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-fetch-records
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p3-request-status
---

# Health information request acknowledgement

## In plain words

ABDM posts here once it has validated your health information request against the consent. On success, `hiRequest.transactionId` is the transaction the facility sends the data under.

## What happens

Either `hiRequest` or `error` is present. Keep the `transactionId`: the request status call takes it.

## How you know it worked

`hiRequest` is present with a `sessionStatus`. Answer with `200`.
