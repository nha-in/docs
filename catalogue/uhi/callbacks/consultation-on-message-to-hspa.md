---
id: uhi.callback.consultation-on-message-to-hspa
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send a message to the HSPA
summary: The EUA sends an in-app chat message directly to the HSPA, for which
  this endpoint is optional.
generated: true
operation: uhi_consultation_on_message_to_hspa
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_message_to_hspa.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_message_to_hspa.mdx#consultation-on-message-to-hspa.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-message-to-eua
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.signing-headers
  flows:
    - uhi.flow.consultation-post-fulfilment
---

# Send a message to the HSPA

## In plain words

The [EUA](/docs/uhi/v1/getting-started/glossary#eua) sends an in-app chat message [directly](/docs/uhi/v1/getting-started/glossary#direct-call-p2p) to the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa)'s [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri). The message carries its sender, its receiver, the content and a timestamp. This endpoint is optional for an HSPA. See [Physical Consultation](/docs/uhi/v1/services/consultation#journey-4-post-fulfilment).

Sign every request with a fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

An order with this HSPA, and its `transaction_id`.

## What happens

The content goes in `content_value`, Base64 encoded, with its kind in `content_type`, such as `text`.

## How you know it worked

An HTTP 200 carrying `ACK` from the HSPA.

## When it goes wrong

A 401 means the signature was built over a different body, was reused, or has expired.
