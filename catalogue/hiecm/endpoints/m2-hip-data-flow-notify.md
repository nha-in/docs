---
id: hiecm.endpoint.m2-hip-data-flow-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Notify the gateway that a data transfer finished
summary: After pushing the records, the HIP reports the transfer with a session
  status and a status per care context.
generated: true
operation: m2_post_data_flow_v3_health_information_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_data_flow_v3_health_information_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_data_flow_v3_health_information_notify.mdx#m2-hip-data-flow-notify.
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

# Notify the gateway that a data transfer finished

## In plain words

After you push the encrypted records to the `dataPushUrl`, call this to report the transfer. Set `notifier.type` to `HIP`. Set `sessionStatus` to `TRANSFERRED` or `FAILED`. Give each care context a `hiStatus` of `DELIVERED` or `ERRORED`.

## Before you start

A gateway session token, and the `transactionId` and consent artefact id of the request. Send the `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID` headers.

## What happens

`doneAt` is a UTC date time. `hipId` is your HIP id. The call returns 202 Accepted.

## When it goes wrong

`ABDM-1031` (Invalid request): check the body. A `hiStatus` of `OK` is the HIU's value, not the HIP's. `ABDM-2402` (Invalid Timestamp): check `TIMESTAMP` against your clock. `ABDM-2404` (Invalid Request Id): send a fresh UUID in `REQUEST-ID`. `ABDM-2500` (Authorization header is missing): send the session token. `ABDM-9999` (Unknown exception) gives no cause.
