---
id: uhi.test.ambulance-context
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking test cases for the context block
summary: AMB-A-01 to AMB-A-04 check the search context fields, a missing
  callback address, a mismatched transaction and where init is sent.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/ambulance.md
    status: page
    note: Generated from site/docs/uhi/v1/resources/ambulance.md#a-context. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.context-block
    - uhi.concept.match-transaction-id
  flows:
    - uhi.flow.ambulance-discovery
    - uhi.flow.ambulance-order
---

# Ambulance Booking test cases for the context block

## In plain words

| ID | In plain words | Passes when |
| --- | --- | --- |
| AMB-A-01 | A search carries every context field the network needs. | A `search` with `domain`, `country`, `action`, `core_version`, `consumer_id`, `consumer_uri`, `message_id`, `timestamp` and `transaction_id`, all correctly valued, gets an ACK from the Gateway and is forwarded to HSPAs. |
| AMB-A-02 | A search with no callback address is refused. | A `search` without `consumer_uri` gets a NACK from the Gateway with an error code. |
| AMB-A-03 | The EUA catches a quote that belongs to another transaction. | An `on_init` whose `transaction_id` differs from the originating `init` is rejected or flagged as mismatched by the EUA. |
| AMB-A-04 | The EUA sends `init` to the provider that answered the search. | An `init` carrying `provider_id` and `provider_uri` from `on_search` reaches the HSPA, which returns ACK. |
