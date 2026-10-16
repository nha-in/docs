---
id: uhi.endpoint.consultation-select
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Select items and build an order
summary: Physical Consultation does not use select. After the second on_search,
  the EUA goes straight to init.
generated: true
operation: uhi_consultation_select
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_select.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_select.mdx#consultation-select. Edit
      the page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-init
  callbacks:
    - uhi.callback.consultation-on-select
  flows:
    - uhi.flow.consultation-order
---

# Select items and build an order

## In plain words

Do not implement `select` for Physical Consultation. After the second `on_search` returns the doctor's slots, the [EUA](/docs/uhi/v1/getting-started/glossary#eua) sends `init` directly. See [Physical Consultation](/docs/uhi/v1/services/consultation).

## What happens

The order starts with `init`, sent directly to the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa)'s `provider_uri`. The HSPA answers with `on_init`.
