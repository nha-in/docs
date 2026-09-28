---
id: uhi.concept.aggregate-answers
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Aggregating the on_search answers to one UHI search
summary: Each matching HSPA answers a search separately, so group the on_search
  answers by their shared transaction_id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/build-it-well.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/build-it-well.mdx#aggregate-the-answers.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.match-transaction-id
    - uhi.concept.timeouts
  callbacks:
    - uhi.callback.network-gateway-on-search
---

# Aggregating the on_search answers to one UHI search

## In plain words

The [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) broadcasts
a search to every HSPA registered for the domain. Each matching HSPA replies
separately, so group them by the shared `transaction_id`.

| Service | What to expect |
| --- | --- |
| PM-JAY HEM, Jan Aushadhi, NOTTO | One HSPA, so one `on_search` per search |
| Blood Bank | Several HSPAs. Aggregate within a 10 to 15 second window |
| Physical Consultation | One catalog per HSPA with doctors, fees and `provider_uri` |
| Ambulance Booking | Only HSPAs that serve the pickup area answer. Silence means no coverage, not a network fault |
