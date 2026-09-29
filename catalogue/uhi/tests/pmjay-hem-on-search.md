---
id: uhi.test.pmjay-hem-on-search
type: test
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM test cases for on_search
summary: TC-C01 to TC-C09 check that results arrive and every hospital carries
  its id, core details, dates, location, nodal officer and specialities.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/resources/pmjay-hem.md
    status: page
    note: Generated from
      site/docs/uhi/v1/resources/pmjay-hem.md#c-the-on-search-response. Edit the
      page, never this file.
related:
  callbacks:
    - uhi.callback.network-gateway-on-search
  concepts:
    - uhi.concept.pmjay-hem-service-identity
    - uhi.concept.pmjay-hem-limits
  flows:
    - uhi.flow.pmjay-hem-discovery
---

# PM-JAY HEM test cases for on_search

## In plain words

| ID | What it checks | Passes when |
| --- | --- | --- |
| TC-C01 | The results reach your app. | After a valid `search`, the `on_search` payload arrives at your `consumer_uri` within your timeout window. |
| TC-C02 | Every hospital has an ID. | Each `catalog.providers[].id` is a non-null string, for example `HOSP27G13867`. |
| TC-C03 | Every hospital has its core details. | `id`, `descriptor.name`, `location.gps` and `contact.phone` are present on each provider, and none is null or empty. |
| TC-C04 | Every hospital has its empanelment date. | Each provider has a `fulfillments[]` entry with `type: Empaneled Date` whose `start.time.timestamp` is a non-null string. |
| TC-C05 | Every hospital has its establishment date. | Each provider has a `fulfillments[]` entry with `type: Establishment Date` whose `start.time.timestamp` is a non-null string. |
| TC-C06 | Every hospital's location can be placed on a map. | Each `location.gps` is a comma separated `lat,long` string that parses as two valid decimal numbers. |
| TC-C07 | Every hospital has a PM-JAY nodal officer to call. | `contact.tags.nodalOfficerNumber` is a non-null numeric string on each provider. |
| TC-C08 | Every hospital lists its specialities. | Each provider has at least one `categories[]` entry with both `descriptor.name` and `descriptor.code`, and the code is a valid integer. |
| TC-C09 | Every hospital says whether it is government or private. | `descriptor.code` on each provider is a non-null, single character string, for example `G` or `P`. |
