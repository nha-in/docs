---
id: uhi.endpoint.consultation-on-status-audit
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Copy on_status to the Gateway audit
summary: The HSPA sends the UHI Gateway an exact copy of each on_status it sends
  the EUA, with the care context id.
generated: true
operation: uhi_consultation_on_status_audit
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_status_audit.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_status_audit.mdx#consultation-on-status-audit.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-status
  concepts:
    - uhi.concept.audit-copies
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.consultation-fulfilment
---

# Copy on_status to the Gateway audit

## In plain words

After the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends `on_status` to the [EUA](/docs/uhi/v1/getting-started/glossary#eua), it sends an exact copy of it here, to the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway). The Gateway does not see a [direct call](/docs/uhi/v1/getting-started/glossary#direct-call-p2p), so this [audit copy](/docs/uhi/v1/getting-started/glossary#audit-copy) is how it learns of one. It carries the care context id in `@abdm/gov.in/care_context_id`. See [Audit copies](/docs/uhi/v1/concepts/routes#audit-copies).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

As a Physical Consultation HSPA, an `on_status` already sent to the EUA.

## What happens

Send the same body you sent the EUA, unchanged, and sign it with a fresh header.

## How you know it worked

An HTTP 200 carrying `ACK` from the Gateway.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired. Build a new header for this call rather than reusing the one you sent the EUA.
