---
id: uhi.concept.audit-copies
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Audit copies a Physical Consultation HSPA sends the Gateway
summary: A Physical Consultation HSPA sends the UHI Gateway an exact copy of
  each on_confirm, on_status, on_update and on_cancel it sends the EUA.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/routes.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/routes.mdx#audit-copies. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.consultation-on-confirm-audit
    - uhi.endpoint.consultation-on-status-audit
    - uhi.endpoint.consultation-on-update-audit
    - uhi.endpoint.consultation-on-cancel-audit
  glossary:
    - uhi.glossary.audit-copy
---

# Audit copies a Physical Consultation HSPA sends the Gateway

## In plain words

The Gateway does not see a direct call. A Physical Consultation HSPA therefore sends the Gateway an exact copy of four callbacks, as well as sending each one to the EUA.

| Callback to the EUA | Audit copy to the Gateway |
| --- | --- |
| `on_confirm` | `POST /api/v1/uhi/on_confirm_audit` |
| `on_status` | `POST /api/v1/uhi/on_status_audit` |
| `on_update` | `POST /api/v1/uhi/on_update_audit`, including the care context ID |
| `on_cancel` | `POST /api/v1/uhi/on_cancel_audit` |

## Before you start

Your system is a Physical Consultation HSPA. No other service sends audit copies.

## What happens

After each `on_confirm`, `on_status`, `on_update` or `on_cancel` to the EUA, send the same body to the matching audit endpoint. Sign it as you sign every outbound call.

## How you know it worked

Every one of the four callbacks your HSPA sends has a matching audit call with an identical body.

## When it goes wrong

A body edited between the callback and its copy is not an exact copy. An `on_update` copy without the care context ID is incomplete.
