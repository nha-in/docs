---
id: hiecm.concept.phr-subscriptions
type: concept
gateway: hiecm
milestone: P3
version: abdm-v3
title: Subscriptions, and why a personal health record application needs one
summary: >
  A subscription is a standing watch on one person's address, so the
  application is told when a new health record is linked to them instead of
  polling for it. NHA expects every personal health record application to set
  one up, and the person to be asked first.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-05/NewDocumant-PHR-app.docx
    fetched: 2026-09-05
    hash: sha256:4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542
    note: >
      NHA's PHR application document. Gives the four events a subscription
      delivers, the two moments an application must create one, and the five
      states a request moves through in the interface.
verified:
  status: unverified
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
    - shared.glossary.hiu
skills:
  - hiecm-p3-build
---

# Subscriptions, and why a personal health record application needs one

## In plain words

A [care context](hiecm.concept.care-context) can be linked to a person's
address at any time, by any facility they visit, without your application
being part of it. A subscription is how you find out. It is a standing watch
on one address: once it exists, the consent manager posts to your callback
whenever something changes for that person.

Either a [health information user](shared.glossary.hiu) or a
[personal health record application](shared.glossary.phr) may hold one.
Without it, the only way to notice a new record is to ask repeatedly, and
nothing in ABDM is built for that.

NHA expects every personal health record application to set one up at two
moments: when it creates an address, and when a person signs in with an
address it has not seen before.

## Before you start

- A registered callback URL, because a subscription delivers to it. See
  [asynchronous calls and callbacks](hiecm.concept.asynchronous-callbacks).
- The person's explicit agreement. NHA is direct about this: the person must
  be asked to consent to the subscription, and it is not implied by their
  signing in.

## What happens

### The four events it delivers

Once the person approves the subscription, the consent manager notifies you
on:

- a new care context linked to the address,
- a modified care context,
- a new consent request,
- a new subscription request.

Delivery is to your callback. Showing it to the person on their device is
your job, and NHA names a push service, Firebase on Android, as the example
rather than a requirement.

### The states a request moves through

The interface NHA describes carries two groups, and a request sits in exactly
one state within them. Building a screen per state is the point of listing
them:

| Group | State | What it means |
| --- | --- | --- |
| Requests | Requested | Sent to the person, who has not acted yet |
| Requests | Denied | The person refused it |
| Requests | Expired | The person did not act inside the window the requester set |
| Approved | Granted | The person allowed it |
| Approved | Revoked | The person allowed it and later withdrew that |

The same five states carry consent requests, subscription requests and health
locker requests, so one screen serves all three.

### What a subscription is not

It is not consent, and it does not give anybody a record. It tells you that a
record exists. Reading it still needs a consent, which is why a subscription
usually runs alongside an auto approval policy: the notification arrives, your
application raises a consent request for the care context it names, the policy
grants it without troubling the person, and only then can the record be
fetched and stored. That sequence is
[subscribe and auto approve](hiecm.flow.p3-subscribe-and-auto-approve).

## How you know it worked

The person approves the subscription and your callback receives a
notification the next time a care context is linked to their address.

Test it by linking a care context to that address from a facility, and
watching for the notification rather than for a response to anything you sent.

## When it goes wrong

Nothing arrives. A subscription delivers to the callback URL like everything
else, so the checks are the same as for any callback that does not appear. See
[the callback never arrives](hiecm.troubleshooting.callback-never-arrives).

The person was never asked. A subscription created without asking is a policy
failure rather than a technical one, and it is the kind of thing certification
looks for.

The notification is treated as permission. A notification says a record
exists. Acting on it without a consent is the mistake this page exists to
prevent.
