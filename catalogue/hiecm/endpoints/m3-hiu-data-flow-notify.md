---
id: hiecm.endpoint.m3-hiu-data-flow-notify
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Notify the gateway that data was received
summary: After the records arrive, the HIU reports receipt with a session status
  and a status per care context.
generated: true
operation: m3_post_data_flow_v3_health_information_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_data_flow_v3_health_information_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_data_flow_v3_health_information_notify.mdx#m3-hiu-data-flow-notify.
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

# Notify the gateway that data was received

## In plain words

After the records reach your `dataPushUrl`, call this to report receipt. Set `notifier.type` to `HIU`. Set `sessionStatus` to `RECEIVED`, or to `FAILED` when data was not sent or was invalid. Give each care context a `hiStatus` of `OK` or `ERRORED`.

## Before you start

A gateway session token and the `transactionId` of your health information request. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

The HIP uses the same path and reports `TRANSFERRED` and `DELIVERED` instead. The call returns 202 Accepted.

## When it goes wrong

`ABDM-1031` (Invalid request): check the body. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
