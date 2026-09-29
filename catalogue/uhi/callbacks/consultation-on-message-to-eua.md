---
id: uhi.callback.consultation-on-message-to-eua
type: callback
gateway: uhi
milestone: n/a
version: uhi-v1
title: Send a message to the EUA
summary: The HSPA sends an in-app chat message to the EUA, which every EUA must
  accept at its /on_message endpoint.
generated: true
operation: uhi_consultation_on_message_to_eua
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_consultation_on_message_to_eua.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_consultation_on_message_to_eua.mdx#consultation-on-message-to-eua.
      Edit the page, never this file.
related:
  callbacks:
    - uhi.callback.consultation-on-message-to-hspa
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.verifying-signatures
  flows:
    - uhi.flow.consultation-post-fulfilment
---

# Send a message to the EUA

## In plain words

The [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) sends an in-app chat message to the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri). The message carries its sender, its receiver, the content and a timestamp. Every EUA must expose this endpoint. See [Physical Consultation](/docs/uhi/v1/services/consultation#journey-4-post-fulfilment).

## Before you start

As the HSPA, an order with this EUA. Sign with your own `Authorization` header and keep the order's `transaction_id`.

## What happens

The content goes in `content_value`, Base64 encoded, with its kind in `content_type`, such as `text`. The EUA returns an `ACK` at once, then shows the message.

## How you know it worked

An HTTP 200 carrying `ACK` from the EUA.

## When it goes wrong

As the EUA, check the signature against the HSPA's key from the [registry lookup](/docs/uhi/v1/concepts/registry-lookup) before you show the message.
