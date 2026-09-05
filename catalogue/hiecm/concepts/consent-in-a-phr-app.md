---
id: hiecm.concept.consent-in-a-phr-app
type: concept
gateway: hiecm
milestone: P3
version: abdm-v3
title: The five things a personal health record application must let a person do with consent
summary: >
  A personal health record application is where a person actually exercises
  consent, so NHA sets a floor for it: see a request, change it, allow or
  refuse it, see what is already allowed, and take it back.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-05/NewDocumant-PHR-app.docx
    fetched: 2026-09-05
    hash: sha256:4f8b40b31e894520be49885260912586a3f665933958cc0680ce5a4675704542
    note: >
      NHA's PHR application document. Names five capabilities the application
      must provide, the fields each screen must show, and the three outcomes
      of a request including ignoring it.
verified:
  status: unverified
related:
  concepts:
    - hiecm.concept.consent-artefact
    - hiecm.concept.phr-subscriptions
    - hiecm.concept.care-context
  flows:
    - hiecm.flow.p3-fetch-records
  endpoints:
    - hiecm.endpoint.p3-deny-consent-request
    - hiecm.endpoint.p3-revoke-consent-request
  glossary:
    - shared.glossary.phr
    - shared.glossary.hiu
    - shared.glossary.consent-artefact
skills:
  - hiecm-p3-build
---

# The five things a personal health record application must let a person do with consent

## In plain words

Consent in ABDM is granted by a person, not by a system, and the
[personal health record application](shared.glossary.phr) is where they do it.
Everything else in the network assumes that screen exists and works.

NHA sets a floor of five capabilities. An application missing one of them
leaves a person able to give access they cannot inspect, change or withdraw.

## Before you start

You need to understand what a
[consent artefact](hiecm.concept.consent-artefact) is, because each of the
five acts on one, and how requests reach the application at all, which is
[subscriptions](hiecm.concept.phr-subscriptions).

## What happens

### 1. See the request

Every request the person has received, showing the
[health information user](shared.glossary.hiu) asking, the purpose, the record
types wanted, the date range of records, how long the consent would last, and
its current status.

### 2. Change it before allowing it

Where the request permits it, the person adjusts it rather than facing all or
nothing. Four things are adjustable: how long access lasts, the date range of
records covered, which categories of record are shared, and the validity
period of the consent itself.

This is the capability most often left out, and it is the one that turns a
consent screen into a negotiation rather than a demand.

### 3. Allow or refuse

The decision goes back to the consent manager. NHA's own flow names three
outcomes, not two: approve, reject, and ignore. Ignoring is a real outcome
with a real effect, because a request the person never touches expires on the
window the requester set, and your interface has to be able to show that
state.

Approving is `POST /api/consent-management/consent-requests/{consentRequestId}/approve`,
and its reference page carries the headers and the body. Denying and revoking
have a written page each as well, which approving does not yet, so read the
reference for that one rather than looking for prose that is not there.

### 4. See what is already allowed

Every consent currently granted, its details and status, so the person can see
which organisations hold access to their records right now. A list of past
decisions is not the same thing as a list of live ones.

### 5. Take it back

The person withdraws a granted consent at any time. Two things follow, and
both matter: the status is updated at the consent manager, and sharing under
that consent stops immediately. Not at the end of the period, not at the next
request.

## How you know it worked

A person can carry one request through the whole arc in your application:
see it, narrow its date range, allow it, find it later in a list of live
consents, and revoke it.

After revoking, a fetch attempted under that consent fails rather than
returning records.

## When it goes wrong

The screen shows requests but not live consents. A person who cannot see what
is currently allowed cannot revoke what they do not know about, and the fifth
capability quietly depends on the fourth.

Revocation is treated as an expiry. Expiry is the window running out and
revocation is the person changing their mind. Both end access; only one is a
decision, and the interface should not present them as the same event.

An ignored request is shown as denied. The person refused nothing. See
[subscriptions](hiecm.concept.phr-subscriptions) for the five states a request
actually moves through.

Modification is dropped because it is hard. It is the capability that most
changes what a person can do, and leaving it out is the difference between
consent and a consent notice.
