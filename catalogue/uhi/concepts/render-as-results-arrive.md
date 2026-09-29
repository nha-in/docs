---
id: uhi.concept.render-as-results-arrive
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Timing out a UHI search and rendering results as they arrive
summary: Render each on_search as it arrives, keep the timeout configurable, and
  show a fallback or retry instead of a screen left loading.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/build-it-well.mdx#time-out-and-render-as-results-arrive.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.timeouts
    - uhi.concept.paginate-client-side
---

# Timing out a UHI search and rendering results as they arrive

## In plain words

A search has no end signal. Nothing tells you the last answer has arrived.

- Set a timeout for each search, and keep it a configuration value.
- Render each `on_search` as it arrives. Do not wait for all of them.
- When the timeout passes with nothing received, stop waiting and offer a retry. Never leave the screen loading.
- An empty result is a result. Show a fallback message and suggest a wider search.

Blood Bank's window is 10 to 15 seconds. No figure is set for the other
services, so agree one at onboarding.
