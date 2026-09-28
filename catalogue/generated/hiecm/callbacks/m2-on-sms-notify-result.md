---
id: hiecm.callback.m2-on-sms-notify-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the SMS notify call you made
summary: The acknowledgement status on this callback says whether the SMS was
  accepted for sending, not whether it was delivered.
generated: true
operation: m2_post_v3_patients_sms_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_patients_sms_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_patients_sms_on_notify.mdx#m2-on-sms-notify-result.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m2-sms-deep-link-notify
  flows:
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.asynchronous-callbacks
  errors:
    - hiecm.error.abdm-9999
---

# The outcome of the SMS notify call you made

## In plain words

`acknowledgement.status` is `SUCCESS` when the message was accepted for sending, and `ERRORED` when it was not. Accepted is not delivered: this callback does not report whether the patient received the message. Match it to your call by `response.requestId`.

## Before you start

Store the `REQUEST-ID` of the notify call before you send it.

## How you know it worked

A callback with `acknowledgement.status` of `SUCCESS` and a `requestId` equal to your stored `REQUEST-ID`. Answer it with 200 OK.

## When it goes wrong

No callback arrives: check that the callback URL is public, registered and quick to answer. An `error` object is the answer, not a delivery fault: read the code before you call again.
