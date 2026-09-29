---
id: uhi.glossary.context-domain
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: context.domain, the field that names a UHI service
summary: The context field that names the UHI service a call belongs to. The
  Gateway sends a search to every HSPA registered for it.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#context-domain. Edit the page,
      never this file.
related:
  concepts:
    - uhi.concept.context-block
  glossary:
    - uhi.glossary.fulfillment-type
    - shared.glossary.gateway
---

# context.domain, the field that names a UHI service

## In plain words

The field in every call's `context` block that names the service, such as `nic2004:85111` for Physical Consultation. The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) sends a search to every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) registered for that domain. See [Services](/docs/uhi/v1/services) for each service's value.
