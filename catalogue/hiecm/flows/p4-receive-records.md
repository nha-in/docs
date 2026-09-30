---
id: hiecm.flow.p4-receive-records
type: flow
gateway: hiecm
milestone: P4
version: abdm-v3
title: Receive and keep records as a health locker
summary: Set up a locker for the person, subscribe to their ABHA address, and
  turn each LINK or DATA notification into a consent request, a health
  information request and a stored record.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p4.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p4.mdx#p4-receive-records.
      Edit the page, never this file.
related:
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
    - hiecm.flow.p3-fetch-records
  concepts:
    - hiecm.concept.phr-subscriptions
    - hiecm.concept.consent-artefact
    - hiecm.concept.care-context
  glossary:
    - shared.glossary.phr
    - shared.glossary.abha-address
    - hiecm.glossary.hrp
    - hiecm.glossary.hip
---

# Receive and keep records as a health locker

## In plain words

1. **Set up the locker for the patient.** Call setup locker with the locker's
   identifier in `X-LOCKER-ID`. The response carries a `consentAutoApprovalId`.
2. **Subscribe to the patient's ABHA address.** Use the gateway subscription
   calls and identify your application as a health locker. The subscription is
   approved automatically for all HIPs and all health information types.
3. **Act on each notification** by its category:

   | Category | What happened | What your locker does |
   | --- | --- | --- |
   | `LINK` | A HIP linked a new care context to the ABHA address | Raise a consent request for that care context. Once the person grants it, raise the health information request |
   | `DATA` | New data is available on a care context already linked | Look for an existing consent that covers the health information type and date range, and use it to raise the health information request |

4. **Store what arrives**, for long term access by the person.

A notification carries no health records. The records arrive only through the
health information request that follows a granted consent, as described in
[P3 Subscription](./p3).

## Before you start

The app is a PHR application with [P1](./p1) login and the [P3](./p3) subscription and consent calls, and the person is signed in. The calls about a patient carry `X-AUTH-TOKEN`, the person's login token, not the gateway session token.

## What happens

Set up the locker with `X-LOCKER-ID` and keep the `consentAutoApprovalId` it returns. Subscribe to the ABHA address as a health locker; the subscription is approved automatically. On a `LINK` notification, raise a consent request and, once the person grants it, the health information request. On a `DATA` notification, reuse a consent that covers the health information type and date range. Store what arrives.

## How you know it worked

Setup locker answers 200 with a `consentAutoApprovalId`. The lockers call lists the locker for the ABHA address with `isActive` true, and its settings show subscriptions with status `GRANTED`.

## When it goes wrong

A notification arrived but no records did: the notification only says something changed, so raise the consent request or the health information request. A patient call is refused: it carries the gateway session token where `X-AUTH-TOKEN` needs the person's login token. Processing documents the person uploads needs certification as a Health Locker, which requires [M2](./m2).
