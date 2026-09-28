---
id: hiecm.endpoint.p3-request-status
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get the status of a health information request
summary: Check how far a health information request has got, by its transaction id.
generated: true
operation: m3_get_data_flow_v3_health_information_request_status_tra_550104
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_get_data_flow_v3_health_information_request_status_tra_550104.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_get_data_flow_v3_health_information_request_status_tra_550104.mdx#p3-request-status.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-fetch-records
  concepts:
    - hiecm.concept.gateway-session
  callbacks:
    - hiecm.callback.p3-call-back-to-hiu
---

# Get the status of a health information request

## In plain words

Returns the current status of a health information request. Pass the transaction id from the health information on-request callback in the path as `transaction-id`.

## Before you start

`X-CM-ID` and the `transactionId` from the on-request callback.

## How you know it worked

You receive `200` with `transactionId` and `status`.

## When it goes wrong

`400` with `ABDM-1006` means the request is invalid.
