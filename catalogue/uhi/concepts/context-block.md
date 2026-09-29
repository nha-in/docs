---
id: uhi.concept.context-block
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: The context block every UHI call carries
summary: Every UHI call starts with a context block naming the service, the
  sender, the callback URL and the ids that match an answer to its request.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/messages.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/messages.mdx#the-context-block.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.match-transaction-id
    - uhi.concept.ack-then-answer
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.consumer-uri
---

# The context block every UHI call carries

## In plain words

Every call, in both directions, starts with the same block. Build a fresh one for each request.

```json
{
  "context": {
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "<YOUR_SUBSCRIBER_ID_FROM_SANDBOX_REGISTRATION>",
    "consumer_uri": "<YOUR_HTTPS_CALLBACK_BASE_URL>",
    "message_id": "<NEW_UUID>",
    "transaction_id": "<NEW_UUID_FOR_A_NEW_EXCHANGE>",
    "timestamp": "<NOW_IN_UTC_RFC3339>"
  }
}
```

| Field | Required | What it holds |
| --- | --- | --- |
| `domain` | Yes | The service, such as `nic2004:85112` for PM-JAY HEM. The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) routes a search to every [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) registered for it. [Each service's value](/docs/uhi/v1/services) |
| `country` | Yes | `IND` |
| `city` | Yes | `std:011` |
| `action` | Yes | The name of this call, such as `search` or `on_search` |
| `core_version` | Yes | `0.7.1` |
| `consumer_id` | Yes | The [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s subscriber ID |
| `consumer_uri` | Yes | The EUA's callback base URL. It must share a domain name with `consumer_id` |
| `provider_id` | No | The HSPA's subscriber ID |
| `provider_uri` | No | The HSPA's base URL for direct calls |
| `message_id` | Yes | Unique for one request and its callback |
| `transaction_id` | Yes | Unique for one exchange, and the same on every call from `search` through `confirm` |
| `timestamp` | Yes | When the request was generated, in RFC 3339 format |
| `key` | No | The sender's encryption public key |
| `ttl` | No | How long after `timestamp` the message stays valid, as an ISO 8601 duration |

Times inside `message`, such as a fulfillment's start and end, follow ISO 8601 without a time zone: `2022-07-15T00:00:00`.

## Before you start

A subscriber ID from sandbox registration, and a public HTTPS callback base URL that shares a domain name with it.

## What happens

Build a new `context` for every request, with a new `message_id` and a current `timestamp`. Create a new `transaction_id` only when an exchange starts at `search`, and reuse it on every call through `confirm`. Set `action` to the call you are making and `domain` to the value on the service page.

## How you know it worked

The `on_search` for your request echoes your `transaction_id` and `message_id`, and arrives on your `consumer_uri`.

## When it goes wrong

No callback arrives: check that `consumer_uri` is public over HTTPS and shares a domain name with `consumer_id`. A `transaction_id` reused across two exchanges mixes their callbacks, so neither can be matched.
