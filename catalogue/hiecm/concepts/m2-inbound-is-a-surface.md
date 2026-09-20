---
id: hiecm.concept.m2-inbound-is-a-surface
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
order: 5
title: Inbound is a surface, and silence there is a failure state
summary: >
  ABDM asks your bridge questions and waits, most of them carry no documented
  payload, and a handler that only logs leaves records undiscoverable.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      Of the five inbound requests a provider answers, four carry no payload
      shape in either of the published sources, so the first real delivery is
      the only way to learn the shape.
related:
  concepts:
    - hiecm.concept.m2-exchange-not-call
    - hiecm.concept.m2-integrator-call-panel
    - hiecm.concept.m2-care-context-and-records
---

# Inbound is a surface, and silence there is a failure state

## In plain words

M2 and M3 are not only things your desk asks ABDM. ABDM asks your desk things
and waits: a discovery request, a link initiation, a link confirmation, a
request for the records a consent covers, and a consent notification.

Four of those five carry no documented payload in the published sources. A
handler written against an assumed shape fails on the first real delivery,
asynchronously, where nobody is watching. And a handler that only logs leaves a
patient's records undiscoverable while appearing to work.

## Before you start

- A callback URL registered against your facility id, or nothing inbound
  arrives at all.
- A place to record deliveries, from
  [the integrator call panel](m2-integrator-call-panel.md).

## What happens

Answer the transport quickly and reason afterwards. ABDM is waiting on a `2xx`,
and a handler that thinks before it replies is a handler that times out.

Then give the interface a state for ABDM asked and this desk has not replied.
Not an empty list, and not silence. A named, visible condition, saying what a
correct reply would have been.

Where the payload is undocumented, record the entire body and the entire header
set on the first delivery of each path, before anything tries to read it. That
first delivery is also the only way to answer a question the published sources
do not: which header carries the signed token on an inbound callback. ABDM signs
its callbacks and publishes the keys, and no source names the field carrying the
signature.

Record header names and lengths, never values. The name is the finding. The
value is a credential.

The security rule underneath: a URL reachable by ABDM is reachable by everyone.
A presented signature that fails verification is refused everywhere. An absent
one may be tolerated on a sandbox, and where it is, the record has to be marked
as unverified rather than passed off as genuine.

## How you know it worked

Trigger a discovery against your bridge. The transport is acknowledged inside
the window, and the interface shows the delivery, the reply, and the time
between them.

Take a path you have never received before. The whole body and the whole header
name set are recorded before any code reads a field, so the shape can be learned
from the record rather than guessed.

Leave an inbound request unanswered on purpose. The interface names it as
unanswered rather than showing nothing.

## When it goes wrong

- A patient's records cannot be found from another facility, and nothing looks
  broken. A discovery handler is logging and not replying.
- Deliveries time out under load. Work is being done before the acknowledgement
  rather than after it.
- A handler throws on the first real delivery. It was written against an assumed
  payload, and the body was never recorded whole.
