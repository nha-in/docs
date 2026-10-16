---
id: hiecm.callback.p2-callback-on-health-record-discover
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Discovery result callback
summary: ABDM posts the care contexts a facility found for the person to your
  on-discover URL.
generated: true
operation: p2_post_v3_hiu_patient_care_context_on_discover
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_discover.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_discover.mdx#p2-callback-on-health-record-discover.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-care-context-discover
---

# Discovery result callback

## In plain words

ABDM posts the result of a discovery request to this path on your bridge. It lists the [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context) the facility found, grouped by patient reference and [HI type](/docs/hiecm/v3/getting-started/glossary#hi-type). Show them to the person so they can choose what to link.

## Before you start

A callback URL registered for your bridge and reachable from the public internet.

## What happens

Either `patient` or `error` is present, and `response` always is. Keep `transactionId`: the link init call sends it back.

## How you know it worked

`patient` holds at least one entry with `careContexts`. Answer with `200`.

## When it goes wrong

An `error` object instead of `patient` means discovery failed. Show the error `message` to the person and do not start linking.
