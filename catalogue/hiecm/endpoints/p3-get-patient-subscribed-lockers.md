---
id: hiecm.endpoint.p3-get-patient-subscribed-lockers
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: List the health lockers an ABHA address subscribes to
summary: List the health lockers the logged-in person is subscribed to.
generated: true
operation: p4_get_subscription_requests_v3_patients_lockers
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_lockers.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/p4_get_subscription_requests_v3_patients_lockers.mdx#p3-get-patient-subscribed-lockers.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  endpoints:
    - hiecm.endpoint.p3-patient-locker-details-by-locker-id
---

# List the health lockers an ABHA address subscribes to

## In plain words

Lists the health lockers the logged-in person's ABHA address is subscribed to. Set `includeInactive` to true to include lockers that are no longer active.

## Before you start

The person's `X-AUTH-TOKEN`.

## How you know it worked

You receive `200` with an array. Each locker has a `lockerId`, a `lockerName` and `isActive`.

## When it goes wrong

`400` with `ABDM-1006` means the request is invalid.
