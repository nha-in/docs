---
id: uhi.test.pmjay-hem-context
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM test cases for the context block
summary: TC-A01 to TC-A03 check that the Gateway accepts your search, results
  match its transaction id, and the domain is nic2004:85112.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/pmjay-hem.md
    status: page
    note: Generated from
      site/docs/uhi/v1/resources/pmjay-hem.md#a-the-context-block. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.context-block
    - uhi.concept.match-transaction-id
  glossary:
    - uhi.glossary.context-domain
  flows:
    - uhi.flow.pmjay-hem-discovery
---

# PM-JAY HEM test cases for the context block

## In plain words

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-A01 | Your search is well formed and the Gateway accepts it. | You send a `search` with every `context` field populated. The Gateway returns HTTP 200 with an ACK and no error. |
| TC-A02 | The results you receive belong to the search you sent. | `context.transaction_id` in the `on_search` at your `consumer_uri` equals the `transaction_id` of the originating `search` exactly. |
| TC-A03 | The response is for PM-JAY HEM. | `context.domain` in the `on_search` is present and equals `nic2004:85112`. |
