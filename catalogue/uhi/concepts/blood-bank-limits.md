---
id: uhi.concept.blood-bank-limits
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Blood Bank limits to code against
summary: GPS gaps, stock counts that update at different rates, no end signal,
  no pagination and no reservation, each with what your EUA does about it.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/blood-bank.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/blood-bank.mdx#limits-to-code-against. Edit the
      page, never this file.
related:
  flows:
    - uhi.flow.blood-bank-discovery
  concepts:
    - uhi.concept.render-as-results-arrive
    - uhi.concept.paginate-client-side
---

# Blood Bank limits to code against

## In plain words

| Limit | What to do |
| --- | --- |
| GPS search can return incomplete results where blood bank density is low | Offer state and district search next to GPS, and surface both in your UI |
| Stock counts update at different frequencies, some in real time and some daily | Show a disclaimer that counts are indicative. Recommend a call to the blood bank before travelling. |
| `on_search` has no end of results signal | Wait 10 to 15 seconds. Show results as they arrive rather than waiting for all of them. |
| `on_search` is not paginated | Handle large payloads without blocking the UI. Paginate or lazy load on the client. |
| No booking or reservation | Keep your UI to discovery. Show the blood bank's phone number prominently so users can call to reserve or confirm. |
