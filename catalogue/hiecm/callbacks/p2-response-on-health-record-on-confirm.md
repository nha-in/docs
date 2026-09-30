---
id: hiecm.callback.p2-response-on-health-record-on-confirm
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Link confirm result callback
summary: ABDM posts the outcome of the confirm call, listing the care contexts
  now linked.
generated: true
operation: p2_post_v3_hiu_patient_care_context_on_confirm
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_confirm.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_confirm.mdx#p2-response-on-health-record-on-confirm.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-link-care-context-confirm
    - hiecm.endpoint.p3-get-all-links-records
---

# Link confirm result callback

## In plain words

ABDM posts the outcome of the confirm call here. On success it lists the care contexts now linked to the person's [ABHA address](/docs/hiecm/v3/getting-started/glossary#abha-address). On failure it carries an `error` instead.

## How you know it worked

`careContexts` lists the linked records. Answer with `200`. The links then appear in the get all links call.

## When it goes wrong

An `error` object instead of `patient` means nothing was linked. Show the error `message` to the person and do not mark the records as linked.
