---
id: uhi.concept.timeouts
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Timeouts for a UHI search with no end signal
summary: A UHI search has no end signal, so set a configurable timeout, render
  each on_search as it arrives, and offer a retry when nothing comes.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/messages.mdx
    status: page
    note: Generated from site/docs/uhi/v1/concepts/messages.mdx#timeouts. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.render-as-results-arrive
    - uhi.concept.aggregate-answers
    - uhi.concept.paginate-client-side
  endpoints:
    - uhi.endpoint.network-gateway-search
---

# Timeouts for a UHI search with no end signal

## In plain words

A search has no end signal. The Gateway broadcasts it to every HSPA registered for the domain, and each one answers separately. Nothing tells you the last answer has arrived.

- Set a timeout for each search.
- Render each `on_search` as it arrives. Do not wait for all of them.
- Paginate on your side.
- When the timeout passes with nothing received, stop waiting and offer a retry.

Blood Bank's figure is 10 to 15 seconds. Aggregate its answers by `transaction_id` within that window.

## What happens

Read the timeout from configuration and start it when `search` is sent. Render each `on_search` for that `transaction_id` as it arrives. When the timeout passes, stop waiting on that exchange.

## How you know it worked

The first result shows before the timeout ends, and a search that gets no answer ends in a retry offer, not a loading screen.

## When it goes wrong

A screen that waits for a final answer never finishes, because no final answer is sent. A timeout fixed in code cannot take your service's figure once it is agreed at onboarding.
