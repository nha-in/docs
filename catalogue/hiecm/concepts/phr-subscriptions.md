---
id: hiecm.concept.phr-subscriptions
type: concept
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscriptions, and why a personal health record application needs one
summary: A subscription tells a personal health record app when a record is
  linked to a person's address, and the person must agree to it first.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/p3.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/p3.mdx#phr-subscriptions.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.care-context
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.consent-artefact
  flows:
    - hiecm.flow.p3-subscribe-and-auto-approve
  endpoints:
    - hiecm.endpoint.p3-approve-subscription-request
    - hiecm.endpoint.p3-consent-auto-approve
  glossary:
    - shared.glossary.phr
    - hiecm.glossary.hiu
---

# Subscriptions, and why a personal health record application needs one

## In plain words

Ask the user for consent before you create a subscription. An approved
subscription notifies your app when a care context is linked or updated. Surface these as device
notifications.

You need screens to list subscriptions, approve them, deny them and edit them.
Editing covers health information types, purpose, categories and the time period.

A subscription tells you a record exists. It is not consent, and it gives nobody
the record: reading it still needs a consent request, which is why a
subscription usually runs beside an auto approval policy.

## Before you start

A callback URL registered and reachable, and the person's explicit agreement to the subscription. Signing in does not imply it.

## What happens

Raise the subscription with `/api/hiecm/subscription-requests/v3/init`; the request id arrives on `/api/v3/hiu/hiecm/subscription-requests/on-init`. The person approves it with `/api/hiecm/subscription-requests/v3/{subscriptionRequestId}/approve` or denies it. Once approved, notifications arrive on `/api/v3/hiu/subscription/notify`, in the categories `LINK` and `DATA`, and you acknowledge each with `/api/hiecm/subscription-requests/v3/hiu/care-context/on-notify`. Set one up when you create an address and when a person signs in with an address the install has not seen.

## How you know it worked

The subscription shows as approved, and linking a care context to that address from a facility produces a notification on your callback without any call from you.

## When it goes wrong

Nothing arrives: the checks are those for any callback, see [the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives). A subscription created without asking the person is a consent failure that certification looks for. A notification acted on as though it were permission reads a record with no consent behind it.
