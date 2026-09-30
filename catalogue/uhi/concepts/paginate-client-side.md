---
id: uhi.concept.paginate-client-side
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Paginating UHI search results on your side
summary: on_search is not paginated, so handle a large payload without blocking
  the screen and page through it in your own UI.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/build-it-well.mdx#paginate-on-your-side.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.render-as-results-arrive
  callbacks:
    - uhi.callback.network-gateway-on-search
---

# Paginating UHI search results on your side

## In plain words

`on_search` is not paginated. Handle a large payload without blocking the
screen, and page through it in your own UI.
