---
id: hiecm.endpoint.m4-hfr-search-facility
type: endpoint
gateway: hiecm
milestone: M4
version: abdm-v3
title: Search the facility registry before creating anything
summary: Finds facilities that already match a name and location, so a second
  record is never created for one that exists.
generated: true
operation: m4_post_facilitymanagement_v1_5_facility_search
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/m4_post_facilitymanagement_v1_5_facility_search.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/m4_post_facilitymanagement_v1_5_facility_search.mdx#m4-hfr-search-facility.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.m4-onboard-facility
  concepts:
    - hiecm.concept.gateway-session
---

# Search the facility registry before creating anything

## In plain words

Search the [HFR](/docs/hiecm/v3/getting-started/glossary#hfr), the Health Facility Registry, before you register a facility, so the same facility is never registered twice. A match means the facility already exists: use its `facilityId` instead of creating a new record.

Narrow the search by `facilityName` and by location. Location fields take Local Government Directory (LGD) codes: `stateLGDCode`, `districtLGDCode` and `subDistrictLGDCode`. Results are paged with `page` and `resultsPerPage`.

## Before you start

A session token for the `Authorization` header. The state, district and sub district LGD codes, fetched from the HFR LGD master data calls rather than typed by hand.

## What happens

You send the search criteria. The response lists matching facilities in `facilities`, with `totalFacilities` and `numberOfPages` so you can page through the rest.

## How you know it worked

An empty `facilities` list means no match, and onboarding can go ahead. When the list has entries, compare `facilityName`, `address` and `facilityStatus`. If one of them is the facility, use its `facilityId` and stop.
