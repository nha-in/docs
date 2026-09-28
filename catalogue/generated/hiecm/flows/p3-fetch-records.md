---
id: hiecm.flow.p3-fetch-records
type: flow
gateway: hiecm
milestone: P3
version: abdm-v3
title: Fetch and store the records a linked care context points at
summary: Turn a notification that a record exists into the record itself, by
  raising a consent request, getting it granted, and asking for the health
  information the grant covers.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p3.mdx#p3-fetch-records. Edit
      the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.p3-consent-fetch
    - hiecm.endpoint.p3-get-all-consent-request-for-an-abha-address
    - hiecm.endpoint.p3-get-consent-artefact-details-by-artifact-id
    - hiecm.endpoint.p3-deny-consent-request
    - hiecm.endpoint.p3-revoke-consent-request
    - hiecm.endpoint.p3-request-status
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
    - hiecm.flow.p2-discover-and-link
    - hiecm.flow.m3-fetch-records
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.care-context
  errors:
    - hiecm.error.abdm-1112
  glossary:
    - shared.glossary.hi-type
    - shared.glossary.hip
    - shared.glossary.hiu
    - shared.glossary.phr
---

# Fetch and store the records a linked care context points at

## In plain words

Once a care context is linked to the user's ABHA address:

1. Your app receives the notification.
2. It creates a consent request for that record and sends it to the HIE-CM.
3. The consent is granted, automatically if a policy exists, otherwise by the
   user.
4. It raises a health information request with the approved [consent
   artefact](/docs/hiecm/v3/getting-started/glossary#consent-artefact).
5. The [HIP](/docs/hiecm/v3/getting-started/glossary#hip) sends the records
   across the network.
6. Your app stores them for long term access and displays them, preferably in
   chronological order.

A grant on its own is not the end. A granted consent with no health information
request behind it leaves the person with permission and no records.

## Before you start

The care context is linked to the person's address, a subscription tells you when it appears or changes, and the app implements the consent and data flow calls as an HIU. See [M3 Journey 3](/docs/hiecm/v3/milestones/m3#m3-fetch-records) for the fetch itself.

## What happens

On the notification, raise a consent request for that care context, wait for the grant, then raise the health information request with the granted artefact, and decrypt what the HIP pushes. Store every record for the long term.

## How you know it worked

The records for the notified care context are stored and shown in date order, and reopening them needs no new request.

## When it goes wrong

`ABDM-1112`: the artefact is invalid or already expired. Revocation is the person exercising a right, so handle it as a state, not as an error. Records fetched but not stored disappear when the consent window closes. Test every HI type the app may receive, structured and unstructured, not only one.
