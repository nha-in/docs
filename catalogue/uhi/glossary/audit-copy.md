---
id: uhi.glossary.audit-copy
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: Audit copy, the callback copy a Physical Consultation HSPA sends the Gateway
summary: An exact copy of on_confirm, on_status, on_update or on_cancel that a
  Physical Consultation HSPA sends to the UHI Gateway.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#audit-copy. Edit the page,
      never this file.
related:
  concepts:
    - uhi.concept.audit-copies
  endpoints:
    - uhi.endpoint.consultation-on-confirm-audit
    - uhi.endpoint.consultation-on-update-audit
  glossary:
    - uhi.glossary.direct-call-p2p
---

# Audit copy, the callback copy a Physical Consultation HSPA sends the Gateway

## In plain words

An exact copy of `on_confirm`, `on_status`, `on_update` or `on_cancel` that a Physical Consultation [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends to the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway), at `/api/v1/uhi/on_<callback>_audit`. The Gateway does not see [direct calls](/docs/uhi/v1/getting-started/glossary#direct-call-p2p), so it receives these copies instead. See [Routes](/docs/uhi/v1/concepts/routes#audit-copies).
