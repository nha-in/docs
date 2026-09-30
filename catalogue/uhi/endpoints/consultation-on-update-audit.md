---
id: uhi.endpoint.consultation-on-update-audit
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Copy on_update to the Gateway audit
summary: The HSPA sends the UHI Gateway an exact copy of each on_update it sends
  the EUA; this copy counts for the Digital Health Incentive Scheme.
generated: true
operation: uhi_consultation_on_update_audit
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_update_audit.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_update_audit.mdx#consultation-on-update-audit.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-update-to-eua
  concepts:
    - uhi.concept.audit-copies
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.consultation-fulfilment
---

# Copy on_update to the Gateway audit

## In plain words

After the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends `on_update` to the [EUA](/docs/uhi/v1/getting-started/glossary#eua), it sends an exact copy of it here, to the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway). The Gateway does not see a [direct call](/docs/uhi/v1/getting-started/glossary#direct-call-p2p), so this [audit copy](/docs/uhi/v1/getting-started/glossary#audit-copy) is how it learns of one. It carries the care context id in `@abdm/gov.in/care_context_id`. This is the copy that counts for the Digital Health Incentive Scheme (DHIS). See [Audit copies](/docs/uhi/v1/concepts/routes#audit-copies).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

As a Physical Consultation HSPA, an `on_update` already sent to the EUA.

## What happens

Send the same body you sent the EUA, unchanged, and sign it with a fresh header. Send one copy for each `on_update` you send the EUA.

## How you know it worked

An HTTP 200 carrying `ACK` from the Gateway.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired. Build a new header for this call rather than reusing the one you sent the EUA.
