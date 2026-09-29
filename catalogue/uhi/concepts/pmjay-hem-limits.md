---
id: uhi.concept.pmjay-hem-limits
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM limits to code against
summary: GPS gaps, an unreliable accreditation flag, no end signal, no
  pagination and a lagging procedure list, each with what your EUA does about
  it.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/pmjay-hem.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/pmjay-hem.mdx#limits-to-code-against. Edit the
      page, never this file.
related:
  flows:
    - uhi.flow.pmjay-hem-discovery
  concepts:
    - uhi.concept.render-as-results-arrive
    - uhi.concept.paginate-client-side
  tests:
    - uhi.test.pmjay-hem-edge-cases
---

# PM-JAY HEM limits to code against

## In plain words

| Limit | What to do |
| --- | --- |
| GPS search can return incomplete results where hospital density is low | Offer district or pincode search next to GPS |
| `descriptor.flag` is not consistently populated | Do not filter on it. Show it when present. |
| `on_search` has no end of results signal | Close your wait with a timeout and render results as they arrive. See [Messages](/docs/uhi/v1/concepts/messages). |
| `on_search` is not paginated | Handle large payloads without blocking the UI. Paginate on the client. |
| The covered procedure list can lag package changes | Show a disclaimer and link to pmjay.gov.in for package and eligibility information |
