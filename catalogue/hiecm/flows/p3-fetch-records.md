---
id: hiecm.flow.p3-fetch-records
type: flow
gateway: hiecm
milestone: P3
version: abdm-v3
title: Fetch and store the records a linked care context points at
summary: >
  Turn a notification that a record exists into the record itself, by
  raising a consent request, getting it granted, and asking for the
  health information the grant covers.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p3.yaml
    fetched: 2026-09-04
    hash: sha256:f24958ad08da0e2b8063682ddbec4d71a0134a2da3d85f2a8b8b651c59349121
    note: >
      NHA's P3 file as ingested on this branch.
  - file: site/docs/hiecm/v3/milestones/p3.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P3 milestone page. The six step sequence, the consent
      management capabilities and the health information types the test
      cases cover come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document: 120 operations with their paths, request
      bodies and error scenarios. It is where the endpoint atoms this
      flow cites come from.
verified:
  status: unverified
  against: docs-only
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
    - shared.glossary.consent-artefact
    - shared.glossary.hi-type
    - shared.glossary.hip
    - shared.glossary.hiu
    - shared.glossary.phr
skills:
  - hiecm-p3-build
---

## In plain words

A linked care context says a record exists somewhere. It does not put the
record in the person's hands. Fetching it is a consent flow, and the
person is the [HIU](shared.glossary.hiu) when their records are fetched
from the facility that holds them. Your application is how they take that
role, so this is an HIU flow like any other.

## Before you start

Four things must already be true, each checkable:

- The care context is linked to the person's health address. See
  [find records held elsewhere and link them](p2-discover-and-link.md).
- Your application implements the consent and data flow calls. This is
  work it does as well as linking, not instead of it.
- You have a subscription, so you are told when a care context appears or
  changes. See
  [subscribe and set an auto approval policy](p3-subscribe-and-auto-approve.md).
- You can store records for the long term. Fetching without storing means
  fetching again, and the person loses their history when the request
  window closes.

## What happens

```mermaid
sequenceDiagram
    participant A as Your PHR app
    participant CM as HIE-CM
    participant HIP as The facility
    CM-->>A: Notification: a new or updated care context
    A->>CM: Consent request for that record
    alt An auto approval policy is active
        CM-->>A: Granted at once
    else No policy
        CM-->>A: The person is asked, then grants or denies
    end
    A->>CM: Health information request with the approved artefact
    CM->>HIP: forwards it
    HIP-->>A: The records
    A->>A: Store for the long term, display in date order
```

1. **Receive the notification.**
2. **Create a consent request for that record and send it to the
   HIE-CM.**
3. **Wait for the grant.** Automatic where a policy exists, otherwise the
   person decides.
4. **Raise a health information request** with the approved
   [consent artefact](hiecm.concept.consent-artefact).
5. **Receive the records** the facility sends across the network.
6. **Store and display them,** preferably in date order.

The person also needs to see and steer all of this: the requests that
have come in with the requester, purpose, data types, date range and
validity; a way to modify a request before granting; a way to grant or
deny; a list of who currently has access; and a way to revoke at any
time, which stops sharing under that consent immediately.

Test cases cover every health information type, structured and
unstructured: diagnostic report, prescription, discharge summary,
consultation note, immunisation record, wellness record and health
document record. An application that handles one shape is not finished.

## How you know it worked

The records arrive for the care context the notification named, your
application has stored them, and they are displayed in date order. Asking
again is not needed, which is what proves they were stored rather than
held for the length of a screen.

A grant on its own is not the exit condition. A granted consent with no
health information request behind it leaves the person with permission
and no records.

## When it goes wrong

The failures, in rough order of frequency:

- [ABDM-1112](hiecm.error.abdm-1112) when the artefact is expired or has
  been revoked. Revocation is the person exercising a right, so it is a
  state to handle rather than an error to report.
- Records fetched but not stored, which reads as working until the
  consent window closes and the history disappears.
- A health information type the application cannot display, from the
  seven the test cases cover.
