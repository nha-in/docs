---
id: hiecm.callback.m2-on-context-notify-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the care context notify call you made
summary: The acknowledgement status on this callback says whether ABDM accepted
  your care context update.
generated: true
operation: m2_post_v3_links_context_on_notify
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_links_context_on_notify.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_links_context_on_notify.mdx#m2-on-context-notify-result.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m2-link-care-context-notify
  flows:
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.asynchronous-callbacks
  errors:
    - hiecm.error.abdm-9999
---

# The outcome of the care context notify call you made

## In plain words

Match the callback to your notify call by `response.requestId`, which echoes the `REQUEST-ID` you sent. An `acknowledgement.status` of `SUCCESS` means ABDM accepted the update. `ERRORED` means it did not, and `error` says why.

## Before you start

Store the `REQUEST-ID` of the notify call before you send it, so a fast callback still finds a match.

## How you know it worked

A callback with `acknowledgement.status` of `SUCCESS` and a `requestId` equal to your stored `REQUEST-ID`. Answer it with 200 OK.

## When it goes wrong

No callback arrives: check that the callback URL is public, registered and quick to answer. Make the handler idempotent on `requestId`, so a repeated delivery changes nothing.
