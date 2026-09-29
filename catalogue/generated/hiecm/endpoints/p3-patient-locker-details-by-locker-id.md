---
id: hiecm.endpoint.p3-patient-locker-details-by-locker-id
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Get a health locker by its id
summary: Fetch one health locker's settings for the logged-in person.
generated: true
operation: p4_get_subscription_requests_v3_patients_lockers_lockerid
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_lockers_lockerid.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_lockers_lockerid.mdx#p3-patient-locker-details-by-locker-id.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-get-patient-subscribed-lockers
---

# Get a health locker by its id

## In plain words

Returns one health locker's settings for the logged-in person, by its `locker-id`: whether it is `active`, and the `subscriptions` it holds.

## Before you start

The person's `X-AUTH-TOKEN` and a `lockerId` from the list of subscribed lockers.

## How you know it worked

You receive `200` with `lockerId`, `lockerName`, `active` and `subscriptions`.

## When it goes wrong

`400` with `ABDM-1066` means the token is invalid: log the person in again.
