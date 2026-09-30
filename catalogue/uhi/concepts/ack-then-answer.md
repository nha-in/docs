---
id: uhi.concept.ack-then-answer
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: ACK now, answer later on UHI
summary: The HTTP response to a UHI call is only an ACK receipt; the business
  answer arrives later as a separate call to your callback URL.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/messages.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/messages.mdx#ack-now-answer-later. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.context-block
    - uhi.concept.match-transaction-id
    - uhi.concept.timeouts
  troubleshooting:
    - uhi.troubleshooting.http-statuses
---

# ACK now, answer later on UHI

## In plain words

The HTTP response to any UHI call is a receipt, not a result. The receiver returns `200` with this body as soon as the request is accepted:

```json
{ "message": { "ack": { "status": "ACK" } }, "error": {} }
```

Your own callback endpoints must do the same. Return `200` and the `ACK` body at once, then process the request. The business answer goes back as a new call, such as `on_search` in reply to `search`.

- **An EUA** receives answers on its `consumer_uri`, for example at `<consumer_uri>/on_search`.
- **An HSPA** receives direct calls on its `provider_uri`.

Both URLs must be public and reachable over HTTPS.

## What happens

On every endpoint you serve, return `200` with the `ACK` body before any processing. Then send the business answer as a new call. Never wait for a result in the HTTP response of a call you sent.

## How you know it worked

Your endpoint answers `200` with `ACK` at once, and the answer reaches the other side later as its own call, such as `on_search`.

## When it goes wrong

Code that reads results from the response to `search` finds only the receipt and shows nothing. An endpoint that does not return `200` at once can leave the sender with an `ACK` and no callback.
