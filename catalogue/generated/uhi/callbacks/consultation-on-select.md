---
id: uhi.callback.consultation-on-select
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send a quoted draft order
summary: Physical Consultation does not use on_select. The HSPA sends the quote
  in on_init, in answer to init.
generated: true
operation: uhi_consultation_on_select
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_select.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_select.mdx#consultation-on-select.
      Edit the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-select
  callbacks:
    - uhi.callback.consultation-on-init
  flows:
    - uhi.flow.consultation-order
---

# Send a quoted draft order

## In plain words

Do not implement `on_select` for Physical Consultation. The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends the `order.id` and the quote in `on_init`, in answer to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s `init`. See [Physical Consultation](/docs/uhi/v1/services/consultation).

## What happens

`on_init` carries the `order.id`, the quote and five terms. The EUA uses that `order.id` in `confirm` and every call after it.
