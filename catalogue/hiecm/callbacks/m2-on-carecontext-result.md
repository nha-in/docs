---
id: hiecm.callback.m2-on-carecontext-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the care context linking call you made
summary: ABDM's answer to your link request says whether the care context is
  linked; it is the linking flow's exit condition.
generated: true
operation: m2_post_v3_link_on_carecontext
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m2_post_v3_link_on_carecontext.mdx#m2-on-carecontext-result.
      Edit the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m2-hip-link-care-context
  flows:
    - hiecm.flow.m2-link-care-context
  concepts:
    - hiecm.concept.asynchronous-callbacks
  errors:
    - hiecm.error.abdm-9999
---

# The outcome of the care context linking call you made

## In plain words

Read `status` for the outcome: `Successfully Linked care context`, or `Failed to link care context` with an `error`. Match the callback to your link call by `response.requestId`, which echoes the `REQUEST-ID` you sent. Treat the care context as linked only when this callback says so.

## Before you start

Store the `REQUEST-ID` of the link call before you send it, so a fast callback still finds a match.

## How you know it worked

A callback with `status` of `Successfully Linked care context` and a `requestId` equal to your stored `REQUEST-ID`. Answer it with 200 OK.

## When it goes wrong

No callback arrives: check that the callback URL is public, registered and quick to answer. An `error` object is the answer, not a delivery fault: read the code and stop retrying the link call. Make the handler idempotent on `requestId`.
