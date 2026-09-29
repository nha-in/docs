---
id: uhi.test.pmjay-hem-edge-cases
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM test cases for edge cases
summary: TC-E01 to TC-E03 check a very long result list, a search that matches
  no hospital, and an on_search that never arrives.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/pmjay-hem.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/pmjay-hem.md#e-edge-cases. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.timeouts
    - uhi.concept.paginate-client-side
    - uhi.concept.pmjay-hem-limits
  flows:
    - uhi.flow.pmjay-hem-discovery
---

# PM-JAY HEM test cases for edge cases

## In plain words

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-E01 | A very long list still works. | A state only search for a high density state, such as Andhra Pradesh or Maharashtra, renders the full list without a crash or timeout. Scroll and filter work across all records. |
| TC-E02 | No matching hospitals is handled. | A state and district search that matches nothing returns an `on_search` with an empty `providers[]`. Your app shows a fallback message, with no crash and no unhandled state. |
| TC-E03 | A missing response does not leave the user waiting. | When no `on_search` arrives, your app shows a timeout message after its configured window and lets the user retry. It never stays loading indefinitely. |
