---
id: hiecm.concept.asynchronous-callbacks
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Asynchronous calls and callbacks, why a 200 means very little
summary: >
  Most of M2 and M3 answer later on a callback rather than in the
  response, so acceptance and completion are different events.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: NHA milestone pack for M2.
verified:
  status: unverified
related:
  glossary: [shared.glossary.request-id]
  decisions: [hiecm.decision.callbacks-as-webhooks]
---

# Asynchronous calls and callbacks, why a 200 means very little

## In plain words

In M1 you call and get your answer. In M2 and M3 you usually call, get an
acknowledgement, and the real answer arrives afterwards as a POST from
ABDM to a URL you registered.

So a 200 means your request was accepted and well formed. It does not
mean the work happened.

## Before you start

You need a publicly reachable callback URL registered with ABDM. See
[the callback URL](../../shared/sandbox/callback-url.md).

## What happens

```mermaid
sequenceDiagram
  participant You
  participant CM as HIE-CM
  participant Other as The other party
  You->>CM: request, REQUEST-ID abc
  CM-->>You: 202 accepted
  CM->>Other: routed request
  Other-->>CM: response
  CM->>You: POST /your-callback, REQUEST-ID abc
  You-->>CM: acknowledgement
```

The `REQUEST-ID` you generated comes back on the callback. That is the
only reliable way to match a reply to the call that caused it, because
callbacks do not arrive in the order you sent the requests.

In this catalogue these callbacks are described as OpenAPI 3.1
`webhooks` inside the module spec that owns them. See
[callbacks as webhooks](../decisions/callbacks-as-webhooks.md).

## How you know it worked

You have understood this when you can answer both of these.


  1. You send three requests and two callbacks arrive. Which request is
     still outstanding, and how do you know?
  2. The same callback arrives twice. What must your handler do?

## When it goes wrong

It never arrives. That is the single most common report, and the cause is
almost always the callback URL: not public, not registered, or not
responding fast enough.

Treating retries as new events. A duplicate delivery must be safe, which
means keying on the `REQUEST-ID` rather than appending on every POST.

Waiting on the response body instead of the callback, which produces an
integration that appears to work in testing and hangs in production.

