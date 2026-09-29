---
id: uhi.concept.error-send-and-log
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: What to send and log when a UHI call fails
summary: Send all four error fields when you reject a call, and log all four
  with the call's transaction_id and message_id when you receive one.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/errors.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/errors.mdx#send-and-log. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.error-object
    - uhi.concept.match-transaction-id
---

# What to send and log when a UHI call fails

## In plain words

**When you reject a call**, send all four fields. Fill `path` whenever the failure is a schema validation failure, so the sender can find the field.

**When you receive an error**, log all four fields with the call's `transaction_id` and `message_id`. Those two values tie the error to the exchange. See [Messages and callbacks](/docs/uhi/v1/concepts/messages#match-on-transaction-id-and-message-id).

## What happens

Act on the HTTP status and on whether `error` is empty. Never branch on a `code` value, because no code list is published.
