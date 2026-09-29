---
id: uhi.concept.match-transaction-id
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Matching a UHI callback on transaction_id and message_id
summary: Store transaction_id and message_id before you send, and look each
  callback up by transaction_id first; a mismatch hides every result.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/messages.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/messages.mdx#match-on-transaction-id-and-message-id.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.context-block
    - uhi.concept.aggregate-answers
  callbacks:
    - uhi.callback.network-on-search
---

# Matching a UHI callback on transaction_id and message_id

## In plain words

| Field | Scope | Use it to |
| --- | --- | --- |
| `transaction_id` | One exchange, from `search` through `confirm` | Group every callback that belongs to one patient's search and booking |
| `message_id` | One request and its callback | Tie one callback to the request that caused it |

An HSPA echoes both values in its `on_search`. A mismatch is the most common reason an EUA never sees results. Store both before you send, and look each callback up by `transaction_id` first.

## What happens

Store `transaction_id` and `message_id` against the patient's request before the call leaves. On each callback, find the exchange by `transaction_id`, then the request by `message_id`.

## How you know it worked

Every `on_search` your app receives resolves to a stored exchange, and its results render on that patient's screen.

## When it goes wrong

Results never render: compare the callback's `transaction_id` with the one you stored. A callback whose `transaction_id` matches no stored exchange is logged with its `message_id` and never attached to another exchange.
