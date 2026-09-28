---
id: hiecm.callback.p2-response-on-health-record-link
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Link init result callback
summary: ABDM posts the facility's answer to a link request, with the reference
  and where the confirmation code went.
generated: true
operation: p2_post_v3_hiu_patient_care_context_on_init
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_init.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p2_post_v3_hiu_patient_care_context_on_init.mdx#p2-response-on-health-record-link.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.asynchronous-callbacks
  endpoints:
    - hiecm.endpoint.p2-link-care-context-init
    - hiecm.endpoint.p2-link-care-context-confirm
---

# Link init result callback

## In plain words

ABDM posts the facility's answer to your link request here. It carries a `link.referenceNumber` and says how the person will confirm. `link.meta.communicationMedium` is `MOBILE` or `EMAIL`, and `communicationHint` shows where the code went.

## What happens

Send `link.referenceNumber` as `linkRefNumber` in the confirm call, with the code the person received.

## How you know it worked

`link` is present and `communicationExpiry` is in the future. Answer with `200`.

## When it goes wrong

An `error` object instead of `link` means linking cannot go ahead. Show the error `message` and do not ask the person for a code.
