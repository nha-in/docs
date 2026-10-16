---
id: hiecm.callback.m3-on-health-information-request
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: Acknowledgement of a health information request
summary: ABDM acknowledges an HIU's data request with its transaction id and
  status; the records come separately.
generated: true
operation: m3_post_v3_hiu_health_information_on_request
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m3_post_v3_hiu_health_information_on_request.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m3_post_v3_hiu_health_information_on_request.mdx#m3-on-health-information-request.
      Edit the page, never this file.
related:
  errors:
    - hiecm.error.abdm-9999
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# Acknowledgement of a health information request

## In plain words

After you [request health information](/docs/hiecm/v3/api/m3/endpoints/m3-consent-management-data-flow-hiu/05-m3-post-data-flow-v3-health-information-request), ABDM answers on your [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) bridge at `/api/v3/hiu/health-information/on-request`. It carries the `transactionId` and the request's `sessionStatus`. This is an acknowledgement, not the records. The records arrive at the `dataPushUrl` you supplied.

## Before you start

Store the `REQUEST-ID` of the request call before you send it.

## What happens

ABDM posts with the `REQUEST-ID`, `TIMESTAMP` and `X-HIU-ID` headers, and expects 200 OK. Keep `transactionId`: the pushed data and the transfer notification carry it.

## When it goes wrong

An `error` in place of `hiRequest` means the request was refused, and no data is pushed for it.
